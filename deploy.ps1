param(
    [string]$Action = "deploy",
    [switch]$Quick,
    [switch]$SkipBuild,
    [switch]$Force
)

# ========================================
# Quran App - Unified Deployment Script
# ========================================
# Usage:
#   ./deploy.ps1                    # Full deployment with prompts
#   ./deploy.ps1 -Quick             # Quick deployment without prompts
#   ./deploy.ps1 -Action deploy     # Deploy application
#   ./deploy.ps1 -Action ssl        # Setup SSL certificate
#   ./deploy.ps1 -Action fix-404    # Fix 404 errors
#   ./deploy.ps1 -Action fix-nginx  # Fix Nginx configuration
#   ./deploy.ps1 -Action fix-dns    # Check and fix DNS issues
#   ./deploy.ps1 -Action status     # Check deployment status
#   ./deploy.ps1 -SkipBuild         # Skip npm build step
#   ./deploy.ps1 -Force             # Force actions without confirmation

# Configuration
$SERVER_IP = "172.236.15.248"
$DOMAIN_NAME = "quran.sunnahlife.co.uk"
$SSH_KEY_PATH = "C:\Users\rizwa\.ssh\optimum_linode"
$REMOTE_APP_DIR = "/var/www/quran-app"
$ADMIN_EMAIL = "admin@$DOMAIN_NAME"

# Colors
function Write-ColorHost($Text, $Color) {
    Write-Host $Text -ForegroundColor $Color
}

function Write-Success($Text) { Write-ColorHost "[SUCCESS] $Text" Green }
function Write-Error($Text) { Write-ColorHost "[ERROR] $Text" Red }
function Write-Warning($Text) { Write-ColorHost "[WARNING] $Text" Yellow }
function Write-Info($Text) { Write-ColorHost "[INFO] $Text" Cyan }
function Write-Step($Text) { Write-ColorHost "[STEP] $Text" Cyan }

# Helper Functions
function Test-SSHConnection {
    Write-Step "Testing SSH connection..."
    $sshTest = ssh -i "$SSH_KEY_PATH" -o ConnectTimeout=10 root@$SERVER_IP "echo 'Connected'" 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Cannot connect to server"
        Write-Host "Check SSH key path: $SSH_KEY_PATH"
        return $false
    }
    Write-Success "SSH connection OK"
    return $true
}

function Test-DNSConfiguration {
    Write-Step "Checking DNS configuration..."
    try {
        $dnsResult = Resolve-DnsName $DOMAIN_NAME -Type A -ErrorAction SilentlyContinue
        if ($dnsResult) {
            $domainIP = $dnsResult.IPAddress
            Write-Info "Domain $DOMAIN_NAME points to: $domainIP"
            
            if ($domainIP -eq $SERVER_IP) {
                Write-Success "DNS points to correct server"
                return $true
            } else {
                Write-Warning "DNS mismatch detected!"
                Write-Host "Domain points to: $domainIP"
                Write-Host "Server IP is: $SERVER_IP"
                Write-Host ""
                Write-Info "Update your DNS A record:"
                Write-Host "  1. Go to your domain registrar"
                Write-Host "  2. Find DNS settings"
                Write-Host "  3. Update A record for 'quran' subdomain to: $SERVER_IP"
                Write-Host "  4. Wait 5-15 minutes for DNS propagation"
                return $false
            }
        } else {
            Write-Warning "Domain does not resolve"
            return $false
        }
    } catch {
        Write-Warning "Could not check DNS"
        return $false
    }
}

function Build-Application {
    if ($SkipBuild) {
        Write-Info "Skipping build (-SkipBuild flag)"
        return $true
    }
    
    Write-Step "Building application..."
    
    # Clean previous build
    if (Test-Path "dist") {
        Remove-Item -Recurse -Force "dist"
        Write-Success "Previous build cleaned"
    }
    
    # Check package.json
    if (!(Test-Path "package.json")) {
        Write-Error "package.json not found"
        return $false
    }
    
    # Install dependencies
    Write-Info "Installing dependencies..."
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Error "npm install failed"
        return $false
    }
    
    # Build
    Write-Info "Building application..."
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Build failed"
        return $false
    }
    
    # Verify build
    if (!(Test-Path "dist")) {
        Write-Error "dist folder not found after build"
        return $false
    }
    
    Write-Success "Build completed"
    return $true
}

function Deploy-Application {
    Write-Step "Deploying application..."
    
    # Create app directory
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "mkdir -p $REMOTE_APP_DIR"
    
    # Upload files
    Write-Info "Uploading files..."
    scp -i "$SSH_KEY_PATH" -r dist/* root@${SERVER_IP}:$REMOTE_APP_DIR/
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Upload failed"
        return $false
    }
    
    # Set permissions
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "chown -R www-data:www-data $REMOTE_APP_DIR; chmod -R 755 $REMOTE_APP_DIR"
    
    Write-Success "Files deployed"
    return $true
}

function Setup-Nginx {
    Write-Step "Setting up Nginx configuration..."
    
    # First ensure Nginx is installed
    Write-Info "Checking if Nginx is installed..."
    $nginxInstalled = ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "which nginx 2>/dev/null || echo 'NOT_FOUND'"
    
    if ($nginxInstalled -eq "NOT_FOUND") {
        Write-Warning "Nginx not installed. Installing..."
        ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "DEBIAN_FRONTEND=noninteractive apt-get update -qq && DEBIAN_FRONTEND=noninteractive apt-get install -y -qq nginx"
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to install Nginx"
            return $false
        }
        Write-Success "Nginx installed"
        
        # Start and enable Nginx
        ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "systemctl start nginx && systemctl enable nginx"
    }
    
    # Ensure directories exist
    Write-Info "Creating Nginx directories..."
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled"
    
    # Create Nginx config directly on server (avoids encoding issues)
    $nginxConfig = @'
server {
    listen 80;
    server_name quran.sunnahlife.co.uk;
    root /var/www/quran-app;
    index index.html;
    
    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript application/wasm;
    
    # Security headers
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
    
    # Handle Vue.js routing
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Cache HTML files for shorter period
        location ~* \.html$ {
            expires 1h;
            add_header Cache-Control "public";
        }
    }
    
    # Service worker should not be cached
    location = /sw.js {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
    
    # PWA manifest
    location = /manifest.json {
        expires 1d;
        add_header Cache-Control "public";
    }
    
    # Error pages
    error_page 404 /index.html;
}
'@

    # Write config to server
    $nginxConfig | ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "cat > /etc/nginx/sites-available/quran-app"
    
    # Remove default site if it exists
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "rm -f /etc/nginx/sites-enabled/default"
    
    # Enable site
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "ln -sf /etc/nginx/sites-available/quran-app /etc/nginx/sites-enabled/quran-app"
    
    # Update main nginx.conf to include sites-enabled
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "grep -q 'include /etc/nginx/sites-enabled' /etc/nginx/nginx.conf || sed -i '/http {/a\    include /etc/nginx/sites-enabled/*;' /etc/nginx/nginx.conf"
    
    # Test configuration
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "nginx -t"
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Nginx configuration test failed"
        return $false
    }
    
    # Reload Nginx
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "systemctl reload nginx"
    
    Write-Success "Nginx configured"
    return $true
}

function Setup-SSL {
    Write-Step "Setting up SSL certificate..."
    
    # Check if DNS is properly configured
    if (!(Test-DNSConfiguration)) {
        if (!$Force) {
            $continue = Read-Host "DNS not properly configured. Continue anyway? (y/N)"
            if ($continue -ne "y" -and $continue -ne "Y") {
                Write-Warning "SSL setup cancelled"
                return $false
            }
        }
    }
    
    # Install certbot if needed
    Write-Info "Ensuring Certbot is installed..."
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "DEBIAN_FRONTEND=noninteractive apt-get update -qq && DEBIAN_FRONTEND=noninteractive apt-get install -y -qq certbot python3-certbot-nginx"
    
    # Clean any stuck processes
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "pkill -f certbot || true"
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "rm -f /var/lib/letsencrypt/.certbot.lock || true"
    
    # Get certificate
    Write-Info "Obtaining SSL certificate..."
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "certbot --nginx -d $DOMAIN_NAME --non-interactive --agree-tos --email $ADMIN_EMAIL --redirect"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "SSL certificate obtained"
        
        # Setup auto-renewal
        ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "(crontab -l 2>/dev/null; echo '0 12 * * * /usr/bin/certbot renew --quiet') | crontab -"
        Write-Success "Auto-renewal configured"
        
        # Test renewal
        ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "certbot renew --dry-run"
        
        return $true
    } else {
        Write-Error "SSL setup failed"
        Write-Info "Common causes:"
        Write-Host "  1. DNS not pointing to server"
        Write-Host "  2. Port 80/443 blocked"
        Write-Host "  3. Rate limits reached"
        return $false
    }
}

function Fix-404Errors {
    Write-Step "Fixing 404 errors..."
    
    # Check if files exist
    $indexExists = ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "test -f $REMOTE_APP_DIR/index.html && echo 'YES' || echo 'NO'"
    
    if ($indexExists -eq "NO") {
        Write-Warning "index.html missing - deploying files..."
        
        if (!(Test-Path "dist")) {
            if (!(Build-Application)) {
                return $false
            }
        }
        
        if (!(Deploy-Application)) {
            return $false
        }
    }
    
    # Fix Nginx configuration
    if (!(Setup-Nginx)) {
        return $false
    }
    
    Write-Success "404 errors fixed"
    return $true
}

function Fix-NginxConflict {
    Write-Step "Fixing Nginx conflicts..."
    
    # Temporarily disable site
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "rm -f /etc/nginx/sites-enabled/quran-app"
    
    # Test if other sites work
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "nginx -t"
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Other Nginx configurations have issues"
        return $false
    }
    
    # Create clean config
    if (!(Setup-Nginx)) {
        return $false
    }
    
    Write-Success "Nginx conflicts resolved"
    return $true
}

function Check-Status {
    Write-ColorHost "" Yellow
    Write-ColorHost "========================================" Green
    Write-ColorHost "Quran App Deployment Status" Green
    Write-ColorHost "========================================" Green
    Write-ColorHost "" Yellow
    
    # Server info
    Write-Info "Server: $SERVER_IP"
    Write-Info "Domain: $DOMAIN_NAME"
    Write-Host ""
    
    # DNS status
    Test-DNSConfiguration | Out-Null
    Write-Host ""
    
    # SSH test
    if (!(Test-SSHConnection)) {
        return
    }
    Write-Host ""
    
    # Service status
    Write-Step "Checking services..."
    $nginxStatus = ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "systemctl is-active nginx"
    Write-Host "Nginx: $nginxStatus" -ForegroundColor $(if ($nginxStatus -eq "active") { "Green" } else { "Red" })
    
    # Files status
    $fileCount = ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "ls -1 $REMOTE_APP_DIR 2>/dev/null | wc -l"
    Write-Host "Files deployed: $fileCount files"
    
    # Test responses
    Write-Host ""
    Write-Step "Testing responses..."
    
    $httpTest = ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "curl -s -o /dev/null -w '%{http_code}' http://localhost -H 'Host: $DOMAIN_NAME'"
    Write-Host "HTTP response: $httpTest"
    
    $httpsTest = ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "curl -s -o /dev/null -w '%{http_code}' -k https://localhost -H 'Host: $DOMAIN_NAME' 2>/dev/null || echo 'N/A'"
    Write-Host "HTTPS response: $httpsTest"
    
    # SSL certificate
    Write-Host ""
    Write-Step "SSL certificate status..."
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "certbot certificates 2>/dev/null | grep -A2 'Certificate Name: quran.sunnahlife.co.uk' || echo 'No SSL certificate found'"
    
    Write-Host ""
    Write-ColorHost "========================================" Green
    Write-Host ""
    
    # URLs to test
    Write-Info "Test these URLs:"
    Write-Host "  Direct IP: http://$SERVER_IP"
    Write-Host "  HTTP: http://$DOMAIN_NAME"
    Write-Host "  HTTPS: https://$DOMAIN_NAME"
}

function Setup-Server {
    Write-Step "Setting up server prerequisites..."
    
    # Update package list
    Write-Info "Updating package list..."
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "DEBIAN_FRONTEND=noninteractive apt-get update -qq"
    
    # Install essential packages
    Write-Info "Installing essential packages..."
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "DEBIAN_FRONTEND=noninteractive apt-get install -y -qq nginx curl git ufw"
    
    # Configure firewall
    Write-Info "Configuring firewall..."
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "ufw allow 'Nginx Full' && ufw allow ssh && echo 'y' | ufw enable"
    
    # Create web directories
    Write-Info "Creating web directories..."
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "mkdir -p /var/www/quran-app"
    
    Write-Success "Server prerequisites installed"
    return $true
}

# Main execution
function Main {
    Write-ColorHost "" Yellow
    Write-ColorHost "========================================" Green
    Write-ColorHost "Quran App - Unified Deployment Script" Green
    Write-ColorHost "========================================" Green
    Write-ColorHost "" Yellow
    
    switch ($Action.ToLower()) {
        "deploy" {
            if (!$Quick) {
                Write-Info "This will deploy the Quran app to $DOMAIN_NAME"
                $confirm = Read-Host "Continue? (y/N)"
                if ($confirm -ne "y" -and $confirm -ne "Y") {
                    Write-Warning "Deployment cancelled"
                    exit 0
                }
            }
            
            if (!(Test-SSHConnection)) { exit 1 }
            Test-DNSConfiguration | Out-Null
            
            if (!(Build-Application)) { exit 1 }
            if (!(Deploy-Application)) { exit 1 }
            if (!(Setup-Nginx)) { exit 1 }
            
            Write-Success "Deployment completed!"
            Write-Host ""
            Write-Info "Your app is available at: http://$DOMAIN_NAME"
            Write-Host ""
            
            if (!$Quick) {
                $setupSSL = Read-Host "Setup SSL certificate? (y/N)"
                if ($setupSSL -eq "y" -or $setupSSL -eq "Y") {
                    Setup-SSL | Out-Null
                }
            }
        }
        
        "ssl" {
            if (!(Test-SSHConnection)) { exit 1 }
            if (!(Setup-SSL)) { exit 1 }
            Write-Success "SSL setup completed!"
            Write-Info "Your app is now available at: https://$DOMAIN_NAME"
        }
        
        "fix-404" {
            if (!(Test-SSHConnection)) { exit 1 }
            if (!(Fix-404Errors)) { exit 1 }
            Write-Success "404 errors fixed!"
        }
        
        "fix-nginx" {
            if (!(Test-SSHConnection)) { exit 1 }
            if (!(Fix-NginxConflict)) { exit 1 }
            Write-Success "Nginx conflicts fixed!"
        }
        
        "fix-dns" {
            Test-DNSConfiguration | Out-Null
            Write-Host ""
            Write-Info "If DNS is not configured:"
            Write-Host "  1. Login to your domain registrar"
            Write-Host "  2. Add/Update A record:"
            Write-Host "     Name: quran"
            Write-Host "     Type: A"
            Write-Host "     Value: $SERVER_IP"
            Write-Host "     TTL: 300"
            Write-Host "  3. Wait 5-15 minutes for propagation"
        }
        
        "status" {
            Check-Status
        }
        
        "server-setup" {
            if (!(Test-SSHConnection)) { exit 1 }
            if (!(Setup-Server)) { exit 1 }
            Write-Success "Server setup completed!"
            Write-Info "You can now run: ./deploy.ps1 -Action deploy"
        }
        
        default {
            Write-Error "Invalid action: $Action"
            Write-Host ""
            Write-Info "Available actions:"
            Write-Host "  server-setup - Setup server prerequisites (run this first on new server)"
            Write-Host "  deploy       - Deploy the application"
            Write-Host "  ssl          - Setup SSL certificate"
            Write-Host "  fix-404      - Fix 404 errors"
            Write-Host "  fix-nginx    - Fix Nginx conflicts"
            Write-Host "  fix-dns      - Check DNS configuration"
            Write-Host "  status       - Check deployment status"
            exit 1
        }
    }
}

# Run main function
Main

if (!$Quick) {
    Write-Host ""
    Read-Host "Press Enter to exit"
}
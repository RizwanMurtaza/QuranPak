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
#   ./deploy.ps1 -Action second-site # Deploy second website
#   ./deploy.ps1 -Action verify-sites # Verify both websites are working
#   ./deploy.ps1 -SkipBuild         # Skip npm build step
#   ./deploy.ps1 -Force             # Force actions without confirmation

# Configuration
$SERVER_IP = "172.236.15.248"
$DOMAIN_NAME = "quranlight.co.uk"
$SSH_KEY_PATH = "C:\Users\rizwa\.ssh\optimum_linode"
$REMOTE_APP_DIR = "/var/www/quran-app"
$ADMIN_EMAIL = "admin@$DOMAIN_NAME"

# Second website configuration
$SECOND_DOMAIN = "demo.quranlight.co.uk"
$SECOND_APP_DIR = "/var/www/demo-app"

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
    server_name quranlight.co.uk www.quranlight.co.uk;
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
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "certbot certificates 2>/dev/null | grep -A2 'Certificate Name: quranlight.co.uk' || echo 'No SSL certificate found'"
    
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
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "mkdir -p /var/www/quran-app /var/www/demo-app"
    
    Write-Success "Server prerequisites installed"
    return $true
}

function Setup-SecondSite {
    Write-Step "Setting up second website ($SECOND_DOMAIN)..."
    
    # Create directory for second site
    Write-Info "Creating directory for second site..."
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "mkdir -p $SECOND_APP_DIR"
    
    # Create a simple demo HTML page
    $demoHTML = @'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo Site - QuranLight</title>
    <style>
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background: linear-gradient(135deg, #8b4513, #c04000);
            color: white;
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
        }
        .container {
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        h1 { font-size: 3rem; margin-bottom: 1rem; }
        p { font-size: 1.2rem; margin-bottom: 2rem; }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background: #b8860b;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            transition: background 0.3s;
        }
        .button:hover { background: #996f0a; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Demo Site</h1>
        <p>This is a demo website running on the same server as QuranLight</p>
        <p>Both sites are working correctly!</p>
        <a href="https://quranlight.co.uk" class="button">Visit Main Site</a>
    </div>
</body>
</html>
'@
    
    # Write demo HTML to server
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "cat > $SECOND_APP_DIR/index.html << 'EOF'
$demoHTML
EOF"
    
    # Set permissions
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "chown -R www-data:www-data $SECOND_APP_DIR && chmod -R 755 $SECOND_APP_DIR"
    
    # Create Nginx config for second site
    $secondSiteConfig = @'
server {
    listen 80;
    server_name demo.quranlight.co.uk;
    root /var/www/demo-app;
    index index.html;
    
    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Security headers
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;
    
    location / {
        try_files $uri $uri/ =404;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Error pages
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
    
    # Logs
    access_log /var/log/nginx/demo_access.log;
    error_log /var/log/nginx/demo_error.log;
}
'@
    
    # Write config file
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "cat > /etc/nginx/sites-available/demo << 'EOF'
$secondSiteConfig
EOF"
    
    # Enable site
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "ln -sf /etc/nginx/sites-available/demo /etc/nginx/sites-enabled/demo"
    
    # Test and reload Nginx
    Write-Info "Testing Nginx configuration..."
    $nginxTest = ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "nginx -t 2>&1"
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Nginx configuration test failed:"
        Write-Host $nginxTest
        return $false
    }
    
    Write-Info "Reloading Nginx..."
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "systemctl reload nginx"
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to reload Nginx"
        return $false
    }
    
    Write-Success "Second site setup completed!"
    Write-Info "Demo site available at: http://$SECOND_DOMAIN"
    return $true
}

function Verify-Sites {
    Write-Step "Verifying both websites..."
    
    # Test main site
    Write-Info "Testing main site ($DOMAIN_NAME)..."
    try {
        $response1 = Invoke-WebRequest -Uri "http://$DOMAIN_NAME" -TimeoutSec 10 -UseBasicParsing
        if ($response1.StatusCode -eq 200) {
            Write-Success "Main site is responding (HTTP $($response1.StatusCode))"
        } else {
            Write-Warning "Main site returned HTTP $($response1.StatusCode)"
        }
    } catch {
        Write-Error "Main site is not accessible: $($_.Exception.Message)"
    }
    
    # Test second site
    Write-Info "Testing demo site ($SECOND_DOMAIN)..."
    try {
        $response2 = Invoke-WebRequest -Uri "http://$SECOND_DOMAIN" -TimeoutSec 10 -UseBasicParsing
        if ($response2.StatusCode -eq 200) {
            Write-Success "Demo site is responding (HTTP $($response2.StatusCode))"
        } else {
            Write-Warning "Demo site returned HTTP $($response2.StatusCode)"
        }
    } catch {
        Write-Error "Demo site is not accessible: $($_.Exception.Message)"
    }
    
    # Check Nginx status
    Write-Info "Checking Nginx status..."
    $nginxStatus = ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "systemctl is-active nginx"
    if ($nginxStatus -eq "active") {
        Write-Success "Nginx is running"
    } else {
        Write-Error "Nginx is not running properly"
    }
    
    # List enabled sites
    Write-Info "Enabled Nginx sites:"
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "ls -la /etc/nginx/sites-enabled/"
    
    Write-Host ""
    Write-Info "Test URLs:"
    Write-Host "  Main site: http://$DOMAIN_NAME"
    Write-Host "  Demo site: http://$SECOND_DOMAIN"
    Write-Host "  Server IP: http://$SERVER_IP"
    
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
        
        "second-site" {
            if (!(Test-SSHConnection)) { exit 1 }
            if (!(Setup-SecondSite)) { exit 1 }
            Write-Success "Second site setup completed!"
            Write-Info "Demo site is available at: http://$SECOND_DOMAIN"
        }
        
        "verify-sites" {
            if (!(Test-SSHConnection)) { exit 1 }
            if (!(Verify-Sites)) { exit 1 }
            Write-Success "Site verification completed!"
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
            Write-Host "  second-site  - Deploy second website (demo.quranlight.co.uk)"
            Write-Host "  verify-sites - Verify both websites are working"
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
param(
    [switch]$Compressed
)

if ($Compressed) {
    # Quick compressed deploy
    Write-Host "Quran App Quick Deploy" -ForegroundColor Green
    
    $SERVER_IP = "139.162.156.153"
    $SSH_KEY_PATH = "C:\Users\rizwa\.ssh\id_ed25519"
    
    # Test connection
    ssh -i "$SSH_KEY_PATH" -o ConnectTimeout=5 root@$SERVER_IP "exit" 2>$null
    if ($LASTEXITCODE -ne 0) { Write-Host "Connection failed" -ForegroundColor Red; exit 1 }
    
    # Build
    if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }
    npm install --silent; if ($LASTEXITCODE -ne 0) { Write-Host "Install failed" -ForegroundColor Red; exit 1 }
    npm run build --silent; if ($LASTEXITCODE -ne 0) { Write-Host "Build failed" -ForegroundColor Red; exit 1 }
    
    # Deploy
    scp -i "$SSH_KEY_PATH" -r dist/* root@${SERVER_IP}:/var/www/quran-app/ 2>$null
    if ($LASTEXITCODE -ne 0) { Write-Host "Upload failed" -ForegroundColor Red; exit 1 }
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "chown -R www-data:www-data /var/www/quran-app && chmod -R 755 /var/www/quran-app && systemctl reload nginx"
    
    Write-Host "SUCCESS: Deployed to https://quran.sunnahlife.co.uk" -ForegroundColor Green
    exit 0
}

Write-Host "========================================" -ForegroundColor Green
Write-Host "Quran App - PowerShell Deploy" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

$SERVER_IP = "139.162.156.153"
$DOMAIN_NAME = "quran.sunnahlife.co.uk"
$SSH_KEY_PATH = "C:\Users\rizwa\.ssh\id_ed25519"

Write-Host "Server IP: $SERVER_IP" -ForegroundColor Yellow
Write-Host "Domain: $DOMAIN_NAME" -ForegroundColor Yellow
Write-Host "SSH Key: $SSH_KEY_PATH" -ForegroundColor Yellow
Write-Host ""

Write-Host "Step 1: Testing server connection..." -ForegroundColor Cyan
$sshTest = ssh -i "$SSH_KEY_PATH" -o ConnectTimeout=10 root@$SERVER_IP "echo 'Connected successfully'" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Cannot connect to server" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "SUCCESS: Server connection OK" -ForegroundColor Green
Write-Host ""

Write-Host "Step 2: Checking Node.js..." -ForegroundColor Cyan
$nodeVersion = node --version
Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
Write-Host ""

Write-Host "Step 3: Checking NPM..." -ForegroundColor Cyan
$npmVersion = npm --version
Write-Host "NPM version: $npmVersion" -ForegroundColor Green
Write-Host ""

Write-Host "Step 4: Cleaning previous build..." -ForegroundColor Cyan
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "Previous dist folder removed" -ForegroundColor Green
}
Write-Host "SUCCESS: Previous build cleaned" -ForegroundColor Green
Write-Host ""

Write-Host "Step 5: Installing dependencies..." -ForegroundColor Cyan
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
if (Test-Path "package.json") {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: npm install failed" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "SUCCESS: Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "ERROR: package.json not found" -ForegroundColor Red
    Get-ChildItem
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

Write-Host "Step 6: Building application..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "SUCCESS: Build completed" -ForegroundColor Green
Write-Host ""

Write-Host "Step 7: Verifying build output..." -ForegroundColor Cyan
if (!(Test-Path "dist")) {
    Write-Host "ERROR: dist folder not found after build" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Get-ChildItem "dist"
Write-Host "SUCCESS: Build output verified" -ForegroundColor Green
Write-Host ""

Write-Host "Step 8: Setting up Quran app directory on server..." -ForegroundColor Cyan
ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "mkdir -p /var/www/quran-app && chown -R www-data:www-data /var/www/quran-app"
Write-Host "SUCCESS: Quran app directory ready" -ForegroundColor Green
Write-Host ""

Write-Host "Step 9: Uploading to server..." -ForegroundColor Cyan
scp -i "$SSH_KEY_PATH" -r dist/* root@${SERVER_IP}:/var/www/quran-app/
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Upload failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "SUCCESS: Files uploaded" -ForegroundColor Green
Write-Host ""

Write-Host "Step 10: Setting permissions..." -ForegroundColor Cyan
ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "chown -R www-data:www-data /var/www/quran-app && chmod -R 755 /var/www/quran-app"
Write-Host "SUCCESS: Permissions set" -ForegroundColor Green
Write-Host ""

Write-Host "Step 11: Creating Nginx configuration for Quran app..." -ForegroundColor Cyan
$nginxConfig = @"
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
        try_files `$uri `$uri/ /index.html;
        
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
"@

$nginxConfig | ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "cat > /etc/nginx/sites-available/quran-app"
ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "ln -sf /etc/nginx/sites-available/quran-app /etc/nginx/sites-enabled/"
Write-Host "SUCCESS: Nginx configuration created" -ForegroundColor Green
Write-Host ""

Write-Host "Step 12: Testing Nginx configuration..." -ForegroundColor Cyan
ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "nginx -t"
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Nginx configuration test failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "SUCCESS: Nginx configuration is valid" -ForegroundColor Green
Write-Host ""

Write-Host "Step 13: Reloading Nginx..." -ForegroundColor Cyan
ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "systemctl reload nginx"
Write-Host "SUCCESS: Nginx reloaded" -ForegroundColor Green
Write-Host ""

Write-Host "Step 14: Testing deployment..." -ForegroundColor Cyan
$httpStatus = ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "curl -s -o /dev/null -w 'HTTP Status: %{http_code}' http://localhost -H 'Host: quran.sunnahlife.co.uk'"
Write-Host $httpStatus -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "DEPLOYMENT COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "Your Quran app is available at: http://$DOMAIN_NAME" -ForegroundColor Yellow
Write-Host ""

$sslSetup = Read-Host "Setup SSL certificate for $DOMAIN_NAME? (y/N)"
if ($sslSetup -eq "y" -or $sslSetup -eq "Y") {
    Write-Host "Setting up SSL..." -ForegroundColor Cyan
    
    # Check DNS configuration first
    Write-Host "Checking DNS configuration..." -ForegroundColor Yellow
    Write-Host "Your server IP: $SERVER_IP" -ForegroundColor Yellow
    
    try {
        $dnsResult = Resolve-DnsName $DOMAIN_NAME -Type A -ErrorAction SilentlyContinue
        if ($dnsResult) {
            $domainIP = $dnsResult.IPAddress
            Write-Host "Domain $DOMAIN_NAME points to: $domainIP" -ForegroundColor Yellow
            
            if ($domainIP -ne $SERVER_IP) {
                Write-Host "WARNING: DNS mismatch detected!" -ForegroundColor Red
                Write-Host "Domain points to: $domainIP" -ForegroundColor Red
                Write-Host "Server IP is: $SERVER_IP" -ForegroundColor Red
                Write-Host ""
                Write-Host "You need to update your DNS A record:" -ForegroundColor Yellow
                Write-Host "1. Go to your domain registrar (where you bought the domain)" -ForegroundColor White
                Write-Host "2. Find DNS settings or DNS management" -ForegroundColor White
                Write-Host "3. Update the A record for 'quran' subdomain to: $SERVER_IP" -ForegroundColor White
                Write-Host "4. Wait 5-15 minutes for DNS propagation" -ForegroundColor White
                Write-Host ""
                
                $continueSSL = Read-Host "Continue with SSL setup anyway? (y/N)"
                if ($continueSSL -ne "y" -and $continueSSL -ne "Y") {
                    Write-Host "SSL setup cancelled. Update DNS first, then run SSL setup manually:" -ForegroundColor Yellow
                    Write-Host "ssh -i `"$SSH_KEY_PATH`" root@$SERVER_IP `"/usr/local/bin/setup-ssl $DOMAIN_NAME`"" -ForegroundColor Cyan
                    Read-Host "Press Enter to exit"
                    exit 0
                }
            }
        }
    } catch {
        Write-Host "Could not resolve DNS for $DOMAIN_NAME" -ForegroundColor Yellow
    }
    
    # Proceed with SSL setup
    Write-Host "Proceeding with SSL certificate setup..." -ForegroundColor Cyan
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "/usr/local/bin/setup-ssl $DOMAIN_NAME"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "SSL certificate setup completed" -ForegroundColor Green
        Write-Host "Your Quran app is now available at: https://$DOMAIN_NAME" -ForegroundColor Yellow
    } else {
        Write-Host "SSL setup failed. This is usually due to DNS issues." -ForegroundColor Red
        Write-Host ""
        Write-Host "Manual steps to fix:" -ForegroundColor Yellow
        Write-Host "1. Update DNS A record for '$DOMAIN_NAME' to: $SERVER_IP" -ForegroundColor White
        Write-Host "2. Wait 15-30 minutes for DNS propagation" -ForegroundColor White
        Write-Host "3. Test with: nslookup $DOMAIN_NAME" -ForegroundColor White
        Write-Host "4. Retry SSL: ssh root@$SERVER_IP '/usr/local/bin/setup-ssl $DOMAIN_NAME'" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "🕌 Your Quran application is now deployed!" -ForegroundColor Green
Write-Host "📖 Features included:" -ForegroundColor Yellow
Write-Host "   • Progressive Web App (PWA)" -ForegroundColor White
Write-Host "   • Word-by-word analysis" -ForegroundColor White
Write-Host "   • Audio recitation" -ForegroundColor White
Write-Host "   • Multiple translations" -ForegroundColor White
Write-Host "   • Mobile-optimized" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit"
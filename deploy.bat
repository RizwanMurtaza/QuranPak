@echo off
REM ========================================
REM Quran App - Unified Deployment Script
REM ========================================
REM Usage:
REM   deploy.bat                    - Full deployment with prompts
REM   deploy.bat quick              - Quick deployment without prompts
REM   deploy.bat deploy             - Deploy application
REM   deploy.bat ssl                - Setup SSL certificate
REM   deploy.bat fix-404            - Fix 404 errors
REM   deploy.bat fix-nginx          - Fix Nginx configuration
REM   deploy.bat fix-dns            - Check and fix DNS issues
REM   deploy.bat status             - Check deployment status

set ACTION=%1
if "%ACTION%"=="" set ACTION=deploy

REM Configuration
set SERVER_IP=172.236.15.248
set DOMAIN_NAME=quran.sunnahlife.co.uk
set SSH_KEY_PATH=C:\Users\rizwa\.ssh\optimum_linode
set REMOTE_APP_DIR=/var/www/quran-app
set ADMIN_EMAIL=admin@%DOMAIN_NAME%

REM Check if PowerShell script exists
if exist "%~dp0deploy.ps1" (
    echo Using PowerShell for better functionality...
    if "%ACTION%"=="quick" (
        powershell.exe -ExecutionPolicy Bypass -File "%~dp0deploy.ps1" -Quick
    ) else (
        powershell.exe -ExecutionPolicy Bypass -File "%~dp0deploy.ps1" -Action "%ACTION%"
    )
    exit /b %ERRORLEVEL%
)

REM Fallback to basic batch implementation
echo ========================================
echo Quran App - Unified Deployment Script
echo ========================================
echo.

if /i "%ACTION%"=="deploy" goto :deploy
if /i "%ACTION%"=="quick" goto :quick_deploy
if /i "%ACTION%"=="ssl" goto :ssl
if /i "%ACTION%"=="fix-404" goto :fix404
if /i "%ACTION%"=="fix-nginx" goto :fixnginx
if /i "%ACTION%"=="fix-dns" goto :fixdns
if /i "%ACTION%"=="status" goto :status

echo ERROR: Invalid action: %ACTION%
echo.
echo Available actions:
echo   deploy    - Deploy the application
echo   quick     - Quick deployment without prompts
echo   ssl       - Setup SSL certificate
echo   fix-404   - Fix 404 errors
echo   fix-nginx - Fix Nginx conflicts
echo   fix-dns   - Check DNS configuration
echo   status    - Check deployment status
pause
exit /b 1

:deploy
echo This will deploy the Quran app to %DOMAIN_NAME%
set /p CONFIRM=Continue? (y/N): 
if /i not "%CONFIRM%"=="y" (
    echo Deployment cancelled
    pause
    exit /b 0
)

:quick_deploy
echo Testing SSH connection...
ssh -i "%SSH_KEY_PATH%" -o ConnectTimeout=10 root@%SERVER_IP% "echo Connected" >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: Cannot connect to server
    pause
    exit /b 1
)
echo SUCCESS: SSH connection OK
echo.

echo Building application...
if exist dist rmdir /s /q dist
call npm install
if %ERRORLEVEL% neq 0 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)

call npm run build
if %ERRORLEVEL% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)
echo SUCCESS: Build completed
echo.

echo Deploying application...
ssh -i "%SSH_KEY_PATH%" root@%SERVER_IP% "mkdir -p %REMOTE_APP_DIR%"
scp -i "%SSH_KEY_PATH%" -r dist/* root@%SERVER_IP%:%REMOTE_APP_DIR%/
if %ERRORLEVEL% neq 0 (
    echo ERROR: Upload failed
    pause
    exit /b 1
)

ssh -i "%SSH_KEY_PATH%" root@%SERVER_IP% "chown -R www-data:www-data %REMOTE_APP_DIR% && chmod -R 755 %REMOTE_APP_DIR%"
echo SUCCESS: Files deployed
echo.

echo Setting up Nginx...
ssh -i "%SSH_KEY_PATH%" root@%SERVER_IP% "cat > /etc/nginx/sites-available/quran-app << 'EOF'
server {
    listen 80;
    server_name quran.sunnahlife.co.uk;
    root /var/www/quran-app;
    index index.html;
    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF"

ssh -i "%SSH_KEY_PATH%" root@%SERVER_IP% "ln -sf /etc/nginx/sites-available/quran-app /etc/nginx/sites-enabled/"
ssh -i "%SSH_KEY_PATH%" root@%SERVER_IP% "nginx -t && systemctl reload nginx"
echo SUCCESS: Nginx configured
echo.

echo ========================================
echo DEPLOYMENT COMPLETED!
echo ========================================
echo Your app is available at: http://%DOMAIN_NAME%
echo.

if not "%ACTION%"=="quick" (
    set /p SETUP_SSL=Setup SSL certificate? (y/N): 
    if /i "%SETUP_SSL%"=="y" goto :ssl
)

pause
exit /b 0

:ssl
echo Setting up SSL certificate...
ssh -i "%SSH_KEY_PATH%" root@%SERVER_IP% "apt update && apt install -y certbot python3-certbot-nginx"
ssh -i "%SSH_KEY_PATH%" root@%SERVER_IP% "certbot --nginx -d %DOMAIN_NAME% --non-interactive --agree-tos --email %ADMIN_EMAIL% --redirect"
if %ERRORLEVEL% equ 0 (
    echo SUCCESS: SSL certificate obtained
    ssh -i "%SSH_KEY_PATH%" root@%SERVER_IP% "(crontab -l 2>/dev/null; echo '0 12 * * * /usr/bin/certbot renew --quiet') | crontab -"
    echo Your app is now available at: https://%DOMAIN_NAME%
) else (
    echo ERROR: SSL setup failed
    echo Check DNS configuration and try again
)
pause
exit /b 0

:fix404
echo Fixing 404 errors...
ssh -i "%SSH_KEY_PATH%" root@%SERVER_IP% "test -f %REMOTE_APP_DIR%/index.html"
if %ERRORLEVEL% neq 0 (
    echo Files missing - deploying...
    goto :quick_deploy
)
echo Files exist, checking Nginx...
ssh -i "%SSH_KEY_PATH%" root@%SERVER_IP% "nginx -t && systemctl restart nginx"
echo 404 errors should be fixed
pause
exit /b 0

:fixnginx
echo Fixing Nginx conflicts...
ssh -i "%SSH_KEY_PATH%" root@%SERVER_IP% "rm -f /etc/nginx/sites-enabled/quran-app"
ssh -i "%SSH_KEY_PATH%" root@%SERVER_IP% "nginx -t"
if %ERRORLEVEL% neq 0 (
    echo ERROR: Other Nginx configurations have issues
    pause
    exit /b 1
)
goto :quick_deploy

:fixdns
echo Checking DNS configuration...
nslookup %DOMAIN_NAME% | findstr /i "Address" | findstr /v "#"
echo.
echo Your server IP should be: %SERVER_IP%
echo.
echo If DNS is not configured:
echo   1. Login to your domain registrar
echo   2. Add/Update A record:
echo      Name: quran
echo      Type: A
echo      Value: %SERVER_IP%
echo      TTL: 300
echo   3. Wait 5-15 minutes for propagation
pause
exit /b 0

:status
echo ========================================
echo Quran App Deployment Status
echo ========================================
echo.
echo Server: %SERVER_IP%
echo Domain: %DOMAIN_NAME%
echo.

echo Testing connection...
ssh -i "%SSH_KEY_PATH%" -o ConnectTimeout=5 root@%SERVER_IP% "echo 'Connected'" >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: Cannot connect to server
    pause
    exit /b 1
)

echo Checking services...
ssh -i "%SSH_KEY_PATH%" root@%SERVER_IP% "systemctl is-active nginx"
ssh -i "%SSH_KEY_PATH%" root@%SERVER_IP% "ls -1 %REMOTE_APP_DIR% 2>/dev/null | wc -l"
echo.

echo Testing responses...
ssh -i "%SSH_KEY_PATH%" root@%SERVER_IP% "curl -s -o /dev/null -w 'HTTP: %%{http_code}' http://localhost -H 'Host: %DOMAIN_NAME%'"
echo.
ssh -i "%SSH_KEY_PATH%" root@%SERVER_IP% "curl -s -o /dev/null -w 'HTTPS: %%{http_code}' -k https://localhost -H 'Host: %DOMAIN_NAME%' 2>/dev/null || echo HTTPS: N/A"
echo.

echo SSL certificate status:
ssh -i "%SSH_KEY_PATH%" root@%SERVER_IP% "certbot certificates 2>/dev/null | findstr /i 'quran.sunnahlife.co.uk' || echo No SSL certificate found"
echo.

echo Test these URLs:
echo   Direct IP: http://%SERVER_IP%
echo   HTTP: http://%DOMAIN_NAME%
echo   HTTPS: https://%DOMAIN_NAME%
echo.

pause
exit /b 0
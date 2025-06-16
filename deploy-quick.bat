@echo off
REM Quick Deploy Script for Quran App - Windows Batch

echo ========================================
echo Quran App - Quick Deploy (Windows)
echo ========================================

set SERVER_IP=139.162.156.153
set SSH_KEY_PATH=C:\Users\rizwa\.ssh\id_ed25519
set DOMAIN_NAME=quran.sunnahlife.co.uk

echo Testing connection...
ssh -i "%SSH_KEY_PATH%" -o ConnectTimeout=5 root@%SERVER_IP% "exit" 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: Connection failed
    pause
    exit /b 1
)

echo Building application...
if exist dist (
    rmdir /s /q dist
)

call npm install --silent
if %ERRORLEVEL% neq 0 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)

call npm run build --silent
if %ERRORLEVEL% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo Uploading files...
scp -i "%SSH_KEY_PATH%" -r dist/* root@%SERVER_IP%:/var/www/quran-app/ 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: Upload failed
    pause
    exit /b 1
)

echo Setting permissions and reloading...
ssh -i "%SSH_KEY_PATH%" root@%SERVER_IP% "chown -R www-data:www-data /var/www/quran-app && chmod -R 755 /var/www/quran-app && systemctl reload nginx"

echo.
echo ========================================
echo SUCCESS: Quran app deployed!
echo ========================================
echo Your app is available at: https://%DOMAIN_NAME%
echo.

pause
# Quran App Deployment Guide

This guide explains how to deploy the Quran application to `quran.sunnahlife.co.uk` on the same server as your booking system.

## Prerequisites

- Server: `139.162.156.153` (same as booking system)
- SSH access configured with key: `C:\Users\rizwa\.ssh\id_ed25519`
- Node.js and npm installed locally
- Domain `quran.sunnahlife.co.uk` should point to the server IP

## Deployment Scripts

### 1. PowerShell Script (Windows) - Full Deploy
```powershell
# Navigate to the Quran app directory
cd "m:\QuranPak\QuranPak"

# Run full deployment with interactive prompts
.\deploy-quran.ps1

# Or run quick deployment (silent)
.\deploy-quran.ps1 -Compressed
```

### 2. Bash Script (Linux/Mac)
```bash
# Navigate to the Quran app directory
cd /mnt/m/QuranPak/QuranPak

# Run the deployment script
./deploy-quran.sh
```

### 3. Quick Deploy (Windows Batch)
```cmd
REM Navigate to the Quran app directory
cd "m:\QuranPak\QuranPak"

REM Run quick deployment
deploy-quick.bat
```

## What the Scripts Do

1. **Test Connection**: Verify SSH access to the server
2. **Build Application**: Run `npm install` and `npm run build`
3. **Create Directory**: Set up `/var/www/quran-app/` on server
4. **Upload Files**: Transfer built files to server
5. **Configure Nginx**: Create virtual host configuration for `quran.sunnahlife.co.uk`
6. **Set Permissions**: Ensure proper file ownership and permissions
7. **SSL Setup**: Optional SSL certificate installation with Let's Encrypt

## Nginx Configuration

The deployment creates an optimized Nginx configuration with:

- **Gzip Compression**: Reduces file sizes for faster loading
- **Security Headers**: Protects against common web vulnerabilities  
- **Vue.js SPA Support**: Handles client-side routing correctly
- **Static Asset Caching**: Optimizes performance with proper cache headers
- **PWA Support**: Ensures service worker and manifest work correctly

## Features Included

- 📱 **Progressive Web App (PWA)**: Installable on mobile devices
- 🔍 **Word-by-word Analysis**: Detailed Quran study features
- 🎵 **Audio Recitation**: Integrated audio playback
- 🌐 **Multiple Translations**: Support for various language translations
- 📱 **Mobile Optimized**: Responsive design for all devices
- ⚡ **Fast Loading**: Optimized build with caching strategies

## Directory Structure on Server

```
/var/www/quran-app/
├── index.html
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
├── icons/
├── manifest.json
├── sw.js (service worker)
└── other built files...
```

## SSL Certificate Setup

The scripts can automatically set up SSL certificates using Let's Encrypt:

1. Ensure DNS points to your server IP
2. Run the deployment script
3. Choose "Y" when prompted for SSL setup
4. The script will automatically obtain and configure the certificate

## Manual SSL Setup

If automatic SSL setup fails:

```bash
# SSH into your server
ssh -i "C:\Users\rizwa\.ssh\id_ed25519" root@139.162.156.153

# Run the SSL setup script
/usr/local/bin/setup-ssl quran.sunnahlife.co.uk
```

## Troubleshooting

### DNS Issues
- Verify `quran.sunnahlife.co.uk` points to `139.162.156.153`
- Use `nslookup quran.sunnahlife.co.uk` to check DNS resolution
- DNS changes can take 5-30 minutes to propagate

### Build Failures
- Ensure Node.js and npm are installed and up to date
- Clear `node_modules` and run `npm install` again
- Check for TypeScript or linting errors

### Upload Issues
- Verify SSH key permissions and access
- Check server disk space: `df -h`
- Ensure `/var/www/quran-app/` directory exists and is writable

### Nginx Configuration
- Test config: `nginx -t`
- Check error logs: `tail -f /var/log/nginx/error.log`
- Restart if needed: `systemctl restart nginx`

## Quick Commands

```bash
# Check deployment status
curl -I https://quran.sunnahlife.co.uk

# View nginx logs
ssh root@139.162.156.153 "tail -f /var/log/nginx/access.log"

# Check server status
ssh root@139.162.156.153 "systemctl status nginx"

# Update just the files (after initial setup)
./deploy-quran.ps1 -Compressed
```

## Updating the Application

For future updates, you can use the quick deploy option:

1. Make your changes to the Vue.js application
2. Run the quick deploy script
3. The application will be rebuilt and uploaded automatically

The deployment preserves your nginx configuration and SSL certificates, only updating the application files.

## Support

If you encounter issues:

1. Check the deployment logs for error messages
2. Verify all prerequisites are met
3. Ensure DNS is configured correctly
4. Test SSH connectivity manually

Your Quran application will be available at `https://quran.sunnahlife.co.uk` after successful deployment!
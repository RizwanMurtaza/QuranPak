# Quran App Deployment Guide

This unified deployment script handles all deployment tasks for the Quran app to quran.sunnahlife.co.uk.

## Prerequisites

- Node.js and npm installed locally
- SSH key configured at `~/.ssh/optimum_linode` (or update path in scripts)
- Server access to 172.236.15.248
- Domain configured: quran.sunnahlife.co.uk

## Usage

### PowerShell (Windows)

```powershell
# For new server - run this first!
./deploy.ps1 -Action server-setup

# Full deployment with prompts
./deploy.ps1

# Quick deployment without prompts
./deploy.ps1 -Quick

# Specific actions
./deploy.ps1 -Action deploy      # Deploy application
./deploy.ps1 -Action ssl         # Setup SSL certificate
./deploy.ps1 -Action fix-404     # Fix 404 errors
./deploy.ps1 -Action fix-nginx   # Fix Nginx configuration
./deploy.ps1 -Action fix-dns     # Check DNS configuration
./deploy.ps1 -Action status      # Check deployment status

# Additional flags
./deploy.ps1 -SkipBuild          # Skip npm build step
./deploy.ps1 -Force              # Force actions without confirmation
```

### Bash (Linux/Mac)

```bash
# Make script executable (first time only)
chmod +x deploy.sh

# For new server - run this first!
./deploy.sh server-setup

# Full deployment with prompts
./deploy.sh

# Quick deployment without prompts
./deploy.sh --quick

# Specific actions
./deploy.sh deploy               # Deploy application
./deploy.sh ssl                  # Setup SSL certificate
./deploy.sh fix-404              # Fix 404 errors
./deploy.sh fix-nginx            # Fix Nginx configuration
./deploy.sh fix-dns              # Check DNS configuration
./deploy.sh status               # Check deployment status

# Additional flags
./deploy.sh --skip-build         # Skip npm build step
./deploy.sh --force              # Force actions without confirmation
```

### Batch (Windows fallback)

```batch
REM Full deployment
deploy.bat

REM Quick deployment
deploy.bat quick

REM Specific actions
deploy.bat deploy
deploy.bat ssl
deploy.bat fix-404
deploy.bat fix-nginx
deploy.bat fix-dns
deploy.bat status
```

## Features

### Server-Setup Action (NEW)
- Installs Nginx web server
- Configures firewall rules
- Creates necessary directories
- Installs required packages
- **Run this first on a new server!**

### Deploy Action
- Builds the Vue.js application
- Uploads files to server
- Configures Nginx
- Sets proper permissions
- Optional SSL setup

### SSL Action
- Installs Let's Encrypt certificate
- Configures auto-renewal
- Sets up HTTPS redirect

### Fix-404 Action
- Checks for missing files
- Re-deploys if needed
- Fixes Nginx configuration

### Fix-Nginx Action
- Resolves configuration conflicts
- Recreates clean configuration
- Restarts services

### Fix-DNS Action
- Checks current DNS configuration
- Provides instructions for fixes
- Verifies domain resolution

### Status Action
- Shows server connectivity
- Displays service status
- Tests HTTP/HTTPS responses
- Shows SSL certificate info

## Configuration

Edit the configuration section in any script to update:
- `SERVER_IP`: Target server IP address
- `DOMAIN_NAME`: Your domain name
- `SSH_KEY_PATH`: Path to SSH private key
- `REMOTE_APP_DIR`: Server app directory
- `ADMIN_EMAIL`: Email for SSL certificates

## Troubleshooting

### Connection Issues
```bash
# Check SSH connection
./deploy.sh status

# Verify SSH key path
ls -la ~/.ssh/id_ed25519
```

### DNS Issues
```bash
# Check DNS configuration
./deploy.sh fix-dns

# Verify DNS propagation
nslookup quran.sunnahlife.co.uk
```

### SSL Issues
```bash
# Clean SSL setup attempt
./deploy.sh ssl --force

# Check certificate status
./deploy.sh status
```

### 404 Errors
```bash
# Fix missing files and configuration
./deploy.sh fix-404
```

## Quick Start

For first-time deployment on a new server:
```bash
# 1. Setup server prerequisites
./deploy.ps1 -Action server-setup
# or
./deploy.sh server-setup

# 2. Check DNS is configured
./deploy.ps1 -Action fix-dns

# 3. Deploy application
./deploy.ps1 -Action deploy

# 4. Setup SSL (after DNS propagates)
./deploy.ps1 -Action ssl

# 5. Verify deployment
./deploy.ps1 -Action status
```

For subsequent deployments:
```bash
# Quick deployment
./deploy.ps1 -Quick
# or
./deploy.sh --quick
```

## Notes

- DNS changes take 5-15 minutes to propagate
- SSL certificate requires valid DNS pointing to server
- The script handles both HTTP and HTTPS configurations
- Auto-renewal is configured for SSL certificates
- All scripts support the same functionality across platforms
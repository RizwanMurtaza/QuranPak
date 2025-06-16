#!/bin/bash

# Quran App Deployment Script (Linux/Mac)
# Deploy to quran.sunnahlife.co.uk

set -e

# Configuration
SERVER_IP="139.162.156.153"
DOMAIN_NAME="quran.sunnahlife.co.uk"
SSH_KEY_PATH="$HOME/.ssh/id_ed25519"
REMOTE_APP_DIR="/var/www/quran-app"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================"
echo -e "Quran App - Bash Deploy Script"
echo -e "========================================${NC}"

echo -e "${YELLOW}Server IP: $SERVER_IP"
echo -e "Domain: $DOMAIN_NAME"
echo -e "SSH Key: $SSH_KEY_PATH${NC}"
echo ""

# Function to check if command was successful
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}SUCCESS: $1${NC}"
    else
        echo -e "${RED}ERROR: $1 failed${NC}"
        exit 1
    fi
}

echo -e "${CYAN}Step 1: Testing server connection...${NC}"
ssh -i "$SSH_KEY_PATH" -o ConnectTimeout=10 -o StrictHostKeyChecking=no root@$SERVER_IP "echo 'Connected successfully'" > /dev/null 2>&1
check_status "Server connection"
echo ""

echo -e "${CYAN}Step 2: Checking local Node.js...${NC}"
node_version=$(node --version 2>/dev/null || echo "Not found")
echo -e "${GREEN}Node.js version: $node_version${NC}"
echo ""

echo -e "${CYAN}Step 3: Checking local NPM...${NC}"
npm_version=$(npm --version 2>/dev/null || echo "Not found")
echo -e "${GREEN}NPM version: $npm_version${NC}"
echo ""

echo -e "${CYAN}Step 4: Cleaning previous build...${NC}"
if [ -d "dist" ]; then
    rm -rf dist
    echo -e "${GREEN}Previous dist folder removed${NC}"
fi
check_status "Previous build cleaned"
echo ""

echo -e "${CYAN}Step 5: Installing dependencies...${NC}"
echo -e "${YELLOW}Current directory: $(pwd)${NC}"
if [ -f "package.json" ]; then
    npm install
    check_status "Dependencies installation"
else
    echo -e "${RED}ERROR: package.json not found${NC}"
    ls -la
    exit 1
fi
echo ""

echo -e "${CYAN}Step 6: Building application...${NC}"
npm run build
check_status "Application build"
echo ""

echo -e "${CYAN}Step 7: Verifying build output...${NC}"
if [ ! -d "dist" ]; then
    echo -e "${RED}ERROR: dist folder not found after build${NC}"
    exit 1
fi
ls -la dist/
check_status "Build output verification"
echo ""

echo -e "${CYAN}Step 8: Setting up Quran app directory on server...${NC}"
ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "mkdir -p $REMOTE_APP_DIR && chown -R www-data:www-data $REMOTE_APP_DIR"
check_status "Quran app directory setup"
echo ""

echo -e "${CYAN}Step 9: Uploading to server...${NC}"
scp -i "$SSH_KEY_PATH" -r dist/* root@$SERVER_IP:$REMOTE_APP_DIR/
check_status "File upload"
echo ""

echo -e "${CYAN}Step 10: Setting permissions...${NC}"
ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "chown -R www-data:www-data $REMOTE_APP_DIR && chmod -R 755 $REMOTE_APP_DIR"
check_status "Permission setting"
echo ""

echo -e "${CYAN}Step 11: Creating Nginx configuration for Quran app...${NC}"
cat << 'NGINX_CONFIG' | ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "cat > /etc/nginx/sites-available/quran-app"
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
NGINX_CONFIG

ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "ln -sf /etc/nginx/sites-available/quran-app /etc/nginx/sites-enabled/"
check_status "Nginx configuration creation"
echo ""

echo -e "${CYAN}Step 12: Testing Nginx configuration...${NC}"
ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "nginx -t"
check_status "Nginx configuration test"
echo ""

echo -e "${CYAN}Step 13: Reloading Nginx...${NC}"
ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "systemctl reload nginx"
check_status "Nginx reload"
echo ""

echo -e "${CYAN}Step 14: Testing deployment...${NC}"
http_status=$(ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "curl -s -o /dev/null -w 'HTTP Status: %{http_code}' http://localhost -H 'Host: quran.sunnahlife.co.uk'")
echo -e "${GREEN}$http_status${NC}"
echo ""

echo -e "${GREEN}========================================"
echo -e "DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo -e "========================================${NC}"
echo -e "${YELLOW}Your Quran app is available at: http://$DOMAIN_NAME${NC}"
echo ""

echo -e "${CYAN}Setup SSL certificate for $DOMAIN_NAME? (y/N)${NC}"
read -r ssl_setup

if [[ $ssl_setup == "y" || $ssl_setup == "Y" ]]; then
    echo -e "${CYAN}Setting up SSL...${NC}"
    
    # Check DNS configuration first
    echo -e "${YELLOW}Checking DNS configuration...${NC}"
    echo -e "${YELLOW}Your server IP: $SERVER_IP${NC}"
    
    domain_ip=$(nslookup $DOMAIN_NAME | grep "Address:" | tail -1 | awk '{print $2}' 2>/dev/null || echo "")
    
    if [ -n "$domain_ip" ] && [ "$domain_ip" != "$SERVER_IP" ]; then
        echo -e "${RED}WARNING: DNS mismatch detected!${NC}"
        echo -e "${RED}Domain points to: $domain_ip${NC}"
        echo -e "${RED}Server IP is: $SERVER_IP${NC}"
        echo ""
        echo -e "${YELLOW}You need to update your DNS A record:${NC}"
        echo -e "${NC}1. Go to your domain registrar (where you bought the domain)${NC}"
        echo -e "${NC}2. Find DNS settings or DNS management${NC}"
        echo -e "${NC}3. Update the A record for 'quran' subdomain to: $SERVER_IP${NC}"
        echo -e "${NC}4. Wait 5-15 minutes for DNS propagation${NC}"
        echo ""
        
        echo -e "${CYAN}Continue with SSL setup anyway? (y/N)${NC}"
        read -r continue_ssl
        
        if [[ $continue_ssl != "y" && $continue_ssl != "Y" ]]; then
            echo -e "${YELLOW}SSL setup cancelled. Update DNS first, then run SSL setup manually:${NC}"
            echo -e "${CYAN}ssh -i \"$SSH_KEY_PATH\" root@$SERVER_IP \"/usr/local/bin/setup-ssl $DOMAIN_NAME\"${NC}"
            exit 0
        fi
    fi
    
    # Proceed with SSL setup
    echo -e "${CYAN}Proceeding with SSL certificate setup...${NC}"
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "/usr/local/bin/setup-ssl $DOMAIN_NAME"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}SSL certificate setup completed${NC}"
        echo -e "${YELLOW}Your Quran app is now available at: https://$DOMAIN_NAME${NC}"
    else
        echo -e "${RED}SSL setup failed. This is usually due to DNS issues.${NC}"
        echo ""
        echo -e "${YELLOW}Manual steps to fix:${NC}"
        echo -e "${NC}1. Update DNS A record for '$DOMAIN_NAME' to: $SERVER_IP${NC}"
        echo -e "${NC}2. Wait 15-30 minutes for DNS propagation${NC}"
        echo -e "${NC}3. Test with: nslookup $DOMAIN_NAME${NC}"
        echo -e "${NC}4. Retry SSL: ssh root@$SERVER_IP '/usr/local/bin/setup-ssl $DOMAIN_NAME'${NC}"
    fi
fi

echo ""
echo -e "${GREEN}🕌 Your Quran application is now deployed!${NC}"
echo -e "${YELLOW}📖 Features included:${NC}"
echo -e "${NC}   • Progressive Web App (PWA)${NC}"
echo -e "${NC}   • Word-by-word analysis${NC}"
echo -e "${NC}   • Audio recitation${NC}"
echo -e "${NC}   • Multiple translations${NC}"
echo -e "${NC}   • Mobile-optimized${NC}"
echo ""

# Quick deploy option for future use
echo -e "${CYAN}For future quick deployments, use:${NC}"
echo -e "${YELLOW}./deploy-quran.sh -q${NC}"
echo ""
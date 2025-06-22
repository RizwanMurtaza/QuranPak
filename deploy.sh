#!/bin/bash

# ========================================
# Quran App - Unified Deployment Script
# ========================================
# Usage:
#   ./deploy.sh                    # Full deployment with prompts
#   ./deploy.sh --quick            # Quick deployment without prompts
#   ./deploy.sh deploy             # Deploy application
#   ./deploy.sh ssl                # Setup SSL certificate
#   ./deploy.sh fix-404            # Fix 404 errors
#   ./deploy.sh fix-nginx          # Fix Nginx configuration
#   ./deploy.sh fix-dns            # Check and fix DNS issues
#   ./deploy.sh status             # Check deployment status
#   ./deploy.sh --skip-build       # Skip npm build step
#   ./deploy.sh --force            # Force actions without confirmation

set -e

# Configuration
SERVER_IP="172.236.15.248"
DOMAIN_NAME="quran.sunnahlife.co.uk"
SSH_KEY_PATH="$HOME/.ssh/optimum_linode"
REMOTE_APP_DIR="/var/www/quran-app"
ADMIN_EMAIL="admin@$DOMAIN_NAME"

# Parse arguments
ACTION="${1:-deploy}"
QUICK=false
SKIP_BUILD=false
FORCE=false

for arg in "$@"; do
    case $arg in
        --quick) QUICK=true ;;
        --skip-build) SKIP_BUILD=true ;;
        --force) FORCE=true ;;
    esac
done

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Helper functions
write_success() { echo -e "${GREEN}✅ $1${NC}"; }
write_error() { echo -e "${RED}❌ $1${NC}"; }
write_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
write_info() { echo -e "${CYAN}ℹ️  $1${NC}"; }
write_step() { echo -e "${CYAN}▶️  $1${NC}"; }

# Test SSH connection
test_ssh_connection() {
    write_step "Testing SSH connection..."
    if ssh -i "$SSH_KEY_PATH" -o ConnectTimeout=10 -o StrictHostKeyChecking=no root@$SERVER_IP "echo 'Connected'" > /dev/null 2>&1; then
        write_success "SSH connection OK"
        return 0
    else
        write_error "Cannot connect to server"
        echo "Check SSH key path: $SSH_KEY_PATH"
        return 1
    fi
}

# Test DNS configuration
test_dns_configuration() {
    write_step "Checking DNS configuration..."
    
    domain_ip=$(nslookup $DOMAIN_NAME 2>/dev/null | grep "Address:" | tail -1 | awk '{print $2}' || echo "")
    
    if [ -n "$domain_ip" ]; then
        write_info "Domain $DOMAIN_NAME points to: $domain_ip"
        
        if [ "$domain_ip" = "$SERVER_IP" ]; then
            write_success "DNS points to correct server"
            return 0
        else
            write_warning "DNS mismatch detected!"
            echo "Domain points to: $domain_ip"
            echo "Server IP is: $SERVER_IP"
            echo ""
            write_info "Update your DNS A record:"
            echo "  1. Go to your domain registrar"
            echo "  2. Find DNS settings"
            echo "  3. Update A record for 'quran' subdomain to: $SERVER_IP"
            echo "  4. Wait 5-15 minutes for DNS propagation"
            return 1
        fi
    else
        write_warning "Domain does not resolve"
        return 1
    fi
}

# Build application
build_application() {
    if [ "$SKIP_BUILD" = true ]; then
        write_info "Skipping build (--skip-build flag)"
        return 0
    fi
    
    write_step "Building application..."
    
    # Clean previous build
    if [ -d "dist" ]; then
        rm -rf dist
        write_success "Previous build cleaned"
    fi
    
    # Check package.json
    if [ ! -f "package.json" ]; then
        write_error "package.json not found"
        return 1
    fi
    
    # Install dependencies
    write_info "Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        write_error "npm install failed"
        return 1
    fi
    
    # Build
    write_info "Building application..."
    npm run build
    if [ $? -ne 0 ]; then
        write_error "Build failed"
        return 1
    fi
    
    # Verify build
    if [ ! -d "dist" ]; then
        write_error "dist folder not found after build"
        return 1
    fi
    
    write_success "Build completed"
    return 0
}

# Deploy application
deploy_application() {
    write_step "Deploying application..."
    
    # Create app directory
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "mkdir -p $REMOTE_APP_DIR"
    
    # Upload files
    write_info "Uploading files..."
    scp -i "$SSH_KEY_PATH" -r dist/* root@$SERVER_IP:$REMOTE_APP_DIR/
    if [ $? -ne 0 ]; then
        write_error "Upload failed"
        return 1
    fi
    
    # Set permissions
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "chown -R www-data:www-data $REMOTE_APP_DIR && chmod -R 755 $REMOTE_APP_DIR"
    
    write_success "Files deployed"
    return 0
}

# Setup server prerequisites
setup_server() {
    write_step "Setting up server prerequisites..."
    
    # Update package list
    write_info "Updating package list..."
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "DEBIAN_FRONTEND=noninteractive apt-get update -qq"
    
    # Install essential packages
    write_info "Installing essential packages..."
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "DEBIAN_FRONTEND=noninteractive apt-get install -y -qq nginx curl git ufw"
    
    # Configure firewall
    write_info "Configuring firewall..."
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "ufw allow 'Nginx Full' && ufw allow ssh && echo 'y' | ufw enable"
    
    # Create web directories
    write_info "Creating web directories..."
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "mkdir -p /var/www/quran-app"
    
    write_success "Server prerequisites installed"
    return 0
}

# Setup Nginx
setup_nginx() {
    write_step "Setting up Nginx configuration..."
    
    # First ensure Nginx is installed
    write_info "Checking if Nginx is installed..."
    nginx_installed=$(ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "which nginx 2>/dev/null || echo 'NOT_FOUND'")
    
    if [ "$nginx_installed" = "NOT_FOUND" ]; then
        write_warning "Nginx not installed. Installing..."
        ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "DEBIAN_FRONTEND=noninteractive apt-get update -qq && DEBIAN_FRONTEND=noninteractive apt-get install -y -qq nginx"
        if [ $? -ne 0 ]; then
            write_error "Failed to install Nginx"
            return 1
        fi
        write_success "Nginx installed"
        
        # Start and enable Nginx
        ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "systemctl start nginx && systemctl enable nginx"
    fi
    
    # Ensure directories exist
    write_info "Creating Nginx directories..."
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled"
    
    # Create Nginx config directly on server
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
    
    # Remove default site if it exists
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "rm -f /etc/nginx/sites-enabled/default"
    
    # Enable site
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "ln -sf /etc/nginx/sites-available/quran-app /etc/nginx/sites-enabled/quran-app"
    
    # Update main nginx.conf to include sites-enabled
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "grep -q 'include /etc/nginx/sites-enabled' /etc/nginx/nginx.conf || sed -i '/http {/a\    include /etc/nginx/sites-enabled/*;' /etc/nginx/nginx.conf"
    
    # Test configuration
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "nginx -t"
    if [ $? -ne 0 ]; then
        write_error "Nginx configuration test failed"
        return 1
    fi
    
    # Reload Nginx
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "systemctl reload nginx"
    
    write_success "Nginx configured"
    return 0
}

# Setup SSL
setup_ssl() {
    write_step "Setting up SSL certificate..."
    
    # Check if DNS is properly configured
    if ! test_dns_configuration; then
        if [ "$FORCE" != true ]; then
            echo -n "DNS not properly configured. Continue anyway? (y/N) "
            read -r continue_ssl
            if [[ $continue_ssl != "y" && $continue_ssl != "Y" ]]; then
                write_warning "SSL setup cancelled"
                return 1
            fi
        fi
    fi
    
    # Install certbot if needed
    write_info "Ensuring Certbot is installed..."
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "DEBIAN_FRONTEND=noninteractive apt-get update -qq && DEBIAN_FRONTEND=noninteractive apt-get install -y -qq certbot python3-certbot-nginx"
    
    # Clean any stuck processes
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "pkill -f certbot || true"
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "rm -f /var/lib/letsencrypt/.certbot.lock || true"
    
    # Get certificate
    write_info "Obtaining SSL certificate..."
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "certbot --nginx -d $DOMAIN_NAME --non-interactive --agree-tos --email $ADMIN_EMAIL --redirect"
    
    if [ $? -eq 0 ]; then
        write_success "SSL certificate obtained"
        
        # Setup auto-renewal
        ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "(crontab -l 2>/dev/null; echo '0 12 * * * /usr/bin/certbot renew --quiet') | crontab -"
        write_success "Auto-renewal configured"
        
        # Test renewal
        ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "certbot renew --dry-run"
        
        return 0
    else
        write_error "SSL setup failed"
        write_info "Common causes:"
        echo "  1. DNS not pointing to server"
        echo "  2. Port 80/443 blocked"
        echo "  3. Rate limits reached"
        return 1
    fi
}

# Fix 404 errors
fix_404_errors() {
    write_step "Fixing 404 errors..."
    
    # Check if files exist
    index_exists=$(ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "test -f $REMOTE_APP_DIR/index.html && echo 'YES' || echo 'NO'")
    
    if [ "$index_exists" = "NO" ]; then
        write_warning "index.html missing - deploying files..."
        
        if [ ! -d "dist" ]; then
            if ! build_application; then
                return 1
            fi
        fi
        
        if ! deploy_application; then
            return 1
        fi
    fi
    
    # Fix Nginx configuration
    if ! setup_nginx; then
        return 1
    fi
    
    write_success "404 errors fixed"
    return 0
}

# Fix Nginx conflicts
fix_nginx_conflict() {
    write_step "Fixing Nginx conflicts..."
    
    # Temporarily disable site
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "rm -f /etc/nginx/sites-enabled/quran-app"
    
    # Test if other sites work
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "nginx -t"
    if [ $? -ne 0 ]; then
        write_error "Other Nginx configurations have issues"
        return 1
    fi
    
    # Create clean config
    if ! setup_nginx; then
        return 1
    fi
    
    write_success "Nginx conflicts resolved"
    return 0
}

# Check status
check_status() {
    echo -e "${YELLOW}"
    echo -e "${GREEN}========================================"
    echo -e "Quran App Deployment Status"
    echo -e "========================================${NC}"
    echo ""
    
    # Server info
    write_info "Server: $SERVER_IP"
    write_info "Domain: $DOMAIN_NAME"
    echo ""
    
    # DNS status
    test_dns_configuration || true
    echo ""
    
    # SSH test
    if ! test_ssh_connection; then
        return
    fi
    echo ""
    
    # Service status
    write_step "Checking services..."
    nginx_status=$(ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "systemctl is-active nginx")
    if [ "$nginx_status" = "active" ]; then
        echo -e "Nginx: ${GREEN}$nginx_status${NC}"
    else
        echo -e "Nginx: ${RED}$nginx_status${NC}"
    fi
    
    # Files status
    file_count=$(ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "ls -1 $REMOTE_APP_DIR 2>/dev/null | wc -l")
    echo "Files deployed: $file_count files"
    
    # Test responses
    echo ""
    write_step "Testing responses..."
    
    http_test=$(ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "curl -s -o /dev/null -w '%{http_code}' http://localhost -H 'Host: $DOMAIN_NAME'")
    echo "HTTP response: $http_test"
    
    https_test=$(ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "curl -s -o /dev/null -w '%{http_code}' -k https://localhost -H 'Host: $DOMAIN_NAME' 2>/dev/null || echo 'N/A'")
    echo "HTTPS response: $https_test"
    
    # SSL certificate
    echo ""
    write_step "SSL certificate status..."
    ssh -i "$SSH_KEY_PATH" root@$SERVER_IP "certbot certificates 2>/dev/null | grep -A2 'Certificate Name: quran.sunnahlife.co.uk' || echo 'No SSL certificate found'"
    
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo ""
    
    # URLs to test
    write_info "Test these URLs:"
    echo "  Direct IP: http://$SERVER_IP"
    echo "  HTTP: http://$DOMAIN_NAME"
    echo "  HTTPS: https://$DOMAIN_NAME"
}

# Main execution
main() {
    echo -e "${YELLOW}"
    echo -e "${GREEN}========================================"
    echo -e "Quran App - Unified Deployment Script"
    echo -e "========================================${NC}"
    echo ""
    
    case "${ACTION,,}" in
        deploy)
            if [ "$QUICK" != true ]; then
                write_info "This will deploy the Quran app to $DOMAIN_NAME"
                echo -n "Continue? (y/N) "
                read -r confirm
                if [[ $confirm != "y" && $confirm != "Y" ]]; then
                    write_warning "Deployment cancelled"
                    exit 0
                fi
            fi
            
            test_ssh_connection || exit 1
            test_dns_configuration || true
            
            build_application || exit 1
            deploy_application || exit 1
            setup_nginx || exit 1
            
            write_success "Deployment completed!"
            echo ""
            write_info "Your app is available at: http://$DOMAIN_NAME"
            echo ""
            
            if [ "$QUICK" != true ]; then
                echo -n "Setup SSL certificate? (y/N) "
                read -r setup_ssl_confirm
                if [[ $setup_ssl_confirm == "y" || $setup_ssl_confirm == "Y" ]]; then
                    setup_ssl || true
                fi
            fi
            ;;
        
        ssl)
            test_ssh_connection || exit 1
            setup_ssl || exit 1
            write_success "SSL setup completed!"
            write_info "Your app is now available at: https://$DOMAIN_NAME"
            ;;
        
        fix-404)
            test_ssh_connection || exit 1
            fix_404_errors || exit 1
            write_success "404 errors fixed!"
            ;;
        
        fix-nginx)
            test_ssh_connection || exit 1
            fix_nginx_conflict || exit 1
            write_success "Nginx conflicts fixed!"
            ;;
        
        fix-dns)
            test_dns_configuration || true
            echo ""
            write_info "If DNS is not configured:"
            echo "  1. Login to your domain registrar"
            echo "  2. Add/Update A record:"
            echo "     Name: quran"
            echo "     Type: A"
            echo "     Value: $SERVER_IP"
            echo "     TTL: 300"
            echo "  3. Wait 5-15 minutes for propagation"
            ;;
        
        status)
            check_status
            ;;
        
        server-setup)
            test_ssh_connection || exit 1
            setup_server || exit 1
            write_success "Server setup completed!"
            write_info "You can now run: ./deploy.sh deploy"
            ;;
        
        *)
            write_error "Invalid action: $ACTION"
            echo ""
            write_info "Available actions:"
            echo "  server-setup - Setup server prerequisites (run this first on new server)"
            echo "  deploy       - Deploy the application"
            echo "  ssl          - Setup SSL certificate"
            echo "  fix-404      - Fix 404 errors"
            echo "  fix-nginx    - Fix Nginx conflicts"
            echo "  fix-dns      - Check DNS configuration"
            echo "  status       - Check deployment status"
            exit 1
            ;;
    esac
}

# Run main function
main

if [ "$QUICK" != true ]; then
    echo ""
    echo "Press Enter to exit..."
    read -r
fi
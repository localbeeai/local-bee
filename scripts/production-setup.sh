#!/bin/bash

# LocalMarket Production Setup Script
# Run this script on your production server as the deploy user

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/home/deploy/LocalMarket"
NGINX_CONF="/etc/nginx/sites-available/localmarket"
DOMAIN="yourdomain.com"  # Replace with your actual domain

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

check_user() {
    if [ "$USER" != "deploy" ]; then
        log_error "This script must be run as the 'deploy' user"
        log_info "Switch to deploy user: sudo su - deploy"
        exit 1
    fi
}

install_dependencies() {
    log_step "Installing application dependencies..."
    
    cd $PROJECT_DIR
    
    # Install backend dependencies
    log_info "Installing backend dependencies..."
    cd backend
    npm ci --only=production
    
    # Install frontend dependencies and build
    log_info "Installing frontend dependencies and building..."
    cd ../frontend
    npm ci
    npm run build
    
    # Install serve globally if not present
    if ! command -v serve &> /dev/null; then
        sudo npm install -g serve
    fi
    
    cd ..
    log_info "✓ Dependencies installed"
}

setup_nginx() {
    log_step "Setting up Nginx configuration..."
    
    # Copy nginx configuration
    sudo cp nginx-production.conf $NGINX_CONF
    
    # Replace domain placeholder with actual domain
    sudo sed -i "s/yourdomain.com/$DOMAIN/g" $NGINX_CONF
    
    # Enable the site
    sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/localmarket
    
    # Remove default nginx site
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Test nginx configuration
    sudo nginx -t
    
    if [ $? -eq 0 ]; then
        sudo systemctl reload nginx
        log_info "✓ Nginx configured and reloaded"
    else
        log_error "Nginx configuration test failed"
        exit 1
    fi
}

setup_ssl() {
    log_step "Setting up SSL certificate..."
    
    # Get SSL certificate
    sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
    
    if [ $? -eq 0 ]; then
        log_info "✓ SSL certificate obtained and configured"
        
        # Set up automatic renewal
        (sudo crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | sudo crontab -
        log_info "✓ SSL auto-renewal configured"
    else
        log_warn "SSL certificate setup failed. You may need to configure it manually."
    fi
}

setup_pm2() {
    log_step "Setting up PM2 process manager..."
    
    cd $PROJECT_DIR
    
    # Create logs directory
    mkdir -p logs
    
    # Start PM2 processes
    pm2 start ecosystem.config.js --env production
    
    # Save PM2 configuration
    pm2 save
    
    # Setup PM2 startup script
    pm2 startup
    
    log_info "✓ PM2 configured and processes started"
    log_info "✓ PM2 startup script generated (run the generated command as root if needed)"
}

setup_monitoring() {
    log_step "Setting up monitoring and logging..."
    
    # Install PM2 log rotation
    pm2 install pm2-logrotate
    pm2 set pm2-logrotate:max_size 10M
    pm2 set pm2-logrotate:retain 30
    pm2 set pm2-logrotate:compress true
    
    log_info "✓ Log rotation configured"
}

setup_firewall() {
    log_step "Configuring firewall..."
    
    # Allow HTTP and HTTPS
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    
    # Allow SSH (should already be allowed)
    sudo ufw allow ssh
    
    # Enable firewall if not already enabled
    sudo ufw --force enable
    
    log_info "✓ Firewall configured"
}

health_check() {
    log_step "Performing health check..."
    
    # Wait for services to start
    sleep 15
    
    # Check backend health
    if curl -f http://localhost:5000/health > /dev/null 2>&1; then
        log_info "✓ Backend health check passed"
    else
        log_error "Backend health check failed"
        pm2 logs localmarket-backend --lines 10
        exit 1
    fi
    
    # Check frontend
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        log_info "✓ Frontend health check passed"
    else
        log_error "Frontend health check failed"
        pm2 logs localmarket-frontend --lines 10
        exit 1
    fi
    
    # Check external access
    if curl -f https://$DOMAIN/health > /dev/null 2>&1; then
        log_info "✓ External health check passed"
    else
        log_warn "External health check failed - check DNS and SSL configuration"
    fi
}

display_status() {
    log_step "Deployment Status"
    
    echo
    echo "🚀 LocalMarket Production Setup Complete!"
    echo
    echo "📊 Service Status:"
    pm2 status
    echo
    echo "🌐 Application URLs:"
    echo "   Frontend: https://$DOMAIN"
    echo "   API: https://$DOMAIN/api"
    echo "   Health Check: https://$DOMAIN/health"
    echo
    echo "📋 Management Commands:"
    echo "   View logs: pm2 logs"
    echo "   Restart app: pm2 restart all"
    echo "   Monitor: pm2 monit"
    echo "   Stop app: pm2 stop all"
    echo
    echo "🔧 Next Steps:"
    echo "   1. Configure your Stripe webhook URLs"
    echo "   2. Test all functionality"
    echo "   3. Set up monitoring alerts"
    echo "   4. Configure backup strategy"
    echo
}

# Main execution
main() {
    log_info "🚀 Starting LocalMarket Production Setup..."
    
    check_user
    install_dependencies
    setup_nginx
    setup_ssl
    setup_pm2
    setup_monitoring
    setup_firewall
    health_check
    display_status
    
    log_info "✅ Production setup completed successfully!"
}

# Parse command line options
while [[ $# -gt 0 ]]; do
    case $1 in
        --domain)
            DOMAIN="$2"
            shift 2
            ;;
        --help|-h)
            echo "LocalMarket Production Setup Script"
            echo
            echo "Usage: $0 [OPTIONS]"
            echo
            echo "Options:"
            echo "  --domain DOMAIN    Set the domain name (default: yourdomain.com)"
            echo "  --help, -h         Show this help message"
            echo
            echo "Prerequisites:"
            echo "  - Run as 'deploy' user"
            echo "  - Application code cloned to $PROJECT_DIR"
            echo "  - .env.production file configured"
            echo "  - DNS pointing to this server"
            echo
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Run main function
main
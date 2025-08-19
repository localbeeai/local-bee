#!/bin/bash

# LocalMarket Server Initial Setup Script
# This script sets up a fresh Ubuntu server for LocalMarket deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

main() {
    log_info "🚀 Starting LocalMarket Server Setup..."
    
    # Check if running as root
    if [ "$EUID" -ne 0 ]; then
        log_error "Please run this script as root (use sudo or login as root)"
        exit 1
    fi
    
    log_step "Updating system packages..."
    apt update && apt upgrade -y
    
    log_step "Creating deploy user..."
    if ! id "deploy" &>/dev/null; then
        adduser --disabled-password --gecos "" deploy
        usermod -aG sudo deploy
        log_info "✓ Deploy user created"
    else
        log_info "✓ Deploy user already exists"
    fi
    
    log_step "Setting up SSH access for deploy user..."
    mkdir -p /home/deploy/.ssh
    if [ -f ~/.ssh/authorized_keys ]; then
        cp ~/.ssh/authorized_keys /home/deploy/.ssh/
        chown -R deploy:deploy /home/deploy/.ssh
        chmod 700 /home/deploy/.ssh
        chmod 600 /home/deploy/.ssh/authorized_keys
        log_info "✓ SSH keys copied to deploy user"
    else
        log_warn "No SSH keys found. You may need to set up SSH access manually."
    fi
    
    log_step "Configuring firewall..."
    ufw allow OpenSSH
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable
    log_info "✓ Firewall configured"
    
    log_step "Installing Docker..."
    if ! command -v docker &> /dev/null; then
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
        usermod -aG docker deploy
        rm get-docker.sh
        log_info "✓ Docker installed"
    else
        log_info "✓ Docker already installed"
    fi
    
    log_step "Installing Docker Compose..."
    if ! command -v docker-compose &> /dev/null; then
        curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
        log_info "✓ Docker Compose installed"
    else
        log_info "✓ Docker Compose already installed"
    fi
    
    log_step "Installing Node.js..."
    if ! command -v node &> /dev/null; then
        curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
        apt-get install -y nodejs
        log_info "✓ Node.js installed"
    else
        log_info "✓ Node.js already installed"
    fi
    
    log_step "Installing PM2..."
    if ! command -v pm2 &> /dev/null; then
        npm install -g pm2
        log_info "✓ PM2 installed"
    else
        log_info "✓ PM2 already installed"
    fi
    
    log_step "Installing Nginx..."
    if ! command -v nginx &> /dev/null; then
        apt install nginx -y
        systemctl enable nginx
        systemctl start nginx
        log_info "✓ Nginx installed and started"
    else
        log_info "✓ Nginx already installed"
    fi
    
    log_step "Installing Certbot for SSL..."
    if ! command -v certbot &> /dev/null; then
        apt install certbot python3-certbot-nginx -y
        log_info "✓ Certbot installed"
    else
        log_info "✓ Certbot already installed"
    fi
    
    log_step "Installing additional tools..."
    apt install -y htop curl wget git unzip software-properties-common
    
    log_step "Securing SSH configuration..."
    sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
    sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
    systemctl restart sshd
    log_info "✓ SSH secured (root login disabled)"
    
    log_step "Setting up log rotation..."
    cat > /etc/logrotate.d/localmarket << EOF
/home/deploy/LocalMarket/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    sharedscripts
    postrotate
        su deploy -c "pm2 reloadLogs"
    endscript
}
EOF
    log_info "✓ Log rotation configured"
    
    log_step "Creating necessary directories..."
    mkdir -p /home/deploy/backups
    chown deploy:deploy /home/deploy/backups
    
    log_info "✅ Server setup completed successfully!"
    echo
    echo "📋 Setup Summary:"
    echo "   • System packages updated"
    echo "   • Deploy user created with sudo access"
    echo "   • SSH access configured"
    echo "   • Firewall configured (ports 22, 80, 443 open)"
    echo "   • Docker and Docker Compose installed"
    echo "   • Node.js 18 and PM2 installed"
    echo "   • Nginx web server installed"
    echo "   • Certbot for SSL certificates installed"
    echo "   • SSH root login disabled for security"
    echo "   • Log rotation configured"
    echo
    echo "🔑 Next Steps:"
    echo "   1. Logout and login as deploy user: ssh deploy@$(hostname -I | awk '{print $1}')"
    echo "   2. Clone your repository: git clone https://github.com/Collin4828/LocalMarket.git"
    echo "   3. Run the production setup script"
    echo
    echo "⚠️  Important: You can no longer SSH as root. Use 'deploy' user instead."
    echo
}

# Run main function
main "$@"
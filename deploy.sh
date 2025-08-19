#!/bin/bash

# LocalMarket Production Deployment Script
# This script automates the deployment process for production

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOCKER_COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.production"
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"

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

check_requirements() {
    log_info "Checking deployment requirements..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check if environment file exists
    if [ ! -f "$ENV_FILE" ]; then
        log_error "Production environment file ($ENV_FILE) not found!"
        log_info "Please copy .env.example to $ENV_FILE and configure your production values."
        exit 1
    fi
    
    log_info "✓ All requirements met"
}

create_directories() {
    log_info "Creating necessary directories..."
    mkdir -p logs uploads ssl backups
    mkdir -p docker/prometheus docker/grafana/provisioning
    log_info "✓ Directories created"
}

backup_database() {
    if [ "$1" = "true" ]; then
        log_info "Creating database backup..."
        mkdir -p "$BACKUP_DIR"
        
        # Create MongoDB backup
        docker-compose -f $DOCKER_COMPOSE_FILE exec mongodb mongodump --out /data/backup
        docker cp $(docker-compose -f $DOCKER_COMPOSE_FILE ps -q mongodb):/data/backup "$BACKUP_DIR/mongodb"
        
        log_info "✓ Database backup created at $BACKUP_DIR"
    fi
}

deploy() {
    log_info "Starting production deployment..."
    
    # Pull latest images
    log_info "Pulling Docker images..."
    docker-compose -f $DOCKER_COMPOSE_FILE pull
    
    # Build and start services
    log_info "Building and starting services..."
    docker-compose -f $DOCKER_COMPOSE_FILE up -d --build
    
    # Wait for services to be healthy
    log_info "Waiting for services to be healthy..."
    timeout 300 bash -c 'until docker-compose -f $DOCKER_COMPOSE_FILE ps | grep -E "(healthy|Up)"; do sleep 5; done'
    
    log_info "✓ Deployment completed successfully!"
}

setup_ssl() {
    log_info "Setting up SSL certificates..."
    
    # This would typically use Let's Encrypt
    log_warn "SSL setup requires manual configuration"
    log_info "For Let's Encrypt certificates:"
    log_info "1. Install certbot: sudo apt-get install certbot"
    log_info "2. Get certificate: sudo certbot certonly --webroot -w /var/www/certbot -d yourdomain.com"
    log_info "3. Copy certificates to docker/ssl/ directory"
    log_info "4. Uncomment HTTPS server block in nginx configuration"
}

show_status() {
    log_info "Deployment Status:"
    docker-compose -f $DOCKER_COMPOSE_FILE ps
    
    log_info "Service URLs:"
    log_info "Frontend: http://localhost (or your domain)"
    log_info "API: http://localhost/api (or your domain/api)"
    log_info "Health Check: http://localhost/health"
    log_info "Monitoring (Grafana): http://localhost:3001"
    log_info "Metrics (Prometheus): http://localhost:9090"
}

show_logs() {
    log_info "Recent logs from all services:"
    docker-compose -f $DOCKER_COMPOSE_FILE logs --tail=50
}

cleanup() {
    log_info "Cleaning up old Docker images and containers..."
    docker system prune -f
    log_info "✓ Cleanup completed"
}

# Main deployment function
main() {
    local backup_db=false
    local setup_ssl_flag=false
    local show_logs_flag=false
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --backup)
                backup_db=true
                shift
                ;;
            --ssl)
                setup_ssl_flag=true
                shift
                ;;
            --logs)
                show_logs_flag=true
                shift
                ;;
            --help|-h)
                echo "LocalMarket Production Deployment Script"
                echo
                echo "Usage: $0 [OPTIONS]"
                echo
                echo "Options:"
                echo "  --backup    Create database backup before deployment"
                echo "  --ssl       Show SSL setup instructions"
                echo "  --logs      Show service logs after deployment"
                echo "  --help, -h  Show this help message"
                echo
                echo "Environment:"
                echo "  Copy .env.example to .env.production and configure your production values"
                echo
                echo "Example:"
                echo "  $0 --backup --logs"
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                echo "Use --help for usage information"
                exit 1
                ;;
        esac
    done
    
    log_info "🚀 LocalMarket Production Deployment Starting..."
    
    check_requirements
    create_directories
    backup_database $backup_db
    deploy
    
    if [ "$setup_ssl_flag" = "true" ]; then
        setup_ssl
    fi
    
    show_status
    
    if [ "$show_logs_flag" = "true" ]; then
        show_logs
    fi
    
    log_info "🎉 Deployment completed successfully!"
    log_warn "Don't forget to:"
    log_warn "1. Configure your domain DNS to point to this server"
    log_warn "2. Set up SSL certificates for HTTPS"
    log_warn "3. Configure your Stripe webhook URLs"
    log_warn "4. Test all functionality in production environment"
    log_warn "5. Set up monitoring and alerting"
}

# Run the main function with all arguments
main "$@"
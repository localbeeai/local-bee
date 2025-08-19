# 🚀 LocalMarket Production Deployment Guide

This guide walks you through deploying LocalMarket to production with automated CI/CD, security, and easy updates.

## 📋 Prerequisites

### 1. Required Accounts & Services
- **GitHub Account** (for code hosting and CI/CD)
- **Cloud Server** (DigitalOcean, AWS EC2, or VPS)
- **Domain Name** (from Namecheap, GoDaddy, etc.)
- **MongoDB Atlas** (free tier available)
- **Stripe Account** (for payments)
- **SendGrid Account** (for emails)
- **Cloudinary Account** (for image storage)

### 2. Server Requirements
- **OS**: Ubuntu 20.04+ LTS
- **RAM**: 2GB minimum (4GB recommended)
- **Storage**: 20GB minimum (50GB recommended)
- **CPU**: 2 cores minimum

## 🎯 Deployment Strategy Overview

We'll use a **Blue-Green deployment** strategy with:
- **GitHub Actions** for CI/CD automation
- **Docker** for containerization
- **Nginx** for reverse proxy and load balancing
- **Let's Encrypt** for SSL certificates
- **PM2** for process management
- **Automated backups** and rollback capability

## 📝 Step-by-Step Deployment

### Phase 1: Server Setup & Security

#### Step 1: Create and Secure Your Server

1. **Create a Cloud Server**
   ```bash
   # Example for DigitalOcean (or use AWS EC2, Linode, etc.)
   # - Choose Ubuntu 20.04 LTS
   # - 2GB RAM, 2 CPU cores, 50GB SSD
   # - Enable VPC networking
   # - Add SSH key for secure access
   ```

2. **Connect to Your Server**
   ```bash
   # Replace YOUR_SERVER_IP with actual IP
   ssh root@YOUR_SERVER_IP
   ```

3. **Initial Server Security Setup**
   ```bash
   # Update system packages
   apt update && apt upgrade -y
   
   # Create deployment user (never use root for deployment)
   adduser deploy
   usermod -aG sudo deploy
   
   # Set up SSH key for deploy user
   mkdir -p /home/deploy/.ssh
   cp ~/.ssh/authorized_keys /home/deploy/.ssh/
   chown -R deploy:deploy /home/deploy/.ssh
   chmod 700 /home/deploy/.ssh
   chmod 600 /home/deploy/.ssh/authorized_keys
   
   # Configure firewall
   ufw allow OpenSSH
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw --force enable
   
   # Disable root SSH login (security best practice)
   sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
   systemctl restart sshd
   ```

4. **Install Required Software**
   ```bash
   # Switch to deploy user
   su - deploy
   
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker deploy
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   
   # Install Node.js (for local development tools)
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2 globally
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt install nginx -y
   sudo systemctl enable nginx
   
   # Install Certbot for SSL
   sudo apt install certbot python3-certbot-nginx -y
   
   # Log out and back in to apply Docker group membership
   exit
   ```

#### Step 2: Configure Domain and DNS

1. **Point Your Domain to Server**
   ```bash
   # In your domain registrar's DNS settings, create these A records:
   # yourdomain.com → YOUR_SERVER_IP
   # www.yourdomain.com → YOUR_SERVER_IP
   # api.yourdomain.com → YOUR_SERVER_IP (optional)
   
   # Wait 5-15 minutes for DNS propagation
   # Test with: nslookup yourdomain.com
   ```

### Phase 2: Application Setup

#### Step 3: Clone and Configure Application

1. **Connect as Deploy User**
   ```bash
   ssh deploy@YOUR_SERVER_IP
   ```

2. **Clone Repository**
   ```bash
   # Clone your repository
   git clone https://github.com/Collin4828/LocalMarket.git
   cd LocalMarket
   
   # Create production branch (optional but recommended)
   git checkout -b production
   git push -u origin production
   ```

3. **Set Up Environment Configuration**
   ```bash
   # Copy production environment template
   cp .env.production.example .env.production
   
   # Edit production environment file
   nano .env.production
   ```

4. **Configure Production Environment** (Replace with your actual values):
   ```env
   # .env.production
   NODE_ENV=production
   PORT=5000
   
   # Your domain
   FRONTEND_URL=https://yourdomain.com
   BACKEND_URL=https://yourdomain.com
   
   # MongoDB Atlas (get connection string from MongoDB Atlas dashboard)
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/localmarket
   
   # Generate strong secrets (use: openssl rand -base64 32)
   JWT_SECRET=YOUR_SUPER_SECURE_JWT_SECRET_32_CHARS_MIN
   SESSION_SECRET=YOUR_SESSION_SECRET
   
   # Stripe LIVE keys (from Stripe Dashboard)
   STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_ACTUAL_STRIPE_PUBLISHABLE_KEY
   STRIPE_SECRET_KEY=sk_live_YOUR_ACTUAL_STRIPE_SECRET_KEY
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
   
   # SendGrid (from SendGrid Dashboard)
   SENDGRID_API_KEY=SG.YOUR_ACTUAL_SENDGRID_API_KEY
   FROM_EMAIL=noreply@yourdomain.com
   SUPPORT_EMAIL=support@yourdomain.com
   
   # Cloudinary (from Cloudinary Dashboard)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   # Security settings
   RATE_LIMIT_MAX=100
   RATE_LIMIT_WINDOW_MS=900000
   LOG_LEVEL=info
   ```

#### Step 4: Set Up SSL Certificate

1. **Get SSL Certificate with Let's Encrypt**
   ```bash
   # Get SSL certificate for your domain
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   
   # Set up automatic renewal
   sudo crontab -e
   # Add this line:
   # 0 12 * * * /usr/bin/certbot renew --quiet
   ```

#### Step 5: Configure Nginx

1. **Create Nginx Configuration**
   ```bash
   sudo nano /etc/nginx/sites-available/localmarket
   ```

2. **Add Nginx Configuration**
   ```bash
   # Copy the production nginx configuration
   sudo cp nginx-production.conf /etc/nginx/sites-available/localmarket
   
   # Replace 'yourdomain.com' with your actual domain
   sudo sed -i 's/yourdomain.com/YOURDOMAIN.com/g' /etc/nginx/sites-available/localmarket
   
   # Enable the site
   sudo ln -s /etc/nginx/sites-available/localmarket /etc/nginx/sites-enabled/
   sudo rm -f /etc/nginx/sites-enabled/default
   
   # Test configuration
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### Phase 3: Automated CI/CD Setup

#### Step 6: Set Up GitHub Actions for Automated Deployment

1. **Configure GitHub Secrets**
   ```bash
   # Go to your GitHub repository → Settings → Secrets and variables → Actions
   # Add these secrets:
   
   SSH_PRIVATE_KEY=your_private_ssh_key_content
   SERVER_HOST=YOUR_SERVER_IP_OR_DOMAIN
   SERVER_USER=deploy
   STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
   ```

2. **Generate SSH Key for Deployment**
   ```bash
   # On your local machine
   ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/localmarket_deploy
   
   # Copy the public key to your server
   ssh-copy-id -i ~/.ssh/localmarket_deploy.pub deploy@YOUR_SERVER_IP
   
   # Copy the private key content to GitHub secrets (SSH_PRIVATE_KEY)
   cat ~/.ssh/localmarket_deploy
   ```

#### Step 7: Initial Production Deployment

1. **Run Automated Setup Script**
   ```bash
   # On your server as deploy user
   cd LocalMarket
   chmod +x scripts/production-setup.sh
   ./scripts/production-setup.sh --domain yourdomain.com
   ```

2. **Configure Environment Variables**
   ```bash
   # Make sure your .env.production file is properly configured
   nano .env.production
   ```

### Phase 4: Stripe & External Services Setup

#### Step 8: Configure Stripe Webhooks

1. **Go to Stripe Dashboard → Webhooks**
2. **Add endpoint**: `https://yourdomain.com/api/payments/webhook`
3. **Select events**:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. **Copy webhook secret** to your `.env.production` file

#### Step 9: Configure Email Service (SendGrid)

1. **Go to SendGrid Dashboard → API Keys**
2. **Create API key** with Mail Send permissions
3. **Add to `.env.production`**
4. **Verify your domain** in SendGrid for better deliverability

## 🔄 Day-to-Day Operations

### Making Updates & Bug Fixes

1. **Development Workflow**
   ```bash
   # Make changes on your local machine
   git checkout main
   git pull origin main
   
   # Create feature branch
   git checkout -b fix/bug-description
   
   # Make your changes, commit
   git add .
   git commit -m "Fix: description of bug fix"
   
   # Push to GitHub
   git push origin fix/bug-description
   
   # Create Pull Request to 'production' branch
   ```

2. **Automatic Deployment**
   ```bash
   # When you merge PR to 'production' branch:
   # 1. GitHub Actions automatically runs tests
   # 2. If tests pass, deploys to production
   # 3. Zero-downtime deployment with PM2
   # 4. Health checks ensure successful deployment
   ```

3. **Manual Deployment (if needed)**
   ```bash
   # SSH to your server
   ssh deploy@YOUR_SERVER_IP
   
   # Pull latest changes
   cd LocalMarket
   git pull origin production
   
   # Install dependencies and restart
   cd backend && npm ci --only=production
   cd ../frontend && npm ci && npm run build
   pm2 reload ecosystem.config.js
   ```

### Monitoring & Maintenance

1. **Check Application Status**
   ```bash
   # SSH to server
   ssh deploy@YOUR_SERVER_IP
   
   # Check PM2 processes
   pm2 status
   pm2 monit
   
   # View logs
   pm2 logs
   pm2 logs localmarket-backend --lines 100
   
   # Check system resources
   htop
   df -h
   ```

2. **Database Backup**
   ```bash
   # Create backup script (run daily via cron)
   mongodump --uri="your_mongodb_atlas_connection_string" --out /home/deploy/backups/$(date +%Y%m%d)
   
   # Add to crontab for daily backups
   crontab -e
   # Add: 0 2 * * * /home/deploy/backup-script.sh
   ```

3. **SSL Certificate Renewal**
   ```bash
   # Check certificate expiry
   sudo certbot certificates
   
   # Manual renewal (automatic via cron)
   sudo certbot renew
   ```

### Rollback Strategy

1. **Quick Rollback**
   ```bash
   # SSH to server
   ssh deploy@YOUR_SERVER_IP
   cd LocalMarket
   
   # Switch to previous version
   git log --oneline -5  # See recent commits
   git checkout PREVIOUS_COMMIT_HASH
   
   # Restart services
   pm2 reload ecosystem.config.js
   ```

2. **Database Rollback** (if needed)
   ```bash
   # Restore from backup
   mongorestore --uri="your_mongodb_connection" /path/to/backup
   ```

## 🛡️ Security Checklist

### Production Security Measures

- ✅ **SSL/TLS**: HTTPS with Let's Encrypt certificates
- ✅ **Firewall**: UFW configured with minimal open ports
- ✅ **Rate Limiting**: API and auth endpoint rate limiting
- ✅ **Security Headers**: HSTS, CSP, X-Frame-Options, etc.
- ✅ **Environment Secrets**: All sensitive data in environment variables
- ✅ **Database Security**: MongoDB Atlas with authentication
- ✅ **Process Management**: Non-root user for application processes
- ✅ **Input Validation**: Server-side validation and sanitization
- ✅ **Error Handling**: No sensitive information in error responses

### Ongoing Security Tasks

1. **Regular Updates**
   ```bash
   # Server updates (monthly)
   sudo apt update && sudo apt upgrade
   
   # Node.js security updates
   npm audit
   npm audit fix
   ```

2. **Monitor Logs**
   ```bash
   # Check for suspicious activity
   sudo tail -f /var/log/nginx/access.log
   sudo tail -f /var/log/auth.log
   ```

3. **Backup Strategy**
   ```bash
   # Daily automated backups
   # - Database backups to secure cloud storage
   # - Application code in Git
   # - Configuration files backed up
   ```

## 🚨 Troubleshooting Guide

### Common Issues & Solutions

1. **Application Won't Start**
   ```bash
   # Check PM2 logs
   pm2 logs localmarket-backend
   
   # Check environment variables
   pm2 show localmarket-backend
   
   # Restart with fresh environment
   pm2 delete all
   pm2 start ecosystem.config.js --env production
   ```

2. **Database Connection Issues**
   ```bash
   # Test MongoDB connection
   node -e "
   const mongoose = require('mongoose');
   mongoose.connect(process.env.MONGODB_URI)
     .then(() => console.log('✓ Connected'))
     .catch(err => console.error('✗ Failed:', err));
   "
   ```

3. **SSL Certificate Issues**
   ```bash
   # Check certificate status
   sudo certbot certificates
   
   # Renew certificate
   sudo certbot renew --force-renewal
   
   # Test SSL configuration
   sudo nginx -t
   ```

4. **High Memory Usage**
   ```bash
   # Check memory usage
   free -h
   pm2 monit
   
   # Restart processes if needed
   pm2 restart all
   
   # Check for memory leaks
   pm2 logs --lines 100
   ```

## 📞 Support & Maintenance

### Regular Maintenance Schedule

- **Daily**: Check application status, review error logs
- **Weekly**: Review performance metrics, check disk space
- **Monthly**: Update dependencies, review security logs
- **Quarterly**: Full security audit, performance optimization

### Emergency Contacts & Procedures

1. **Application Down**: Follow rollback procedure
2. **Database Issues**: Contact MongoDB Atlas support
3. **Payment Issues**: Check Stripe dashboard and logs
4. **Security Incident**: Immediately revoke API keys, review logs

---

🎉 **Congratulations!** Your LocalMarket application is now production-ready with:
- Automated CI/CD pipeline
- Zero-downtime deployments  
- Comprehensive monitoring
- Security best practices
- Easy update workflow

The deployment process is now:
1. **Make changes** → 2. **Push to GitHub** → 3. **Automatic deployment** → 4. **Live in production**
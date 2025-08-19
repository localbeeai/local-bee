# 🚀 LocalMarket - Quick Production Deployment

**This is your step-by-step checklist for going live in production.**

## ⚡ Quick Summary

1. **Get a server** (DigitalOcean, AWS, etc.)
2. **Buy a domain** and point it to your server
3. **Run our automated setup script**
4. **Configure your services** (Stripe, email, etc.)
5. **You're live!** 🎉

---

## 📋 Pre-Deployment Checklist

### ✅ Required Accounts
- [ ] **Cloud Server** (DigitalOcean, AWS EC2, Linode)
- [ ] **Domain Name** (Namecheap, GoDaddy, etc.)
- [ ] **MongoDB Atlas** (free tier) → [sign up](https://cloud.mongodb.com)
- [ ] **Stripe Account** → [sign up](https://stripe.com)
- [ ] **SendGrid Account** → [sign up](https://sendgrid.com)
- [ ] **Cloudinary Account** → [sign up](https://cloudinary.com)

### ✅ Information You'll Need
- [ ] **Server IP address**
- [ ] **Your domain name**
- [ ] **MongoDB connection string**
- [ ] **Stripe API keys** (live keys)
- [ ] **SendGrid API key**
- [ ] **Cloudinary credentials**

---

## 🔧 Step 1: Server Setup (15 minutes)

### Create Your Server
1. **Sign up for DigitalOcean** (or AWS/Linode)
2. **Create Droplet:**
   - **OS**: Ubuntu 20.04 LTS
   - **Size**: 2GB RAM, 2 CPU, 50GB SSD
   - **Add SSH key** for secure access
3. **Note your server IP address**

### Initial Server Configuration
```bash
# Connect to your server
ssh root@YOUR_SERVER_IP

# Run the security setup (copy/paste this entire block)
curl -fsSL https://raw.githubusercontent.com/Collin4828/LocalMarket/production/scripts/server-setup.sh | bash
```

---

## 🌐 Step 2: Domain Setup (5 minutes)

### Point Your Domain to Server
1. **Go to your domain registrar** (Namecheap, GoDaddy, etc.)
2. **Add DNS A Records:**
   ```
   Type: A    Name: @              Value: YOUR_SERVER_IP
   Type: A    Name: www            Value: YOUR_SERVER_IP
   ```
3. **Wait 5-15 minutes** for DNS propagation

### Test DNS (optional)
```bash
# Test if your domain points to your server
nslookup yourdomain.com
```

---

## 🚀 Step 3: Automated Deployment (10 minutes)

### Connect as Deploy User
```bash
# Connect to your server as the deploy user
ssh deploy@YOUR_SERVER_IP
```

### Clone and Deploy
```bash
# Clone the repository
git clone https://github.com/Collin4828/LocalMarket.git
cd LocalMarket

# Create production branch
git checkout -b production
git push -u origin production

# Make setup script executable
chmod +x scripts/production-setup.sh

# Run automated setup (replace 'yourdomain.com' with your actual domain)
./scripts/production-setup.sh --domain yourdomain.com
```

**This script will automatically:**
- Install all dependencies
- Configure Nginx with SSL
- Set up PM2 process manager
- Configure firewall
- Start your application

---

## ⚙️ Step 4: Environment Configuration (10 minutes)

### Configure Production Environment
```bash
# Edit your production environment file
nano .env.production
```

### Fill in your actual values:
```env
# Replace these with your actual values
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://yourdomain.com

# MongoDB Atlas connection string (get from MongoDB Atlas dashboard)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/localmarket

# Generate strong secrets (32+ characters)
JWT_SECRET=your_super_secure_jwt_secret_32_chars_minimum
SESSION_SECRET=your_session_secret_here

# Stripe LIVE keys (get from Stripe dashboard)
STRIPE_PUBLISHABLE_KEY=pk_live_your_actual_stripe_publishable_key
STRIPE_SECRET_KEY=sk_live_your_actual_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# SendGrid (get from SendGrid dashboard)
SENDGRID_API_KEY=SG.your_actual_sendgrid_api_key
FROM_EMAIL=noreply@yourdomain.com
SUPPORT_EMAIL=support@yourdomain.com

# Cloudinary (get from Cloudinary dashboard)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Restart Application
```bash
# Restart with new environment
pm2 reload ecosystem.config.js --env production
```

---

## 🔐 Step 5: Service Configuration (10 minutes)

### Configure Stripe Webhooks
1. **Go to Stripe Dashboard → Webhooks**
2. **Add endpoint**: `https://yourdomain.com/api/payments/webhook`
3. **Select events:**
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. **Copy the webhook secret** and add to `.env.production`

### Configure SendGrid
1. **Go to SendGrid Dashboard → API Keys**
2. **Create API key** with Mail Send permissions
3. **Add domain verification** for better deliverability
4. **Update `.env.production` with API key**

---

## ✅ Step 6: Final Testing (5 minutes)

### Health Check
```bash
# Check if everything is running
pm2 status

# Test your website
curl https://yourdomain.com/health

# Check logs for any errors
pm2 logs
```

### Test in Browser
1. **Visit**: `https://yourdomain.com`
2. **Test user registration**
3. **Test product creation**
4. **Test checkout flow** (use Stripe test card: 4242 4242 4242 4242)

---

## 🎉 You're Live!

**Congratulations! Your LocalMarket is now live in production.**

### Your URLs:
- **Website**: https://yourdomain.com
- **API**: https://yourdomain.com/api
- **Health Check**: https://yourdomain.com/health

---

## 🔄 Setting Up Automated Updates

### Enable GitHub Actions (One-time setup)

1. **Go to your GitHub repository → Settings → Secrets**
2. **Add these secrets:**
   ```
   SSH_PRIVATE_KEY = your_ssh_private_key_content
   SERVER_HOST = YOUR_SERVER_IP
   SERVER_USER = deploy
   STRIPE_PUBLISHABLE_KEY = pk_live_your_stripe_key
   ```

3. **Generate SSH key for deployment:**
   ```bash
   # On your local machine
   ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/localmarket_deploy
   
   # Copy public key to server
   ssh-copy-id -i ~/.ssh/localmarket_deploy.pub deploy@YOUR_SERVER_IP
   
   # Copy private key content to GitHub secret
   cat ~/.ssh/localmarket_deploy
   ```

### Now You Can Deploy by Simply:
1. **Make changes** to your code locally
2. **Push to `production` branch**
3. **GitHub automatically deploys** to your server
4. **Zero downtime** - your site stays live during updates

---

## 🆘 Quick Troubleshooting

### Application Not Starting?
```bash
# Check PM2 status and logs
pm2 status
pm2 logs localmarket-backend

# Restart if needed
pm2 restart all
```

### SSL Issues?
```bash
# Check certificate
sudo certbot certificates

# Renew if needed
sudo certbot renew
```

### Can't Access Website?
```bash
# Check if domain points to server
nslookup yourdomain.com

# Check firewall
sudo ufw status

# Check Nginx
sudo nginx -t
sudo systemctl status nginx
```

---

## 📞 Need Help?

### Common Commands
```bash
# Check app status
pm2 status

# View logs
pm2 logs

# Restart app
pm2 restart all

# Update app (manual)
git pull origin production
pm2 reload ecosystem.config.js
```

### Emergency Rollback
```bash
# If something breaks, quickly rollback
git log --oneline -5  # See recent commits
git checkout PREVIOUS_COMMIT_HASH
pm2 reload ecosystem.config.js
```

---

**🎯 Total Time: ~45 minutes to go from zero to live production app!**

Your LocalMarket platform is now ready to compete with major e-commerce sites. You have:
- ✅ Enterprise-grade security
- ✅ Automated deployment pipeline  
- ✅ SSL certificates
- ✅ Payment processing
- ✅ Professional infrastructure
- ✅ Easy update workflow
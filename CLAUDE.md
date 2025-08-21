# LocalMarket Production Setup - Claude Code Documentation

## 🎯 CURRENT STATUS: LIVE IN PRODUCTION

**Website URL:** https://topresponder.net  
**Last Updated:** August 21, 2025 - 7:40 PM  
**Status:** ✅ FULLY OPERATIONAL

---

## 📋 CRITICAL INFORMATION FOR NEW CLAUDE SESSIONS

### Production Server Details
- **Provider:** DigitalOcean
- **IP Address:** 167.172.245.227
- **OS:** Ubuntu 24.04 LTS
- **SSH Access:** `ssh deploy@167.172.245.227`
- **Domain:** topresponder.net (temporary, will migrate to localbee.ai later)

### Key Credentials & Services
- **MongoDB Atlas:** 
  - Cluster: localbee.sfgdp4d.mongodb.net
  - Database: localmarket
  - Username: localbee
  - Password: 1ozXBqQwCX1XFbSH
  - Connection String: `mongodb+srv://localbee:1ozXBqQwCX1XFbSH@localbee.sfgdp4d.mongodb.net/localmarket?retryWrites=true&w=majority&appName=LocalBee`

- **GitHub Repository:** https://github.com/localbeeai/local-bee.git
- **DNS:** Namecheap (topresponder.net → 167.172.245.227)

### Current Architecture
```
[Internet] → [Nginx (Port 80/443)] → [PM2 Process Manager]
                                      ├── Backend (Port 5000) × 2 instances
                                      └── Frontend (Port 3000) × 1 instance
```

---

## 🔧 COMMON COMMANDS & TROUBLESHOOTING

### Server Access
```bash
# Connect to production server
ssh deploy@167.172.245.227

# Check application status
pm2 status

# View logs
pm2 logs
pm2 logs localmarket-backend --lines 50
pm2 logs localmarket-frontend --lines 50

# Restart services
pm2 restart localmarket-backend
pm2 restart localmarket-frontend
pm2 restart all
```

### Health Checks
```bash
# Test backend health
curl https://topresponder.net/health

# Test frontend
curl -I https://topresponder.net

# Check SSL certificate
sudo certbot certificates

# Check MongoDB connection (from server)
# The connection string is in ecosystem.config.js
```

### File Locations on Server
```
/home/deploy/LocalMarket/                    # Main application directory
├── backend/                                 # Node.js API
├── frontend/                               # React app
├── .env.production                         # Environment variables
├── ecosystem.config.js                     # PM2 configuration
└── logs/                                   # Application logs

/etc/nginx/sites-available/localmarket      # Nginx configuration
/var/log/nginx/                            # Nginx logs
```

---

## 🐛 RECENT FIXES & KNOWN ISSUES

### Recently Fixed Issues
1. **MongoDB Connection**: Fixed truncated connection string in environment
2. **API Routing**: Fixed double `/api/api/` issue in frontend
3. **Auth Endpoints**: Fixed `/register` vs `/signup` mismatch in rate limiter
4. **SSL Certificates**: Successfully installed with Let's Encrypt
5. **Image Uploads**: Fixed nginx serving and parent directory permissions
6. **Products Page Empty**: Fixed product controller query with incorrect `isApproved` condition
7. **Trust Proxy**: Added `app.set('trust proxy', true)` to fix rate limiting behind nginx

### Current Configuration Status
- ✅ MongoDB Atlas connected and working
- ✅ SSL certificates installed and auto-renewing
- ✅ User signup/login working
- ✅ API endpoints responding correctly
- ✅ Frontend serving from HTTPS
- ✅ Image uploads working (products and merchant profiles)
- ✅ Admin account access configured
- ⚠️ Using placeholder values for Stripe, SendGrid, Cloudinary

### Environment Variables (in ecosystem.config.js)
```javascript
env_production: {
  NODE_ENV: "production",
  PORT: 5000,
  FRONTEND_URL: "https://topresponder.net",
  BACKEND_URL: "https://topresponder.net",
  MONGODB_URI: "mongodb+srv://localbee:1ozXBqQwCX1XFbSH@localbee.sfgdp4d.mongodb.net/localmarket?retryWrites=true&w=majority&appName=LocalBee",
  // ... other vars with placeholder values
}
```

---

## 🚨 EMERGENCY PROCEDURES

### If Application is Down
1. **Check PM2 status:** `pm2 status`
2. **Restart if needed:** `pm2 restart all`
3. **Check logs:** `pm2 logs --lines 20`
4. **Check MongoDB connection** in logs
5. **Verify Nginx:** `sudo nginx -t && sudo systemctl status nginx`

### If Database Issues
1. **Check MongoDB Atlas dashboard:** https://cloud.mongodb.com
2. **Verify connection string** in ecosystem.config.js
3. **Check network access** in MongoDB Atlas (whitelist server IP)

### If SSL Issues
1. **Check certificate status:** `sudo certbot certificates`
2. **Renew if needed:** `sudo certbot renew`
3. **Test Nginx config:** `sudo nginx -t`

### Rollback Procedure
```bash
# If new deployment breaks something
cd LocalMarket
git log --oneline -5  # See recent commits
git checkout PREVIOUS_COMMIT_HASH
pm2 restart all
```

---

## 🔄 DEPLOYMENT WORKFLOW

### Manual Deployment (Current)
```bash
# On server
cd LocalMarket
git pull origin main
cd frontend && npm run build
pm2 restart all
```

### Pending: GitHub Actions Setup
- Need to configure automated deployments
- SSH keys and secrets need to be set up
- This is the next major task

---

## 🎛️ KEY CONFIGURATION FILES

### 1. ecosystem.config.js (PM2 Configuration)
- Contains all environment variables
- Manages backend cluster (2 instances)
- Configures frontend serving
- **CRITICAL:** This file has the MongoDB connection string

### 2. .env.production (Backup Environment File)
- Contains same variables as ecosystem.config.js
- Used as backup/reference

### 3. Nginx Configuration: /etc/nginx/sites-available/localmarket
- Handles HTTPS redirect
- Reverse proxy to backend (port 5000)
- Serves frontend (port 3000)
- SSL certificate integration

### 4. Frontend API Config: frontend/src/config/api.js
- **CRITICAL FIX:** baseURL set to empty string in production
- Prevents double `/api/api/` in requests

---

## 📞 HANDOFF INSTRUCTIONS FOR NEW CLAUDE

### Immediate Context
1. **LocalMarket is a MERN stack e-commerce platform**
2. **Currently LIVE and WORKING** at https://topresponder.net
3. **User can create merchant accounts and test the platform**
4. **MongoDB Atlas database is connected and storing data**

### First Actions for New Claude
1. **Verify current status:**
   ```bash
   curl https://topresponder.net/health
   ```
2. **If issues found, check PM2:**
   ```bash
   ssh deploy@167.172.245.227 "pm2 status && pm2 logs --lines 10"
   ```

### Common Tasks
- **Bug fixes:** Check logs first, then examine specific components
- **Updates:** Pull from GitHub, rebuild frontend, restart PM2
- **Monitoring:** Use PM2 commands and check application logs

### Testing Endpoints
- **Health:** `curl https://topresponder.net/health`
- **Signup:** Test on website or via curl to `/api/auth/signup`
- **Frontend:** Visit https://topresponder.net

---

## 🎯 NEXT PRIORITIES

1. **GitHub Actions CI/CD** - Automate deployment process
2. **Real API Keys** - Replace placeholder Stripe/SendGrid keys
3. **Domain Migration** - Move to localbee.ai when ready
4. **Performance Monitoring** - Set up alerts and monitoring
5. **Backup Strategy** - Automated database backups

---

## ⚠️ IMPORTANT NOTES

- **Never restart the server** without checking with the user first
- **MongoDB password is visible** in this file - keep secure
- **Server requires sudo password** for system changes
- **Always backup before major changes**
- **The frontend must be rebuilt** after any React code changes
- **PM2 process management** handles auto-restart and clustering

---

## 🔗 QUICK REFERENCE LINKS

- **Live Site:** https://topresponder.net
- **GitHub:** https://github.com/localbeeai/local-bee.git
- **MongoDB Atlas:** https://cloud.mongodb.com
- **Server SSH:** `ssh deploy@167.172.245.227`

---

---

## 🔄 MANDATORY: Documentation Maintenance

### For ALL Claude Sessions (Current and Future):

**CRITICAL RULE: After any configuration change, ALWAYS update these files:**

1. **CLAUDE.md** - Update status, add new fixes, modify configuration details
2. **TROUBLESHOOTING.md** - Add new issues and solutions encountered  
3. **CURRENT_CONFIG.md** - Update with any configuration changes made

### Auto-Update Process:
```bash
# After making any changes to the production system:
cd /c/Users/colli/Desktop/localmarket

# Update the relevant documentation files with new information
# Then commit and push:
git add CLAUDE.md TROUBLESHOOTING.md CURRENT_CONFIG.md
git commit -m "Update documentation: [describe what changed]

🤖 Generated with Claude Code (https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
git push
```

### Documentation Update Checklist:
- [ ] Status and timestamp updated in CLAUDE.md
- [ ] New issues added to TROUBLESHOOTING.md (if any)
- [ ] Configuration changes reflected in CURRENT_CONFIG.md
- [ ] Changes committed to GitHub
- [ ] User informed of documentation updates

**Remember: These docs are the lifeline for future Claude sessions - keep them current!**

---

**This file should give any new Claude session everything needed to continue supporting the LocalMarket production deployment.**
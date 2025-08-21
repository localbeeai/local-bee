# LocalMarket - Current Working Configuration

## 📸 SNAPSHOT: Working Configuration as of August 21, 2025

**Status:** ✅ LIVE and FULLY FUNCTIONAL  
**Last Verified:** August 21, 2025 at 02:35 UTC

---

## 🌐 Network Configuration

```
Domain: topresponder.net
DNS A Records:
  @ (root) → 167.172.245.227
  www → 167.172.245.227

SSL Certificate: Let's Encrypt (Auto-renewing)
Certificate expires: November 19, 2025
```

---

## 🖥️ Server Configuration

```
Provider: DigitalOcean
IP: 167.172.245.227
OS: Ubuntu 24.04 LTS
SSH: ssh deploy@167.172.245.227

Services Running:
- Nginx (ports 80/443)
- PM2 Process Manager
- MongoDB client (connects to Atlas)
- Certbot (SSL management)
```

---

## 📦 PM2 Process Configuration (EXACT WORKING VERSION)

**File:** `/home/deploy/LocalMarket/ecosystem.config.js`

```javascript
module.exports = {
  apps: [
    {
      name: "localmarket-backend",
      script: "./backend/server.js",
      instances: 2,
      exec_mode: "cluster",
      
      env: {
        NODE_ENV: "development",
        PORT: 5000
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 5000,
        FRONTEND_URL: "https://topresponder.net",
        BACKEND_URL: "https://topresponder.net",
        MONGODB_URI: "mongodb+srv://localbee:1ozXBqQwCX1XFbSH@localbee.sfgdp4d.mongodb.net/localmarket?retryWrites=true&w=majority&appName=LocalBee",
        JWT_SECRET: "localmarket_production_jwt_secret_32_chars_minimum_length",
        SESSION_SECRET: "localmarket_session_secret_for_production",
        ENCRYPTION_KEY: "localmarket_encryption_key_32_chars",
        STRIPE_PUBLISHABLE_KEY: "pk_test_placeholder",
        STRIPE_SECRET_KEY: "sk_test_placeholder",
        STRIPE_WEBHOOK_SECRET: "whsec_test_placeholder",
        SENDGRID_API_KEY: "SG.placeholder",
        FROM_EMAIL: "noreply@topresponder.net",
        SUPPORT_EMAIL: "support@topresponder.net",
        CLOUDINARY_CLOUD_NAME: "placeholder",
        CLOUDINARY_API_KEY: "placeholder",
        CLOUDINARY_API_SECRET: "placeholder",
        RATE_LIMIT_MAX: 100,
        RATE_LIMIT_WINDOW_MS: 900000,
        LOG_LEVEL: "info",
        ENABLE_EMAIL_NOTIFICATIONS: false,
        ENABLE_SMS_NOTIFICATIONS: false,
        ENABLE_ANALYTICS: false
      },
      
      watch: false,
      ignore_watch: ["node_modules", "logs", "uploads"],
      max_memory_restart: "500M",
      log_file: "./logs/combined.log",
      out_file: "./logs/out.log",
      error_file: "./logs/error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
      kill_timeout: 5000,
      listen_timeout: 8000,
      health_check_grace_period: 3000,
      instance_var: "INSTANCE_ID"
    },
    
    {
      name: "localmarket-frontend",
      script: "npx",
      args: "serve -s build -l 3000",
      cwd: "./frontend",
      instances: 1,
      exec_mode: "fork",
      
      env: {
        NODE_ENV: "production"
      },
      
      watch: false,
      max_memory_restart: "300M",
      log_file: "./logs/frontend-combined.log",
      out_file: "./logs/frontend-out.log",
      error_file: "./logs/frontend-error.log",
      autorestart: true,
      max_restarts: 5,
      min_uptime: "5s"
    }
  ]
};
```

---

## 🔧 Frontend API Configuration (EXACT WORKING VERSION)

**File:** `/home/deploy/LocalMarket/frontend/src/config/api.js`

```javascript
import axios from "axios";

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = process.env.NODE_ENV === "development";

const isMobile = isDevelopment && window.location.hostname !== "localhost";

let baseURL;
if (isProduction) {
  baseURL = ""; // CRITICAL: Empty string to prevent /api/api/ double prefix
} else {
  const hostname = window.location.hostname === "localhost" ? "localhost" : window.location.hostname;
  baseURL = `http://${hostname}:5000`;
}

const apiInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
});

// ... rest of interceptors
```

---

## 🌐 Nginx Configuration (EXACT WORKING VERSION)

**File:** `/etc/nginx/sites-available/localmarket`

```nginx
server {
    listen 80;
    server_name topresponder.net www.topresponder.net;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name topresponder.net www.topresponder.net;

    ssl_certificate /etc/letsencrypt/live/topresponder.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/topresponder.net/privkey.pem;
    
    # Standard SSL settings...
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /health {
        proxy_pass http://localhost:5000;
    }
}
```

---

## 🗄️ Database Configuration

```
Provider: MongoDB Atlas
Cluster: localbee.sfgdp4d.mongodb.net
Database: localmarket
Connection String: mongodb+srv://localbee:1ozXBqQwCX1XFbSH@localbee.sfgdp4d.mongodb.net/localmarket?retryWrites=true&w=majority&appName=LocalBee

Network Access: 
- 0.0.0.0/0 (Allow access from anywhere)
- Server IP: 167.172.245.227 (specifically whitelisted)
```

---

## ✅ Working Endpoints (Verified August 21, 2025)

```bash
# Health check
curl https://topresponder.net/health
# Returns: {"status":"healthy","timestamp":"...","uptime":...}

# Frontend
curl -I https://topresponder.net
# Returns: HTTP/1.1 200 OK

# Auth signup (works)
curl -X POST https://topresponder.net/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123","userType":"merchant"}'
# Returns: {"message":"User created successfully","token":"...","user":{...}}
```

---

## 📊 PM2 Status (Current Working State)

```
┌────┬─────────────────────────┬─────────┬─────────┬──────────┬────────┬───────────┐
│ id │ name                    │ mode    │ pid      │ uptime   │ ↺      │ status    │
├────┼─────────────────────────┼─────────┼──────────┼────────┼──────┼───────────┤
│ 3  │ localmarket-backend     │ cluster │ 39092    │ 10m      │ 1      │ online    │
│ 4  │ localmarket-backend     │ cluster │ 39100    │ 10m      │ 1      │ online    │
│ 1  │ localmarket-frontend    │ fork    │ 38752    │ 12m      │ 4      │ online    │
└────┴─────────────────────────┴─────────┴──────────┴────────┴──────┴───────────┘
```

---

## 🔄 Deployment Commands (What Works)

```bash
# Start PM2 processes (from LocalMarket directory)
pm2 start ecosystem.config.js --env production

# Restart after changes
pm2 restart localmarket-backend
pm2 restart localmarket-frontend

# View logs
pm2 logs localmarket-backend --lines 20

# Status check
pm2 status
```

---

## 🚨 CRITICAL FIX HISTORY

**These fixes are already applied - DO NOT revert:**

1. **Fixed MongoDB Connection:** Updated ecosystem.config.js with full Atlas connection string
2. **Fixed API Double Prefix:** Set frontend baseURL to empty string in production
3. **Fixed Auth Route Mismatch:** Changed rate limiter from `/register` to `/signup` in server.js
4. **SSL Working:** Let's Encrypt certificates installed and auto-renewing

---

## 📞 For New Claude: Quick Verification

Run this command to verify everything is working:

```bash
curl -s https://topresponder.net/health && echo " - Backend OK" && \
curl -I https://topresponder.net 2>/dev/null | head -1 && echo " - Frontend OK" && \
echo "✅ System is operational"
```

Expected output:
```
{"status":"healthy",...} - Backend OK
HTTP/1.1 200 OK - Frontend OK
✅ System is operational
```

---

**This configuration is LIVE and WORKING. Only change if there are specific issues to fix!**
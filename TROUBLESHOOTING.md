# LocalMarket - Common Issues & Solutions

## 🚨 CRITICAL: Read CLAUDE.md First!

This file contains specific fixes for known issues. Always check CLAUDE.md for overall context.

---

## 🔧 Common Error Patterns & Fixes

### 1. "signup failed" or "cannot POST /api/auth/signup"

**Symptoms:**
- Frontend shows "signup failed" error
- Network tab shows 404 or CORS errors
- Backend logs show route not found

**Diagnostics:**
```bash
# Check if backend is running
ssh deploy@167.172.245.227 "pm2 status"

# Check backend logs
ssh deploy@167.172.245.227 "pm2 logs localmarket-backend --lines 20"

# Test API endpoint directly
curl -X POST https://topresponder.net/api/auth/signup -H "Content-Type: application/json" -d '{"name":"Test","email":"test@test.com","password":"test123","userType":"merchant"}'
```

**Common Causes & Fixes:**
1. **Double /api/ in URLs**: Check frontend/src/config/api.js - baseURL should be empty string in production
2. **Backend not running**: Restart with `pm2 restart localmarket-backend`
3. **MongoDB connection failed**: Check connection string in ecosystem.config.js
4. **Route mismatch**: Ensure rate limiter uses `/signup` not `/register`

### 2. MongoDB Connection Errors

**Symptoms:**
- Backend logs show "ECONNREFUSED ::1:27017"
- Trying to connect to localhost instead of Atlas

**Fix:**
```bash
# Check ecosystem.config.js has correct MongoDB URI
ssh deploy@167.172.245.227 "grep -A 5 MONGODB_URI LocalMarket/ecosystem.config.js"

# Should show: mongodb+srv://localbee:1ozXBqQwCX1XFbSH@localbee.sfgdp4d.mongodb.net/localmarket?retryWrites=true&w=majority&appName=LocalBee
```

### 3. CORS Errors

**Symptoms:**
- Browser console shows CORS policy errors
- Options requests being blocked

**Fix:**
- Check backend CORS configuration includes https://topresponder.net
- Restart backend: `pm2 restart localmarket-backend`

### 4. SSL Certificate Issues

**Symptoms:**
- HTTPS not working
- Certificate expired warnings

**Diagnostics:**
```bash
ssh deploy@167.172.245.227 "sudo certbot certificates"
```

**Fix:**
```bash
# Renew certificates
ssh deploy@167.172.245.227 "sudo certbot renew"
```

### 5. Frontend Not Loading

**Symptoms:**
- 404 on main page
- Static files not found

**Fix:**
```bash
# Rebuild frontend and restart
ssh deploy@167.172.245.227 "cd LocalMarket/frontend && npm run build && cd .. && pm2 restart localmarket-frontend"
```

### 6. Image Upload Issues (403 Forbidden)

**Symptoms:**
- Product photos not displaying
- Merchant profile photos not loading
- 403 Forbidden when accessing /uploads/ URLs

**Diagnostics:**
```bash
# Test image serving
curl -I https://topresponder.net/uploads/filename.jpg

# Check nginx logs
sudo tail -10 /var/log/nginx/error.log

# Check file permissions
ls -la LocalMarket/backend/uploads/
```

**Fix:**
```bash
# Fix parent directory permissions (critical for nginx access)
sudo chmod 755 /home/deploy/
sudo chmod 755 /home/deploy/LocalMarket/
sudo chmod 755 /home/deploy/LocalMarket/backend/

# Fix uploads directory ownership and permissions
sudo chown -R www-data:www-data LocalMarket/backend/uploads/
sudo chmod -R 755 LocalMarket/backend/uploads/
```

**Root Cause:** Nginx (www-data user) needs execute permissions on all parent directories to access uploaded files.

---

## 🔍 Diagnostic Commands

### Quick Health Check
```bash
# All-in-one status check
ssh deploy@167.172.245.227 "pm2 status && curl -s https://topresponder.net/health | jq"
```

### Deep Dive Diagnostics
```bash
# Backend health
ssh deploy@167.172.245.227 "pm2 logs localmarket-backend --lines 10"

# Frontend health  
ssh deploy@167.172.245.227 "pm2 logs localmarket-frontend --lines 10"

# Nginx status
ssh deploy@167.172.245.227 "sudo nginx -t && sudo systemctl status nginx"

# Disk space
ssh deploy@167.172.245.227 "df -h"

# Memory usage
ssh deploy@167.172.245.227 "free -h"
```

---

## 🛠️ Recovery Procedures

### Complete Application Restart
```bash
ssh deploy@167.172.245.227 "cd LocalMarket && pm2 restart all"
```

### Nuclear Option - Full Redeploy
```bash
ssh deploy@167.172.245.227 "
cd LocalMarket && 
git pull origin main && 
cd frontend && npm run build && 
cd .. && 
pm2 restart all
"
```

### Emergency Rollback
```bash
ssh deploy@167.172.245.227 "
cd LocalMarket && 
git log --oneline -5 && 
echo 'Choose commit hash to rollback to, then run: git checkout HASH && pm2 restart all'
"
```

---

## 📱 User-Facing Issues

### "Cannot create merchant account"
1. Check if signup endpoint working (see section 1 above)
2. Check if MongoDB storing data
3. Verify no rate limiting blocking requests

### "Website not loading"
1. Check DNS: `nslookup topresponder.net` should return 167.172.245.227
2. Check SSL: Visit https://topresponder.net in browser
3. Check frontend serving: `curl -I https://topresponder.net`

### "Error 500 on all requests"
1. Backend probably crashed - check logs and restart
2. MongoDB connection might be down - verify Atlas status
3. Check server resources (disk space, memory)

---

## 🔐 Security Notes

- MongoDB password is in this documentation - keep files secure
- Server access requires SSH key authentication
- All API requests go through rate limiting
- SSL certificates auto-renew via cron job

---

## 📞 Escalation Path

If unable to resolve:
1. Check if issue is server-wide (DigitalOcean status)
2. Check if issue is database-wide (MongoDB Atlas status)
3. Consider temporary maintenance mode
4. Document issue and resolution for future reference

---

**Remember: This is a live production system - always backup before making changes!**
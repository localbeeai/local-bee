# Mobile Development Setup

To run the LocalMarket app on your phone locally, follow these steps:

## Prerequisites
- Both your computer and phone must be on the same WiFi network
- Node.js and npm installed on your computer

## Setup Instructions

### 1. Start the Backend Server
```bash
cd backend
npm run dev
```
The backend will be accessible from any IP on port 5000.

### 2. Start the Frontend for Mobile
```bash
cd frontend
npm run start:mobile
```
This will start the React app and make it accessible from any device on your network.

### 3. Find Your Computer's IP Address
On Windows, open Command Prompt and run:
```cmd
ipconfig
```
Look for your IPv4 Address (usually something like 192.168.1.x)

### 4. Access on Your Phone
Open your phone's web browser and navigate to:
```
http://YOUR_IP_ADDRESS:3000
```
For example: `http://192.168.1.100:3000`

## Troubleshooting

### If the site doesn't load:
1. Check that both devices are on the same WiFi network
2. Verify the IP address is correct
3. Make sure Windows Firewall isn't blocking the ports
4. Try disabling any VPN connections

### To allow through Windows Firewall:
1. Open Windows Defender Firewall
2. Click "Allow an app or feature through Windows Defender Firewall"
3. Add Node.js if it's not already allowed
4. Ensure both Private and Public are checked

### Alternative Method:
You can also use the regular start command and manually set the HOST:
```bash
set HOST=0.0.0.0
npm start
```

## Features Available on Mobile
- Browse products
- View product details
- Add to cart
- User authentication
- Merchant profiles
- Messaging
- All responsive design features

The app is fully responsive and optimized for mobile viewing.
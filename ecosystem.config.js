// PM2 Production Configuration for LocalMarket
module.exports = {
  apps: [
    {
      name: 'localmarket-backend',
      script: './backend/server.js',
      instances: 2, // Run 2 instances for load balancing
      exec_mode: 'cluster',
      
      // Environment variables
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      
      // Process management
      watch: false, // Don't watch in production
      ignore_watch: ['node_modules', 'logs', 'uploads'],
      max_memory_restart: '500M',
      
      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Auto restart configuration
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      
      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 8000,
      
      // Health monitoring
      health_check_grace_period: 3000,
      
      // Load balancing
      instance_var: 'INSTANCE_ID'
    },
    
    {
      name: 'localmarket-frontend',
      script: 'npx',
      args: 'serve -s build -l 3000',
      cwd: './frontend',
      instances: 1,
      exec_mode: 'fork',
      
      env: {
        NODE_ENV: 'production'
      },
      
      // Process management
      watch: false,
      max_memory_restart: '300M',
      
      // Logging
      log_file: './logs/frontend-combined.log',
      out_file: './logs/frontend-out.log',
      error_file: './logs/frontend-error.log',
      
      // Auto restart
      autorestart: true,
      max_restarts: 5,
      min_uptime: '5s'
    }
  ],

  // Deployment configuration
  deploy: {
    production: {
      user: 'deploy',
      host: ['yourdomain.com'], // Replace with your server IP or domain
      ref: 'origin/production',
      repo: 'https://github.com/Collin4828/LocalMarket.git',
      path: '/home/deploy/LocalMarket',
      
      // Post-deployment commands
      'post-deploy': 'cd backend && npm ci --only=production && cd ../frontend && npm ci && npm run build && pm2 reload ecosystem.config.js --env production',
      
      // Pre-deployment commands
      'pre-deploy-local': '',
      
      // Environment variables for deployment
      env: {
        NODE_ENV: 'production'
      }
    }
  }
};
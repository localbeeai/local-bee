#!/bin/sh

# Exit on any error
set -e

echo "Starting LocalMarket Application..."

# Start nginx in background
nginx -g "daemon off;" &
NGINX_PID=$!

# Start backend API
cd /app/backend
node server.js &
BACKEND_PID=$!

# Function to handle shutdown
shutdown() {
    echo "Shutting down gracefully..."
    kill -TERM $NGINX_PID 2>/dev/null || true
    kill -TERM $BACKEND_PID 2>/dev/null || true
    wait
    exit 0
}

# Set up signal handlers
trap shutdown SIGTERM SIGINT

echo "LocalMarket Application started successfully"
echo "Backend PID: $BACKEND_PID"
echo "Nginx PID: $NGINX_PID"

# Wait for processes
wait
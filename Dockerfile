# Multi-stage build for production optimization
FROM node:18-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    musl-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# ====================================
# Backend Build Stage
# ====================================
FROM base AS backend-build

WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./

# Install backend dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy backend source code
COPY backend/ ./

# Create logs directory
RUN mkdir -p logs

# ====================================
# Frontend Build Stage
# ====================================
FROM base AS frontend-build

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm ci && npm cache clean --force

# Copy frontend source code
COPY frontend/ ./

# Build frontend for production
RUN npm run build

# ====================================
# Production Stage
# ====================================
FROM node:18-alpine AS production

# Install system dependencies for production
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    musl-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    nginx

# Create app user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S localmarket -u 1001

WORKDIR /app

# Copy backend from build stage
COPY --from=backend-build --chown=localmarket:nodejs /app/backend ./backend
COPY --from=frontend-build --chown=localmarket:nodejs /app/frontend/build ./frontend/build

# Create necessary directories
RUN mkdir -p /app/backend/logs /app/backend/uploads
RUN chown -R localmarket:nodejs /app

# Configure nginx
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Switch to non-root user
USER localmarket

# Expose ports
EXPOSE 3000 5000 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node /app/backend/healthcheck.js

# Start script
COPY docker/start.sh /start.sh
USER root
RUN chmod +x /start.sh
USER localmarket

CMD ["/start.sh"]
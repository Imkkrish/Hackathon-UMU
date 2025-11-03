# Multi-stage build for security and optimization
# Stage 1: Build the application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code (excluding secrets)
COPY . .

# Build arguments for environment variables (NEVER include secrets here)
ARG VITE_API_BASE_URL
ARG VITE_ML_API_URL
ARG VITE_DIGIPIN_API_URL
ARG VITE_APP_NAME
ARG VITE_MAX_UPLOAD_SIZE

# Set environment variables from build args
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_ML_API_URL=$VITE_ML_API_URL
ENV VITE_DIGIPIN_API_URL=$VITE_DIGIPIN_API_URL
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_MAX_UPLOAD_SIZE=$VITE_MAX_UPLOAD_SIZE

# Build the application
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Run nginx
CMD ["nginx", "-g", "daemon off;"]

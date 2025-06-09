# Debug Dockerfile to find the Exit 127 issue
FROM node:18-alpine AS build
WORKDIR /app

# Debug: Check what's available
RUN echo "=== NODE & NPM VERSIONS ==="
RUN which npm
RUN npm --version
RUN node --version

# Copy package files
COPY package*.json ./

# Debug: Show package.json content
RUN echo "=== PACKAGE.JSON CONTENT ==="
RUN cat package.json

# Install dependencies with verbose output
RUN echo "=== INSTALLING DEPENDENCIES ==="
RUN npm install --verbose

# Copy source code
COPY . .

# Debug: List files and check what's available
RUN echo "=== FILES IN DIRECTORY ==="
RUN ls -la

# Debug: Check available npm scripts
RUN echo "=== AVAILABLE NPM SCRIPTS ==="
RUN npm run

# Debug: Try to run build with full path
RUN echo "=== TRYING TO BUILD ==="
RUN which node
RUN which npm
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Create nginx config for SPA
RUN echo 'server { listen 80; root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
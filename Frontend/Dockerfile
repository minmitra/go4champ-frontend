# Production Dockerfile - Skip TypeScript checking
FROM node:18-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install


# Copy source code
COPY . .

# Build without TypeScript checking (Vite only)
RUN npx vite build --mode production

# Production stage
FROM nginx:alpine

# Copy built app
COPY --from=build /app/dist /usr/share/nginx/html

# Create nginx config for SPA
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
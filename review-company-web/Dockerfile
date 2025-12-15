# Stage 1: Build the Next.js app
FROM node:24-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Set the environment variable for production
# ENV NODE_ENV=production

# Build the Next.js app
RUN npm run build

# Stage 2: Serve the app with NGINX
FROM nginx:alpine

# Set up working directory for NGINX
WORKDIR /usr/share/nginx/html

# Copy the built Next.js app from the builder stage to NGINX's html folder
COPY --from=builder /app /usr/share/nginx/html

# Copy custom NGINX configuration
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 for NGINX
EXPOSE 8080

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]

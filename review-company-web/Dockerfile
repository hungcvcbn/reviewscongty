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

# Build the Next.js app
RUN npm run build

# Stage 2: Run the Next.js app
FROM node:24-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

# Expose port 3000 for the Next.js app
EXPOSE 3000

# Set the environment variable for production
ENV NODE_ENV=production

# Start the Next.js app
CMD ["npm", "run", "start"]

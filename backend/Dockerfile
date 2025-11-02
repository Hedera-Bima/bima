# Use Node.js LTS version
FROM node:18-alpine

# Install build dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Create directories for data and uploads
RUN mkdir -p /app/data /app/uploads/images /app/uploads/documents

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]

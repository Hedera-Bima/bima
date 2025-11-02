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

# Create unified storage directory
RUN mkdir -p /app/storage/data /app/storage/uploads/images /app/storage/uploads/documents

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]

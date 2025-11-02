# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Create directories for uploads and logs
RUN mkdir -p /app/uploads

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]

#!/bin/bash

# BIMA Deployment Script for Fly.io
# This script deploys both backend services to Fly.io

set -e  # Exit on any error

echo "Starting BIMA deployment to Fly.io..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if flyctl is installed
if ! command -v flyctl &> /dev/null; then
    print_error "flyctl is not installed. Please install it first:"
    echo "  macOS: brew install flyctl"
    echo "  Linux: curl -L https://fly.io/install.sh | sh"
    echo "  Windows: powershell -Command \"iwr https://fly.io/install.ps1 -useb | iex\""
    exit 1
fi

# Check if logged in to Fly.io
if ! flyctl auth whoami &> /dev/null; then
    print_error "Not logged in to Fly.io. Please login first:"
    echo "  flyctl auth login"
    exit 1
fi

print_status "Fly CLI check passed ✓"

# Deploy Main Backend
print_status "Deploying Main Backend Service..."
cd "$(dirname "$0")/backend"

# Check if app exists, if not create it
if ! flyctl apps show bima-backend &> /dev/null; then
    print_warning "App 'bima-backend' not found. Creating it..."
    flyctl apps create bima-backend
fi

# Check if volume exists, if not create it
if ! flyctl volumes list --app bima-backend | grep -q "bima_storage"; then
    print_warning "Volume 'bima_storage' not found. Creating it..."
    flyctl volumes create bima_storage --size 3 --region iad --app bima-backend
fi

# Deploy backend
print_status "Deploying backend application..."
flyctl deploy --app bima-backend

if [ $? -eq 0 ]; then
    print_status "Main Backend deployed successfully!"
    BACKEND_URL=$(flyctl info --app bima-backend | grep "Hostname" | awk '{print "https://"$2}')
    echo "🌐 Backend URL: $BACKEND_URL"
else
    print_error "Main Backend deployment failed!"
    exit 1
fi

# Deploy Hedera Token Service
print_status "Deploying Hedera Token Service..."
cd "../Hedera Token Service"

# Check if app exists, if not create it
if ! flyctl apps show bima-hedera-service &> /dev/null; then
    print_warning "App 'bima-hedera-service' not found. Creating it..."
    flyctl apps create bima-hedera-service
fi

# Check if volume exists, if not create it
if ! flyctl volumes list --app bima-hedera-service | grep -q "hedera_data"; then
    print_warning "Volume 'hedera_data' not found. Creating it..."
    flyctl volumes create hedera_data --size 1 --region iad --app bima-hedera-service
fi

# Deploy Hedera service
print_status "Deploying Hedera Token Service..."
flyctl deploy --app bima-hedera-service

if [ $? -eq 0 ]; then
    print_status "Hedera Token Service deployed successfully!"
    HEDERA_URL=$(flyctl info --app bima-hedera-service | grep "Hostname" | awk '{print "https://"$2}')
    echo "🔗 Hedera Service URL: $HEDERA_URL"
else
    print_error "Hedera Token Service deployment failed!"
    exit 1
fi

# Summary
print_status "Deployment completed successfully!"
echo ""
echo "📋 Deployment Summary:"
echo "  Main Backend: $BACKEND_URL"
echo "  Hedera Service: $HEDERA_URL"
echo ""
echo "📝 Next Steps:"
echo "  1. Update your frontend environment variables:"
echo "     VITE_API_URL=$BACKEND_URL"
echo "     VITE_HEDERA_SERVICE_URL=$HEDERA_URL"
echo ""
echo "  2. Set required secrets for Hedera service:"
echo "     flyctl secrets set OPERATOR_ID=\"0.0.xxxxxxx\" --app bima-hedera-service"
echo "     flyctl secrets set OPERATOR_KEY=\"302e...\" --app bima-hedera-service"
echo "     flyctl secrets set TOKEN_ID=\"0.0.xxxxxxx\" --app bima-hedera-service"
echo "     flyctl secrets set PINATA_API_KEY=\"your-key\" --app bima-hedera-service"
echo "     flyctl secrets set PINATA_SECRET_API_KEY=\"your-secret\" --app bima-hedera-service"
echo ""
echo "  3. Redeploy frontend to Vercel with updated environment variables"
echo ""
echo "🔍 Monitor your apps:"
echo "  flyctl logs --app bima-backend"
echo "  flyctl logs --app bima-hedera-service"

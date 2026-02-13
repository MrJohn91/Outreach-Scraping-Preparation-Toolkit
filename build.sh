#!/bin/bash
# Build script for Railway

echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo "Installing backend dependencies..."
cd backend
pip install -r requirements.txt
cd ..

# Create .env file from Railway build-time env vars
echo "Creating .env file..."
echo "APIFY_API_TOKEN=${APIFY_API_TOKEN}" > .env
echo "EXA_API_KEY=${EXA_API_KEY}" >> .env
echo "Created .env with APIFY_API_TOKEN: ${APIFY_API_TOKEN:+SET}"

echo "Build complete!"

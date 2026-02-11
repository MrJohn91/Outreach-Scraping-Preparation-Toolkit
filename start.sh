#!/bin/bash
set -e

echo "🚀 Starting Outreach Scraping Toolkit..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
pip install -r requirements.txt
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
npm run build
cd ..

# Start backend
echo "🔧 Starting backend server..."
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# Serve frontend build
echo "🌐 Serving frontend..."
cd frontend
npx serve -s dist -l 5173 &
FRONTEND_PID=$!
cd ..

echo "✅ Backend running on http://0.0.0.0:8000"
echo "✅ Frontend running on http://0.0.0.0:5173"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID

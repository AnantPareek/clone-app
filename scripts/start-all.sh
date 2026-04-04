#!/bin/bash

# Navigate to root
PROJECT_ROOT=$(pwd)

echo "🚀 Starting CalSync Services..."

# Start backend in background
echo "📡 Starting Backend (Port 5001)..."
(cd "$PROJECT_ROOT/backend" && npm run dev) &

# Start frontend in background
echo "🎨 Starting Frontend (Port 5173)..."
(cd "$PROJECT_ROOT/frontend" && npm run dev) &

# Handle exit to kill both processes
trap "kill 0" EXIT

# Wait for all processes to finish
wait

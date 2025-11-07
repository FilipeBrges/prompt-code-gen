#!/bin/bash

# Start backend
cd "$(dirname "$0")/../backend"
echo "Starting backend..."
source venv/bin/activate || python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACK_PID=$!

# Start frontend
cd "$(dirname "$0")/../frontend"
echo "Starting frontend..."
npm install
npm run dev &
FRONT_PID=$!

# Wait for both to finish (Ctrl+C to stop)
wait $BACK_PID $FRONT_PID

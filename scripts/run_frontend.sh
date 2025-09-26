#!/bin/bash

echo "Starting PromptCodeGen Frontend..."

cd frontend

# Install dependencies
echo "Installing dependencies..."
npm install

# Start development server
echo "Starting React development server..."
npm run dev
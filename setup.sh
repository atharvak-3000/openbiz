#!/bin/bash

echo "========================================"
echo "Openbiz Assignment - Setup Script"
echo "========================================"
echo

echo "Installing dependencies for all components..."
echo

echo "[1/3] Installing scraper dependencies..."
cd scraper
npm install
if [ $? -ne 0 ]; then
    echo "Error installing scraper dependencies"
    exit 1
fi
cd ..

echo "[2/3] Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "Error installing backend dependencies"
    exit 1
fi
cd ..

echo "[3/3] Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "Error installing frontend dependencies"
    exit 1
fi
cd ..

echo
echo "========================================"
echo "Setup completed successfully!"
echo "========================================"
echo
echo "To run the application:"
echo
echo "1. Start the backend:"
echo "   cd backend && npm start"
echo
echo "2. Start the frontend (in a new terminal):"
echo "   cd frontend && npm run dev"
echo
echo "3. Optional: Run the scraper to update schema:"
echo "   cd scraper && npm run scrape"
echo

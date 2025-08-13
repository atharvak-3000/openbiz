@echo off
echo ========================================
echo Openbiz Assignment - Setup Script
echo ========================================
echo.

echo Installing dependencies for all components...
echo.

echo [1/3] Installing scraper dependencies...
cd scraper
call npm install
if %errorlevel% neq 0 (
    echo Error installing scraper dependencies
    pause
    exit /b 1
)
cd ..

echo [2/3] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies
    pause
    exit /b 1
)
cd ..

echo [3/3] Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo To run the application:
echo.
echo 1. Start the backend:
echo    cd backend && npm start
echo.
echo 2. Start the frontend (in a new terminal):
echo    cd frontend && npm run dev
echo.
echo 3. Optional: Run the scraper to update schema:
echo    cd scraper && npm run scrape
echo.
pause

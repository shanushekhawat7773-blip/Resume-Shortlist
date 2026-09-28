@echo off
REM ==============================================================================
REM Resume Shortlist — Automated Environment Setup (Windows)
REM ==============================================================================

echo [1/3] Setting up Python backend environment...
cd backend
if not exist "venv" (
    python -m venv venv
)
call venv\Scripts\activate.bat
pip install -r requirements.txt
cd ..

echo [2/3] Setting up Node.js frontend environment...
cd frontend
call npm install
cd ..

echo [3/3] Seeding initial benchmark database...
python scripts\seed_database.py

echo.
echo ==============================================================================
echo Setup Complete!
echo Run backend:  cd backend ^&^& venv\Scripts\activate ^&^& uvicorn app.main:app --reload
echo Run frontend: cd frontend ^&^& npm run dev
echo ==============================================================================

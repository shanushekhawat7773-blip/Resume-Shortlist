#!/usr/bin/env bash
# ==============================================================================
# Resume Shortlist — Automated Environment Setup (Unix/macOS)
# ==============================================================================

set -e

echo "[1/3] Setting up Python backend environment..."
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt
cd ..

echo "[2/3] Setting up Node.js frontend environment..."
cd frontend
npm install
cd ..

echo "[3/3] Seeding initial benchmark database..."
python3 scripts/seed_database.py

echo ""
echo "=============================================================================="
echo "Setup Complete!"
echo "Run backend:  cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
echo "Run frontend: cd frontend && npm run dev"
echo "=============================================================================="

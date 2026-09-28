# Contributing to Resume Shortlist

Thank you for your interest in contributing to **Resume Shortlist: Explainable AI Recruitment Intelligence Platform**.

## Code of Conduct & Core Ethics
1. **Algorithmic Fairness**: Any modification to parsing or scoring algorithms must strictly respect protected characteristics immunity (zero demographic inference, zero proxy discrimination).
2. **Deterministic Explainability**: Never introduce black-box random scoring, artificial hallucination, or unsubstantiated match outputs.
3. **Strict Wording Policy**: Missing candidate skills must consistently be marked as `"Not detected in the submitted resume."` rather than asserting personal lack of competence.

---

## Local Development Setup

### 1. Frontend Setup (React 19 / TypeScript / Vite)
```bash
cd frontend
npm install
npm run dev
```

### 2. Backend Setup (FastAPI / Python 3.11+)
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Unix
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

---

## Testing & Quality Gates

Run all automated verification tests before opening a Pull Request:
```bash
# Frontend Typecheck & Build
cd frontend
npm run build
node tests/test_screening_engine.js

# Backend Pytest
cd ../backend
pytest tests/ -v
```

---

## Pull Request Guidelines
- Follow Conventional Commits: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`.
- Ensure zero lint and typecheck errors.
- Document any schema or API changes in `docs/API.md` and `docs/ARCHITECTURE.md`.

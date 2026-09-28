from fastapi import APIRouter
from app.api.v1.jobs import router as jobs_router
from app.api.v1.resumes import router as resumes_router
from app.api.v1.analyze import router as analyze_router
from app.api.v1.candidates import router as candidates_router
from app.api.v1.search import router as search_router
from app.api.v1.compare import router as compare_router
from app.api.v1.reports import router as reports_router

api_router = APIRouter()
api_router.include_router(jobs_router)
api_router.include_router(resumes_router)
api_router.include_router(analyze_router)
api_router.include_router(candidates_router)
api_router.include_router(search_router)
api_router.include_router(compare_router)
api_router.include_router(reports_router)

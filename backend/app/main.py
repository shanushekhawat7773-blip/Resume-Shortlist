from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1.router import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Explainable AI recruitment intelligence platform for resume parsing, semantic job matching, skill-gap analysis, candidate analytics, and evidence-based screening.",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API v1
app.include_router(api_router, prefix=settings.API_V1_PREFIX)

@app.get("/api/health", tags=["Health"])
async def health_check():
    """Healthcheck endpoint for platform uptime and engine monitoring."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "engine": "v2.4-HybridSemantic",
        "database": "connected",
        "fair_hiring_charter": "active",
    }

@app.get("/", tags=["Root"])
async def root():
    return {
        "title": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "documentation": "/docs",
        "health": "/api/health",
        "api_v1": settings.API_V1_PREFIX,
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

import os
from typing import List

try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseModel as BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Resume Shortlist"
    VERSION: str = "2.4.0"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./resume_shortlist.db")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "resume-shortlist-secret-key-production-grade-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]
    
    # Constraints
    MAX_UPLOAD_SIZE_MB: int = 15
    ALLOWED_EXTENSIONS: List[str] = ["pdf", "docx", "txt"]
    
    # Default Scoring Weights (Sum to 100)
    DEFAULT_WEIGHTS: dict = {
        "required_skills": 30,
        "experience_relevance": 20,
        "responsibilities": 20,
        "education": 10,
        "preferred_skills": 10,
        "projects": 10,
    }

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()

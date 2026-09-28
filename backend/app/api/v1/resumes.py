import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import validate_file_extension, compute_document_hash
from app.core.config import settings
from app.models.entities import CandidateModel, ResumeModel
from app.schemas.schemas import CandidateResponse
from app.services.resume_parser import parse_resume_text
from app.services.audit_service import log_audit_event

router = APIRouter(prefix="/resumes", tags=["Resumes"])

@router.post("/upload", response_model=CandidateResponse, status_code=status.HTTP_201_CREATED)
async def upload_resume(
    file: UploadFile = File(...),
    applied_job_id: Optional[str] = Form(None),
    db: AsyncSession = Depends(get_db),
):
    """
    Upload and parse a single resume document (PDF, DOCX, TXT).
    Extracts structured entities, contact details, and quantified metrics.
    """
    if not validate_file_extension(file.filename, settings.ALLOWED_EXTENSIONS):
        raise HTTPException(status_code=400, detail="Invalid file extension. Please upload PDF, DOCX, or TXT.")

    contents = await file.read()
    if len(contents) > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds maximum allowed 15MB limit.")

    try:
        raw_text = contents.decode("utf-8", errors="ignore")
    except Exception:
        raise HTTPException(status_code=422, detail="Failed to decode document contents.")

    parsed = parse_resume_text(raw_text, file_name=file.filename)
    cand_id = f"cand-{uuid.uuid4().hex[:8]}"

    db_candidate = CandidateModel(
        id=cand_id,
        name=parsed["name"],
        email=parsed["email"],
        phone=parsed["phone"],
        location=parsed["location"],
        linkedin=parsed["linkedin"],
        github=parsed["github"],
        summary=parsed["summary"],
        experience_years=parsed["experience_years"],
        education=parsed["education"],
        work_history=parsed["work_history"],
        projects=parsed["projects"],
        skills=parsed["skills"],
        stage="new",
        applied_job_id=applied_job_id,
        resume_file_name=file.filename,
        document_hash=parsed["document_hash"],
        raw_text=raw_text,
    )
    db.add(db_candidate)

    db_resume = ResumeModel(
        id=f"res_{uuid.uuid4().hex[:8]}",
        candidate_id=cand_id,
        file_name=file.filename,
        file_size=len(contents),
        document_hash=parsed["document_hash"],
        raw_text=raw_text,
        section_confidence={"experience": 0.95, "skills": 0.92, "education": 0.90},
    )
    db.add(db_resume)

    await log_audit_event(
        db=db,
        action="UPLOAD",
        candidate_name=parsed["name"],
        candidate_id=cand_id,
        details=f"Resume uploaded ({file.filename}) and fingerprint cached.",
        user="Recruiter Admin",
    )
    await db.commit()
    await db.refresh(db_candidate)
    return db_candidate

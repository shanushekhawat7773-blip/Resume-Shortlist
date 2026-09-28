import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.core.database import get_db
from app.models.entities import JobModel, RequirementModel
from app.schemas.schemas import JobCreate, JobResponse
from app.services.job_parser import parse_job_description
from app.services.audit_service import log_audit_event

router = APIRouter(prefix="/jobs", tags=["Jobs"])

@router.post("", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
async def create_job(job_in: JobCreate, db: AsyncSession = Depends(get_db)):
    """Create a new job description with structured requirements."""
    job_id = f"job-{uuid.uuid4().hex[:8]}"

    # Evaluate JD Quality
    parsed = parse_job_description(job_in.description)
    quality_score = parsed.get("jd_quality_score", 90)

    db_job = JobModel(
        id=job_id,
        title=job_in.title,
        company=job_in.company,
        department=job_in.department,
        location=job_in.location,
        employment_type=job_in.employment_type,
        seniority=job_in.seniority,
        experience_required=job_in.experience_required,
        description=job_in.description,
        required_skills=job_in.required_skills,
        preferred_skills=job_in.preferred_skills,
        education=job_in.education,
        certifications=job_in.certifications,
        responsibilities=job_in.responsibilities,
        domain=job_in.domain,
        keywords=job_in.keywords,
        jd_quality_score=quality_score,
    )
    db.add(db_job)

    # Insert Structured Requirements
    for idx, skill in enumerate(job_in.required_skills):
        req = RequirementModel(
            id=f"req-{job_id}-{idx+1}",
            job_id=job_id,
            name=skill,
            category="Skill",
            importance="Required",
            weight=25,
            description=f"Demonstrated proficiency in {skill}.",
            semantic_tokens=[skill.lower()],
        )
        db.add(req)

    await log_audit_event(
        db=db,
        action="JOB_CREATED",
        job_title=job_in.title,
        details=f"Job role '{job_in.title}' created at '{job_in.company}'.",
        user="Recruiter Admin",
    )
    await db.commit()
    await db.refresh(db_job)
    return db_job

@router.get("", response_model=List[JobResponse])
async def list_jobs(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """Retrieve all active job descriptions with pagination."""
    query = select(JobModel).offset(skip).limit(limit)
    if search:
        query = query.where(JobModel.title.ilike(f"%{search}%") | JobModel.company.ilike(f"%{search}%"))
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/{job_id}", response_model=JobResponse)
async def get_job(job_id: str, db: AsyncSession = Depends(get_db)):
    """Retrieve details of a specific job role."""
    result = await db.execute(select(JobModel).where(JobModel.id == job_id))
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job role not found")
    return job

@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job(job_id: str, db: AsyncSession = Depends(get_db)):
    """Delete a job description and associated requirements."""
    result = await db.execute(select(JobModel).where(JobModel.id == job_id))
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job role not found")
    await db.delete(job)
    await db.commit()
    return None

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.entities import CandidateModel
from app.schemas.schemas import CandidateResponse, CandidateStageUpdate
from app.services.audit_service import log_audit_event

router = APIRouter(prefix="/candidates", tags=["Candidates"])

@router.get("", response_model=List[CandidateResponse])
async def list_candidates(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, le=100),
    stage: Optional[str] = None,
    job_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """List all candidate profiles with optional stage and job filters."""
    query = select(CandidateModel).offset(skip).limit(limit)
    if stage:
        query = query.where(CandidateModel.stage == stage)
    if job_id:
        query = query.where(CandidateModel.applied_job_id == job_id)

    result = await db.execute(query)
    return result.scalars().all()

@router.get("/{candidate_id}", response_model=CandidateResponse)
async def get_candidate(candidate_id: str, db: AsyncSession = Depends(get_db)):
    """Retrieve full candidate snapshot and structured intelligence."""
    result = await db.execute(select(CandidateModel).where(CandidateModel.id == candidate_id))
    candidate = result.scalar_one_or_none()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate

@router.patch("/{candidate_id}/stage", response_model=CandidateResponse)
async def update_candidate_stage(
    candidate_id: str,
    stage_in: CandidateStageUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update candidate pipeline stage (new, reviewed, shortlisted, interview, final_review, rejected)."""
    result = await db.execute(select(CandidateModel).where(CandidateModel.id == candidate_id))
    candidate = result.scalar_one_or_none()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    old_stage = candidate.stage
    candidate.stage = stage_in.stage

    await log_audit_event(
        db=db,
        action="STAGE_CHANGE",
        candidate_name=candidate.name,
        candidate_id=candidate.id,
        details=f"Stage updated from {old_stage} to {stage_in.stage}.",
        user="Recruiter Admin",
    )
    await db.commit()
    await db.refresh(candidate)
    return candidate

@router.delete("/{candidate_id}", status_code=status.HTTP_204_NO_CONTENT)
async def purge_candidate_data(candidate_id: str, db: AsyncSession = Depends(get_db)):
    """
    Privacy & Right-to-Erasure feature: Permanently purges candidate PII, profile,
    and raw resume document from database in compliance with GDPR.
    """
    result = await db.execute(select(CandidateModel).where(CandidateModel.id == candidate_id))
    candidate = result.scalar_one_or_none()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    cand_name = candidate.name
    await db.delete(candidate)

    await log_audit_event(
        db=db,
        action="PRIVACY_PURGE",
        candidate_name=cand_name,
        candidate_id=candidate_id,
        details="Candidate records and raw resume document permanently erased per GDPR compliance.",
        user="Recruiter Admin",
    )
    await db.commit()
    return None

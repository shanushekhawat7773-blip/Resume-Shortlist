import uuid
import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.entities import CandidateModel, JobModel, AnalysisModel
from app.schemas.schemas import AnalysisRequest, AnalysisResponse
from app.services.scoring_engine import evaluate_candidate_match
from app.services.audit_service import log_audit_event

router = APIRouter(tags=["Analysis"])

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_candidate_match(req: AnalysisRequest, db: AsyncSession = Depends(get_db)):
    """
    Execute explainable hybrid semantic matching between Candidate and Job Description.
    Calculates exact mathematical scores across all 6 dimensions and builds Requirement Matrix.
    """
    cand_res = await db.execute(select(CandidateModel).where(CandidateModel.id == req.candidate_id))
    candidate = cand_res.scalar_one_or_none()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    job_res = await db.execute(select(JobModel).where(JobModel.id == req.job_id))
    job = job_res.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job role not found")

    weights_dict = req.weights.model_dump() if req.weights else None

    # Transform SQLAlchemy models to service dictionaries
    cand_dict = {
        "id": candidate.id,
        "name": candidate.name,
        "experience_years": candidate.experience_years,
        "skills": candidate.skills,
        "education": candidate.education,
        "work_history": candidate.work_history,
        "projects": candidate.projects,
        "quantified_metrics": getattr(candidate, "quantified_metrics", []),
    }
    job_dict = {
        "id": job.id,
        "title": job.title,
        "experience_required": job.experience_required,
        "required_skills": job.required_skills,
        "preferred_skills": job.preferred_skills,
        "responsibilities": job.responsibilities,
    }

    eval_result = evaluate_candidate_match(cand_dict, job_dict, weights_dict)
    analysis_id = f"anl_{uuid.uuid4().hex[:8]}"

    db_analysis = AnalysisModel(
        id=analysis_id,
        candidate_id=candidate.id,
        job_id=job.id,
        overall_score=eval_result["overall_score"],
        match_classification=eval_result["match_classification"],
        dimension_scores=eval_result["dimension_scores"],
        requirement_matrix=eval_result["requirement_coverage_matrix"],
        evaluated_at=datetime.datetime.utcnow(),
        model_version=eval_result["model_version"],
    )
    db.add(db_analysis)

    await log_audit_event(
        db=db,
        action="ANALYSIS",
        candidate_name=candidate.name,
        candidate_id=candidate.id,
        job_title=job.title,
        details=f"Evaluated against {job.title}: {eval_result['overall_score']}/100 composite score. Zero protected attributes used.",
        user="Scoring Engine v2.4",
    )
    await db.commit()

    return AnalysisResponse(
        id=analysis_id,
        candidate_id=candidate.id,
        job_id=job.id,
        overall_score=eval_result["overall_score"],
        match_classification=eval_result["match_classification"],
        dimension_scores=eval_result["dimension_scores"],
        requirement_coverage_matrix=eval_result["requirement_coverage_matrix"],
        ats_score=eval_result["ats_score"],
        evaluated_at=datetime.datetime.utcnow(),
        model_version=eval_result["model_version"],
    )

@router.get("/jobs/{job_id}/matches", response_model=List[AnalysisResponse])
async def get_job_matches(job_id: str, db: AsyncSession = Depends(get_db)):
    """Retrieve all candidate analyses recorded for a specific job."""
    result = await db.execute(select(AnalysisModel).where(AnalysisModel.job_id == job_id))
    analyses = result.scalars().all()
    return [
        AnalysisResponse(
            id=a.id,
            candidate_id=a.candidate_id,
            job_id=a.job_id,
            overall_score=a.overall_score,
            match_classification=a.match_classification,
            dimension_scores=a.dimension_scores,
            requirement_coverage_matrix=a.requirement_matrix,
            ats_score=92,
            evaluated_at=a.evaluated_at,
            model_version=a.model_version,
        )
        for a in analyses
    ]

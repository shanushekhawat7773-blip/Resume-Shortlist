from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.entities import CandidateModel, JobModel
from app.services.scoring_engine import evaluate_candidate_match

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.post("")
async def generate_executive_report(payload: Dict[str, str], db: AsyncSession = Depends(get_db)):
    """
    Generate complete 10-section executive candidate dossier ready for hiring managers.
    """
    candidate_id = payload.get("candidate_id")
    job_id = payload.get("job_id")

    if not candidate_id or not job_id:
        raise HTTPException(status_code=400, detail="candidate_id and job_id are required")

    cand_res = await db.execute(select(CandidateModel).where(CandidateModel.id == candidate_id))
    candidate = cand_res.scalar_one_or_none()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    job_res = await db.execute(select(JobModel).where(JobModel.id == job_id))
    job = job_res.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    cand_dict = {
        "id": candidate.id,
        "name": candidate.name,
        "experience_years": candidate.experience_years,
        "skills": candidate.skills,
        "education": candidate.education,
        "work_history": candidate.work_history,
        "projects": candidate.projects,
    }
    job_dict = {
        "id": job.id,
        "title": job.title,
        "experience_required": job.experience_required,
        "required_skills": job.required_skills,
        "preferred_skills": job.preferred_skills,
        "responsibilities": job.responsibilities,
    }

    eval_result = evaluate_candidate_match(cand_dict, job_dict)

    return {
        "report_id": f"rep_{candidate.id}_{job.id}",
        "candidate": {
            "name": candidate.name,
            "email": candidate.email,
            "phone": candidate.phone,
            "location": candidate.location,
            "experience_years": candidate.experience_years,
        },
        "job": {
            "title": job.title,
            "company": job.company,
            "department": job.department,
            "experience_required": job.experience_required,
        },
        "score_summary": {
            "overall_score": eval_result["overall_score"],
            "match_classification": eval_result["match_classification"],
            "dimension_scores": eval_result["dimension_scores"],
        },
        "requirement_matrix": eval_result["requirement_coverage_matrix"],
        "governance": {
            "model_version": eval_result["model_version"],
            "wording_policy": "Strict Non-Exclusionary: Undetected skills marked 'Not detected in the submitted resume.'",
            "protected_attributes_evaluated": 0,
            "human_in_the_loop_required": True,
        }
    }

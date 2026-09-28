from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.entities import CandidateModel, JobModel
from app.schemas.schemas import CompareRequest, CompareResponse, CompareCandidateMatrix, DimensionScoresSchema
from app.services.scoring_engine import evaluate_candidate_match

router = APIRouter(prefix="/compare", tags=["Compare"])

@router.post("", response_model=CompareResponse)
async def compare_candidates(req: CompareRequest, db: AsyncSession = Depends(get_db)):
    """
    Compare multiple candidates side-by-side against a target job role.
    Outputs dimension metrics, skill counts, and recruiter verification guidance.
    """
    job_res = await db.execute(select(JobModel).where(JobModel.id == req.job_id))
    job = job_res.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job role not found")

    job_dict = {
        "id": job.id,
        "title": job.title,
        "experience_required": job.experience_required,
        "required_skills": job.required_skills,
        "preferred_skills": job.preferred_skills,
        "responsibilities": job.responsibilities,
    }

    candidates_res = await db.execute(select(CandidateModel).where(CandidateModel.id.in_(req.candidate_ids)))
    candidates = candidates_res.scalars().all()

    matrices = []
    for c in candidates:
        cand_dict = {
            "id": c.id,
            "name": c.name,
            "experience_years": c.experience_years,
            "skills": c.skills,
            "education": c.education,
            "work_history": c.work_history,
            "projects": c.projects,
        }
        eval_result = evaluate_candidate_match(cand_dict, job_dict)
        matrices.append(
            CompareCandidateMatrix(
                candidate_id=c.id,
                name=c.name,
                overall_score=eval_result["overall_score"],
                dimension_scores=DimensionScoresSchema(**eval_result["dimension_scores"]),
                matched_skills_count=eval_result["matched_skills_count"],
                missing_skills_count=eval_result["missing_skills_count"],
                experience_years=c.experience_years,
                key_evidence=f"Demonstrates {eval_result['matched_skills_count']} of {len(job.required_skills)} required capabilities.",
                stage=c.stage,
            )
        )

    recommendations = [
        "Review partial skill overlaps during technical interview round.",
        "Verify quantified metrics with reference or scenario-based checks.",
        "System provides decision support: final hiring determinations remain with the human interview panel."
    ]

    return CompareResponse(
        job_title=job.title,
        company=job.company,
        candidates=matrices,
        recruiter_recommendations=recommendations,
    )

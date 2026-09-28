from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.entities import CandidateModel
from app.schemas.schemas import SearchQueryRequest, SearchQueryResponse
from app.services.search_engine import rank_candidates_by_query

router = APIRouter(prefix="/search", tags=["Search"])

@router.post("", response_model=SearchQueryResponse)
async def search_candidates(req: SearchQueryRequest, db: AsyncSession = Depends(get_db)):
    """
    Natural Language Recruiter Search: Converts English requests (e.g.
    'Find candidates with strong SQL and Power BI experience') into structured
    criteria and transparently displays search interpretations.
    """
    query = select(CandidateModel)
    if req.target_job_id:
        query = query.where(CandidateModel.applied_job_id == req.target_job_id)

    result = await db.execute(query)
    candidates = result.scalars().all()

    cand_list = [
        {
            "id": c.id,
            "name": c.name,
            "skills": c.skills,
            "experience_years": c.experience_years,
            "stage": c.stage,
        }
        for c in candidates
    ]

    ranked_data = rank_candidates_by_query(cand_list, req.query)
    return SearchQueryResponse(**ranked_data)

import pytest
import sys
import os
from httpx import AsyncClient, ASGITransport

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app
from app.core.database import engine, Base

@pytest.fixture(autouse=True)
async def init_test_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

@pytest.mark.anyio
async def test_health_check_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "v2.4-HybridSemantic" in data["engine"]

@pytest.mark.anyio
async def test_root_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "documentation" in data

@pytest.mark.anyio
async def test_job_and_search_endpoints():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Create Job
        job_payload = {
            "title": "Senior Data Analyst",
            "company": "Nexus Systems",
            "department": "Analytics",
            "location": "Bangalore",
            "employment_type": "Full-time",
            "seniority": "Senior",
            "experience_required": 4,
            "description": "Must have 4+ years experience with SQL and Python.",
            "required_skills": ["SQL", "Python", "Power BI"],
            "preferred_skills": ["Snowflake"],
            "responsibilities": ["Build analytics dashboards"],
            "domain": "Fintech",
            "keywords": ["SQL", "Python"],
        }
        res = await client.post("/api/v1/jobs", json=job_payload)
        assert res.status_code == 201
        created_job = res.json()
        assert created_job["title"] == "Senior Data Analyst"

        # List Jobs
        res_list = await client.get("/api/v1/jobs")
        assert res_list.status_code == 200
        assert len(res_list.json()) >= 1

        # Search
        search_res = await client.post("/api/v1/search", json={"query": "Find candidates with SQL and Python"})
        assert search_res.status_code == 200
        search_data = search_res.json()
        assert "interpretation" in search_data
        assert "SQL" in search_data["interpretation"]["skills_identified"]

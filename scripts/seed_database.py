"""
Database Seeding Script for Resume Shortlist
Populates the database with realistic benchmark jobs and synthetic candidates.
"""
import asyncio
import os
import sys

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.core.database import AsyncSessionLocal, engine, Base
from app.models.entities import JobModel, CandidateModel, RequirementModel, UserModel
from app.core.security import compute_document_hash

SAMPLE_JOBS = [
    {
        "id": "job-1",
        "title": "Senior Data Analyst",
        "company": "Nexus Cognitive Systems",
        "department": "Data & Analytics",
        "location": "Bangalore, India (Hybrid)",
        "employment_type": "Full-time",
        "seniority": "Senior",
        "experience_required": 5,
        "description": "Nexus Cognitive Systems is hiring a Senior Data Analyst to lead our product intelligence and financial analytics team. You will build scalable SQL queries, design executive dashboards, and derive predictive insights.",
        "required_skills": ["SQL", "Python", "Power BI", "PostgreSQL", "Data Modeling"],
        "preferred_skills": ["Tableau", "Snowflake", "dbt", "Airflow"],
        "education": "Bachelor's or Master's in Computer Science, Statistics, Mathematics, or related field",
        "certifications": ["Microsoft Certified Power BI Analyst or AWS Analytics"],
        "responsibilities": [
            "Design and optimize high-throughput SQL queries across relational and cloud data warehouses",
            "Architect interactive enterprise dashboards and KPI reports in Power BI for leadership stakeholders",
            "Conduct statistical cohort analysis and A/B testing to inform core product roadmaps",
            "Build automated data quality monitoring pipelines using Python"
        ],
        "domain": "Fintech & Enterprise Analytics",
        "keywords": ["SQL", "Python", "Power BI", "Data Modeling", "Tableau", "Snowflake"],
        "jd_quality_score": 94,
    },
    {
        "id": "job-2",
        "title": "Lead AI / ML Engineer",
        "company": "Cognitive AI Labs",
        "department": "Artificial Intelligence",
        "location": "Hyderabad, India (Hybrid)",
        "employment_type": "Full-time",
        "seniority": "Lead",
        "experience_required": 5,
        "description": "Cognitive AI Labs is looking for a Lead AI/ML Engineer to architect state-of-the-art deep learning, NLP transformer models, and scalable MLOps inference pipelines.",
        "required_skills": ["Python", "PyTorch", "Machine Learning", "Natural Language Processing", "Docker"],
        "preferred_skills": ["Kubernetes", "FastAPI", "TensorFlow", "MLflow"],
        "education": "Master's or Ph.D. in Computer Science, Artificial Intelligence, or Electrical Engineering",
        "certifications": ["AWS Certified Machine Learning - Specialty"],
        "responsibilities": [
            "Architect and fine-tune large language models and transformer architectures for enterprise applications",
            "Optimize inference latency and GPU utilization using quantization and TensorRT",
            "Deploy containerized microservices via Docker and Kubernetes",
            "Establish end-to-end MLOps tracking and continuous performance monitoring"
        ],
        "domain": "Applied Artificial Intelligence",
        "keywords": ["Python", "PyTorch", "Machine Learning", "NLP", "Transformers", "Docker"],
        "jd_quality_score": 92,
    },
]

SAMPLE_CANDIDATES = [
    {
        "id": "cand-1",
        "name": "Aarav Mehta",
        "email": "aarav.mehta@example.com",
        "phone": "+91 98765 43210",
        "location": "Bangalore, India",
        "experience_years": 6.0,
        "skills": ["SQL", "Python", "Power BI", "PostgreSQL", "Data Modeling", "Tableau", "Snowflake"],
        "summary": "Senior Data Analyst with 6 years of experience in enterprise analytics and SQL data modeling. Reduced query latencies by 45%.",
        "applied_job_id": "job-1",
        "stage": "shortlisted",
        "resume_file_name": "Aarav_Mehta_Senior_Data_Analyst.pdf",
    },
    {
        "id": "cand-2",
        "name": "Priya Sharma",
        "email": "priya.sharma@example.com",
        "phone": "+91 98765 43211",
        "location": "Hyderabad, India",
        "experience_years": 5.5,
        "skills": ["Python", "PyTorch", "Machine Learning", "Natural Language Processing", "Docker", "FastAPI", "Kubernetes"],
        "summary": "Lead AI/ML Engineer with 5+ years of experience in deep learning, transformer NLP architectures, and inference latency optimization.",
        "applied_job_id": "job-2",
        "stage": "interview",
        "resume_file_name": "Priya_Sharma_AI_ML_Engineer.pdf",
    },
]

async def seed():
    print("Initializing database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    print("Seeding benchmark data...")
    async with AsyncSessionLocal() as session:
        # Seed Jobs
        for j in SAMPLE_JOBS:
            job_obj = JobModel(**j)
            session.add(job_obj)
            for idx, skill in enumerate(j["required_skills"]):
                req = RequirementModel(
                    id=f"req-{j['id']}-{idx+1}",
                    job_id=j["id"],
                    name=skill,
                    category="Skill",
                    importance="Required",
                    weight=25,
                    description=f"Demonstrated proficiency in {skill}.",
                    semantic_tokens=[skill.lower()],
                )
                session.add(req)

        # Seed Candidates
        for c in SAMPLE_CANDIDATES:
            cand_obj = CandidateModel(
                **c,
                education=[{"degree": "B.Tech Computer Science", "institution": "IIT Madras"}],
                work_history=[{"title": "Senior Specialist", "company": "Enterprise Tech", "duration": "3 years"}],
                projects=[{"title": "Scalable Analytics Mart", "description": "High-throughput data processing pipeline"}],
                document_hash=compute_document_hash(c["name"] + c["email"]),
            )
            session.add(cand_obj)

        await session.commit()
    print("Database seeding successfully completed!")

if __name__ == "__main__":
    asyncio.run(seed())

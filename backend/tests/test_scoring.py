import pytest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.scoring_engine import evaluate_candidate_match

def test_explainable_scoring():
    candidate = {
        "id": "cand-test",
        "name": "Aarav Mehta",
        "experience_years": 5.0,
        "skills": ["Python", "SQL", "PostgreSQL", "Power BI"],
        "education": [{"degree": "B.Tech Computer Science"}],
        "work_history": [
            {
                "bullet_points": ["Engineered optimized SQL queries and analytics pipelines.", "Automated ETL processing."]
            }
        ],
        "projects": [{"title": "Data Pipeline"}],
        "quantified_metrics": ["40% latency reduction"],
    }

    job = {
        "id": "job-test",
        "title": "Senior Data Analyst",
        "experience_required": 4,
        "required_skills": ["SQL", "Python", "Power BI"],
        "preferred_skills": ["Snowflake"],
        "responsibilities": ["Build automated data pipelines and SQL queries."],
    }

    result = evaluate_candidate_match(candidate, job)

    assert result["overall_score"] >= 80
    assert result["match_classification"] == "Strong"
    assert "required_skills" in result["dimension_scores"]
    assert "experience_relevance" in result["dimension_scores"]

    # Verify Strict Non-Exclusionary wording for missing skills
    for item in result["requirement_coverage_matrix"]:
        if item["match_strength"] == "Not detected":
            assert item["candidate_evidence"] == "Not detected in the submitted resume."

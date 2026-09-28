import pytest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.resume_parser import parse_resume_text, extract_quantified_metrics
from app.services.job_parser import parse_job_description

def test_metric_quantification():
    sample = "Reduced database response latency by 45% and saved $1.2M annually across 500k users."
    metrics = extract_quantified_metrics(sample)
    assert len(metrics) >= 2
    assert any("45%" in m for m in metrics)
    assert any("$1.2M" in m or "$1.2" in m for m in metrics)

def test_resume_parser():
    resume_text = """
    Aarav Mehta
    aarav.mehta@example.com | +91 98765 43210 | Bangalore, India
    
    Work Experience:
    Senior Data Analyst - FinPulse Systems (5 years)
    - Designed automated SQL reporting pipeline improving throughput by 40%
    - Built customer churn prediction models in Python using Scikit-Learn
    
    Education:
    B.Tech in Computer Science, IIT Madras
    
    Skills:
    Python, SQL, PostgreSQL, Power BI, Machine Learning
    """
    parsed = parse_resume_text(resume_text, "Aarav_Mehta_Resume.pdf")
    assert parsed["name"] == "Aarav Mehta"
    assert parsed["email"] == "aarav.mehta@example.com"
    assert "Python" in parsed["skills"]
    assert "SQL" in parsed["skills"]
    assert parsed["experience_years"] >= 4.0

def test_job_parser():
    jd_text = """
    Senior Data Analyst
    Nexus Cognitive Systems is hiring a Senior Data Analyst.
    Requirements:
    - 5+ years experience with SQL and Python
    - Demonstrated background in data warehousing and predictive modeling
    """
    job = parse_job_description(jd_text)
    assert job["seniority"] == "Senior"
    assert job["experience_required"] == 5
    assert "SQL" in job["required_skills"] or "Python" in job["required_skills"]
    assert job["jd_quality_score"] >= 80

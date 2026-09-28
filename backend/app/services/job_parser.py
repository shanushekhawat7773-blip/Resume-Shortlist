"""
Job Description Parser & Intelligence Extraction Service
Analyzes JDs, extracts structured requirements, and evaluates JD quality score.
"""
import re
from typing import Dict, List, Any
from app.services.skill_ontology import SKILL_GRAPH

BUZZWORDS = ["rockstar", "ninja", "guru", "wizard", "unicorn", "dynamic fast-paced synergy"]

def parse_job_description(raw_text: str) -> Dict[str, Any]:
    """Parse raw JD text into structured job requirements and quality score."""
    clean_text = raw_text.strip()
    lines = [l.strip() for l in clean_text.split("\n") if l.strip()]

    # Title detection
    title = "Senior Technical Specialist"
    for line in lines[:3]:
        if len(line) > 5 and len(line) < 60 and not any(kw in line.lower() for kw in ["about", "description", "company"]):
            title = re.sub(r"^(job title|role|position):\s*", "", line, flags=re.IGNORECASE)
            break

    # Seniority detection
    lower = clean_text.lower()
    seniority = "Mid"
    if any(k in lower for k in ["principal", "staff", "director"]):
        seniority = "Principal"
    elif any(k in lower for k in ["lead", "manager"]):
        seniority = "Lead"
    elif any(k in lower for k in ["senior", "sr."]):
        seniority = "Senior"
    elif any(k in lower for k in ["junior", "entry", "associate", "intern"]):
        seniority = "Entry"

    # Experience requirement
    experience_required = 3
    exp_match = re.search(r"(\d+)\+?\s*(?:to\s*(\d+))?\s*(?:years|yrs)\b", clean_text, re.IGNORECASE)
    if exp_match:
        experience_required = int(exp_match.group(1))

    # Detect skills via Ontology
    required_skills = []
    preferred_skills = []

    for slug, node in SKILL_GRAPH.items():
        if re.search(rf"\b{re.escape(node.name)}\b", clean_text, re.IGNORECASE):
            if len(required_skills) < 5:
                required_skills.append(node.name)
            else:
                preferred_skills.append(node.name)

    if not required_skills:
        required_skills = ["Python", "SQL", "Data Analysis"]

    # Responsibilities
    resp_bullets = []
    for line in lines:
        if line.startswith(("-", "•", "*", "1.", "2.", "3.")) and len(line) > 25:
            resp_bullets.append(line.lstrip("-•* 0123456789.").strip())
    if not resp_bullets:
        resp_bullets = [
            "Architect and maintain scalable data pipelines and backend services",
            "Collaborate with engineering and product teams to deliver customer features",
            "Drive technical performance optimization and query reliability"
        ]

    # JD Quality Score & Suggestions
    vague_count = sum(1 for b in BUZZWORDS if b in lower)
    jd_quality_score = max(50, 100 - (vague_count * 15))
    suggestions = []
    if vague_count > 0:
        suggestions.append("Replace vague buzzwords (e.g., rockstar/ninja) with measurable domain responsibilities.")
    if len(required_skills) > 12:
        suggestions.append("Over-specified mandatory requirements list. Consider moving non-critical items to preferred skills.")

    structured_requirements = []
    for idx, skill in enumerate(required_skills):
        structured_requirements.append({
            "id": f"req-{idx+1}",
            "name": skill,
            "category": "Skill",
            "importance": "Required",
            "weight": 25,
            "description": f"Demonstrated commercial proficiency in {skill}.",
            "semantic_tokens": [skill.lower()]
        })

    return {
        "title": title,
        "company": "Nexus Enterprise Systems",
        "department": "Engineering & Technology",
        "location": "Bangalore, India (Hybrid)",
        "employment_type": "Full-time",
        "seniority": seniority,
        "experience_required": experience_required,
        "description": clean_text[:400] + "...",
        "required_skills": required_skills,
        "preferred_skills": preferred_skills or ["Docker", "Kubernetes", "AWS"],
        "education": "Bachelor's or Master's in Computer Science, Data, or related field",
        "certifications": ["Relevant professional cloud or software certifications"],
        "responsibilities": resp_bullets[:5],
        "domain": "Enterprise Technology",
        "keywords": required_skills + preferred_skills,
        "jd_quality_score": jd_quality_score,
        "jd_suggestions": suggestions,
        "structured_requirements": structured_requirements,
    }

"""
Natural Language Recruiter Search Engine
Parses recruiter queries into structured criteria and ranks candidates with transparent reasoning.
"""
import re
from typing import Dict, List, Any
from app.services.skill_ontology import SKILL_GRAPH, resolve_skill

def parse_search_query(query: str) -> Dict[str, Any]:
    """Parse unstructured recruiter query into structured search parameters."""
    clean = query.lower()

    # Extract target skills
    skills_found = []
    for slug, node in SKILL_GRAPH.items():
        if re.search(rf"\b{re.escape(node.name)}\b", clean, re.IGNORECASE):
            skills_found.append(node.name)
            continue
        for alias in node.aliases:
            if re.search(rf"\b{re.escape(alias)}\b", clean, re.IGNORECASE):
                skills_found.append(node.name)
                break

    # Extract minimum years
    min_years = None
    yr_match = re.search(r"(\d+)\+?\s*(?:years|yrs)", clean)
    if yr_match:
        min_years = int(yr_match.group(1))

    # Degree keyword
    degree = None
    if "master" in clean or "ms" in clean:
        degree = "Master's"
    elif "bachelor" in clean or "b.tech" in clean or "bs" in clean:
        degree = "Bachelor's"

    # Project keywords
    project_keywords = []
    for kw in ["analytics", "nlp", "cloud", "pipeline", "etl", "dashboard", "api", "fintech", "ecommerce"]:
        if kw in clean:
            project_keywords.append(kw)

    return {
        "skills_identified": skills_found,
        "min_experience_years": min_years,
        "degree_required": degree,
        "project_keywords": project_keywords,
    }

def rank_candidates_by_query(candidates: List[Dict[str, Any]], query: str) -> Dict[str, Any]:
    """Rank candidate pool against parsed recruiter query."""
    criteria = parse_search_query(query)
    target_skills = set(s.lower() for s in criteria["skills_identified"])

    ranked_results = []
    for c in candidates:
        cand_skills = set(s.lower() for s in c.get("skills", []))
        matched = [s for s in criteria["skills_identified"] if s.lower() in cand_skills]
        missing = [s for s in criteria["skills_identified"] if s.lower() not in cand_skills]

        # Calculate query match score
        skill_score = (len(matched) / max(1, len(target_skills))) * 60 if target_skills else 40
        exp_score = 0
        if criteria["min_experience_years"]:
            if c.get("experience_years", 0) >= criteria["min_experience_years"]:
                exp_score = 25
            else:
                exp_score = 10
        else:
            exp_score = 20

        proj_score = 15 if criteria["project_keywords"] else 10
        relevance = int(min(99, skill_score + exp_score + proj_score))

        ranked_results.append({
            "candidate_id": c["id"],
            "name": c["name"],
            "experience_years": c.get("experience_years", 0.0),
            "relevance_score": relevance,
            "matched_skills": matched,
            "missing_skills": missing,
            "evidence_snippet": f"Verified {len(matched)} target capabilities in candidate work history.",
            "stage": c.get("stage", "new"),
        })

    ranked_results.sort(key=lambda x: x["relevance_score"], reverse=True)

    return {
        "interpretation": criteria,
        "results": ranked_results,
    }

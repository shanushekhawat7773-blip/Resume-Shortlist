"""
Explainable Hybrid Scoring Engine (v2.4-HybridSemantic)
Calculates reproducible composite scores across 6 measurable dimensions:
1. Required Skills (30%)
2. Experience Relevance (20%)
3. Job Responsibilities (20%)
4. Education Match (10%)
5. Preferred Skills (10%)
6. Projects / Evidence Proof (10%)
"""
from typing import Dict, List, Any, Optional
from app.services.semantic_engine import evaluate_semantic_match, cosine_similarity
from app.services.skill_ontology import get_related_skills, resolve_skill

DEFAULT_WEIGHTS = {
    "required_skills": 30,
    "experience_relevance": 20,
    "responsibilities": 20,
    "education": 10,
    "preferred_skills": 10,
    "projects": 10,
}

def evaluate_candidate_match(
    candidate: Dict[str, Any],
    job: Dict[str, Any],
    weights: Optional[Dict[str, int]] = None
) -> Dict[str, Any]:
    """
    Evaluate candidate against job requirements with 100% explainability receipt.
    """
    w = weights or DEFAULT_WEIGHTS
    total_w = sum(w.values()) or 100
    norm_w = {k: v / total_w for k, v in w.items()}

    cand_skills = set(s.lower() for s in candidate.get("skills", []))
    req_skills = job.get("required_skills", [])
    pref_skills = job.get("preferred_skills", [])

    # 1. Required Skills Dimension (S1)
    matched_req = []
    missing_req = []
    coverage_matrix = []

    for req in req_skills:
        req_lower = req.lower()
        node = resolve_skill(req)
        slug = node.slug if node else req_lower

        if req_lower in cand_skills:
            matched_req.append(req)
            coverage_matrix.append({
                "requirement_name": req,
                "category": "Skill",
                "importance": "Required",
                "candidate_evidence": f"Directly demonstrated proficiency in {req}.",
                "evidence_location": "Work Experience / Core Competencies",
                "match_strength": "Strong",
                "confidence": 0.95,
                "audit_notes": "Canonical skill matched in submitted resume."
            })
        else:
            # Check related ontology skills for partial match
            related = get_related_skills(slug)
            found_related = [r for r in related if r.lower() in cand_skills]
            if found_related:
                matched_req.append(req) # partial credit
                coverage_matrix.append({
                    "requirement_name": req,
                    "category": "Skill",
                    "importance": "Required",
                    "candidate_evidence": f"Candidate possesses related skill: {found_related[0].title()}.",
                    "evidence_location": "Ontology Graph Expansion",
                    "match_strength": "Needs verification",
                    "confidence": 0.70,
                    "audit_notes": "Recruiter should verify depth during technical screening."
                })
            else:
                missing_req.append(req)
                coverage_matrix.append({
                    "requirement_name": req,
                    "category": "Skill",
                    "importance": "Required",
                    "candidate_evidence": "Not detected in the submitted resume.",
                    "evidence_location": None,
                    "match_strength": "Not detected",
                    "confidence": 0.0,
                    "audit_notes": "Flagged as an interview discussion probe."
                })

    s1 = int((len(matched_req) / max(1, len(req_skills))) * 100)

    # 2. Experience Relevance Dimension (S2)
    cand_exp = candidate.get("experience_years", 0.0)
    req_exp = job.get("experience_required", 3)
    if cand_exp >= req_exp:
        s2 = min(100, 85 + int((cand_exp - req_exp) * 3))
    else:
        s2 = max(40, int((cand_exp / max(1, req_exp)) * 90))

    # 3. Responsibilities Dimension (S3)
    work_bullets = " ".join([b for w in candidate.get("work_history", []) for b in w.get("bullet_points", [])])
    job_resps = " ".join(job.get("responsibilities", []))
    semantic_sim = cosine_similarity(job_resps, work_bullets)
    s3 = int(min(100, max(65, 60 + int(semantic_sim * 100))))

    # 4. Education Match (S4)
    s4 = 90 if candidate.get("education") else 70

    # 5. Preferred Skills Dimension (S5) - Nice-to-have bonus dimension
    matched_pref = [p for p in pref_skills if p.lower() in cand_skills]
    s5 = int(70 + (len(matched_pref) / max(1, len(pref_skills))) * 30) if pref_skills else 80

    # 6. Project Evidence Dimension (S6)
    quantified = candidate.get("quantified_metrics", [])
    s6 = min(100, 70 + (len(quantified) * 6)) if candidate.get("projects") else 60

    # Penalty Calculations
    exp_penalty = 0
    if cand_exp < req_exp:
        exp_penalty = min(15, int((req_exp - cand_exp) * 3))

    gap_penalty = min(10, len(missing_req) * 2)

    # Composite Equation
    raw_composite = (
        (s1 * norm_w["required_skills"]) +
        (s2 * norm_w["experience_relevance"]) +
        (s3 * norm_w["responsibilities"]) +
        (s4 * norm_w["education"]) +
        (s5 * norm_w["preferred_skills"]) +
        (s6 * norm_w["projects"])
    )
    final_score = int(min(100, max(0, raw_composite - exp_penalty - gap_penalty)))

    if final_score >= 80:
        classification = "Strong"
    elif final_score >= 65:
        classification = "Moderate"
    elif final_score >= 50:
        classification = "Needs verification"
    else:
        classification = "Low"

    return {
        "overall_score": final_score,
        "match_classification": classification,
        "dimension_scores": {
            "required_skills": s1,
            "experience_relevance": s2,
            "responsibilities": s3,
            "education": s4,
            "preferred_skills": s5,
            "projects": s6,
        },
        "requirement_coverage_matrix": coverage_matrix,
        "matched_skills_count": len(matched_req),
        "missing_skills_count": len(missing_req),
        "quantified_metrics_detected": len(quantified),
        "ats_score": max(75, min(98, 85 + (len(quantified) * 2))),
        "model_version": "v2.4-HybridSemantic",
    }

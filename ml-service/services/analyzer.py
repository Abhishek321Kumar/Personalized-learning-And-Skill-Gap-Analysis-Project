import math
import re
from collections import defaultdict

from .skill_catalog import SKILL_CATALOG


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", (text or "").lower()).strip()


def extract_skills(text: str):
    normalized = normalize_text(text)
    extracted = []

    for canonical_name, metadata in SKILL_CATALOG.items():
        aliases = metadata["aliases"]
        if any(alias.lower() in normalized for alias in aliases):
            extracted.append(
                {
                    "name": canonical_name,
                    "category": metadata["category"],
                    "ictGroup": metadata["ict_group"],
                }
            )

    return extracted


def merge_resume_and_declared_skills(resume_text: str, declared_skills):
    resume_skills = extract_skills(resume_text)
    seen = {skill["name"] for skill in resume_skills}

    for skill in declared_skills or []:
        name = skill.get("name")
        if name and name not in seen:
            metadata = SKILL_CATALOG.get(
                name,
                {
                    "category": skill.get("category", "General"),
                    "ict_group": "Problem Solving",
                },
            )
            resume_skills.append(
                {
                    "name": name,
                    "category": metadata["category"],
                    "ictGroup": metadata["ict_group"],
                }
            )
            seen.add(name)

    return resume_skills


def extract_required_skills(job_description: str, explicit_required_skills):
    if explicit_required_skills:
        return explicit_required_skills

    inferred = extract_skills(job_description)
    return [{"name": item["name"], "weight": 1, "category": item["category"]} for item in inferred]


def score_assessment_signals(assessment_signals):
    scores = defaultdict(list)

    for attempt in assessment_signals or []:
        for answer in attempt.get("answers", []):
            scores[answer["skill"]].append(1 if answer["wasCorrect"] else 0)

    result = {}
    for skill, values in scores.items():
        result[skill] = round(sum(values) / len(values) * 100)

    return result


def build_category_breakdown(required_skills, matched_skill_names, assessment_scores):
    grouped = defaultdict(lambda: {"required": 0, "matched": 0, "assessment": []})

    for item in required_skills:
        category = item.get("category", "General")
        grouped[category]["required"] += 1
        if item["name"] in matched_skill_names:
            grouped[category]["matched"] += 1
        if item["name"] in assessment_scores:
            grouped[category]["assessment"].append(assessment_scores[item["name"]])

    breakdown = []
    for category, values in grouped.items():
        category_match = 0 if values["required"] == 0 else round(values["matched"] / values["required"] * 100)
        assessment_score = round(sum(values["assessment"]) / len(values["assessment"])) if values["assessment"] else 0
        breakdown.append(
            {
                "category": category,
                "required": values["required"],
                "matched": values["matched"],
                "coverageScore": category_match,
                "assessmentScore": assessment_score,
            }
        )

    breakdown.sort(key=lambda item: item["coverageScore"], reverse=True)
    return breakdown


def evaluate_resume_structure(resume_text: str):
    score = 60
    pros = []
    cons = []
    text_lower = (resume_text or "").lower()
    text_nospace = text_lower.replace(" ", "")
    
    if len(text_lower) > 500:
        score += 15
        pros.append("Good overall length and detail")
    else:
        score -= 10
        cons.append("Resume seems a bit short. Add more details about your achievements.")
        
    if "experience" in text_nospace or "workhistory" in text_nospace:
        score += 10
        pros.append("Clear experience section")
    else:
        cons.append("Missing a clear 'Experience' section")
        
    if "education" in text_nospace or "university" in text_nospace or "degree" in text_nospace:
        score += 10
        pros.append("Education details are present")
    else:
        cons.append("Missing education details")
        
    if "achieved" in text_nospace or "improved" in text_nospace or "increased" in text_nospace or "developed" in text_nospace:
        score += 5
        pros.append("Good use of action verbs")
    else:
        cons.append("Consider using more action verbs (e.g., achieved, developed)")
        
    score = max(0, min(100, score))
    return score, pros, cons


def analyze_profile(payload):
    resume_text = payload.get("resumeText", "")
    job_description = payload.get("jobDescription", "")
    target_role = payload.get("targetRole") or "Selected role"
    declared_skills = payload.get("declaredSkills", [])
    assessment_signals = payload.get("assessmentSignals", [])

    user_skills = merge_resume_and_declared_skills(resume_text, declared_skills)
    user_skill_names = {skill["name"] for skill in user_skills}

    required_skills = extract_required_skills(job_description, payload.get("requiredSkills"))
    required_skill_names = [skill["name"] for skill in required_skills]

    assessment_scores = score_assessment_signals(assessment_signals)

    matched_skills = []
    missing_skills = []
    weighted_total = 0
    weighted_score = 0

    for skill in required_skills:
        weight = skill.get("weight", 1)
        weighted_total += weight
        if skill["name"] in user_skill_names:
            matched_skills.append(skill["name"])
            weighted_score += weight

            if assessment_scores.get(skill["name"], 100) < 50:
                weighted_score -= 0.25 * weight
        else:
            missing_skills.append(skill["name"])

    match_percentage = 0 if weighted_total == 0 else round(max(weighted_score, 0) / weighted_total * 100)

    assessment_bonus = (
        round(sum(assessment_scores.values()) / len(assessment_scores) * 0.2)
        if assessment_scores
        else 0
    )
    readiness_score = min(100, round(match_percentage * 0.8 + assessment_bonus))

    strengths = matched_skills[:4]
    improvement_priorities = sorted(
        missing_skills,
        key=lambda name: next(
            (item.get("weight", 1) for item in required_skills if item["name"] == name),
            1,
        ),
        reverse=True,
    )[:5]

    category_breakdown = build_category_breakdown(required_skills, matched_skills, assessment_scores)

    ict_required = len(required_skills)
    ict_measured = len(matched_skills) + len(assessment_scores)
    ict_coverage = 0 if ict_required == 0 else min(100, round((ict_measured / (ict_required * 2)) * 100))

    confidence_band = "Emerging"
    if readiness_score >= 75:
        confidence_band = "Advanced"
    elif readiness_score >= 50:
        confidence_band = "Progressing"

    resume_score, resume_pros, resume_cons = evaluate_resume_structure(resume_text)

    return {
        "targetRole": target_role,
        "readinessScore": readiness_score,
        "matchPercentage": match_percentage,
        "matchedSkills": matched_skills,
        "missingSkills": missing_skills,
        "strengths": strengths,
        "improvementPriorities": improvement_priorities,
        "categoryBreakdown": category_breakdown,
        "ictIndicator": {
            "measuredSkills": ict_measured,
            "requiredSkills": ict_required,
            "coverageScore": ict_coverage,
        },
        "confidenceBand": confidence_band,
        "detectedResumeSkills": user_skills,
        "resumeScore": resume_score,
        "resumePros": resume_pros,
        "resumeCons": resume_cons,
    }


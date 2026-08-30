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


def evaluate_resume_structure(resume_text: str, matched_skills: list, missing_skills: list, user_skills: set):
    score = 0
    pros = []
    cons = []
    text_lower = (resume_text or "").lower()
    text_nospace = text_lower.replace(" ", "")

    # 1. Keyword Relevance (40 points)
    total_skills = len(matched_skills) + len(missing_skills)
    if total_skills > 0:
        match_ratio = len(matched_skills) / total_skills
        score += int(match_ratio * 40)
        if match_ratio >= 0.8:
            pros.append("High keyword relevance for the target role.")
        elif match_ratio >= 0.4:
            cons.append(f"Moderate keyword match ({len(matched_skills)}/{total_skills} target skills). Consider tailoring more to the job description.")
        else:
            cons.append(f"Low keyword match ({len(matched_skills)}/{total_skills} target skills). Include more relevant skills.")
    else:
        # Fallback if no target skills to compare against
        if len(user_skills) >= 8:
            score += 40
            pros.append(f"Detected a strong variety of professional skills ({len(user_skills)} skills found).")
        elif len(user_skills) >= 4:
            score += 30
            pros.append(f"Detected several professional skills ({len(user_skills)} skills found).")
            cons.append("Consider adding more specific technical or soft skills to stand out.")
        elif len(user_skills) > 0:
            score += 15
            cons.append(f"Very few skills detected ({len(user_skills)} skills). Ensure you use standard industry keywords.")
        else:
            cons.append("No professional skills detected. Make sure your skills section uses standard keywords.")

    # 2. Formatting and Structure (30 points)
    struct_score = 0
    if any(kw in text_nospace for kw in ["experience", "workhistory", "employment"]):
        struct_score += 10
        pros.append("Clear 'Experience' section detected.")
    else:
        cons.append("Missing a clear 'Experience' or 'Work History' section.")
        
    if any(kw in text_nospace for kw in ["education", "university", "degree", "bachelor", "master"]):
        struct_score += 10
        pros.append("Education details are present.")
    else:
        cons.append("Missing clear education details. Include your degree or university.")
        
    if "@" in text_nospace or re.search(r'\d{3}[-.\s]?\d{3}[-.\s]?\d{4}', text_lower):
        struct_score += 10
    else:
        cons.append("Could not detect contact information (email or phone number).")
        
    score += struct_score

    # 3. Readability and Clarity (30 points)
    read_score = 0
    
    if len(text_lower) > 800:
        read_score += 10
        pros.append("Good overall length and detail.")
    elif len(text_lower) > 400:
        read_score += 5
        cons.append("Resume is somewhat brief. Consider elaborating on your responsibilities.")
    else:
        cons.append("Resume is very short. Add more details about your achievements.")

    action_verbs = ["achieved", "improved", "increased", "developed", "managed", "led", "created", "designed", "engineered", "delivered", "optimized", "spearheaded"]
    found_verbs = [v for v in action_verbs if v in text_lower]
    if len(found_verbs) >= 4:
        read_score += 10
        pros.append("Strong use of action verbs.")
    elif len(found_verbs) > 0:
        read_score += 5
        cons.append("Consider using a wider variety of action verbs to describe impact.")
    else:
        cons.append("Lacking action verbs (e.g., achieved, optimized). Use these to highlight accomplishments.")

    if re.search(r'\d+%|\$\d+|\d+\s*(?:users|clients|revenue|sales)', text_lower) or len(re.findall(r'\d+', text_lower)) > 8:
        read_score += 10
        pros.append("Good use of metrics to quantify achievements.")
    else:
        cons.append("Achievements are not quantified. Add numbers or percentages (e.g., 'Increased sales by 20%').")

    score += read_score
    score = max(0, min(100, score))
    
    if len(cons) == 0 and score < 100:
        cons.append("Consider adding more detailed achievements or matching more keywords to reach a perfect score.")

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

    resume_score, resume_pros, resume_cons = evaluate_resume_structure(resume_text, matched_skills, missing_skills)

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


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
    categories = []
    text_lower = (resume_text or "").lower()
    text_nospace = text_lower.replace(" ", "")
    lines = [line.strip() for line in (resume_text or "").split("\n") if line.strip()]

    # 1. Keyword Optimization (30 points)
    keyword_score = 0
    keyword_feedback = []
    
    total_skills = len(matched_skills) + len(missing_skills)
    if total_skills > 0:
        match_ratio = len(matched_skills) / total_skills
        keyword_score = int(match_ratio * 20)  # Up to 20 pts for matching skills
    else:
        keyword_score = 10 if len(user_skills) > 10 else 5

    # Density and hard/soft skills heuristics
    if len(user_skills) >= 20:
        keyword_score += 10
        keyword_feedback.append({"type": "pro", "text": f"Excellent keyword density and variety ({len(user_skills)} skills found)."})
    elif len(user_skills) >= 10:
        keyword_score += 5
        keyword_feedback.append({"type": "con", "text": f"Moderate keyword density ({len(user_skills)} skills). Expand on technical and soft skills."})
    else:
        keyword_feedback.append({"type": "con", "text": "Low keyword density. Make sure you are using standard industry terminology."})
        
    keyword_score = min(30, keyword_score)
    
    # Add matched/missing explicitly
    if total_skills > 0:
        keyword_feedback.append({
            "type": "info",
            "text": f"Skill Gap Analysis ({len(matched_skills)} matched, {len(missing_skills)} missing)",
            "matched": matched_skills,
            "missing": missing_skills
        })

    categories.append({
        "name": "Keyword Optimization",
        "score": keyword_score,
        "maxScore": 30,
        "feedback": keyword_feedback
    })

    # 2. Formatting & Structure (25 points)
    struct_score = 0
    struct_feedback = []
    
    # Sections check
    has_exp = any(kw in text_nospace for kw in ["experience", "workhistory", "employment"])
    if has_exp:
        struct_score += 5
        struct_feedback.append({"type": "pro", "text": "Clear 'Experience' section detected."})
    else:
        struct_feedback.append({"type": "con", "text": "Missing a standard 'Experience' or 'Work History' section."})

    has_edu = any(kw in text_nospace for kw in ["education", "university", "degree", "bachelor", "master"])
    if has_edu:
        struct_score += 5
        struct_feedback.append({"type": "pro", "text": "Education details are present."})
    else:
        struct_feedback.append({"type": "con", "text": "Missing clear education details. Include your degree or university."})

    # Contact Info check (Email + Phone + LinkedIn)
    has_email = "@" in text_nospace
    has_phone = bool(re.search(r'\d{3}[-.\s]?\d{3}[-.\s]?\d{4}', text_lower))
    has_linkedin = "linkedin.com" in text_nospace or "linkedin" in text_lower
    
    contact_pts = sum([has_email * 2, has_phone * 2, has_linkedin * 1])
    struct_score += contact_pts
    
    if has_email and has_phone and has_linkedin:
        struct_feedback.append({"type": "pro", "text": "Complete contact info and LinkedIn profile detected."})
    elif has_email and has_phone:
        struct_feedback.append({"type": "con", "text": "Basic contact info found, but missing a LinkedIn URL."})
    else:
        struct_feedback.append({"type": "con", "text": "Missing complete contact information (needs email and phone number)."})

    # Chronology markers (Years like 2019, 2020, 2021)
    years = re.findall(r'20\d{2}', text_lower)
    if len(set(years)) >= 2:
        struct_score += 5
        struct_feedback.append({"type": "pro", "text": "Chronological dates detected consistently."})
    else:
        struct_feedback.append({"type": "con", "text": "Ensure you are using consistent dates (e.g. Month Year - Month Year) for your experience."})

    # Length / No weird characters
    if 500 < len(text_lower) < 5000:
        struct_score += 5
        struct_feedback.append({"type": "pro", "text": "Appropriate resume length (likely 1-2 pages)."})
    else:
        struct_feedback.append({"type": "con", "text": "Resume length is either too short or excessively long for ATS processing."})

    categories.append({
        "name": "Formatting & Structure",
        "score": struct_score,
        "maxScore": 25,
        "feedback": struct_feedback
    })

    # 3. Readability & Clarity (25 points)
    read_score = 0
    read_feedback = []
    
    # Bullet points
    bullet_lines = [l for l in lines if l.startswith("-") or l.startswith("•") or l.startswith("*")]
    if len(bullet_lines) >= 5:
        read_score += 10
        read_feedback.append({"type": "pro", "text": "Good use of bullet points for readability."})
    else:
        read_feedback.append({"type": "con", "text": "Too much paragraph text. Use bullet points for experience."})

    # Action verbs
    action_verbs = ["achieved", "improved", "increased", "developed", "managed", "led", "created", "designed", "engineered", "delivered", "optimized", "spearheaded", "orchestrated", "implemented", "resolved", "directed", "executed", "collaborated"]
    found_verbs = [v for v in action_verbs if v in text_lower]
    if len(found_verbs) >= 6:
        read_score += 10
        read_feedback.append({"type": "pro", "text": "Strong, consistent use of active voice verbs."})
    elif len(found_verbs) >= 3:
        read_score += 5
        read_feedback.append({"type": "con", "text": "Consider starting more bullets with strong action verbs."})
    else:
        read_feedback.append({"type": "con", "text": "Lacking active voice. Start bullets with verbs like 'Optimized' or 'Spearheaded'."})

    # Metrics
    if re.search(r'\d+%|\$\d+', text_lower) and len(re.findall(r'\d+', text_lower)) > 5:
        read_score += 5
        read_feedback.append({"type": "pro", "text": "Excellent use of metrics to quantify impact."})
    else:
        read_feedback.append({"type": "con", "text": "Achievements lack quantification. Add numbers, percentages, or dollar amounts."})

    categories.append({
        "name": "Readability & Clarity",
        "score": read_score,
        "maxScore": 25,
        "feedback": read_feedback
    })

    # 4. Relevance & Tailoring (20 points)
    rel_score = 0
    rel_feedback = []
    
    # Summary
    if any(kw in text_nospace for kw in ["summary", "profile", "objective", "about"]):
        rel_score += 10
        rel_feedback.append({"type": "pro", "text": "Professional summary/profile section detected."})
    else:
        rel_feedback.append({"type": "con", "text": "Missing a professional summary. A short summary helps contextualize your relevance."})
        
    # Top heaviness (Are target skills appearing early?)
    # Just look at the first 30% of the text.
    first_third = text_lower[:max(1, len(text_lower) // 3)]
    matched_in_first_third = [s for s in matched_skills if s.lower() in first_third]
    
    if len(matched_skills) > 0:
        if len(matched_in_first_third) >= len(matched_skills) * 0.4:
            rel_score += 10
            rel_feedback.append({"type": "pro", "text": "Relevant skills are well-positioned near the top of the resume."})
        else:
            rel_score += 5
            rel_feedback.append({"type": "con", "text": "Key target skills are buried. Move the most relevant skills/experience higher up."})
    else:
        rel_score += 5
        rel_feedback.append({"type": "con", "text": "Cannot determine relevance positioning due to lack of matched skills."})

    categories.append({
        "name": "Relevance & Tailoring",
        "score": rel_score,
        "maxScore": 20,
        "feedback": rel_feedback
    })

    score = keyword_score + struct_score + read_score + rel_score
    score = max(0, min(100, score))
    
    return score, categories


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

    resume_score, resume_categories = evaluate_resume_structure(resume_text, matched_skills, missing_skills, user_skill_names)

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
        "resumeCategories": resume_categories,
    }


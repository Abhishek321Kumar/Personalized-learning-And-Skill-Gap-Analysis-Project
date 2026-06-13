# SkillBridge Synopsis Mapping

## Introduction analysis

The introduction describes a gap between what learners think they know and what employers actually need. It also highlights fragmented learning, weak accountability, and lack of measurable direction.

The application addresses that with:

- structured profile creation
- evidence-based resume parsing
- target-role skill comparison
- timed assessments for validation
- analytics that show readiness and next priorities

## Proposed system analysis

The synopsis proposed flow is:

1. student registers or logs in
2. takes a skill assessment test
3. system analyzes score
4. detects weak areas
5. recommends suitable resources
6. tracks student progress
7. generates report dashboard

This build implements steps `1`, `2`, `3`, `4`, and `7` directly.

Step `5` and step `6` were intentionally deferred because you asked to ignore:

- deadline and re-assessment scheduling
- personalized roadmap and recommendation

Even so, the codebase keeps their module slots open for later addition.

## Modules identified analysis

### Implemented now

- `M1` User Authentication & Profile Module
- `M2` Resume & JD Parsing Module
- `M3` Skill Gap Analysis & Readiness Score Module
- `M4` Adaptive Quiz & Assessment Module
- `M7` Dashboard & Progress Analytics Module

### Deferred but architecturally reserved

- `M5` Personalised Roadmap & Recommendation Module
- `M6` Deadline & Re-Assessment Scheduling Module

## Technologies used analysis

The synopsis mentions:

- React, HTML, CSS, JavaScript
- Node.js, Express
- MongoDB
- Python recommendation / NLP stack
- VS Code
- GitHub

This implementation keeps to that stack:

- frontend uses plain React with CSS
- backend uses Express and Mongoose
- persistence uses MongoDB
- analysis uses Python service code
- the repo structure is VS Code friendly

## Current limitations by design

- recommendation resources are not yet generated automatically
- no scheduling or deadline engine exists yet
- no cloud deployment files are included in this first local-development baseline
- current NLP uses a lightweight deterministic catalog approach that can later be upgraded to spaCy and Transformers

## Safe extension points

- add recommendation endpoints under `server/src/modules/recommendation/`
- add scheduler endpoints under `server/src/modules/reassessment/`
- extend the Python analyzer with embeddings or transformer inference
- introduce additional role packs and quizzes


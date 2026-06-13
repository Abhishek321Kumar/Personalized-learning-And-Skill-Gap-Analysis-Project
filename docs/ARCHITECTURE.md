# SkillBridge Architecture

## Synopsis interpretation

The synopsis identifies four especially important anchors:

1. `Introduction`
2. `Modules identified`
3. `Proposed system`
4. `Technologies used`

This implementation follows those anchors directly.

## Introduction to system mapping

The introduction explains that learners currently:

- do not know their actual job readiness
- rely on fragmented learning
- lack validation of real proficiency
- need a structured path with measurable progress

The application maps those needs into concrete product capabilities:

- `Profile + role setup` turns vague goals into structured learner input.
- `Resume + JD parsing` extracts evidence from resume files and job descriptions.
- `Skill gap analysis` compares current and required skills using weighted scoring.
- `Timed adaptive quiz` validates actual proficiency instead of self-reporting alone.
- `Dashboard analytics` exposes measurable readiness and ICT coverage.

## Module architecture

### `M1` User Authentication & Profile

- Frontend forms and protected routes
- JWT authentication
- learner preferences, target role, declared skills, resume metadata

### `M2` Resume & JD Parsing

- file upload through Express and `multer`
- text extraction through Python
- shared inputs for resume and job-description comparison

### `M3` Skill Gap Analysis & Readiness Score

- weighted skill matching
- gap prioritization
- readiness score generation
- category and ICT coverage breakdown

### `M4` Adaptive Quiz & Assessment

- timed quizzes
- adaptive difficulty transitions
- attempt history and readiness impact

### `M7` Dashboard & Progress Analytics

- readiness summary
- category progress bars
- assessment history
- SDG reporting message

### `M5` and `M6`

These are intentionally disabled in this release but the architecture reserves them through:

- `modules.config.json`
- shared controller boundaries
- future-proof seed and analytics design

## Service boundaries

### Frontend

- React application in `client/`
- route-based UI for overview, workspace, assessment, and dashboard
- shared fetch client in `client/src/api/client.js`

### Backend

- Express API in `server/`
- MongoDB persistence via Mongoose
- route modules by feature
- central feature registration in `server/src/app.js`

### ML / NLP layer

- Python Flask service in `ml-service/`
- file text extraction
- skill catalog matching
- readiness and ICT coverage scoring

## Database model summary

### `User`

Stores:

- identity
- hashed password
- target role
- profile context
- resume text
- declared skills

### `JobRole`

Stores:

- seeded role title
- role summary
- job description
- required skills with weights

### `AnalysisSnapshot`

Stores:

- readiness score
- matched skills
- missing skills
- category breakdown
- ICT indicator coverage

### `Quiz`

Stores:

- domain
- time limit
- adaptive questions

### `AssessmentAttempt`

Stores:

- chosen answers
- adaptive trail
- score
- readiness impact

## Removability strategy

The project was built to allow easy module changes.

### Mechanism

1. Modules are defined in `modules.config.json`.
2. The backend mounts only enabled feature routes.
3. The frontend consumes the module list from `/api/meta/modules`.
4. UI content changes based on enabled modules.

### Result

- removing a module does not require rewriting unrelated screens
- future features can be added behind the same registry
- controller and route boundaries reduce coupling

## SDG 4.4 and 4.4.1 implementation logic

The synopsis specifically requires support for:

- `Target 4.4`: increase relevant employability skills
- `Indicator 4.4.1`: measure ICT skill possession

This implementation supports that through:

- job-role skill comparison
- digital skill extraction
- timed validation quizzes
- measurable readiness score
- ICT coverage calculation in the analysis result
- dashboard reporting of progress metrics


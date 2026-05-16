# SkillBridge

SkillBridge is a modular web application for personalized learning and skill gap analysis. It is built from the synopsis requirements using:

- Frontend: React, HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MongoDB
- ML / NLP service: Python

This version implements the required core modules from the synopsis:

- `M1` User Authentication & Profile
- `M2` Resume & JD Parsing
- `M3` Skill Gap Analysis & Readiness Score
- `M4` Adaptive Quiz & Assessment
- `M7` Dashboard & Progress Analytics

The following modules are intentionally left disabled but are already planned in the architecture:

- `M5` Personalised Roadmap & Recommendation
- `M6` Deadline & Re-Assessment Scheduling

## Why this matches the synopsis

The synopsis introduction centers on a clear problem: learners do not know how ready they are for a job role, they rely on scattered learning, and they need a structured and measurable pathway. This build addresses that by combining:

- learner profile capture
- resume upload and text extraction
- job-role comparison
- readiness scoring
- timed skill validation quizzes
- dashboard-based progress visibility

The system also aligns with SDG 4 Target 4.4 and Indicator 4.4.1 by measuring job-relevant digital skills through readiness scores, ICT skill coverage, and assessment trends.

## Project structure

```text
SkillBridge/
├─ client/                  React frontend
├─ server/                  Express + MongoDB API
├─ ml-service/              Python NLP / analysis service
├─ docs/                    Architecture and handover docs
├─ modules.config.json      Feature registry for removable modules
└─ README.md
```

## How modularity works

Feature control lives in `modules.config.json`.

- Backend route registration checks enabled modules in [server/src/app.js](./server/src/app.js).
- The frontend reads the same module list from `/api/meta/modules`.
- Disabled modules are hidden from the UI and not mounted on the API.

This means you can remove or add modules later with low risk:

1. Disable the module entry in `modules.config.json`.
2. Remove or replace the corresponding route, UI page, and service implementation.
3. Keep the shared contracts untouched for the rest of the app.

## Run in VS Code

Open the root folder `E:\Mern\PBL` in Visual Studio Code and use three terminals.

### 1. Backend API

```powershell
cd E:\Mern\PBL\server
copy .env.example .env
npm install
npm run dev
```

### 2. Python ML service

```powershell
cd E:\Mern\PBL\ml-service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### 3. React frontend

```powershell
cd E:\Mern\PBL\client
npm install
npm run dev
```

### 4. MongoDB

Run MongoDB locally on the default URI:

```text
mongodb://127.0.0.1:27017/skillbridge
```

If you use MongoDB Atlas or another local port, update [server/.env.example](./server/.env.example) after copying it to `.env`.

## Core workflow

1. Register or login.
2. Fill in the learner profile and target role.
3. Upload a resume or enter declared skills.
4. Pick a seeded role or paste a custom job description.
5. Run analysis to generate readiness, matched skills, and gaps.
6. Take a timed adaptive quiz.
7. Review analytics on the dashboard.

## Important implementation notes

### Resume parsing

The current build supports:

- `.pdf`
- `.docx`
- `.txt`
- `.md`

Resume extraction is handled by the Python service in [ml-service/services/text_extractor.py](./ml-service/services/text_extractor.py).

### Skill gap analysis

The current analysis engine is deterministic and modular. It uses:

- curated skill catalog matching
- role-required skill weights
- assessment-based readiness adjustments
- ICT coverage scoring for SDG reporting

You can extend the engine later with spaCy, Transformers, embeddings, or recommendation logic inside [ml-service/services/analyzer.py](./ml-service/services/analyzer.py).

### Timed assessment

The quiz is time-oriented as requested.

- There is a countdown timer.
- Question difficulty adapts based on correctness.
- Monitoring or proctoring is not implemented.

### SDG 4 alignment

The app supports SDG 4 Target 4.4 and Indicator 4.4.1 through:

- job-relevant digital skill measurement
- accessible, responsive interface
- learner-specific improvement priorities
- measurable ICT skill coverage
- evidence-based proficiency validation through assessments

## Key files to edit later

- App module registry: [modules.config.json](./modules.config.json)
- Seeded job roles: [server/src/data/jobRoles.js](./server/src/data/jobRoles.js)
- Seeded quizzes: [server/src/data/quizzes.js](./server/src/data/quizzes.js)
- Analysis engine: [ml-service/services/analyzer.py](./ml-service/services/analyzer.py)
- Frontend routes: [client/src/App.jsx](./client/src/App.jsx)
- Workspace page: [client/src/pages/WorkspacePage.jsx](./client/src/pages/WorkspacePage.jsx)
- Dashboard page: [client/src/pages/DashboardPage.jsx](./client/src/pages/DashboardPage.jsx)

## Recommended next extensions

- add module `M5` recommendation engine with curated course resources
- add module `M6` re-assessment scheduling and notifications
- introduce persistent role-specific roadmaps
- expand skill ontology and question banks
- add charts from a dedicated visualization library if needed later


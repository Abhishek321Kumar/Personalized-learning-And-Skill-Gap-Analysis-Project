# SkillBridge

SkillBridge is a modular web application for personalized learning and skill gap analysis. It is built from the synopsis requirements using:

- Frontend: React, Tailwind CSS, Vite, JavaScript
- Backend: Node.js, Express
- Database: MongoDB
- ML / NLP service: Python

This version implements the required core modules from the synopsis and features a completely redesigned user interface matching the Stitch design mocks:

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

## Step-by-Step: Run in VS Code

To run the entire SkillBridge application on your local machine using Visual Studio Code, follow these steps exactly:

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **Python** (v3.10 or higher recommended)
- **MongoDB** (running locally on port 27017, or a valid MongoDB Atlas URI)
- **VS Code**

### Step 1: Open the Project
1. Open **Visual Studio Code**.
2. Go to `File` > `Open Folder...`
3. Select the root folder: `E:\Mern\PBL`.

### Step 2: Setup MongoDB
Ensure your MongoDB service is running locally. By default, the application will look for:
`mongodb://127.0.0.1:27017/skillbridge`

*(If you are using MongoDB Atlas, you will configure this in Step 3).*

### Step 3: Run the Backend API (Terminal 1)
1. In VS Code, go to `Terminal` > `New Terminal` (or press `` Ctrl + ` ``).
2. Run the following commands to navigate to the server, install dependencies, and start it:
   ```powershell
   cd server
   copy .env.example .env
   npm install
   npm run dev
   ```
   *Note: If you are using a custom MongoDB URI, open `server/.env` and update the `MONGO_URI` before running `npm run dev`.*

   **Configuring Real Email Delivery for OTP:**
   By default, the application uses Ethereal Email (a mock testing service) which only prints a preview URL in the console. To send the 6-digit OTP code to real user inboxes, add the following to `server/.env`:
   ```env
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   ```
   *(If using Gmail, use a generated 16-character "App Password" from your Google Account Security settings).*
3. You should see a message indicating the server is running on `http://localhost:5000` and connected to MongoDB. **Leave this terminal open.**

### Step 4: Run the Python ML Service (Terminal 2)
1. In VS Code, open a **second** terminal by clicking the `+` icon in the terminal panel.
2. Run the following commands to set up the Python environment and start the service:
   ```powershell
   cd ml-service
   # Create a virtual environment
   python -m venv .venv or python -m venv .venv --without-pip
   
   # Activate the virtual environment
   .\.venv\Scripts\Activate.ps1
   
   # Install required Python packages
   pip install -r requirements.txt
   
   # Start the ML Service
   python app.py
   ```
3. You should see a message indicating the Flask service is running (usually on `http://localhost:8000`). **Leave this terminal open.**

### Step 5: Run the React Frontend (Terminal 3)
1. Open a **third** terminal by clicking the `+` icon in the terminal panel.
2. Run the following commands to start the React application:
   ```powershell
   cd client
   npm install
   npm run dev
   ```
3. The terminal will provide a local URL (e.g., `http://localhost:5173/`).
4. `Ctrl + Click` the local URL to open SkillBridge in your web browser.

You are now running the full SkillBridge stack locally!

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


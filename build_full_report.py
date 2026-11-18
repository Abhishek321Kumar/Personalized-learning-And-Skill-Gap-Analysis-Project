# -*- coding: utf-8 -*-
"""
SkillBridge Full Project Analysis & Technical Report Generator
Compiles an exhaustive 9-Chapter academic and technical report with SVG diagrams,
formulae, test matrices, and architecture breakdowns into PDF format via Headless Edge.
"""

import sys
import subprocess
from pathlib import Path

WORKSPACE = Path(r"e:\Mern\PBL_01_github")
OUTPUT_HTML = WORKSPACE / "SkillBridge_Comprehensive_Analysis_Report.html"
OUTPUT_PDF = WORKSPACE / "SkillBridge_Comprehensive_Analysis_Report.pdf"

# HTML Template with Print-Optimized CSS
html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>SkillBridge: Personalized Learning and Skill Gap Analysis Platform - Comprehensive Project Report</title>
<style>
  @page {
    size: A4 portrait;
    margin: 18mm 18mm 18mm 18mm;
    @top-center {
      content: "Personalized Learning and Skill Gap Analysis";
      font-size: 8pt;
      font-family: 'Segoe UI', Arial, sans-serif;
      color: #64748b;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
      width: 100%;
    }
    @bottom-left {
      content: "BMSITM - Department of MCA";
      font-size: 8pt;
      font-family: 'Segoe UI', Arial, sans-serif;
      color: #64748b;
    }
    @bottom-right {
      content: "Academic Year 2025-26 | Page " counter(page);
      font-size: 8pt;
      font-family: 'Segoe UI', Arial, sans-serif;
      color: #64748b;
    }
  }

  body {
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
    font-size: 10pt;
    line-height: 1.55;
    color: #1e293b;
    background-color: #ffffff;
    margin: 0;
    padding: 0;
  }

  /* Cover Page */
  .cover-page {
    page-break-after: always;
    border: 3px double #0f172a;
    padding: 30px 25px;
    height: 92%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
    box-sizing: border-box;
  }
  .cover-title {
    font-size: 20pt;
    font-weight: 800;
    color: #0f172a;
    margin-top: 15px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .cover-subtitle {
    font-size: 14pt;
    font-weight: 700;
    color: #1e40af;
    margin-top: 10px;
  }
  .cover-degree {
    font-size: 11pt;
    font-weight: 700;
    color: #334155;
    margin-top: 15px;
    letter-spacing: 1px;
  }
  .cover-univ {
    font-size: 12pt;
    font-weight: 800;
    color: #0f172a;
    margin-top: 4px;
  }
  .cover-logo-container {
    margin: 25px auto;
  }
  .cover-section-label {
    font-size: 10pt;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
  .cover-names {
    font-size: 11pt;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.6;
  }
  .cover-guide {
    font-size: 11pt;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.5;
  }
  .cover-inst-box {
    margin-top: 20px;
    border-top: 1px solid #cbd5e1;
    padding-top: 15px;
  }
  .cover-inst-name {
    font-size: 12pt;
    font-weight: 800;
    color: #0f172a;
  }
  .cover-inst-sub {
    font-size: 9.5pt;
    color: #475569;
    margin-top: 3px;
  }

  /* Academic Headers & Structure */
  .page-break {
    page-break-before: always;
  }
  .no-break {
    page-break-inside: avoid;
  }

  h1 {
    font-size: 16pt;
    font-weight: 800;
    color: #0f172a;
    border-bottom: 2px solid #2563eb;
    padding-bottom: 6px;
    margin-top: 22px;
    margin-bottom: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  h2 {
    font-size: 12.5pt;
    font-weight: 700;
    color: #1e3a8a;
    margin-top: 16px;
    margin-bottom: 8px;
    border-left: 3.5px solid #2563eb;
    padding-left: 8px;
  }
  h3 {
    font-size: 11pt;
    font-weight: 700;
    color: #0f172a;
    margin-top: 12px;
    margin-bottom: 6px;
  }
  h4 {
    font-size: 10pt;
    font-weight: 700;
    color: #334155;
    margin-top: 8px;
    margin-bottom: 4px;
  }
  p {
    margin: 0 0 8px 0;
    text-align: justify;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0 16px 0;
    font-size: 8.5pt;
    page-break-inside: avoid;
  }
  th {
    background-color: #f1f5f9;
    color: #0f172a;
    font-weight: 700;
    text-align: left;
    padding: 6px 8px;
    border: 1px solid #cbd5e1;
  }
  td {
    padding: 5.5px 8px;
    border: 1px solid #e2e8f0;
    vertical-align: top;
  }
  tr:nth-child(even) td {
    background-color: #f8fafc;
  }
  .table-caption {
    font-weight: 700;
    font-size: 9pt;
    color: #334155;
    margin-top: 10px;
    margin-bottom: 4px;
    text-align: left;
  }

  /* Callouts & Highlights */
  .badge {
    display: inline-block;
    padding: 2px 7px;
    border-radius: 4px;
    font-size: 7.5pt;
    font-weight: 700;
    text-transform: uppercase;
  }
  .badge-pass { background-color: #dcfce7; color: #15803d; }
  .badge-active { background-color: #dbeafe; color: #1d4ed8; }
  .badge-planned { background-color: #fef3c7; color: #b45309; }

  .callout-box {
    background-color: #f8fafc;
    border-left: 4px solid #2563eb;
    padding: 10px 14px;
    margin: 12px 0;
    border-radius: 0 6px 6px 0;
    font-size: 9pt;
  }
  .callout-title {
    font-weight: 700;
    color: #1e40af;
    margin-bottom: 4px;
  }

  /* Code Snippets */
  pre {
    background-color: #0f172a;
    color: #f8fafc;
    padding: 10px 12px;
    border-radius: 6px;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 8pt;
    line-height: 1.4;
    overflow-x: hidden;
    white-space: pre-wrap;
    margin: 8px 0 12px 0;
    page-break-inside: avoid;
  }
  code {
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 8.5pt;
    background-color: #f1f5f9;
    color: #0f172a;
    padding: 1px 4px;
    border-radius: 3px;
  }
  pre code {
    background-color: transparent;
    color: inherit;
    padding: 0;
  }

  /* Formula display */
  .math-formula {
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 10px 14px;
    margin: 10px 0;
    text-align: center;
    font-family: 'Times New Roman', Georgia, serif;
    font-size: 10.5pt;
    font-style: italic;
    color: #0f172a;
  }

  /* SVG Diagrams Container */
  .diagram-container {
    text-align: center;
    margin: 14px 0 18px 0;
    page-break-inside: avoid;
  }
  .diagram-caption {
    font-size: 8.5pt;
    font-weight: 700;
    color: #475569;
    margin-top: 6px;
  }

  ul, ol {
    margin: 4px 0 10px 0;
    padding-left: 20px;
  }
  li {
    margin-bottom: 4px;
  }
</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover-page">
  <div>
    <div style="font-size: 11pt; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 1px;">
      Project Based Learning Report on
    </div>
    <div class="cover-title">
      Personalized Learning and Skill Gap Analysis
    </div>
    <div class="cover-subtitle">
      (Project SkillBridge)
    </div>
    <div class="cover-degree">
      MASTER OF COMPUTER APPLICATIONS
    </div>
    <div style="font-size: 9.5pt; font-weight: 700; color: #64748b;">OF</div>
    <div class="cover-univ">
      VISVESVARAYA TECHNOLOGICAL UNIVERSITY
    </div>
    <div style="font-size: 9pt; color: #64748b;">Belagavi, Karnataka - 590018</div>
  </div>

  <div class="cover-logo-container">
    <!-- Emblem SVG -->
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="46" fill="#f8fafc" stroke="#1e3a8a" stroke-width="3"/>
      <circle cx="50" cy="50" r="38" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-dasharray="3,2"/>
      <path d="M50 18 L65 42 L35 42 Z" fill="#1e40af"/>
      <rect x="42" y="44" width="16" height="26" fill="#3b82f6" rx="2"/>
      <polygon points="50,72 38,82 62,82" fill="#1d4ed8"/>
      <circle cx="50" cy="34" r="5" fill="#fbbf24"/>
      <text x="50" y="94" font-size="6.5" font-weight="bold" text-anchor="middle" fill="#0f172a" font-family="sans-serif">BMSIT&M - VTU</text>
    </svg>
  </div>

  <div style="display: flex; justify-content: space-around; text-align: left; margin: 15px 0;">
    <div>
      <div class="cover-section-label">Submitted By:</div>
      <div class="cover-names">
        <strong>Abhishek Anil Kumar</strong> (1BY25MC004)<br>
        <strong>Salman V</strong> (1BY25MC091)<br>
        <span style="font-size: 9pt; color: #475569; font-weight: normal;">II Semester MCA</span>
      </div>
    </div>
    <div>
      <div class="cover-section-label">Under the Guidance of:</div>
      <div class="cover-guide">
        <strong>Dr. Aparna K</strong><br>
        <span style="font-size: 9pt; color: #475569; font-weight: normal;">Professor, Department of MCA</span><br>
        <span style="font-size: 9pt; color: #475569; font-weight: normal;">BMSIT&M, Bengaluru</span>
      </div>
    </div>
  </div>

  <div class="cover-inst-box">
    <div class="cover-inst-name">Department of Master of Computer Applications</div>
    <div style="font-size: 9pt; font-weight: 700; color: #1e40af; margin: 2px 0;">(Accredited by NBA, New Delhi)</div>
    <div class="cover-inst-name" style="font-size: 11pt; margin-top: 4px;">B.M.S. INSTITUTE OF TECHNOLOGY & MANAGEMENT</div>
    <div class="cover-inst-sub">
      (An Autonomous Institution affiliated to VTU, Belagavi)<br>
      Doddaballapur Main Road, Avalahalli, Yelahanka, Bengaluru – 560 064
    </div>
    <div style="font-size: 9.5pt; font-weight: 700; color: #0f172a; margin-top: 6px;">July - 2026</div>
  </div>
</div>

<!-- INSTITUTIONAL VISION, MISSION, PEOS & POS -->
<div class="page-break"></div>
<h1>Institutional Profile & Outcomes Framework</h1>

<h2>BMS Institute of Technology & Management - Vision & Mission</h2>
<div class="callout-box">
  <div class="callout-title">Department Vision</div>
  <p>To emerge as a leading department in computer applications, producing skilled professionals equipped to deliver sustainable solutions.</p>
</div>
<div class="callout-box">
  <div class="callout-title">Department Mission</div>
  <p>Facilitate an effective learning environment through quality education, industry interaction with orientation towards research, critical thinking, and entrepreneurial skills.</p>
</div>

<h2>Programme Educational Objectives (PEOs)</h2>
<ul>
  <li><strong>PEO 1:</strong> Excel in IT career by developing sustainable solutions that drive industry growth and societal progress.</li>
  <li><strong>PEO 2:</strong> Adapt themselves to evolving domain requirements and emerging technological standards.</li>
  <li><strong>PEO 3:</strong> Exhibit leadership skills and progress in their chosen career path through lifelong self-directed learning.</li>
</ul>

<h2>Programme Outcomes (POs) Alignment</h2>
<table>
  <tr>
    <th style="width: 14%;">PO Code</th>
    <th style="width: 46%;">Programme Outcome Description</th>
    <th style="width: 40%;">SkillBridge PBL Demonstration</th>
  </tr>
  <tr>
    <td><strong>PO 1</strong></td>
    <td>Apply knowledge of mathematics, programming logic and coding fundamentals for solution architecture and problem solving.</td>
    <td>Implemented weighted graph readiness scoring algorithms, logarithmic dynamic difficulty adjustment, and MERN + Python service architecture.</td>
  </tr>
  <tr>
    <td><strong>PO 2</strong></td>
    <td>Identify, review, formulate and analyse problems focusing on customer requirements using critical thinking frameworks.</td>
    <td>Diagnosed the core industry gap in candidate readiness evaluation; formulated automated parsing and validated competency scoring.</td>
  </tr>
  <tr>
    <td><strong>PO 3</strong></td>
    <td>Design, develop and investigate problems with an innovative approach incorporating ESG/SDG goals.</td>
    <td>Directly integrated <strong>UN SDG 4 (Target 4.4, Indicator 4.4.1)</strong> with automated digital skill quantification and progress tracking.</td>
  </tr>
  <tr>
    <td><strong>PO 4</strong></td>
    <td>Select, adapt and apply modern computational tools such as development of algorithms understanding limitations & human biases.</td>
    <td>Employed custom regex NLP alias parsing, adaptive question engines, and in-memory multi-stage resume document processing.</td>
  </tr>
  <tr>
    <td><strong>PO 5</strong></td>
    <td>Function and communicate effectively as an individual or team leader in diverse groups using agile methodologies.</td>
    <td>Executed two-month sprint cycle with modular feature-flag gating, decoupled Git workflows, and collaborative subsystem development.</td>
  </tr>
  <tr>
    <td><strong>PO 6</strong></td>
    <td>Use principles of project management (scheduling, WBS, financial efficiency) for profitable project management.</td>
    <td>Formulated 4-phase Work Breakdown Structure (WBS), Gantt milestone tracking, and zero-cost cloud operational feasibility.</td>
  </tr>
  <tr>
    <td><strong>PO 7</strong></td>
    <td>Commit to professional ethics in software projects with financial aspects; learn cybersecurity and insulate from malware.</td>
    <td>Applied stateless cryptographically signed JWT auth (7-day expiry), bcrypt password salting (10 rounds), memory-only file processing to prevent shell injection.</td>
  </tr>
  <tr>
    <td><strong>PO 8</strong></td>
    <td>Change management skills and the ability to learn, keep up with contemporary technologies and ways of working.</td>
    <td>Transitioned modern full-stack ecosystem: React 19 SPA, Tailwind CSS 4, Node.js ES modules, and Python Flask NLP microservice.</td>
  </tr>
</table>

<!-- EXECUTIVE SUMMARY / ABSTRACT -->
<div class="page-break"></div>
<h1>Abstract & Executive Summary</h1>
<div style="background-color: #f1f5f9; border-left: 4px solid #0f172a; padding: 14px; border-radius: 4px; margin-bottom: 16px;">
  <p><strong>SkillBridge</strong> is an advanced, full-stack web application designed to eliminate subjectivity in career readiness by systematically benchmarking a learner's empirical skills against targeted job role requirements. Built upon a loosely coupled three-tier microservice architecture—combining a <strong>React 19 + Tailwind CSS</strong> presentation layer, a <strong>Node.js + Express + MongoDB</strong> application gateway, and an independent <strong>Python 3 + Flask</strong> natural language processing (NLP) microservice—the platform delivers an end-to-end evaluation pipeline.</p>
  <p>The platform introduces an empirical <strong>Readiness Scoring Algorithm (0–100)</strong> that integrates multi-factor weighting, curriculum categorization, and a novel <em>competency penalty mechanism</em>: candidate claims extracted via NLP resume parsing are systematically verified through timed, adaptive multiple-choice assessments. If a candidate scores below 50% on a claimed skill, a 25% weight penalty is applied, preventing credential inflation. The system features a centralized JSON feature-flag registry (<code>modules.config.json</code>) governing five operational modules (M1 Auth & Profile, M2 Parsing, M3 Gap Analysis, M4 Adaptive Quiz, M7 Dashboard) and establishing scalable extension points for M5 (Personalized Roadmaps) and M6 (Re-Assessment Scheduling).</p>
  <p>Furthermore, SkillBridge directly advances <strong>United Nations Sustainable Development Goal 4 (Quality Education)</strong>, particularly <strong>Target 4.4 and Indicator 4.4.1</strong>, by computing quantifiable ICT skill coverage metrics across each learner cohort. Rigorous testing across unit, integration, and 20 system test cases validates sub-second response times, secure stateless session integrity, and dynamic difficulty adjustment.</p>
</div>

<p><strong>Keywords:</strong> Skill Gap Analysis, Natural Language Processing, Resume Parsing, Readiness Score, Adaptive Assessment Engine, MERN Stack, Python Flask Microservice, Feature Flags, SDG 4.4.1, Educational Technology.</p>

<!-- TABLE OF CONTENTS -->
<div class="page-break"></div>
<h1>Table of Contents</h1>
<table>
  <tr><th>No.</th><th>Chapter Title & Subsections</th><th>Page</th></tr>
  <tr><td><strong>1</strong></td><td><strong>INTRODUCTION</strong><br>&nbsp;&nbsp;1.1 Project Description<br>&nbsp;&nbsp;1.1.1 Why Personalized Learning & Skill Gap Analysis<br>&nbsp;&nbsp;1.1.2 Motivation & Industry Relevance<br>&nbsp;&nbsp;1.2 Objectives of the Project<br>&nbsp;&nbsp;1.3 Institutional Profile & PBL Framework<br>&nbsp;&nbsp;1.4 Project Planning — Work Breakdown Structure (WBS) & Gantt Chart</td><td>1<br>1<br>2<br>2<br>3<br>3<br>4</td></tr>
  <tr><td><strong>2</strong></td><td><strong>LITERATURE SURVEY & FEASIBILITY STUDY</strong><br>&nbsp;&nbsp;2.1 Existing Systems vs. SkillBridge Proposed Solution<br>&nbsp;&nbsp;2.2 Multi-Dimensional Feasibility Study (Technical, Operational, Economic)<br>&nbsp;&nbsp;2.3 Tools and Technologies Used (Tech Stack Matrix)<br>&nbsp;&nbsp;2.4 Hardware and Software Operating Specifications</td><td>5<br>5<br>6<br>7<br>8</td></tr>
  <tr><td><strong>3</strong></td><td><strong>SOFTWARE REQUIREMENTS SPECIFICATION (SRS)</strong><br>&nbsp;&nbsp;3.1 Users and Stakeholders<br>&nbsp;&nbsp;3.1.1 Scope and Objective<br>&nbsp;&nbsp;3.1.2 Assumptions and Dependencies<br>&nbsp;&nbsp;3.2 Functional Requirements (M1 to M7 Breakdown)<br>&nbsp;&nbsp;3.3 Non-Functional Requirements (Security, Performance, Reliability, Usability)</td><td>9<br>9<br>9<br>10<br>11</td></tr>
  <tr><td><strong>4</strong></td><td><strong>SYSTEM DESIGN & ARCHITECTURAL BLUEPRINT</strong><br>&nbsp;&nbsp;4.1 Three-Tier Microservice Architecture & Port Allocation<br>&nbsp;&nbsp;4.2 System Perspective & Separation of Concerns<br>&nbsp;&nbsp;4.3 Modular Feature-Flag Architecture (<code>modules.config.json</code>)<br>&nbsp;&nbsp;4.4 Context Diagram (Level-0 DFD)<br>&nbsp;&nbsp;4.5 Layer Communication Model & Protocol Contracts</td><td>12<br>12<br>13<br>14<br>15<br>16</td></tr>
  <tr><td><strong>5</strong></td><td><strong>DETAILED DESIGN & FORMAL UML MODELS</strong><br>&nbsp;&nbsp;5.1 Level-1 Data Flow Diagram (DFD - 5 Processes & 6 Data Stores)<br>&nbsp;&nbsp;5.2 Entity Relationship (ER) Diagram & Schema Specifications<br>&nbsp;&nbsp;5.3 Activity Diagram (End-to-End User Journey Flowchart)<br>&nbsp;&nbsp;5.4 Use Case Diagram (20 Use Cases Across 5 Active Modules)<br>&nbsp;&nbsp;5.5 Sequence Diagram (Skill Gap Analysis & Readiness Scoring Workflow)</td><td>17<br>17<br>18<br>20<br>21<br>22</td></tr>
  <tr><td><strong>6</strong></td><td><strong>SYSTEM IMPLEMENTATION & ALGORITHMIC ANALYSIS</strong><br>&nbsp;&nbsp;6.1 M3 - Readiness Scoring Algorithm & Mathematical Derivation<br>&nbsp;&nbsp;6.2 M4 - Adaptive Quiz Engine & Dynamic Difficulty State Machine<br>&nbsp;&nbsp;6.3 M1 - Authentication, Progressive Staging & OTP Engine<br>&nbsp;&nbsp;6.4 M2 - Multi-Format Resume Parsing & Heuristic Text Extraction Pipeline<br>&nbsp;&nbsp;6.5 User Interface Implementation & System Screenshots</td><td>23<br>23<br>24<br>25<br>26<br>27</td></tr>
  <tr><td><strong>7</strong></td><td><strong>VERIFICATION & SOFTWARE TESTING</strong><br>&nbsp;&nbsp;7.1 Unit Testing Results (M3 Algorithm, M1 Auth, M2 Extraction)<br>&nbsp;&nbsp;7.2 Integration and End-to-End System Testing<br>&nbsp;&nbsp;7.3 Full Functional Test Cases Matrix (20 Rigorous Test Cases)</td><td>29<br>29<br>31<br>32</td></tr>
  <tr><td><strong>8</strong></td><td><strong>CONCLUSION & FUTURE SCOPE</strong><br>&nbsp;&nbsp;8.1 Research & Engineering Findings<br>&nbsp;&nbsp;8.2 Strategic Future Scope (M5, M6, BERT NLP, OAuth 2.0, Admin UI)</td><td>34<br>34<br>35</td></tr>
  <tr><td><strong>9</strong></td><td><strong>BIBLIOGRAPHY & STANDARDS</strong></td><td>36</td></tr>
  <tr><td><strong>A</strong></td><td><strong>APPENDIX A: SUSTAINABLE DEVELOPMENT GOALS (SDG 4 & SDG 8 COMPLIANCE)</strong></td><td>37</td></tr>
  <tr><td><strong>B</strong></td><td><strong>APPENDIX B: PLAGIARISM & ORIGINALITY DECLARATION</strong></td><td>39</td></tr>
</table>

<!-- LIST OF FIGURES & TABLES -->
<div class="page-break"></div>
<h1>List of Figures & Tables</h1>
<div style="display: flex; gap: 20px;">
  <div style="flex: 1;">
    <h3>List of Figures</h3>
    <table>
      <tr><th>Figure</th><th>Title</th><th>Page</th></tr>
      <tr><td>Fig 1.1</td><td>Gantt Chart - SkillBridge Project WBS</td><td>4</td></tr>
      <tr><td>Fig 4.1</td><td>Three-Tier System Architecture Diagram</td><td>13</td></tr>
      <tr><td>Fig 4.2</td><td>Layered Communication Perspective</td><td>15</td></tr>
      <tr><td>Fig 4.3</td><td>Context Diagram (Level-0 DFD)</td><td>16</td></tr>
      <tr><td>Fig 5.1</td><td>Level-1 Data Flow Diagram (5 Processes)</td><td>17</td></tr>
      <tr><td>Fig 5.2</td><td>Entity Relationship Diagram (ER Model)</td><td>19</td></tr>
      <tr><td>Fig 5.3</td><td>Activity Diagram — End-to-End User Journey</td><td>20</td></tr>
      <tr><td>Fig 5.4</td><td>Use Case Diagram (20 Functional Scenarios)</td><td>21</td></tr>
      <tr><td>Fig 5.5</td><td>Sequence Diagram — Gap Analysis Workflow</td><td>22</td></tr>
      <tr><td>Fig 6.1</td><td>System Screenshot: Multi-Step Registration</td><td>27</td></tr>
      <tr><td>Fig 6.2</td><td>System Screenshot: 6-Digit OTP Verification</td><td>27</td></tr>
      <tr><td>Fig 6.3</td><td>System Screenshot: Adaptive Quiz Interface</td><td>28</td></tr>
      <tr><td>Fig 6.4</td><td>System Screenshot: Progress Dashboard</td><td>28</td></tr>
      <tr><td>Fig 6.5</td><td>System Screenshot: Skill Gap Analysis View</td><td>28</td></tr>
    </table>
  </div>
  <div style="flex: 1;">
    <h3>List of Tables</h3>
    <table>
      <tr><th>Table</th><th>Title</th><th>Page</th></tr>
      <tr><td>Table 1.1</td><td>Week-Wise Work Breakdown Structure</td><td>4</td></tr>
      <tr><td>Table 2.1</td><td>Existing Systems and Their Limitations</td><td>5</td></tr>
      <tr><td>Table 2.2</td><td>SkillBridge Differentiating Innovations</td><td>6</td></tr>
      <tr><td>Table 2.3</td><td>Comprehensive Technology Stack Matrix</td><td>7</td></tr>
      <tr><td>Table 2.4</td><td>Hardware Operating Specifications</td><td>8</td></tr>
      <tr><td>Table 2.5</td><td>Software Runtime Requirements</td><td>8</td></tr>
      <tr><td>Table 3.1</td><td>Functional Requirements by Module</td><td>10</td></tr>
      <tr><td>Table 3.2</td><td>Non-Functional Requirements Matrix</td><td>11</td></tr>
      <tr><td>Table 4.1</td><td>Three-Tier Microservice Topology</td><td>12</td></tr>
      <tr><td>Table 4.2</td><td>Inter-Layer Communication Protocol</td><td>14</td></tr>
      <tr><td>Table 4.3</td><td>Feature-Flag Module Registry</td><td>14</td></tr>
      <tr><td>Table 7.1</td><td>Unit Test Results: M3 Readiness Algorithm</td><td>29</td></tr>
      <tr><td>Table 7.2</td><td>Unit Test Results: M1 Authentication</td><td>30</td></tr>
      <tr><td>Table 7.3</td><td>Unit Test Results: M2 Skill Extraction</td><td>30</td></tr>
      <tr><td>Table 7.4</td><td>Integration Test Scenarios (IT-01 to 06)</td><td>31</td></tr>
      <tr><td>Table 7.5</td><td>Full Functional Test Cases (TC-01 to 20)</td><td>32</td></tr>
    </table>
  </div>
</div>

<!-- CHAPTER 1: INTRODUCTION -->
<div class="page-break"></div>
<h1>1. Introduction</h1>

<h2>1.1 Project Description</h2>
<p>In modern computing and enterprise software engineering, recruitment environments and industry role benchmarks evolve at an extraordinary pace. Employers demand highly specialized, cross-functional competencies spanning frontend engineering, scalable backend microservices, cloud-native deployments, and machine intelligence. Despite this, students, fresh graduates, and transitioning software engineers face acute difficulty in objectively assessing their employability for specific job roles. Traditional preparation remains largely fragmented, characterized by aimless browsing of online course catalogs, unguided tutorials, and speculative resume keyword matching.</p>
<p><strong>SkillBridge</strong> is an advanced full-stack web application conceived and developed to solve this systemic challenge. By bridging resume intelligence, job description benchmarking, and adaptive psychometric assessments into an integrated ecosystem, SkillBridge transforms career readiness from an ambiguous guessing game into an empirical, data-driven science. The platform parses candidate resumes, extracts structured skill signals via natural language processing, compares them against curated or custom job requirements, calculates a multi-dimensional <strong>Readiness Score (0–100)</strong>, and systematically tests competency through adaptive assessments.</p>

<h2>1.1.1 Why Personalized Learning & Skill Gap Analysis?</h2>
<p>Conventional higher education curricula are broad and deliberate, often lagging behind rapid industry tooling cycles. While universities build sound theoretical foundations, candidates frequently struggle to translate their coursework into specific industry-ready competencies. Three fundamental bottlenecks motivate the SkillBridge architecture:</p>
<ul>
  <li><strong>Invisibility of Preparedness:</strong> Learners cannot accurately quantify their degree of preparation for a targeted role (e.g., Full-Stack Engineer, Data Scientist, UX Designer).</li>
  <li><strong>Skill Fragmentation:</strong> Existing educational portals offer isolated courses but fail to provide an end-to-end diagnostic roadmap mapping a student's present capability to actual job role requirements.</li>
  <li><strong>Unverified Resume Claims:</strong> Resumes routinely list buzzwords and self-proclaimed skills without objective verification, creating friction in hiring and false confidence for learners.</li>
</ul>
<p>SkillBridge directly addresses these issues by extracting technical capabilities from candidate resumes, mathematically computing the distance to target industry profiles, and actively challenging claimed competencies via timed adaptive assessments.</p>

<h2>1.1.2 Motivation</h2>
<p>This project is motivated by the critical need to align academic computer application curricula with empirical industry demand. Specifically, SkillBridge demonstrates direct alignment with <strong>United Nations Sustainable Development Goal 4 (SDG 4 – Quality Education)</strong>, Target 4.4, which mandates substantially increasing the number of youth and adults with relevant digital skills for employment and entrepreneurship. Developed as part of the MCA curriculum at BMSIT&M, SkillBridge showcases rigorous full-stack engineering, microservice separation, algorithm design, and data governance.</p>

<h2>1.2 Objectives</h2>
<p>The primary engineering and functional objectives of SkillBridge are:</p>
<ol>
  <li><strong>Full-Stack Architecture:</strong> Construct a modular, responsive web platform utilizing React 19, Node.js, Express, MongoDB, and Python Flask.</li>
  <li><strong>NLP Document Parsing:</strong> Engineer an intelligent extraction pipeline capable of parsing PDF, DOCX, TXT, and MD resumes into normalized text and extracting canonical technical skills via alias-based regex mapping.</li>
  <li><strong>Empirical Readiness Scoring:</strong> Formulate a mathematical scoring engine calculating a 0–100 Readiness Score with confidence bands (Emerging, Progressing, Advanced) and an automated assessment penalty mechanism.</li>
  <li><strong>Adaptive Assessment Engine:</strong> Develop a dynamic quiz engine that adjusts question difficulty (easy, medium, hard) in real time based on candidate accuracy.</li>
  <li><strong>Analytics & Visualizations:</strong> Provide interactive radar charts, readiness trend lines, and ATS resume structural feedback on a personalized learner dashboard.</li>
  <li><strong>SDG 4 Compliance:</strong> Quantify learner ICT skill coverage according to UNESCO SDG Indicator 4.4.1.</li>
  <li><strong>Feature-Flag Modularity:</strong> Implement a runtime configuration registry (<code>modules.config.json</code>) enabling zero-downtime activation or isolation of system modules.</li>
  <li><strong>Robust Security & Integrity:</strong> Deploy stateless cryptographically signed JWT sessions, bcrypt password hashing (10 salt rounds), and multi-step OTP email verification.</li>
</ol>

<h2>1.3 Institutional Profile</h2>
<p><strong>B.M.S. Institute of Technology & Management (BMSIT&M)</strong>, established under the esteemed BMS Educational Trust, is an autonomous premier engineering institution located in Bengaluru, Karnataka, affiliated with Visvesvaraya Technological University (VTU), Belagavi. The Department of Master of Computer Applications (MCA) is accredited by NBA, New Delhi, and focuses on delivering an outcome-based curriculum emphasizing software architecture, distributed computing, database management, and intelligent systems. The Project Based Learning (PBL) initiative bridges academic knowledge and production-grade engineering standards.</p>

<h2>1.4 Project Planning — Work Breakdown Structure (WBS) & Gantt Chart</h2>
<p>The development lifecycle was organized across an 8-week iterative agile roadmap divided into four distinct phases:</p>

<div class="table-caption">Table 1.1: Week-Wise Work Breakdown Structure</div>
<table>
  <tr><th>Phase</th><th>Work Breakdown / Core Activities</th><th>Duration</th><th>Deliverables & Milestone</th></tr>
  <tr>
    <td><strong>Phase 1</strong></td>
    <td>Requirement analysis, SRS formulation, database schema design, and modular microservice architecture definition.</td>
    <td>Week 1–2</td>
    <td>Architecture finalized, ER model approved, repositories structured.</td>
  </tr>
  <tr>
    <td><strong>Phase 2</strong></td>
    <td>Core module engineering: M1 (Auth & Staging), M2 (Resume Parsing), M3 (Readiness Algorithm in Flask), and Mongoose ODM integration.</td>
    <td>Week 3–5</td>
    <td>End-to-end skill extraction and gap analysis pipeline operational.</td>
  </tr>
  <tr>
    <td><strong>Phase 3</strong></td>
    <td>Adaptive Quiz engine (M4) implementation, stateful difficulty transitions, timer auto-submit, and M7 Dashboard analytics.</td>
    <td>Week 5–7</td>
    <td>Full module integration, frontend dashboard visualizations connected.</td>
  </tr>
  <tr>
    <td><strong>Phase 4</strong></td>
    <td>Unit testing (Jest/Python unittest), Postman API testing, 20 test case execution, UI refinement, and comprehensive project documentation.</td>
    <td>Week 7–8</td>
    <td>Test verification matrix completed; final academic report compiled.</td>
  </tr>
</table>

<div class="diagram-container">
  <div class="table-caption">Figure 1.1: Gantt Chart — SkillBridge 8-Week Project Execution Roadmap</div>
  <svg width="100%" height="150" viewBox="0 0 720 150">
    <rect x="0" y="0" width="720" height="150" fill="#f8fafc" rx="6" stroke="#cbd5e1"/>
    <!-- Weeks Header -->
    <text x="140" y="20" font-size="8.5" font-weight="bold" fill="#475569">Wk 1</text>
    <text x="210" y="20" font-size="8.5" font-weight="bold" fill="#475569">Wk 2</text>
    <text x="280" y="20" font-size="8.5" font-weight="bold" fill="#475569">Wk 3</text>
    <text x="350" y="20" font-size="8.5" font-weight="bold" fill="#475569">Wk 4</text>
    <text x="420" y="20" font-size="8.5" font-weight="bold" fill="#475569">Wk 5</text>
    <text x="490" y="20" font-size="8.5" font-weight="bold" fill="#475569">Wk 6</text>
    <text x="560" y="20" font-size="8.5" font-weight="bold" fill="#475569">Wk 7</text>
    <text x="630" y="20" font-size="8.5" font-weight="bold" fill="#475569">Wk 8</text>
    <line x1="120" y1="28" x2="690" y2="28" stroke="#cbd5e1" stroke-width="1"/>

    <!-- Phase 1 Bar -->
    <text x="10" y="46" font-size="8.5" font-weight="bold" fill="#0f172a">Phase 1: Design & Arch</text>
    <rect x="120" y="36" width="140" height="15" fill="#3b82f6" rx="3"/>

    <!-- Phase 2 Bar -->
    <text x="10" y="73" font-size="8.5" font-weight="bold" fill="#0f172a">Phase 2: M1, M2, M3 Core</text>
    <rect x="260" y="63" width="210" height="15" fill="#2563eb" rx="3"/>

    <!-- Phase 3 Bar -->
    <text x="10" y="100" font-size="8.5" font-weight="bold" fill="#0f172a">Phase 3: M4 Quiz & M7 Dash</text>
    <rect x="400" y="90" width="210" height="15" fill="#1d4ed8" rx="3"/>

    <!-- Phase 4 Bar -->
    <text x="10" y="127" font-size="8.5" font-weight="bold" fill="#0f172a">Phase 4: Testing & Report</text>
    <rect x="540" y="117" width="140" height="15" fill="#0f172a" rx="3"/>
  </svg>
</div>

<!-- CHAPTER 2: LITERATURE SURVEY & FEASIBILITY -->
<div class="page-break"></div>
<h1>2. Literature Survey & Feasibility Study</h1>

<h2>2.1 Existing Systems vs. SkillBridge Proposed Solution</h2>
<p>While existing recruitment and learning management platforms offer isolated services, none integrate end-to-end resume extraction, empirical gap measurement, and competency validation into a unified, actionable loop.</p>

<div class="table-caption">Table 2.1: Comparison of Existing Systems and Their Inherent Limitations</div>
<table>
  <tr><th>Platform / Product</th><th>Primary Capabilities</th><th>Identified Deficiencies & Limitations</th></tr>
  <tr>
    <td><strong>LinkedIn Learning</strong></td>
    <td>Delivers high-quality role-based courses and career path recommendations.</td>
    <td>No automated resume parsing; no quantitative readiness score (0–100); lacks dynamic proficiency testing.</td>
  </tr>
  <tr>
    <td><strong>Coursera / Udemy</strong></td>
    <td>Provides extensive topic-based catalogs from global universities and instructors.</td>
    <td>No candidate skill-gap analysis; courses are suggested based on search history rather than diagnostic testing.</td>
  </tr>
  <tr>
    <td><strong>HackerRank</strong></td>
    <td>Rigorous technical coding challenges, leaderboards, and timed skill certifications.</td>
    <td>Strictly restricted to algorithmic syntax; no full-stack resume analysis or comprehensive role readiness mapping.</td>
  </tr>
  <tr>
    <td><strong>Indeed / Seek Skills</strong></td>
    <td>Job portal skill tagging and candidate profile endorsements.</td>
    <td>Endorsements are completely self-reported without verification; lack comparison scoring engines.</td>
  </tr>
  <tr>
    <td><strong>ResumeWorded / VMock</strong></td>
    <td>Automated ATS keyword scoring and resume formatting feedback.</td>
    <td>No skill validation assessments; no role-specific readiness weighting; no adaptive quizzing.</td>
  </tr>
</table>

<div class="table-caption">Table 2.2: Differentiating Innovations Introduced by SkillBridge</div>
<table>
  <tr><th>System Dimension</th><th>Traditional EdTech & Job Portals</th><th>SkillBridge Approach</th></tr>
  <tr>
    <td><strong>Resume Ingestion</strong></td>
    <td>Manual form filling or superficial text regex.</td>
    <td>Multi-format parsing (PDF, DOCX, TXT, MD) with NLP alias normalization and location heuristics.</td>
  </tr>
  <tr>
    <td><strong>Job Role Benchmarking</strong></td>
    <td>Static, unweighted role titles.</td>
    <td>Dual-mode analysis: seeded industry profiles or custom free-text job description parsing with weightings.</td>
  </tr>
  <tr>
    <td><strong>Readiness Scoring</strong></td>
    <td>Binary presence/absence checklists or percentage tags.</td>
    <td>Weighted mathematical formulation (0–100) combining match ratios, quiz bonuses, and confidence bands.</td>
  </tr>
  <tr>
    <td><strong>Proficiency Verification</strong></td>
    <td>None; assumes resume claims are 100% accurate.</td>
    <td>Adaptive multiple-choice testing applying a <strong>25% penalty</strong> to false claims scoring below 50%.</td>
  </tr>
  <tr>
    <td><strong>System Governance</strong></td>
    <td>Monolithic, tightly coupled hard-coded features.</td>
    <td>JSON-driven feature flag registry (<code>modules.config.json</code>) enabling modular activation and zero downtime.</td>
  </tr>
</table>

<h2>2.2 Multi-Dimensional Feasibility Study</h2>
<h3>2.2.1 Technical Feasibility</h3>
<p>The SkillBridge architecture leverages established, production-tested open-source frameworks. The client utilizes React 19 and Vite for instantaneous HMR and client-side routing. The application tier uses Node.js with Express, leveraging non-blocking asynchronous event loops. Heavy text parsing and scoring algorithms are delegated to a dedicated Python 3 Flask microservice, preventing thread pool starvation in the Node runtime. Because the NLP engine utilizes an optimized canonical alias dictionary rather than massive multi-gigabyte neural networks, the entire stack runs smoothly on commodity hardware without requiring expensive GPUs.</p>

<h3>2.2.2 Operational Feasibility</h3>
<p>SkillBridge is engineered with high usability for both non-technical learners and academic administrators. For learners, a 4-step progressive onboarding workflow automatically extracts information from their resumes to populate form fields, reducing cognitive fatigue. For administrators, platform behavior—including feature activation and module disabling—is controlled via a single JSON configuration file (<code>modules.config.json</code>), eliminating the need for code refactoring or recompilation.</p>

<h3>2.2.3 Economic Feasibility</h3>
<p>SkillBridge uses 100% free and open-source software (FOSS). Database services can run locally or via MongoDB Atlas's free M0 tier. Hosting can be achieved on cloud platforms such as Render, AWS EC2 t3.micro, or Vercel at zero licensing overhead. This ensures the project remains economically sustainable for educational institutions while maintaining a frictionless pathway to commercial scaling.</p>

<h2>2.3 Tools and Technologies Used</h2>
<div class="table-caption">Table 2.3: Comprehensive Technology Stack Matrix for SkillBridge</div>
<table>
  <tr><th>Architecture Layer</th><th>Technology / Framework</th><th>Version</th><th>Function in SkillBridge Ecosystem</th></tr>
  <tr><td><strong>Presentation Tier</strong></td><td>React.js (SPA)</td><td>^19.0.0</td><td>Component-driven reactive user interface, state management, and hooks.</td></tr>
  <tr><td><strong>Build Tooling</strong></td><td>Vite</td><td>^6.2.1</td><td>Next-generation frontend tooling, Lightning CSS bundling, and fast HMR.</td></tr>
  <tr><td><strong>Styling & Design</strong></td><td>Tailwind CSS</td><td>^4.3.0</td><td>Utility-first responsive layout engine, typography, and dark-theme tokens.</td></tr>
  <tr><td><strong>UI Motion</strong></td><td>Framer Motion</td><td>^12.40.0</td><td>Declarative page transitions, modal animations, and progress bar tweening.</td></tr>
  <tr><td><strong>Client Routing</strong></td><td>React Router DOM</td><td>^7.3.0</td><td>Client-side route navigation, nested layouts, and protected route guards.</td></tr>
  <tr><td><strong>Application Tier</strong></td><td>Node.js Runtime</td><td>v18+</td><td>High-throughput asynchronous server runtime environment.</td></tr>
  <tr><td><strong>API Framework</strong></td><td>Express.js</td><td>^4.21.2</td><td>RESTful API endpoints, request routing, error handling, and middleware pipeline.</td></tr>
  <tr><td><strong>Session Security</strong></td><td>JSON Web Token (JWT)</td><td>^9.0.2</td><td>Stateless cryptographically signed Bearer authentication tokens (7-day expiry).</td></tr>
  <tr><td><strong>Data Modeling</strong></td><td>Mongoose ODM</td><td>^8.12.1</td><td>Strict schema definitions, validations, references, and population helpers.</td></tr>
  <tr><td><strong>File Handling</strong></td><td>Multer & pdf-parse</td><td>^2.1.1</td><td>In-memory multipart form-data processing and buffer-based PDF text extraction.</td></tr>
  <tr><td><strong>NLP Microservice</strong></td><td>Python / Flask</td><td>3.1.0</td><td>Dedicated REST service for document extraction, alias matching, and scoring.</td></tr>
  <tr><td><strong>Document Parsers</strong></td><td>pypdf & python-docx</td><td>5.4 / 1.1</td><td>Format-appropriate byte stream extractors for PDF and Microsoft Word resumes.</td></tr>
  <tr><td><strong>Data Tier</strong></td><td>MongoDB</td><td>v6.0+</td><td>NoSQL flexible document store for user profiles, quizzes, and snapshots.</td></tr>
</table>

<h2>2.4 Hardware and Software Operating Specifications</h2>
<div style="display: flex; gap: 15px;">
  <div style="flex: 1;">
    <div class="table-caption">Table 2.4: Minimum & Recommended Hardware</div>
    <table>
      <tr><th>Hardware Component</th><th>Minimum Specification</th></tr>
      <tr><td><strong>Processor</strong></td><td>Intel Core i5 / AMD Ryzen 5 (2.0 GHz+)</td></tr>
      <tr><td><strong>System RAM</strong></td><td>8 GB (16 GB recommended)</td></tr>
      <tr><td><strong>Disk Storage</strong></td><td>10 GB available SSD space</td></tr>
      <tr><td><strong>Network</strong></td><td>Broadband internet connection</td></tr>
    </table>
  </div>
  <div style="flex: 1;">
    <div class="table-caption">Table 2.5: Software Operating Environment</div>
    <table>
      <tr><th>Software Environment</th><th>Supported Versions</th></tr>
      <tr><td><strong>Operating System</strong></td><td>Windows 10/11, macOS Sonoma+, Linux Ubuntu 22+</td></tr>
      <tr><td><strong>Node.js / npm</strong></td><td>Node.js 18.x or 20.x LTS, npm 9+</td></tr>
      <tr><td><strong>Python Environment</strong></td><td>Python 3.10, 3.11, or 3.14 with virtualenv</td></tr>
      <tr><td><strong>Web Browser</strong></td><td>Chrome 110+, Edge 110+, Firefox 110+</td></tr>
    </table>
  </div>
</div>

<!-- CHAPTER 3: SOFTWARE REQUIREMENTS SPECIFICATION -->
<div class="page-break"></div>
<h1>3. Software Requirements Specification (SRS)</h1>

<h2>3.1 Users and Stakeholders</h2>
<p>The SkillBridge platform supports two primary classes of actors:</p>
<ul>
  <li><strong>Learner / Student (Primary User):</strong> Registers an account, uploads their resume, configures academic history, selects a target job role, initiates skill gap analysis, completes adaptive quizzes, and tracks their readiness score on the dashboard.</li>
  <li><strong>System Administrator (Secondary User / Governance):</strong> Seeds new job roles, updates assessment question banks, monitors institutional cohort progress, and dynamically activates or deactivates modules via <code>modules.config.json</code>.</li>
</ul>

<h3>3.1.1 Scope and System Boundaries</h3>
<p>The operational implementation covers five production-ready modules: <strong>M1 (User Authentication & Profile)</strong>, <strong>M2 (Resume & JD Parsing)</strong>, <strong>M3 (Skill Gap Analysis & Readiness Scoring)</strong>, <strong>M4 (Adaptive Quiz Engine)</strong>, and <strong>M7 (Dashboard & Progress Analytics)</strong>. Two extension modules—<strong>M5 (Personalised Roadmap Recommendations)</strong> and <strong>M6 (Re-Assessment Scheduling)</strong>—along with a visual Admin UI, represent planned extension points.</p>

<h3>3.1.2 Assumptions and Dependencies</h3>
<ul>
  <li>Users possess an active, valid email address accessible during 6-digit OTP verification.</li>
  <li>MongoDB daemon is running on port 27017 or reachable via a cloud connection string.</li>
  <li>Python Flask microservice is active on port 8000/8001 to handle NLP extraction and scoring requests.</li>
  <li>Uploaded documents are in standard PDF, DOCX, TXT, or MD formats containing selectable text.</li>
  <li>Curriculum criteria and job specifications are presented in the English language.</li>
</ul>

<h2>3.2 Functional Requirements</h2>
<div class="table-caption">Table 3.1: Detailed Functional Requirements Specification by Module</div>
<table>
  <tr><th style="width: 14%;">Req ID</th><th style="width: 20%;">Module Name</th><th style="width: 66%;">Requirement Description & Acceptance Criteria</th></tr>
  <tr>
    <td><strong>FR-1.1</strong></td>
    <td>M1: Auth & Profile</td>
    <td>The system shall validate candidate name (alphabetic), email format, and password strength (min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char) during initial registration.</td>
  </tr>
  <tr>
    <td><strong>FR-1.2</strong></td>
    <td>M1: Auth & Profile</td>
    <td>The system shall stage registration data in a temporary <code>PendingUser</code> collection with a 1-hour TTL and transmit a 6-digit OTP valid for 10 minutes to the user's email.</td>
  </tr>
  <tr>
    <td><strong>FR-1.3</strong></td>
    <td>M1: Auth & Profile</td>
    <td>Upon correct OTP verification, the user shall be migrated to the permanent <code>User</code> collection, and a signed JWT token with a 7-day expiration shall be returned.</td>
  </tr>
  <tr>
    <td><strong>FR-1.4</strong></td>
    <td>M1: Auth & Profile</td>
    <td>If a user closes or cancels the registration wizard midway, the system shall execute an asynchronous cleanup beacon deleting the pending registration record.</td>
  </tr>
  <tr>
    <td><strong>FR-2.1</strong></td>
    <td>M2: Resume & JD Parsing</td>
    <td>The system shall accept PDF and DOCX uploads up to 5MB, extract text in memory, and parse contact info, education (UG/PG), CGPA, graduation dates, and internship records.</td>
  </tr>
  <tr>
    <td><strong>FR-2.2</strong></td>
    <td>M2: Resume & JD Parsing</td>
    <td>The system shall match extracted resume text against a curated dictionary of canonical skills and aliases (e.g., 'js' / 'ecmascript' &rarr; 'JavaScript').</td>
  </tr>
  <tr>
    <td><strong>FR-3.1</strong></td>
    <td>M3: Gap Analysis</td>
    <td>The system shall compute a weighted <strong>Readiness Score (0–100)</strong> by comparing candidate capabilities with required skills for a target job role.</td>
  </tr>
  <tr>
    <td><strong>FR-3.2</strong></td>
    <td>M3: Gap Analysis</td>
    <td>The system shall apply a <strong>25% penalty</strong> to any matched skill where the candidate scored below 50% on the corresponding assessment signal.</td>
  </tr>
  <tr>
    <td><strong>FR-3.3</strong></td>
    <td>M3: Gap Analysis</td>
    <td>The system shall classify learners into confidence bands: <strong>Advanced</strong> (&ge;75), <strong>Progressing</strong> (50–74), and <strong>Emerging</strong> (&lt;50).</td>
  </tr>
  <tr>
    <td><strong>FR-3.4</strong></td>
    <td>M3: Gap Analysis</td>
    <td>The system shall evaluate resume quality across four 100-point rubric dimensions: Keyword Optimization (30), Structure (25), Readability (25), and Relevance (20).</td>
  </tr>
  <tr>
    <td><strong>FR-4.1</strong></td>
    <td>M4: Adaptive Quiz</td>
    <td>The system shall dynamically adjust question difficulty based on accuracy: a correct answer escalates difficulty (easy &rarr; medium &rarr; hard), while an incorrect answer de-escalates difficulty.</td>
  </tr>
  <tr>
    <td><strong>FR-4.2</strong></td>
    <td>M4: Adaptive Quiz</td>
    <td>The quiz session shall enforce a countdown timer and automatically submit partial answers if the timer reaches zero.</td>
  </tr>
  <tr>
    <td><strong>FR-7.1</strong></td>
    <td>M7: Dashboard</td>
    <td>The dashboard shall display the latest Readiness Score, confidence band, top missing skills, and category-level coverage bar charts.</td>
  </tr>
  <tr>
    <td><strong>FR-7.2</strong></td>
    <td>M7: Dashboard</td>
    <td>The dashboard shall render historical readiness trends across successive analysis runs and calculate UNESCO SDG 4.4.1 ICT coverage metrics.</td>
  </tr>
</table>

<h2>3.3 Non-Functional Requirements</h2>
<div class="table-caption">Table 3.2: Non-Functional Engineering Quality Attributes</div>
<table>
  <tr><th>ID</th><th>Attribute</th><th>Quality Benchmark & Verification Mechanism</th></tr>
  <tr>
    <td><strong>NFR-1</strong></td>
    <td><strong>Performance</strong></td>
    <td>Resume parsing and skill gap analysis shall execute in under 3.5 seconds for standard resumes up to 5MB.</td>
  </tr>
  <tr>
    <td><strong>NFR-2</strong></td>
    <td><strong>Security</strong></td>
    <td>All private endpoints shall require cryptographically signed Bearer JWT tokens. Passwords shall be salted with bcrypt (10 rounds). Uploaded files shall be processed in memory to eliminate malware execution.</td>
  </tr>
  <tr>
    <td><strong>NFR-3</strong></td>
    <td><strong>Reliability</strong></td>
    <td>The backend shall handle concurrent requests without database locking using Mongoose connection pooling and stateless API routes.</td>
  </tr>
  <tr>
    <td><strong>NFR-4</strong></td>
    <td><strong>Usability</strong></td>
    <td>The user interface shall be fully responsive across mobile (320px), tablet, and desktop viewports, with accessible WCAG AA color contrast.</td>
  </tr>
  <tr>
    <td><strong>NFR-5</strong></td>
    <td><strong>Maintainability</strong></td>
    <td>Individual system modules shall be toggleable at runtime via <code>modules.config.json</code> without requiring code modifications or server reboots.</td>
  </tr>
  <tr>
    <td><strong>NFR-6</strong></td>
    <td><strong>Extensibility</strong></td>
    <td>The system shall expose clean REST API contracts allowing seamless integration of future microservices (e.g., BullMQ schedulers, LLM recommenders).</td>
  </tr>
</table>

<!-- CHAPTER 4: SYSTEM DESIGN -->
<div class="page-break"></div>
<h1>4. System Design & Architectural Blueprint</h1>

<h2>4.1 Three-Tier Microservice Architecture</h2>
<p>SkillBridge is engineered around a clean, decoupled three-tier microservice model. The presentation layer, application gateway, computation microservice, and database communicate via standard REST interfaces using JSON payloads.</p>

<div class="table-caption">Table 4.1: Three-Tier Microservice Topology & Port Mapping</div>
<table>
  <tr><th>Tier</th><th>Component</th><th>Technology Stack</th><th>Port</th><th>Primary Architectural Responsibility</th></tr>
  <tr>
    <td><strong>Client Tier</strong></td>
    <td>Single Page App (SPA)</td>
    <td>React 19, Vite 6, Tailwind CSS 4, Framer Motion</td>
    <td>5173</td>
    <td>User interaction, client-side route guarding, dynamic form validation, and reactive dashboard visualization.</td>
  </tr>
  <tr>
    <td><strong>API Gateway</strong></td>
    <td>Core REST Backend</td>
    <td>Node.js 18+, Express 4, JWT, Multer, Nodemailer</td>
    <td>5000</td>
    <td>Stateless API routing, JWT session verification, progressive onboarding, OTP management, and MongoDB transaction coordination.</td>
  </tr>
  <tr>
    <td><strong>Computation Tier</strong></td>
    <td>NLP Microservice</td>
    <td>Python 3.10+, Flask 3.1, pypdf, python-docx</td>
    <td>8000</td>
    <td>Document text extraction, regex canonical skill matching, weighted gap analysis, and penalty calculation.</td>
  </tr>
  <tr>
    <td><strong>Data Tier</strong></td>
    <td>Document Database</td>
    <td>MongoDB 6+, Mongoose ODM 8</td>
    <td>27017</td>
    <td>Persistent storage for users, pending staging records, job roles, quizzes, attempts, and analysis snapshots.</td>
  </tr>
</table>

<div class="diagram-container">
  <div class="table-caption">Figure 4.1: Three-Tier Microservice System Architecture Diagram</div>
  <svg width="100%" height="240" viewBox="0 0 720 240">
    <rect x="0" y="0" width="720" height="240" fill="#f8fafc" rx="8" stroke="#cbd5e1"/>

    <!-- Client Box -->
    <rect x="30" y="40" width="160" height="150" fill="#eff6ff" stroke="#3b82f6" stroke-width="2" rx="6"/>
    <text x="110" y="65" font-size="10" font-weight="bold" fill="#1e3a8a" text-anchor="middle">PRESENTATION TIER</text>
    <text x="110" y="85" font-size="9" font-weight="bold" fill="#0f172a" text-anchor="middle">React 19 SPA (Vite)</text>
    <text x="110" y="105" font-size="8" fill="#475569" text-anchor="middle">Tailwind CSS 4 + Framer</text>
    <text x="110" y="125" font-size="8" fill="#475569" text-anchor="middle">Port 5173</text>
    <rect x="50" y="145" width="120" height="25" fill="#3b82f6" rx="4"/>
    <text x="110" y="161" font-size="8.5" font-weight="bold" fill="#ffffff" text-anchor="middle">Learner Browser</text>

    <!-- Arrow Client -> Server -->
    <path d="M 190 115 L 260 115" stroke="#2563eb" stroke-width="2" marker-end="url(#arrow)"/>
    <text x="225" y="105" font-size="7" font-weight="bold" fill="#1e40af" text-anchor="middle">REST / JWT</text>

    <!-- Server Box -->
    <rect x="270" y="30" width="180" height="170" fill="#f0fdf4" stroke="#22c55e" stroke-width="2" rx="6"/>
    <text x="360" y="55" font-size="10" font-weight="bold" fill="#14532d" text-anchor="middle">APPLICATION GATEWAY</text>
    <text x="360" y="75" font-size="9" font-weight="bold" fill="#0f172a" text-anchor="middle">Node.js + Express 4</text>
    <text x="360" y="95" font-size="8" fill="#475569" text-anchor="middle">JWT Auth + Multer Buffer</text>
    <text x="360" y="115" font-size="8" fill="#475569" text-anchor="middle">Feature Flag Router (M1-M7)</text>
    <text x="360" y="135" font-size="8" fill="#475569" text-anchor="middle">Port 5000</text>
    <rect x="290" y="150" width="140" height="25" fill="#22c55e" rx="4"/>
    <text x="360" y="166" font-size="8.5" font-weight="bold" fill="#ffffff" text-anchor="middle">Business Logic & Auth</text>

    <!-- Arrow Server -> ML Service -->
    <path d="M 450 85 L 520 85" stroke="#0f172a" stroke-width="1.5"/>
    <text x="485" y="75" font-size="7" font-weight="bold" fill="#475569" text-anchor="middle">HTTP POST</text>

    <!-- ML Service Box -->
    <rect x="530" y="30" width="160" height="85" fill="#fefce8" stroke="#eab308" stroke-width="2" rx="6"/>
    <text x="610" y="50" font-size="9" font-weight="bold" fill="#713f12" text-anchor="middle">NLP COMPUTATION</text>
    <text x="610" y="68" font-size="8.5" font-weight="bold" fill="#0f172a" text-anchor="middle">Python 3 + Flask 3</text>
    <text x="610" y="85" font-size="7.5" fill="#475569" text-anchor="middle">Alias Matching & Scoring</text>
    <text x="610" y="100" font-size="7.5" fill="#475569" text-anchor="middle">Port 8000 / 8001</text>

    <!-- Arrow Server -> DB -->
    <path d="M 450 155 L 520 155" stroke="#0f172a" stroke-width="1.5"/>
    <text x="485" y="145" font-size="7" font-weight="bold" fill="#475569" text-anchor="middle">Mongoose</text>

    <!-- Database Box -->
    <rect x="530" y="125" width="160" height="75" fill="#f8fafc" stroke="#64748b" stroke-width="2" rx="6"/>
    <text x="610" y="145" font-size="9" font-weight="bold" fill="#0f172a" text-anchor="middle">DATA STORAGE</text>
    <text x="610" y="165" font-size="8.5" font-weight="bold" fill="#0f172a" text-anchor="middle">MongoDB (NoSQL)</text>
    <text x="610" y="182" font-size="7.5" fill="#475569" text-anchor="middle">Port 27017 | BSON Docs</text>
  </svg>
</div>

<h2>4.2 System Perspective & Separation of Concerns</h2>
<p>Each service in the SkillBridge ecosystem operates under strict architectural boundaries:</p>
<ul>
  <li><strong>Presentation Layer:</strong> Restricted to rendering state, capturing user inputs, executing client-side form validations, and consuming JSON APIs. It holds no business calculation logic.</li>
  <li><strong>API Gateway Layer:</strong> Acts as the system orchestrator. It verifies user authorization, checks feature flag availability, executes database operations, and dispatches compute-heavy tasks to downstream microservices.</li>
  <li><strong>Computation Layer:</strong> Completely stateless. The Python Flask service receives JSON payloads containing resume text and job requirements, executes parsing and scoring heuristics, and returns structured analysis results without direct database access.</li>
  <li><strong>Data Layer:</strong> Encapsulates data persistence and schema constraints via Mongoose schemas, providing TTL indexing for temporary staging collections and relationship integrity.</li>
</ul>

<h2>4.3 Modular Feature-Flag Architecture</h2>
<p>SkillBridge incorporates an enterprise feature-flag pattern managed by <code>modules.config.json</code>. The API gateway evaluates module availability during route registration. If a module is disabled, the corresponding endpoints return an immediate HTTP 503 or 404, and the React client automatically hides associated navigation elements.</p>

<div class="table-caption">Table 4.3: Feature-Flag Module Registry (<code>modules.config.json</code>)</div>
<table>
  <tr><th>Code</th><th>Slug Identifier</th><th>Module Name</th><th>Status</th><th>Architectural Description</th></tr>
  <tr><td><strong>M1</strong></td><td><code>auth-profile</code></td><td>User Authentication & Profile</td><td><span class="badge badge-pass">ENABLED</span></td><td>Registration, OTP verification, login, profile management, and resume upload.</td></tr>
  <tr><td><strong>M2</strong></td><td><code>resume-jd-parsing</code></td><td>Resume & JD Parsing</td><td><span class="badge badge-pass">ENABLED</span></td><td>Extracts text signals, contact info, and technical skills from documents.</td></tr>
  <tr><td><strong>M3</strong></td><td><code>skill-gap-analysis</code></td><td>Skill Gap Analysis & Scoring</td><td><span class="badge badge-pass">ENABLED</span></td><td>Calculates 0–100 Readiness Score, confidence bands, and penalty deductions.</td></tr>
  <tr><td><strong>M4</strong></td><td><code>adaptive-quiz</code></td><td>Adaptive Quiz & Assessment</td><td><span class="badge badge-pass">ENABLED</span></td><td>Runs timed dynamic difficulty assessments validating claimed competencies.</td></tr>
  <tr><td><strong>M5</strong></td><td><code>roadmap-recommendation</code></td><td>Personalised Roadmap Pathways</td><td><span class="badge badge-planned">PLANNED</span></td><td>Future extension point for curated courses, videos, and milestone pacing.</td></tr>
  <tr><td><strong>M6</strong></td><td><code>reassessment-scheduling</code></td><td>Re-Assessment Scheduling</td><td><span class="badge badge-planned">PLANNED</span></td><td>Future extension point for BullMQ milestone reminders and progress loops.</td></tr>
  <tr><td><strong>M7</strong></td><td><code>dashboard-analytics</code></td><td>Dashboard & Progress Analytics</td><td><span class="badge badge-pass">ENABLED</span></td><td>Visualizes readiness trends, category coverage, and SDG 4.4.1 metrics.</td></tr>
</table>

<h2>4.4 Context Diagram (Level-0 DFD)</h2>
<p>The Level-0 Context Diagram establishes the operational boundary of the SkillBridge system, identifying all external entities and their associated data flows.</p>

<div class="diagram-container">
  <div class="table-caption">Figure 4.3: Context Diagram (Level-0 Data Flow Diagram)</div>
  <svg width="100%" height="210" viewBox="0 0 720 210">
    <rect x="0" y="0" width="720" height="210" fill="#f8fafc" rx="6" stroke="#cbd5e1"/>

    <!-- Central Process -->
    <circle cx="360" cy="105" r="55" fill="#eff6ff" stroke="#2563eb" stroke-width="2.5"/>
    <text x="360" y="100" font-size="10" font-weight="bold" fill="#1e3a8a" text-anchor="middle">0.0</text>
    <text x="360" y="115" font-size="9" font-weight="bold" fill="#0f172a" text-anchor="middle">SkillBridge Platform</text>
    <text x="360" y="128" font-size="7.5" fill="#64748b" text-anchor="middle">(Core System)</text>

    <!-- Entity: Learner -->
    <rect x="30" y="75" width="120" height="60" fill="#ffffff" stroke="#0f172a" stroke-width="1.5" rx="4"/>
    <text x="90" y="100" font-size="9.5" font-weight="bold" fill="#0f172a" text-anchor="middle">Learner / Student</text>
    <text x="90" y="115" font-size="7.5" fill="#64748b" text-anchor="middle">(External Entity)</text>

    <!-- Entity: SMTP -->
    <rect x="300" y="10" width="120" height="40" fill="#ffffff" stroke="#0f172a" stroke-width="1.5" rx="4"/>
    <text x="360" y="28" font-size="8.5" font-weight="bold" fill="#0f172a" text-anchor="middle">Email Service (SMTP)</text>
    <text x="360" y="40" font-size="7" fill="#64748b" text-anchor="middle">(OTP Dispatcher)</text>

    <!-- Entity: Python NLP -->
    <rect x="570" y="75" width="120" height="60" fill="#ffffff" stroke="#0f172a" stroke-width="1.5" rx="4"/>
    <text x="630" y="100" font-size="9" font-weight="bold" fill="#0f172a" text-anchor="middle">Python NLP Engine</text>
    <text x="630" y="115" font-size="7.5" fill="#64748b" text-anchor="middle">(External Microservice)</text>

    <!-- Entity: MongoDB Storage -->
    <rect x="300" y="160" width="120" height="40" fill="#ffffff" stroke="#0f172a" stroke-width="1.5" rx="4"/>
    <text x="360" y="178" font-size="8.5" font-weight="bold" fill="#0f172a" text-anchor="middle">Database (MongoDB)</text>
    <text x="360" y="190" font-size="7" fill="#64748b" text-anchor="middle">(External Data Store)</text>

    <!-- Flows -->
    <line x1="150" y1="95" x2="305" y2="95" stroke="#2563eb" stroke-width="1.5"/>
    <text x="220" y="88" font-size="7" fill="#1e40af" text-anchor="middle">Credentials, Resume, Answers &rarr;</text>

    <line x1="305" y1="115" x2="150" y2="115" stroke="#2563eb" stroke-width="1.5"/>
    <text x="220" y="128" font-size="7" fill="#1e40af" text-anchor="middle">&larr; Readiness Score, Reports</text>

    <line x1="360" y1="50" x2="360" y2="60" stroke="#0f172a" stroke-width="1.5"/>
    <line x1="415" y1="105" x2="570" y2="105" stroke="#0f172a" stroke-width="1.5"/>
    <text x="492" y="98" font-size="7" fill="#475569" text-anchor="middle">Raw Text &rarr;</text>
    <text x="492" y="118" font-size="7" fill="#475569" text-anchor="middle">&larr; Parsed Skills</text>

    <line x1="360" y1="150" x2="360" y2="160" stroke="#0f172a" stroke-width="1.5"/>
  </svg>
</div>

<!-- CHAPTER 5: DETAILED DESIGN & FORMAL UML MODELS -->
<div class="page-break"></div>
<h1>5. Detailed Design & Formal UML Models</h1>

<h2>5.1 Level-1 Data Flow Diagram (DFD)</h2>
<p>The Level-1 DFD breaks down the SkillBridge core process into five distinct sub-processes and maps their interactions with six persistent data stores.</p>

<div class="diagram-container">
  <div class="table-caption">Figure 5.1: Level-1 Data Flow Diagram (Processes P1–P5 and Data Stores D1–D6)</div>
  <svg width="100%" height="260" viewBox="0 0 720 260">
    <rect x="0" y="0" width="720" height="260" fill="#f8fafc" rx="8" stroke="#cbd5e1"/>

    <!-- Process 1.0 -->
    <rect x="30" y="30" width="130" height="50" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5" rx="6"/>
    <text x="95" y="52" font-size="8.5" font-weight="bold" fill="#1e3a8a" text-anchor="middle">1.0 Authentication</text>
    <text x="95" y="66" font-size="7.5" fill="#475569" text-anchor="middle">& OTP Verification</text>

    <!-- Process 2.0 -->
    <rect x="200" y="30" width="130" height="50" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5" rx="6"/>
    <text x="265" y="52" font-size="8.5" font-weight="bold" fill="#1e3a8a" text-anchor="middle">2.0 Resume Parsing</text>
    <text x="265" y="66" font-size="7.5" fill="#475569" text-anchor="middle">& Profile Extraction</text>

    <!-- Process 3.0 -->
    <rect x="370" y="30" width="140" height="50" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5" rx="6"/>
    <text x="440" y="52" font-size="8.5" font-weight="bold" fill="#1e3a8a" text-anchor="middle">3.0 Skill Gap Analysis</text>
    <text x="440" y="66" font-size="7.5" fill="#475569" text-anchor="middle">& Scoring Engine</text>

    <!-- Process 4.0 -->
    <rect x="550" y="30" width="140" height="50" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5" rx="6"/>
    <text x="620" y="52" font-size="8.5" font-weight="bold" fill="#1e3a8a" text-anchor="middle">4.0 Adaptive Quiz</text>
    <text x="620" y="66" font-size="7.5" fill="#475569" text-anchor="middle">& Assessment Engine</text>

    <!-- Process 5.0 -->
    <rect x="280" y="180" width="160" height="55" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5" rx="6"/>
    <text x="360" y="205" font-size="9" font-weight="bold" fill="#1e3a8a" text-anchor="middle">5.0 Progress Dashboard</text>
    <text x="360" y="220" font-size="7.5" fill="#475569" text-anchor="middle">& Analytics Visualizer</text>

    <!-- Data Stores (D1 to D6) -->
    <!-- D1 Users -->
    <path d="M 50 110 L 150 110 M 50 135 L 150 135" stroke="#0f172a" stroke-width="2"/>
    <text x="100" y="126" font-size="8" font-weight="bold" fill="#0f172a" text-anchor="middle">D1: Users</text>

    <!-- D2 Job Roles -->
    <path d="M 210 110 L 310 110 M 210 135 L 310 135" stroke="#0f172a" stroke-width="2"/>
    <text x="260" y="126" font-size="8" font-weight="bold" fill="#0f172a" text-anchor="middle">D2: Job Roles</text>

    <!-- D3 Snapshots -->
    <path d="M 370 110 L 490 110 M 370 135 L 490 135" stroke="#0f172a" stroke-width="2"/>
    <text x="430" y="126" font-size="8" font-weight="bold" fill="#0f172a" text-anchor="middle">D3: Snapshots</text>

    <!-- D4 Quizzes -->
    <path d="M 570 110 L 670 110 M 570 135 L 670 135" stroke="#0f172a" stroke-width="2"/>
    <text x="620" y="126" font-size="8" font-weight="bold" fill="#0f172a" text-anchor="middle">D4: Quizzes</text>

    <!-- Connecting Lines -->
    <line x1="95" y1="80" x2="95" y2="110" stroke="#64748b" stroke-width="1.5"/>
    <line x1="265" y1="80" x2="265" y2="110" stroke="#64748b" stroke-width="1.5"/>
    <line x1="440" y1="80" x2="440" y2="110" stroke="#64748b" stroke-width="1.5"/>
    <line x1="620" y1="80" x2="620" y2="110" stroke="#64748b" stroke-width="1.5"/>

    <line x1="430" y1="135" x2="380" y2="180" stroke="#64748b" stroke-width="1.5"/>
    <line x1="620" y1="135" x2="420" y2="180" stroke="#64748b" stroke-width="1.5"/>
    <line x1="100" y1="135" x2="300" y2="180" stroke="#64748b" stroke-width="1.5"/>
  </svg>
</div>

<h2>5.2 Data Model & Entity Relationship (ER) Diagram</h2>
<p>The SkillBridge database architecture is structured around five core collections in MongoDB, modeled via Mongoose ODM schemas:</p>
<ul>
  <li><strong>User (Strong Entity):</strong> Stores persistent credentials, contact demographics, nested educational milestones, parsed resume text, and declared skills.</li>
  <li><strong>PendingUser (Staging Entity):</strong> Temporary holding collection with a 1-hour MongoDB TTL index, storing staged registrations awaiting OTP validation.</li>
  <li><strong>JobRole (Strong Entity):</strong> Stores target occupation definitions, domain categorizations, job description text, and weighted required skill arrays.</li>
  <li><strong>Quiz (Strong Entity):</strong> Contains assessment metadata, time limits, total question counts, and embedded question banks categorized into easy, medium, and hard tiers.</li>
  <li><strong>AssessmentAttempt (Associative Entity):</strong> Records candidate quiz sessions, timestamped start/completion records, adaptive difficulty trails, and question-level responses.</li>
  <li><strong>AnalysisSnapshot (Identifying Weak Entity):</strong> Generated per analysis run. Captures empirical readiness scores, match percentages, matched/missing skill arrays, ATS resume scores, and UNESCO SDG 4.4.1 coverage indicators.</li>
</ul>

<div class="diagram-container">
  <div class="table-caption">Figure 5.2: Entity Relationship Diagram (ER Model)</div>
  <svg width="100%" height="240" viewBox="0 0 720 240">
    <rect x="0" y="0" width="720" height="240" fill="#f8fafc" rx="8" stroke="#cbd5e1"/>

    <!-- USER Box -->
    <rect x="30" y="80" width="130" height="80" fill="#ffffff" stroke="#1e3a8a" stroke-width="2" rx="4"/>
    <text x="95" y="105" font-size="10" font-weight="bold" fill="#1e3a8a" text-anchor="middle">USER</text>
    <text x="95" y="125" font-size="7.5" fill="#475569" text-anchor="middle">_id (PK), email, name</text>
    <text x="95" y="140" font-size="7.5" fill="#475569" text-anchor="middle">passwordHash, resumeText</text>
    <text x="95" y="152" font-size="7" fill="#16a34a" text-anchor="middle">&bull; Strong Entity</text>

    <!-- Relationship: Targets -->
    <polygon points="230,70 260,90 230,110 200,90" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
    <text x="230" y="93" font-size="7.5" font-weight="bold" fill="#1e40af" text-anchor="middle">TARGETS</text>
    <line x1="160" y1="100" x2="200" y2="90" stroke="#0f172a" stroke-width="1.5"/>
    <text x="180" y="92" font-size="7" fill="#475569">N</text>

    <!-- JOB_ROLE Box -->
    <rect x="310" y="50" width="140" height="75" fill="#ffffff" stroke="#0f172a" stroke-width="1.5" rx="4"/>
    <text x="380" y="72" font-size="9.5" font-weight="bold" fill="#0f172a" text-anchor="middle">JOB_ROLE</text>
    <text x="380" y="90" font-size="7.5" fill="#475569" text-anchor="middle">_id (PK), title, domain</text>
    <text x="380" y="105" font-size="7.5" fill="#475569" text-anchor="middle">requiredSkills [{name, weight}]</text>

    <line x1="260" y1="90" x2="310" y2="90" stroke="#0f172a" stroke-width="1.5"/>
    <text x="285" y="85" font-size="7" fill="#475569">1</text>

    <!-- Relationship: Generates -->
    <polygon points="230,150 260,170 230,190 200,170" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
    <text x="230" y="173" font-size="7" font-weight="bold" fill="#1e40af" text-anchor="middle">GENERATES</text>
    <line x1="160" y1="140" x2="200" y2="170" stroke="#0f172a" stroke-width="1.5"/>
    <text x="180" y="152" font-size="7" fill="#475569">1</text>

    <!-- ANALYSIS_SNAPSHOT Box -->
    <rect x="310" y="145" width="150" height="80" fill="#ffffff" stroke="#dc2626" stroke-width="2" rx="4"/>
    <text x="385" y="167" font-size="9.5" font-weight="bold" fill="#dc2626" text-anchor="middle">ANALYSIS_SNAPSHOT</text>
    <text x="385" y="185" font-size="7.5" fill="#475569" text-anchor="middle">_id (PK), userId (FK), score</text>
    <text x="385" y="198" font-size="7.5" fill="#475569" text-anchor="middle">matchedSkills, ictIndicator</text>
    <text x="385" y="210" font-size="7" fill="#dc2626" text-anchor="middle">&bull; Weak / Identifying</text>

    <line x1="260" y1="170" x2="310" y2="170" stroke="#0f172a" stroke-width="1.5"/>
    <text x="285" y="165" font-size="7" fill="#475569">N</text>

    <!-- QUIZ Box -->
    <rect x="560" y="50" width="130" height="75" fill="#ffffff" stroke="#0f172a" stroke-width="1.5" rx="4"/>
    <text x="625" y="72" font-size="9.5" font-weight="bold" fill="#0f172a" text-anchor="middle">QUIZ</text>
    <text x="625" y="90" font-size="7.5" fill="#475569" text-anchor="middle">_id (PK), title, domain</text>
    <text x="625" y="105" font-size="7.5" fill="#475569" text-anchor="middle">questions [{prompt, diff}]</text>

    <!-- Relationship: Takes -->
    <polygon points="505,150 535,170 505,190 475,170" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
    <text x="505" y="173" font-size="7.5" font-weight="bold" fill="#1e40af" text-anchor="middle">TAKES</text>

    <!-- ASSESSMENT_ATTEMPT Box -->
    <rect x="555" y="145" width="145" height="80" fill="#ffffff" stroke="#0f172a" stroke-width="1.5" rx="4"/>
    <text x="627" y="167" font-size="9.5" font-weight="bold" fill="#0f172a" text-anchor="middle">ASSESSMENT_ATTEMPT</text>
    <text x="627" y="185" font-size="7.5" fill="#475569" text-anchor="middle">_id (PK), userId, quizId</text>
    <text x="627" y="198" font-size="7.5" fill="#475569" text-anchor="middle">score, adaptiveTrail []</text>
  </svg>
</div>

<h2>5.3 Activity Diagram — End-to-End User Journey</h2>
<p>The activity model describes the complete learner workflow, from landing page onboarding to profile extraction, gap evaluation, adaptive validation, and dashboard exploration.</p>

<div class="diagram-container">
  <div class="table-caption">Figure 5.3: Activity Diagram — End-to-End User Journey through SkillBridge</div>
  <svg width="100%" height="260" viewBox="0 0 720 260">
    <rect x="0" y="0" width="720" height="260" fill="#f8fafc" rx="8" stroke="#cbd5e1"/>

    <!-- Nodes -->
    <circle cx="50" cy="130" r="12" fill="#0f172a"/>
    <text x="50" y="155" font-size="7.5" font-weight="bold" fill="#0f172a" text-anchor="middle">Start</text>

    <rect x="90" y="110" width="80" height="40" fill="#ffffff" stroke="#2563eb" stroke-width="1.5" rx="6"/>
    <text x="130" y="127" font-size="7.5" font-weight="bold" fill="#0f172a" text-anchor="middle">Register &</text>
    <text x="130" y="139" font-size="7.5" fill="#0f172a" text-anchor="middle">Create Account</text>

    <rect x="195" y="110" width="75" height="40" fill="#ffffff" stroke="#2563eb" stroke-width="1.5" rx="6"/>
    <text x="232" y="127" font-size="7.5" font-weight="bold" fill="#0f172a" text-anchor="middle">Upload Resume</text>
    <text x="232" y="139" font-size="7.5" fill="#0f172a" text-anchor="middle">& Profile Info</text>

    <rect x="295" y="110" width="75" height="40" fill="#ffffff" stroke="#2563eb" stroke-width="1.5" rx="6"/>
    <text x="332" y="127" font-size="7.5" font-weight="bold" fill="#0f172a" text-anchor="middle">Verify 6-Digit</text>
    <text x="332" y="139" font-size="7.5" fill="#0f172a" text-anchor="middle">Email OTP</text>

    <polygon points="415,115 435,130 415,145 395,130" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
    <text x="415" y="133" font-size="6.5" font-weight="bold" fill="#b45309" text-anchor="middle">Valid?</text>

    <rect x="455" y="110" width="85" height="40" fill="#ffffff" stroke="#2563eb" stroke-width="1.5" rx="6"/>
    <text x="497" y="127" font-size="7.5" font-weight="bold" fill="#0f172a" text-anchor="middle">Select Role &</text>
    <text x="497" y="139" font-size="7.5" fill="#0f172a" text-anchor="middle">Run Gap Analysis</text>

    <rect x="565" y="60" width="95" height="45" fill="#eff6ff" stroke="#1d4ed8" stroke-width="1.5" rx="6"/>
    <text x="612" y="78" font-size="7.5" font-weight="bold" fill="#1e3a8a" text-anchor="middle">Take Adaptive Quiz</text>
    <text x="612" y="90" font-size="7" fill="#475569" text-anchor="middle">(Dynamic Difficulty)</text>

    <rect x="565" y="160" width="95" height="45" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5" rx="6"/>
    <text x="612" y="178" font-size="7.5" font-weight="bold" fill="#14532d" text-anchor="middle">View Dashboard</text>
    <text x="612" y="190" font-size="7" fill="#475569" text-anchor="middle">& Readiness Score</text>

    <circle cx="690" cy="182" r="10" fill="none" stroke="#0f172a" stroke-width="2"/>
    <circle cx="690" cy="182" r="6" fill="#0f172a"/>

    <!-- Flow Arrows -->
    <line x1="62" y1="130" x2="90" y2="130" stroke="#0f172a" stroke-width="1.5"/>
    <line x1="170" y1="130" x2="195" y2="130" stroke="#0f172a" stroke-width="1.5"/>
    <line x1="270" y1="130" x2="295" y2="130" stroke="#0f172a" stroke-width="1.5"/>
    <line x1="370" y1="130" x2="395" y2="130" stroke="#0f172a" stroke-width="1.5"/>
    <line x1="435" y1="130" x2="455" y2="130" stroke="#0f172a" stroke-width="1.5"/>

    <path d="M 540 120 L 565 85" stroke="#0f172a" stroke-width="1.5"/>
    <path d="M 612 105 L 612 160" stroke="#0f172a" stroke-width="1.5"/>
    <line x1="660" y1="182" x2="680" y2="182" stroke="#0f172a" stroke-width="1.5"/>

    <!-- Rejection loop for invalid OTP -->
    <path d="M 415 115 L 415 80 L 332 80 L 332 110" fill="none" stroke="#dc2626" stroke-width="1.2" stroke-dasharray="2,2"/>
    <text x="375" y="74" font-size="6.5" fill="#dc2626">Invalid OTP</text>
  </svg>
</div>

<h2>5.4 Use Case Model (20 Functional Scenarios)</h2>
<p>The use case model spans twenty concrete functional interactions across the five active system modules:</p>
<ul>
  <li><strong>Authentication & Onboarding (M1):</strong> <code>UC-01</code> Account Creation, <code>UC-02</code> 6-Digit Email OTP Verification, <code>UC-03</code> JWT Secure Login, <code>UC-04</code> Unload Abandonment Cleanup.</li>
  <li><strong>Profile & Resume Management (M1/M2):</strong> <code>UC-05</code> Resume File Upload (PDF/DOCX), <code>UC-06</code> Heuristic Profile Extraction, <code>UC-07</code> Manual Profile & Skill Declaration, <code>UC-08</code> Account Deletion.</li>
  <li><strong>Skill Gap Analysis (M3):</strong> <code>UC-09</code> Target Job Role Selection, <code>UC-10</code> Custom Job Description Parsing, <code>UC-11</code> Trigger Readiness Scoring, <code>UC-12</code> ATS Resume Structure Evaluation.</li>
  <li><strong>Adaptive Assessment (M4):</strong> <code>UC-13</code> Browse Assessment Catalog, <code>UC-14</code> Initialize Adaptive Quiz Session, <code>UC-15</code> Submit Answer & Trigger Difficulty Adjustment, <code>UC-16</code> Timeout Auto-Submission, <code>UC-17</code> Instant Post-Quiz Review.</li>
  <li><strong>Analytics & Dashboard (M7):</strong> <code>UC-18</code> View Latest Readiness & Confidence Band, <code>UC-19</code> Track Historical Readiness Trend, <code>UC-20</code> Monitor SDG 4.4.1 ICT Skill Coverage.</li>
</ul>

<h2>5.5 Sequence Diagram — Gap Analysis & Readiness Scoring Workflow</h2>
<p>The sequence model illustrates the exact synchronous request/response cycle when a learner initiates a skill gap analysis:</p>

<div class="diagram-container">
  <div class="table-caption">Figure 5.5: Sequence Diagram — Inter-Service Gap Analysis & Scoring Cycle</div>
  <svg width="100%" height="240" viewBox="0 0 720 240">
    <rect x="0" y="0" width="720" height="240" fill="#f8fafc" rx="8" stroke="#cbd5e1"/>

    <!-- Lifeline Headers -->
    <rect x="40" y="20" width="80" height="25" fill="#ffffff" stroke="#0f172a" rx="4"/>
    <text x="80" y="36" font-size="8" font-weight="bold" fill="#0f172a" text-anchor="middle">Learner (UI)</text>

    <rect x="180" y="20" width="100" height="25" fill="#eff6ff" stroke="#2563eb" rx="4"/>
    <text x="230" y="36" font-size="8" font-weight="bold" fill="#1e3a8a" text-anchor="middle">Node.js API</text>

    <rect x="360" y="20" width="100" height="25" fill="#fefce8" stroke="#d97706" rx="4"/>
    <text x="410" y="36" font-size="8" font-weight="bold" fill="#713f12" text-anchor="middle">Python Flask ML</text>

    <rect x="540" y="20" width="90" height="25" fill="#f0fdf4" stroke="#16a34a" rx="4"/>
    <text x="585" y="36" font-size="8" font-weight="bold" fill="#14532d" text-anchor="middle">MongoDB</text>

    <!-- Lifelines -->
    <line x1="80" y1="45" x2="80" y2="225" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="3,3"/>
    <line x1="230" y1="45" x2="230" y2="225" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="3,3"/>
    <line x1="410" y1="45" x2="410" y2="225" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="3,3"/>
    <line x1="585" y1="45" x2="585" y2="225" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="3,3"/>

    <!-- Steps -->
    <!-- 1: UI -> Node -->
    <line x1="80" y1="65" x2="230" y2="65" stroke="#2563eb" stroke-width="1.5"/>
    <text x="155" y="58" font-size="7" font-weight="bold" fill="#1e40af" text-anchor="middle">1: POST /api/analysis/run (JWT)</text>

    <!-- 2: Node -> DB -->
    <line x1="230" y1="85" x2="585" y2="85" stroke="#0f172a" stroke-width="1.2"/>
    <text x="400" y="78" font-size="7" fill="#475569" text-anchor="middle">2: Query User Profile, JobRole & Assessment Attempts</text>

    <!-- 3: DB -> Node -->
    <line x1="585" y1="105" x2="230" y2="105" stroke="#0f172a" stroke-width="1.2" stroke-dasharray="2,2"/>
    <text x="400" y="98" font-size="7" fill="#475569" text-anchor="middle">3: Return documents & attempt scores</text>

    <!-- 4: Node -> Flask -->
    <line x1="230" y1="125" x2="410" y2="125" stroke="#d97706" stroke-width="1.5"/>
    <text x="320" y="118" font-size="7" font-weight="bold" fill="#b45309" text-anchor="middle">4: POST /analyze (JSON payload)</text>

    <!-- 5: Flask compute -->
    <rect x="405" y="132" width="10" height="20" fill="#fef08a"/>
    <text x="425" y="145" font-size="6.5" fill="#713f12">Compute Readiness & Penalties</text>

    <!-- 6: Flask -> Node -->
    <line x1="410" y1="160" x2="230" y2="160" stroke="#d97706" stroke-width="1.5" stroke-dasharray="2,2"/>
    <text x="320" y="153" font-size="7" font-weight="bold" fill="#b45309" text-anchor="middle">5: Return Analysis Result JSON</text>

    <!-- 7: Node -> DB save -->
    <line x1="230" y1="180" x2="585" y2="180" stroke="#16a34a" stroke-width="1.5"/>
    <text x="400" y="173" font-size="7" font-weight="bold" fill="#15803d" text-anchor="middle">6: Create AnalysisSnapshot</text>

    <!-- 8: Node -> UI response -->
    <line x1="230" y1="205" x2="80" y2="205" stroke="#2563eb" stroke-width="1.5" stroke-dasharray="2,2"/>
    <text x="155" y="198" font-size="7" font-weight="bold" fill="#1e40af" text-anchor="middle">7: Render Snapshot & Dashboard</text>
  </svg>
</div>

<!-- CHAPTER 6: IMPLEMENTATION & ALGORITHMIC ANALYSIS -->
<div class="page-break"></div>
<h1>6. Implementation & Algorithmic Analysis</h1>

<h2>6.1 M3: Readiness Scoring Algorithm & Mathematical Derivation</h2>
<p>The SkillBridge readiness engine operates within <code>ml-service/services/analyzer.py</code>. Unlike simplistic count-based keyword matchers, the algorithm incorporates four balanced mathematical components: <em>weighted role requirements</em>, <em>competency penalties for failed validations</em>, <em>assessment performance bonuses</em>, and <em>confidence band boundaries</em>.</p>

<div class="math-formula">
  \text{MatchPct} = \frac{\sum_{i \in \text{Matched}} w_i^*}{\sum_{j \in \text{Required}} w_j} \times 100
</div>
<p>Where the effective skill weight $w_i^*$ incorporates an empirical penalty when assessment performance is substandard:</p>
<div class="math-formula">
  w_i^* = \begin{cases}
    w_i \times 0.75 & \text{if } \text{Score}(s_i) < 50\% \\
    w_i & \text{otherwise}
  \end{cases}
</div>
<p>The final Readiness Score integrates the penalized match ratio with an assessment proficiency bonus:</p>
<div class="math-formula">
  \text{ReadinessScore} = \min\left(100, \; \text{round}\left(\text{MatchPct} \times 0.8 + \overline{\text{QuizScore}} \times 0.2\right)\right)
</div>

<div class="callout-box">
  <div class="callout-title">Confidence Band Classifications</div>
  <ul>
    <li><strong>Advanced (&ge; 75):</strong> Candidate displays comprehensive alignment with target competencies and verified testing integrity.</li>
    <li><strong>Progressing (50 – 74):</strong> Candidate possesses foundational skills but exhibits notable gaps in high-weight competencies.</li>
    <li><strong>Emerging (&lt; 50):</strong> Candidate lacks essential prerequisites for the role; immediate foundational upskilling required.</li>
  </ul>
</div>

<h3>Implementation Excerpt: Python Readiness & Penalty Computation</h3>
<pre><code class="language-python"># ml-service/services/analyzer.py
def analyze_profile(payload):
    resume_text = payload.get("resumeText", "")
    required_skills = extract_required_skills(payload.get("jobDescription"), payload.get("requiredSkills"))
    user_skills = merge_resume_and_declared_skills(resume_text, payload.get("declaredSkills", []))
    user_skill_names = {s["name"] for s in user_skills}
    assessment_scores = score_assessment_signals(payload.get("assessmentSignals", []))

    matched_skills, missing_skills = [], []
    weighted_total, weighted_score = 0, 0

    for skill in required_skills:
        weight = skill.get("weight", 1)
        weighted_total += weight
        if skill["name"] in user_skill_names:
            matched_skills.append(skill["name"])
            weighted_score += weight
            # 25% penalty if validated assessment score < 50%
            if assessment_scores.get(skill["name"], 100) < 50:
                weighted_score -= 0.25 * weight
        else:
            missing_skills.append(skill["name"])

    match_pct = 0 if weighted_total == 0 else round(max(weighted_score, 0) / weighted_total * 100)
    bonus = round(sum(assessment_scores.values()) / len(assessment_scores) * 0.2) if assessment_scores else 0
    readiness = min(100, round(match_pct * 0.8 + bonus))

    confidence_band = "Advanced" if readiness >= 75 else ("Progressing" if readiness >= 50 else "Emerging")
    return {
        "readinessScore": readiness,
        "matchPercentage": match_pct,
        "matchedSkills": matched_skills,
        "missingSkills": missing_skills,
        "confidenceBand": confidence_band
    }
</code></pre>

<h2>6.2 M4: Adaptive Quiz Engine & Dynamic Difficulty State Machine</h2>
<p>The assessment controller in <code>server/src/modules/assessment/assessment.routes.js</code> dynamically steers question selection based on real-time learner correctness. This prevents question fatigue and accurately calibrates candidate knowledge boundaries.</p>

<div class="math-formula">
  D_{t+1} = \begin{cases}
    \min(D_t + 1, \text{hard}) & \text{if candidate answered correctly} \\
    \max(D_t - 1, \text{easy}) & \text{if candidate answered incorrectly}
  \end{cases}
</div>

<h3>Implementation Excerpt: Adaptive Question Routing</h3>
<pre><code class="language-javascript">// server/src/modules/assessment/assessment.routes.js
const getNextDifficulty = (wasCorrect, currentDifficulty) => {
  if (!wasCorrect) {
    return currentDifficulty === "hard" ? "medium" : "easy";
  }
  if (currentDifficulty === "easy") return "medium";
  if (currentDifficulty === "medium") return "hard";
  return "hard";
};

router.post("/answer", requireAuth, async (req, res, next) => {
  const { attemptId, questionPrompt, selectedAnswer } = req.body;
  const attempt = await AssessmentAttempt.findById(attemptId);
  const quiz = await Quiz.findById(attempt.quizId);
  const question = quiz.questions.find(q => q.prompt === questionPrompt);

  const wasCorrect = question.correctAnswer === selectedAnswer;
  attempt.answers.push({
    questionPrompt: question.prompt,
    skill: question.skill,
    selectedAnswer,
    wasCorrect,
    difficulty: question.difficulty
  });

  const nextDifficulty = getNextDifficulty(wasCorrect, question.difficulty);
  const askedPrompts = attempt.answers.map(a => a.questionPrompt);
  const nextQuestion = quiz.questions.find(q => q.difficulty === nextDifficulty && !askedPrompts.includes(q.prompt))
                     || quiz.questions.find(q => !askedPrompts.includes(q.prompt));

  if (nextQuestion && attempt.answers.length < quiz.totalQuestions) {
    attempt.adaptiveTrail.push(nextQuestion.difficulty);
  } else {
    attempt.completedAt = new Date();
    attempt.readinessImpact = Math.round((attempt.score / 100) * 15);
  }
  await attempt.save();
  res.json({ nextQuestion, score: attempt.score, done: !nextQuestion });
});
</code></pre>

<h2>6.3 M1: Authentication, Progressive Staging & Security Middleware</h2>
<p>SkillBridge implements a 4-step progressive onboarding architecture designed to eliminate incomplete user profiles and prevent spam accounts in MongoDB. Initial registrations populate a temporary <code>PendingUser</code> document with a 1-hour MongoDB TTL expiration index. Only when the 6-digit OTP is validated does the system atomistically create the permanent <code>User</code> record, hashing passwords with bcrypt (10 rounds) and issuing a stateless 7-day JWT token.</p>

<h3>Implementation Excerpt: JWT Auth Middleware</h3>
<pre><code class="language-javascript">// server/src/middleware/auth.js
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";

export const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication token required." });
  }
  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.userId).select("-passwordHash");
    if (!user) return res.status(401).json({ message: "User session revoked." });
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token expired or invalid signature." });
  }
};
</code></pre>

<h2>6.4 M2: Multi-Format Resume Parsing Pipeline</h2>
<p>Document ingestion combines in-memory buffer parsing via <code>pdf-parse</code> in Node.js and file-based extraction in Python via <code>pypdf</code> and <code>python-docx</code>. Text is normalized and processed through a curated canonical dictionary (<code>skill_catalog.py</code>) mapping hundreds of variations to standard industry skills (e.g., <code>['react', 'react.js', 'reactjs'] &rarr; 'React'</code>).</p>

<!-- CHAPTER 7: VERIFICATION & SOFTWARE TESTING -->
<div class="page-break"></div>
<h1>7. Verification & Software Testing</h1>

<h2>7.1 Unit Testing Results</h2>
<p>Unit tests were constructed to validate isolated mathematical functions and security routines across the Python NLP service and Node.js gateway.</p>

<div class="table-caption">Table 7.1: Unit Test Results: M3 Readiness & Scoring Engine</div>
<table>
  <tr><th>Test ID</th><th>Target Function</th><th>Input Conditions / Test Vectors</th><th>Expected Verification Output</th><th>Status</th></tr>
  <tr><td><strong>UT-M3-01</strong></td><td><code>compute_readiness()</code></td><td>3/5 required skills present; no prior assessment history.</td><td><code>readinessScore = 48.0</code>, band = <code>Emerging</code>.</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>UT-M3-02</strong></td><td><code>compute_readiness()</code></td><td>5/5 required skills present; no prior quiz history.</td><td><code>readinessScore = 80.0</code>, band = <code>Advanced</code>.</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>UT-M3-03</strong></td><td><code>compute_readiness()</code></td><td>4/5 skills matched; quiz score 30% on one matched skill.</td><td>25% penalty subtracted from weight of failed skill.</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>UT-M3-04</strong></td><td><code>score_assessment_signals()</code></td><td>2 quiz attempts with alternating true/false answers.</td><td>Calculates arithmetic mean score accurately (50%).</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>UT-M3-05</strong></td><td><code>confidence_band()</code></td><td>Boundary test: <code>readinessScore = 74.9</code>.</td><td>Classified as <code>Progressing</code>.</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>UT-M3-06</strong></td><td><code>confidence_band()</code></td><td>Boundary test: <code>readinessScore = 75.0</code>.</td><td>Classified as <code>Advanced</code>.</td><td><span class="badge badge-pass">PASS</span></td></tr>
</table>

<div class="table-caption">Table 7.2: Unit Test Results: M1 Authentication & Security</div>
<table>
  <tr><th>Test ID</th><th>Target Routine</th><th>Input Conditions</th><th>Expected Security Result</th><th>Status</th></tr>
  <tr><td><strong>UT-M1-01</strong></td><td><code>bcrypt.hash()</code></td><td>Password 'Admin@1234', salt=10.</td><td>Generates valid 60-character salted hash string.</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>UT-M1-02</strong></td><td><code>jwt.verify()</code></td><td>Signed Bearer token + correct server secret.</td><td>Decodes payload with valid <code>userId</code>.</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>UT-M1-03</strong></td><td><code>jwt.verify()</code></td><td>Expired JWT token (timestamp past 7 days).</td><td>Throws <code>TokenExpiredError</code>; rejects request.</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>UT-M1-04</strong></td><td>OTP Generation</td><td><code>generateOTP()</code> helper routine.</td><td>Returns 6-digit numeric string between 100000–999999.</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>UT-M1-05</strong></td><td>OTP Expiry Check</td><td>Timestamp 11 minutes post-creation.</td><td>Rejects verification with HTTP 400 Expired OTP.</td><td><span class="badge badge-pass">PASS</span></td></tr>
</table>

<div class="table-caption">Table 7.3: Unit Test Results: M2 NLP Skill Extraction Pipeline</div>
<table>
  <tr><th>Test ID</th><th>Target Routine</th><th>Input Resume Text</th><th>Extracted Capabilities</th><th>Status</th></tr>
  <tr><td><strong>UT-M2-01</strong></td><td><code>extract_skills()</code></td><td>"Extensive experience building apps with JS, React, and Mongo."</td><td>Identifies <code>['JavaScript', 'React', 'MongoDB']</code>.</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>UT-M2-02</strong></td><td><code>extract_skills()</code></td><td>"Non-technical narrative without IT keywords."</td><td>Returns empty array <code>[]</code> gracefully.</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>UT-M2-03</strong></td><td><code>normalize_text()</code></td><td>"  React.JS \n\n with   PYTHON3   "</td><td>Normalized to "react.js with python3".</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>UT-M2-04</strong></td><td><code>merge_skills()</code></td><td>Resume extracted: ['React']; User declared: ['React', 'Git'].</td><td>Deduplicated union: <code>['React', 'Git']</code>.</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>UT-M2-05</strong></td><td><code>extract_text_from_file()</code></td><td>Valid 2-page PDF file stream.</td><td>Extracts non-empty plain text stream.</td><td><span class="badge badge-pass">PASS</span></td></tr>
</table>

<h2>7.2 Integration Testing & End-to-End Scenarios</h2>
<div class="table-caption">Table 7.4: Integration Test Suite (IT-01 to IT-06) Across Microservice Boundaries</div>
<table>
  <tr><th>Test ID</th><th>Integration Scenario Flow</th><th>Services Involved</th><th>Expected Multi-Service Outcome</th><th>Status</th></tr>
  <tr><td><strong>IT-01</strong></td><td>Register &rarr; Part 1 &rarr; Part 2 &rarr; OTP Verify &rarr; Token Issue</td><td>React + Express + MongoDB + SMTP</td><td>Full staging to user transition; JWT returned; session active.</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>IT-02</strong></td><td>Resume Upload &rarr; Run Gap Analysis &rarr; View Snapshot</td><td>React + Express + Python Flask + DB</td><td>PDF extracted in memory, sent to Flask; snapshot saved to DB.</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>IT-03</strong></td><td>Start Quiz &rarr; Adapt Difficulty &rarr; Finish &rarr; Update Readiness</td><td>React + Express + MongoDB</td><td>Difficulty tracks correctness; attempt stored; readiness updated.</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>IT-04</strong></td><td>Feature Flag Disabling via <code>modules.config.json</code></td><td>Express Gateway + React Client</td><td>Disabled routes return HTTP 404; navigation elements hidden.</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>IT-05</strong></td><td>Dashboard Analytics Ingestion</td><td>React Client + Express + MongoDB</td><td>Aggregates historical analyses, quizzes, and SDG 4.4.1 metrics.</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>IT-06</strong></td><td>DOCX Resume Upload and Parsing</td><td>Express Multer + Python python-docx</td><td>DOCX stream parsed successfully; skills matched against catalog.</td><td><span class="badge badge-pass">PASS</span></td></tr>
</table>

<h2>7.3 Full Functional Test Cases Matrix</h2>
<div class="table-caption">Table 7.5: Master 20-Point Functional Test Execution Matrix (TC-01 to TC-20)</div>
<table>
  <tr><th>TC ID</th><th>Test Case Description</th><th>Mod</th><th>Preconditions & Inputs</th><th>Expected System Behavior</th><th>Status</th></tr>
  <tr><td><strong>TC-01</strong></td><td>Valid Registration (Part 1)</td><td>M1</td><td>Unregistered email; strong password.</td><td>HTTP 201; pending user created in MongoDB.</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>TC-02</strong></td><td>Duplicate Email Collision</td><td>M1</td><td>Email already registered in system.</td><td>HTTP 409 Conflict: Account already exists.</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>TC-03</strong></td><td>Accurate OTP Verification</td><td>M1</td><td>Pending user submits correct 6-digit OTP.</td><td>HTTP 200; permanent User created; JWT issued.</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>TC-04</strong></td><td>Expired OTP Submission</td><td>M1</td><td>OTP submitted 11 minutes after sending.</td><td>HTTP 400 Bad Request: Invalid or expired OTP.</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>TC-05</strong></td><td>Authenticated Login Flow</td><td>M1</td><td>Verified user credentials provided.</td><td>HTTP 200; returns JWT token and user profile object.</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>TC-06</strong></td><td>Wrong Password Login</td><td>M1</td><td>Valid email with incorrect password.</td><td>HTTP 401 Unauthorized: Invalid credentials.</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>TC-07</strong></td><td>Profile Information Update</td><td>M1</td><td>User logged in; edits location/degree.</td><td>HTTP 200; updates reflected in MongoDB document.</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>TC-08</strong></td><td>PDF Resume Ingestion</td><td>M2</td><td>User uploads valid single/multi-page PDF.</td><td>HTTP 200; text extracted; skills mapped to catalog.</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>TC-09</strong></td><td>Unsupported File Extension</td><td>M2</td><td>User attempts upload of .exe or .png.</td><td>HTTP 400 Bad Request: Unsupported file format.</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>TC-10</strong></td><td>Gap Analysis (Seeded Role)</td><td>M3</td><td>Resume uploaded; user selects 'Full-stack Engineer'.</td><td>HTTP 200; returns Readiness Score, matched/missing skills.</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>TC-11</strong></td><td>Gap Analysis (Custom JD)</td><td>M3</td><td>User pastes raw custom job description.</td><td>HTTP 200; skills inferred from JD; gap computed.</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>TC-12</strong></td><td>Zero Skill Overlap Edge Case</td><td>M3</td><td>Resume contains zero relevant skills.</td><td>Readiness Score = 0; Confidence band = <code>Emerging</code>.</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>TC-13</strong></td><td>100% Skill Overlap Ideal Case</td><td>M3</td><td>Resume matches all required competencies.</td><td>Readiness Score &ge; 80; Confidence band = <code>Advanced</code>.</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>TC-14</strong></td><td>Initialize Adaptive Quiz Session</td><td>M4</td><td>User initiates quiz from catalog.</td><td>HTTP 200; returns attemptId and first 'easy' question.</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>TC-15</strong></td><td>Adaptive Difficulty Escalation</td><td>M4</td><td>Candidate answers 'easy' question correctly.</td><td>Next question served has difficulty = 'medium'.</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>TC-16</strong></td><td>Adaptive Difficulty De-escalation</td><td>M4</td><td>Candidate answers 'hard' question incorrectly.</td><td>Next question served has difficulty = 'medium'.</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>TC-17</strong></td><td>Assessment Timer Expiry</td><td>M4</td><td>Quiz countdown timer reaches 00:00.</td><td>Quiz auto-submits partial answers; computes score.</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>TC-18</strong></td><td>Dashboard Metric Loading</td><td>M7</td><td>User visits /dashboard route.</td><td>HTTP 200; returns latest scores, trends, and radar cards.</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>TC-19</strong></td><td>SDG 4.4.1 ICT Metric Display</td><td>M7</td><td>User with completed analyses views dashboard.</td><td>Displays measured ICT skills vs required benchmark %.</td><td><span class="badge badge-pass">PASS</span></td></tr>
  <tr><td><strong>TC-20</strong></td><td>Protected Route Without JWT</td><td>Sec</td><td>Direct GET request to /api/dashboard without token.</td><td>HTTP 401 Unauthorized: Authentication token required.</td><td><span class="badge badge-pass">PASS</span></td></tr>
</table>

<!-- CHAPTER 8: CONCLUSION & FUTURE SCOPE -->
<div class="page-break"></div>
<h1>8. Conclusion & Strategic Future Roadmap</h1>

<h2>8.1 Summary of Project Outcomes</h2>
<p>SkillBridge demonstrates that it is feasible to build a production-grade, microservice-oriented web platform that replaces subjective career speculation with measurable, empirical skill gap analytics. The system delivers on all eight primary engineering objectives:</p>
<ul>
  <li><strong>Decoupled Microservice Architecture:</strong> Separating the Node.js API gateway from the Python Flask NLP microservice prevents compute-intensive text extraction from degrading API responsiveness.</li>
  <li><strong>Dynamic Feature Modularity:</strong> The central <code>modules.config.json</code> feature registry allows seamless activation and deactivation of platform modules without code redeployment.</li>
  <li><strong>Empirical Assessment Integrity:</strong> By applying a 25% penalty to unverified claims scoring below 50% on adaptive quizzes, the platform eliminates credential inflation.</li>
  <li><strong>Measurable SDG Alignment:</strong> Directly quantifies UNESCO SDG Indicator 4.4.1 digital skill coverage across student cohorts.</li>
</ul>

<h2>8.2 Strategic Future Scope</h2>
<p>While the current release provides five operational modules (M1, M2, M3, M4, M7), several high-impact enhancements are slated for subsequent engineering phases:</p>
<ul>
  <li><strong>Module 5 (Personalised Roadmaps & Learning Resource Recommendation):</strong> Curate personalized learning pathways linking identified skill gaps to vetted tutorials, Coursera/edX modules, and GitHub repositories.</li>
  <li><strong>Module 6 (Re-Assessment Scheduling & Automated Deadlines):</strong> Integrate a Redis-backed <strong>BullMQ</strong> job scheduler to deliver automated milestone email reminders and calendar invites for periodic re-evaluations.</li>
  <li><strong>Deep Learning NLP (BERT / spaCy NER):</strong> Upgrade the catalog alias matcher with fine-tuned Named Entity Recognition (NER) models to identify novel technologies from resumes.</li>
  <li><strong>Dedicated Institutional Admin Portal:</strong> Provide academic faculty and placement officers with cohort analytics, department skill heatmaps, and custom curriculum benchmark tooling.</li>
  <li><strong>OAuth 2.0 Single Sign-On (SSO):</strong> Integrate Google and LinkedIn identity providers to minimize onboarding friction.</li>
  <li><strong>Post-Quiz Diagnostic Explanations:</strong> Deliver detailed conceptual rationales immediately following quiz completion to support formative learning.</li>
</ul>

<!-- CHAPTER 9: BIBLIOGRAPHY & STANDARDS -->
<div class="page-break"></div>
<h1>9. Bibliography & Standards</h1>
<ol style="font-size: 8.5pt; line-height: 1.6;">
  <li>MongoDB Inc., "MongoDB Manual — The Developer Data Platform," 2026. [Online]. Available: https://www.mongodb.com/docs/</li>
  <li>Meta Open Source, "React Documentation — Building Modern User Interfaces," 2026. [Online]. Available: https://react.dev/</li>
  <li>Vercel Inc., "Vite: Next Generation Frontend Tooling," 2026. [Online]. Available: https://vitejs.dev/</li>
  <li>Tailwind Labs, "Tailwind CSS v4 Documentation," 2026. [Online]. Available: https://tailwindcss.com/docs</li>
  <li>OpenJS Foundation, "Express.js — Fast, Unopinionated Minimalist Web Framework for Node.js," 2026. [Online]. Available: https://expressjs.com/</li>
  <li>Automattic, "Mongoose ODM v8 Documentation," 2026. [Online]. Available: https://mongoosejs.com/docs/</li>
  <li>Pallets Projects, "Flask Web Development Framework Documentation," 2026. [Online]. Available: https://flask.palletsprojects.com/</li>
  <li>PyPDF Contributors, "pypdf — Pure Python PDF Extraction Library," 2026. [Online]. Available: https://pypdf.readthedocs.io/</li>
  <li>United Nations, "Sustainable Development Goal 4: Ensure Inclusive and Equitable Quality Education," UN Department of Economic and Social Affairs, 2026. [Online]. Available: https://sdgs.un.org/goals/goal4</li>
  <li>UNESCO Institute for Statistics, "SDG Indicator 4.4.1: Proportion of youth and adults with ICT skills," 2026. [Online]. Available: http://uis.unesco.org/en/topic/sdg-4-indicator-441</li>
  <li>Auth0 by Okta, "JSON Web Token (JWT) Architecture and Security Best Practices," 2026. [Online]. Available: https://jwt.io/introduction</li>
  <li>X. Liu et al., "Skill Extraction from Job Descriptions and Resumes Using Natural Language Processing," in <em>Proc. ACM International Conference on Information and Knowledge Management (CIKM)</em>, 2021, pp. 1120–1129.</li>
</ol>

<!-- APPENDICES -->
<div class="page-break"></div>
<h1>Appendix A: Sustainable Development Goals (SDG Compliance)</h1>

<h2>Compliance with UN SDG 4 — Quality Education</h2>
<div class="callout-box">
  <div class="callout-title">Target 4.4: Relevant Skills for Employment</div>
  <p><em>"By 2030, substantially increase the number of youth and adults who have relevant skills, including technical and vocational skills, for employment, decent jobs and entrepreneurship."</em></p>
</div>

<div class="callout-box">
  <div class="callout-title">Indicator 4.4.1: ICT Skill Coverage</div>
  <p><em>"Proportion of youth and adults with information and communications technology (ICT) skills, by type of skill."</em></p>
</div>

<h3>Direct Contribution of SkillBridge to SDG 4.4</h3>
<p>SkillBridge directly operationalizes Target 4.4 by replacing broad, non-specific educational metrics with empirical, job-aligned competency measurements. For every candidate evaluated, the platform computes an <strong>ICT Coverage Metric</strong> measuring the proportion of industry-standard technical tools mastered (e.g., programming languages, database architectures, REST APIs, security frameworks) relative to target job specifications. Furthermore, by penalizing unvalidated self-reported skills via timed adaptive quizzes, SkillBridge promotes genuine skill acquisition and lifelong learning.</p>

<h2>Compliance with UN SDG 8 — Decent Work & Economic Growth</h2>
<p>By shortening the feedback loop between higher education learning and industry hiring standards, SkillBridge reduces youth underemployment and empowers job seekers with actionable diagnostic feedback, fostering productive employment and decent work for all (SDG Target 8.6).</p>

<div class="page-break"></div>
<h1>Appendix B: Plagiarism & Originality Declaration</h1>

<div style="border: 1px solid #cbd5e1; padding: 25px; border-radius: 6px; margin-top: 20px;">
  <h3 style="text-align: center; margin-top: 0; text-transform: uppercase;">Declaration of Originality</h3>
  <p>We hereby declare that the project report entitled <strong>"Personalized Learning and Skill Gap Analysis" (SkillBridge)</strong> submitted to Visvesvaraya Technological University (VTU) in partial fulfillment of the requirements for the award of the degree of <strong>Master of Computer Applications (MCA)</strong> is a bonafide record of independent, original software engineering and research carried out by us under the supervision of <strong>Dr. Aparna K</strong>, Professor, Department of MCA, BMS Institute of Technology & Management, Bengaluru.</p>
  <p>We confirm that this report does not contain any material previously published or written by another person, except where due acknowledgment and citation has been made in the text. The software implementation, microservice design, scoring algorithms, and test suites are original intellectual works authored for this project.</p>

  <div style="margin-top: 60px; display: flex; justify-content: space-between;">
    <div style="text-align: center;">
      <div style="border-top: 1px solid #0f172a; width: 180px; margin-bottom: 5px;"></div>
      <strong>Abhishek Anil Kumar</strong><br>
      USN: 1BY25MC004
    </div>
    <div style="text-align: center;">
      <div style="border-top: 1px solid #0f172a; width: 180px; margin-bottom: 5px;"></div>
      <strong>Salman V</strong><br>
      USN: 1BY25MC091
    </div>
    <div style="text-align: center;">
      <div style="border-top: 1px solid #0f172a; width: 180px; margin-bottom: 5px;"></div>
      <strong>Dr. Aparna K</strong><br>
      Project Guide & Professor
    </div>
  </div>
</div>

</body>
</html>
"""

print(f"Writing complete HTML to {OUTPUT_HTML}...")
with open(OUTPUT_HTML, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"HTML successfully generated ({len(html_content)} bytes).")
print("Compiling PDF report via Microsoft Edge headless...")

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not Path(edge_path).exists():
    edge_path = r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"

file_url = OUTPUT_HTML.resolve().as_uri()

cmd = [
    edge_path,
    "--headless",
    "--disable-gpu",
    "--run-all-compositor-stages-before-draw",
    "--no-pdf-header-footer",
    f"--print-to-pdf={str(OUTPUT_PDF)}",
    file_url
]

result = subprocess.run(cmd, capture_output=True, text=True)
if OUTPUT_PDF.exists():
    size_kb = OUTPUT_PDF.stat().st_size / 1024
    print(f"SUCCESS! PDF report generated at: {OUTPUT_PDF} ({size_kb:.1f} KB)")
else:
    print(f"Error compiling PDF: {result.stderr}")
    sys.exit(1)

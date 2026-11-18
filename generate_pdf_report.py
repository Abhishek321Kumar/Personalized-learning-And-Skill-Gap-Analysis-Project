"""
SkillBridge Comprehensive Analysis Report Generator
Generates a complete, publication-grade academic and technical analysis report in HTML and compiles it to PDF via Headless Edge.
"""

import os
import subprocess
import sys
from pathlib import Path

WORKSPACE = Path(r"e:\Mern\PBL_01_github")
OUTPUT_HTML = WORKSPACE / "SkillBridge_Comprehensive_Analysis_Report.html"
OUTPUT_PDF = WORKSPACE / "SkillBridge_Comprehensive_Analysis_Report.pdf"

print("Building HTML report content...")

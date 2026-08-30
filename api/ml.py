import sys
import os

# Add ml-service to path so imports work
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'ml-service'))

# Force rebuild 2
from app import app

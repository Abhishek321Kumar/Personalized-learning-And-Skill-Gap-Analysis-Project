/**
 * Sorts missing/weak skills into 3 phases based on effort tag.
 * Effort Tags expected: "Quick win", "Moderate", "Deep skill".
 * 
 * Phase 1: Quick Wins
 * Phase 2: Moderate
 * Phase 3: Deep Skills
 * 
 * Within each phase, respects the existing array order (assumed to be priority).
 * 
 * @param {Array} skills - Array of skill objects e.g. { name: "...", effortTag: "..." }
 * @returns {Object} { phases: [ { label, estimatedDuration, skills: [] }, ... ] }
 */
export function generateRoadmapPhases(skills) {
  const phases = [
    {
      label: "Phase 1: Quick Wins",
      estimatedDuration: "Weeks 1-2",
      skills: []
    },
    {
      label: "Phase 2: Moderate",
      estimatedDuration: "Weeks 3-5",
      skills: []
    },
    {
      label: "Phase 3: Deep Skills",
      estimatedDuration: "Weeks 6+",
      skills: []
    }
  ];

  if (!skills || skills.length === 0) return { phases };

  skills.forEach(skill => {
    // Default to Moderate if tag is missing or unrecognized
    const tag = (skill.effortTag || "").toLowerCase();
    
    if (tag.includes("quick win")) {
      phases[0].skills.push(skill);
    } else if (tag.includes("deep skill")) {
      phases[2].skills.push(skill);
    } else {
      phases[1].skills.push(skill);
    }
  });

  return { phases };
}

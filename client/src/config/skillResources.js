export const SKILL_RESOURCES = [
  {
    skill: "SQL & Database Optimization",
    applicableRoles: ["Data Scientist", "Senior Data Analyst", "Backend Engineer"],
    coreConcepts: [
      "Complex Joins & Subqueries",
      "Window Functions",
      "Query Optimization & Indexing",
      "Data Normalization"
    ],
    practiceLinks: [
      { platform: "LeetCode", url: "https://leetcode.com/studyplan/sql-50/", label: "SQL 50 Study Plan" },
      { platform: "HackerRank", url: "https://www.hackerrank.com/domains/sql", label: "SQL Practice Tracks" }
    ],
    courses: [
      { platform: "Coursera", title: "Managing Big Data with MySQL", url: "https://www.coursera.org/" },
      { platform: "Udemy", title: "The Complete SQL Bootcamp", url: "https://www.udemy.com/" }
    ]
  },
  {
    skill: "Statistical Analysis",
    applicableRoles: ["Data Scientist", "Senior Data Analyst"],
    coreConcepts: [
      "Hypothesis Testing (A/B Testing)",
      "Probability Distributions",
      "Regression Analysis",
      "Statistical Significance & P-values"
    ],
    courses: [
      { platform: "Udacity", title: "A/B Testing for Business Analysts", url: "https://www.udacity.com/" }
    ]
    // Note: practiceLinks omitted intentionally
  },
  {
    skill: "Business Communication",
    applicableRoles: ["Senior Data Analyst", "Product Manager"],
    coreConcepts: [
      "Stakeholder Management",
      "Executive Storytelling",
      "Translating Tech to Business",
      "Effective Presentations"
    ],
    courses: [
      { platform: "LinkedIn Learning", title: "Communication Foundations", url: "https://www.linkedin.com/learning/" }
    ]
    // Note: practiceLinks and certifications omitted intentionally
  },
  {
    skill: "Advanced State Management",
    applicableRoles: ["Front-end Developer", "Full Stack Engineer"],
    coreConcepts: [
      "Redux Toolkit & RTK Query",
      "Zustand / Jotai Patterns",
      "Context API Performance",
      "Server State vs Client State"
    ],
    practiceLinks: [
      { platform: "Frontend Mentor", url: "https://www.frontendmentor.io/", label: "Build a Complex State App" }
    ],
    courses: [
      { platform: "Frontend Masters", title: "State Management in React", url: "https://frontendmasters.com/" }
    ]
  }
];

export const ROLE_INTERVIEW_GUIDES = [
  {
    role: "Senior Data Analyst",
    interviewGuides: [
      { 
        title: "Top 50 Data Analyst Interview Questions", 
        url: "https://example.com/guide1", 
        description: "Comprehensive guide covering SQL, Python, and business case studies." 
      },
      { 
        title: "A/B Testing Interview Prep", 
        url: "https://example.com/guide2", 
        description: "Focuses on statistical foundations and real-world scenario questions." 
      }
    ]
  },
  {
    role: "Front-end Developer",
    interviewGuides: [
      { 
        title: "Front-end Interview Handbook", 
        url: "https://www.frontendinterviewhandbook.com/", 
        description: "Covers HTML, CSS, JavaScript, and system design for UI." 
      },
      { 
        title: "React Interview Questions", 
        url: "https://example.com/react-prep", 
        description: "Deep dive into React core concepts, hooks, and performance." 
      }
    ]
  }
];

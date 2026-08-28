export const SKILL_RESOURCES = [
  {
    skill: "SQL & Database Optimization",
    applicableRoles: ["Data Scientist", "Senior Data Analyst", "Backend Engineer", "Full-stack Engineer"],
    coreConcepts: [
      "Complex Joins & Subqueries",
      "Window Functions",
      "Query Optimization & Indexing",
      "Data Normalization"
    ],
    practiceLinks: [
      { platform: "LeetCode", url: "https://leetcode.com/problemset/database/", label: "Database Problem Set" },
      { platform: "HackerRank", url: "https://www.hackerrank.com/domains/sql", label: "SQL Practice Tracks" }
    ],
    courses: [
      { platform: "Coursera", title: "Managing Big Data with MySQL", url: "https://www.coursera.org/learn/managing-big-data-with-mysql" },
      { platform: "Udemy", title: "The Complete SQL Bootcamp", url: "https://www.udemy.com/course/the-complete-sql-bootcamp/" }
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
      { platform: "Udacity", title: "A/B Testing for Business Analysts", url: "https://www.udacity.com/course/ab-testing--ud257" }
    ]
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
      { platform: "LinkedIn Learning", title: "Communication Foundations", url: "https://www.linkedin.com/learning/communication-foundations" }
    ]
  },
  {
    skill: "Advanced State Management",
    applicableRoles: ["Front-end Developer", "Full-stack Engineer"],
    coreConcepts: [
      "Redux Toolkit & RTK Query",
      "Zustand / Jotai Patterns",
      "Context API Performance",
      "Server State vs Client State"
    ],
    practiceLinks: [
      { platform: "Frontend Mentor", url: "https://www.frontendmentor.io/challenges", label: "Build a Complex State App" }
    ],
    courses: [
      { platform: "Frontend Masters", title: "State Management in React", url: "https://frontendmasters.com/courses/pure-react-state/" }
    ]
  },
  {
    skill: "System Design & Architecture",
    applicableRoles: ["Backend Engineer", "Full-stack Engineer"],
    coreConcepts: [
      "Microservices vs Monoliths",
      "Caching Strategies (Redis/Memcached)",
      "Load Balancing & Scaling",
      "Message Queues (Kafka/RabbitMQ)"
    ],
    practiceLinks: [
      { platform: "ByteByteGo", url: "https://bytebytego.com/", label: "System Design Framework" }
    ],
    courses: [
      { platform: "Educative", title: "Grokking the System Design Interview", url: "https://www.educative.io/courses/grokking-the-system-design-interview" }
    ]
  },
  {
    skill: "React & Next.js Performance",
    applicableRoles: ["Front-end Developer", "Full-stack Engineer"],
    coreConcepts: [
      "Server-Side Rendering (SSR) vs SSG",
      "Bundle Size Optimization",
      "Memoization (useMemo/useCallback)",
      "Core Web Vitals"
    ],
    courses: [
      { platform: "Next.js Learn", title: "Next.js Foundations", url: "https://nextjs.org/learn" },
      { platform: "Frontend Masters", title: "Web Performance", url: "https://frontendmasters.com/courses/web-perf/" }
    ]
  },
  // PM Roles
  {
    skill: "Data-Driven Prioritization",
    applicableRoles: ["Product Manager"],
    coreConcepts: [
      "RICE & ICE Scoring Models",
      "Opportunity Solution Trees",
      "Validating Product Assumptions",
      "Metrics & KPI Tracking"
    ],
    courses: [
      { platform: "Reforge", title: "Product Strategy", url: "https://www.reforge.com/courses/product-strategy" },
      { platform: "Udemy", title: "Data-Driven Product Management", url: "https://www.udemy.com/course/data-driven-product-management/" }
    ]
    // NO practice links (HackerRank/Leetcode)
  },
  {
    skill: "Go-To-Market Strategy",
    applicableRoles: ["Product Manager"],
    coreConcepts: [
      "Market Segmentation & Personas",
      "Pricing & Packaging",
      "Sales Enablement",
      "Product Positioning & Messaging"
    ],
    courses: [
      { platform: "Product School", title: "Go-To-Market Mastery", url: "https://productschool.com/blog/product-strategy/go-to-market-strategy/" }
    ]
  },
  // UI/UX Roles
  {
    skill: "Interaction Design",
    applicableRoles: ["UI/UX Designer"],
    coreConcepts: [
      "Microinteractions",
      "Animation Principles",
      "Figma Prototyping",
      "State & Flow Mapping"
    ],
    courses: [
      { platform: "Interaction Design Foundation", title: "UI Animation", url: "https://www.interaction-design.org/courses/ui-animation" }
    ]
  }
];

export const ROLE_INTERVIEW_GUIDES = [
  {
    role: "Senior Data Analyst",
    interviewGuides: [
      { 
        title: "Top 50 Data Analyst Interview Questions", 
        url: "https://www.simplilearn.com/tutorials/data-analytics-tutorial/data-analyst-interview-questions", 
        description: "Comprehensive guide covering SQL, Python, and business case studies." 
      },
      { 
        title: "A/B Testing Interview Prep", 
        url: "https://towardsdatascience.com/a-b-testing-interview-questions-and-answers-for-data-scientists-827b40974ed2", 
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
        url: "https://github.com/sudheerj/reactjs-interview-questions", 
        description: "Deep dive into React core concepts, hooks, and performance." 
      }
    ]
  },
  {
    role: "Full-stack Engineer",
    interviewGuides: [
      { 
        title: "Full Stack Developer Interview Questions", 
        url: "https://www.interviewbit.com/full-stack-developer-interview-questions/", 
        description: "Covers frontend, backend, databases, and system architecture." 
      },
      { 
        title: "System Design Interview Guide", 
        url: "https://github.com/donnemartin/system-design-primer", 
        description: "Learn how to design large-scale systems for full-stack and backend interviews." 
      }
    ]
  },
  {
    role: "Product Manager",
    interviewGuides: [
      {
        title: "Product Manager Interview Prep",
        url: "https://igotanoffer.com/blogs/product-manager/product-manager-interview",
        description: "Product design, strategy, and execution questions."
      },
      {
        title: "Product Sense & Case Studies",
        url: "https://www.pramp.com/roles/pm",
        description: "Practice answering product strategy and metric-based questions."
      }
    ]
  },
  {
    role: "UI/UX Designer",
    interviewGuides: [
      {
        title: "UX Portfolio Review & Interview Prep",
        url: "https://www.interaction-design.org/literature/article/how-to-ace-your-ux-design-interview",
        description: "Tips on presenting your design process and case studies."
      }
    ]
  }
];

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
      { platform: "Coursera", title: "Managing Big Data with MySQL", url: "https://www.coursera.org/learn/sql-for-data-science" },
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
      { platform: "Udemy", title: "Data-Driven Product Management", url: "https://www.udemy.com/course/become-a-product-manager-learn-the-skills-get-a-job/" }
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
      { platform: "Coursera", title: "UX Design Fundamentals", url: "https://www.coursera.org/learn/ux-design-fundamentals" }
    ]
  },
  // Marketing Roles
  {
    skill: "Marketing Analytics (ROI/CAC)",
    applicableRoles: ["Marketing Manager"],
    coreConcepts: [
      "Customer Acquisition Cost (CAC) & LTV",
      "Return on Ad Spend (ROAS)",
      "Google Analytics & UTM Tracking",
      "A/B Testing & CRO"
    ],
    courses: [
      { platform: "Coursera", title: "Marketing Analytics Foundation", url: "https://www.coursera.org/learn/marketing-analytics" },
      { platform: "Udemy", title: "Advanced Google Analytics 4", url: "https://www.udemy.com/course/google-analytics-4/" }
    ]
  },
  {
    skill: "Digital Marketing (SEO/SEM)",
    applicableRoles: ["Marketing Manager"],
    coreConcepts: [
      "Search Engine Optimization (On-page & Off-page)",
      "PPC Campaign Management",
      "Keyword Bidding Strategies",
      "Multi-channel Attribution"
    ],
    courses: [
      { platform: "HubSpot", title: "SEO Certification", url: "https://academy.hubspot.com/courses/seo" },
      { platform: "Coursera", title: "Search Engine Optimization (SEO) Specialization", url: "https://www.coursera.org/specializations/seo" }
    ]
  },
  {
    skill: "Budget Optimization",
    applicableRoles: ["Marketing Manager"],
    coreConcepts: [
      "Marketing Mix Modeling",
      "Media Planning & Buying",
      "Cost Optimization",
      "Agency Management"
    ],
    courses: [
      { platform: "Coursera", title: "Marketing Plan", url: "https://www.coursera.org/learn/marketing-plan" }
    ]
  }
,
  {
    skill: "Machine Learning Architecture",
    applicableRoles: ["Data Scientist"],
    coreConcepts: [
      "Distributed Training (Horovod, Ray)",
      "Model Deployment & Serving (TF Serving, TorchServe)",
      "Feature Stores (Feast)",
      "MLOps & CI/CD for ML"
    ],
    courses: [
      { platform: "Coursera", title: "Machine Learning Engineering for Production (MLOps)", url: "https://www.coursera.org/specializations/machine-learning-engineering-for-production-mlops" }
    ]
  },
  {
    skill: "NLP & Deep Learning",
    applicableRoles: ["Data Scientist"],
    coreConcepts: [
      "Transformers & Attention Mechanisms",
      "Large Language Models (LLMs) & Fine-Tuning",
      "Sequence-to-Sequence Models",
      "Word Embeddings & Vector Databases"
    ],
    courses: [
      { platform: "DeepLearning.AI", title: "Natural Language Processing Specialization", url: "https://www.coursera.org/specializations/natural-language-processing" }
    ]
  },
  {
    skill: "Advanced Predictive Modeling",
    applicableRoles: ["Senior Data Analyst"],
    coreConcepts: [
      "Time Series Forecasting (ARIMA, Prophet)",
      "Survival Analysis",
      "Ensemble Methods (Random Forest, XGBoost)",
      "Dimensionality Reduction"
    ],
    courses: [
      { platform: "Coursera", title: "Advanced Data Science with IBM", url: "https://www.coursera.org/specializations/advanced-data-science-ibm" }
    ]
  },
  {
    skill: "Predictive LTV/CAC Analytics",
    applicableRoles: ["Marketing Manager"],
    coreConcepts: [
      "Predictive Customer Lifetime Value (pLTV)",
      "Cohort Analysis & Retention Modeling",
      "Multi-Touch Attribution (Markov Chains, Shapley)",
      "Marketing Spend Optimization"
    ],
    courses: [
      { platform: "Udacity", title: "Predictive Analytics for Business", url: "https://www.udacity.com/course/predictive-analytics-for-business-nanodegree--nd008" }
    ]
  },
  {
    skill: "Advanced Interaction Design",
    applicableRoles: ["UI/UX Designer"],
    coreConcepts: [
      "Complex Micro-interactions",
      "Motion Design Principles",
      "Gestural Interfaces",
      "State Transitions"
    ],
    courses: [
      { platform: "Coursera", title: "Interaction Design Specialization", url: "https://www.coursera.org/specializations/interaction-design" }
    ]
  },
  {
    skill: "Design System Architecture",
    applicableRoles: ["UI/UX Designer"],
    coreConcepts: [
      "Tokenization (Design Tokens)",
      "Component Library Governance",
      "Version Control in Figma",
      "Documentation & Handoff"
    ],
    courses: [
      { platform: "Memorisely", title: "Design Systems Bootcamp", url: "https://www.interaction-design.org/courses/design-systems" }
    ]
  }
,
{
  "skill": "Data Visualization (Tableau/PowerBI)",
  "applicableRoles": [
    "Senior Data Analyst"
  ],
  "coreConcepts": [
    "Dashboard Design",
    "DAX & Calculated Fields",
    "Data Storytelling",
    "Interactive Filtering"
  ],
  "courses": [
    {
      "platform": "Coursera",
      "title": "Data Visualization with Tableau",
      "url": "https://www.coursera.org/specializations/data-visualization"
    }
  ]
},
{
  "skill": "Python (Data Science Stack)",
  "applicableRoles": [
    "Data Scientist",
    "Senior Data Analyst"
  ],
  "coreConcepts": [
    "Pandas & Data Wrangling",
    "NumPy & Vectorization",
    "Scikit-Learn Fundamentals",
    "Matplotlib & Seaborn"
  ],
  "courses": [
    {
      "platform": "Coursera",
      "title": "Applied Data Science with Python",
      "url": "https://www.coursera.org/specializations/data-science-python"
    }
  ]
},
{
  "skill": "Web Performance Optimization",
  "applicableRoles": [
    "Front-end Developer"
  ],
  "coreConcepts": [
    "Core Web Vitals",
    "Code Splitting & Lazy Loading",
    "Image Optimization",
    "Caching Strategies"
  ],
  "courses": [
    {
      "platform": "Udacity",
      "title": "Website Performance Optimization",
      "url": "https://www.udacity.com/course/website-performance-optimization--ud884"
    }
  ]
},
{
  "skill": "React & Next.js Architecture",
  "applicableRoles": [
    "Front-end Developer"
  ],
  "coreConcepts": [
    "Server Components",
    "Routing & Layouts",
    "Data Fetching Patterns",
    "Static Site Generation"
  ],
  "courses": [
    {
      "platform": "Next.js Learn",
      "title": "Next.js Official Course",
      "url": "https://nextjs.org/learn"
    }
  ]
},
{
  "skill": "UI Component Styling",
  "applicableRoles": [
    "Front-end Developer",
    "Full-stack Engineer"
  ],
  "coreConcepts": [
    "Tailwind CSS Utility Classes",
    "CSS Modules",
    "Responsive Design",
    "CSS-in-JS"
  ],
  "courses": [
    {
      "platform": "Frontend Masters",
      "title": "CSS In-Depth",
      "url": "https://frontendmasters.com/courses/css-in-depth-v2/"
    }
  ]
},
{
  "skill": "Accessibility (a11y)",
  "applicableRoles": [
    "Front-end Developer"
  ],
  "coreConcepts": [
    "WCAG Guidelines",
    "ARIA Roles",
    "Keyboard Navigation",
    "Screen Reader Testing"
  ],
  "courses": [
    {
      "platform": "Udacity",
      "title": "Web Accessibility",
      "url": "https://www.udacity.com/course/web-accessibility--ud891"
    }
  ]
},
{
  "skill": "Microservices",
  "applicableRoles": [
    "Full-stack Engineer"
  ],
  "coreConcepts": [
    "Service Discovery",
    "API Gateways",
    "Inter-service Communication",
    "Distributed Tracing"
  ],
  "courses": [
    {
      "platform": "Coursera",
      "title": "Building Microservices",
      "url": "https://aws.amazon.com/microservices/"
    }
  ]
},
{
  "skill": "CI/CD Pipelines",
  "applicableRoles": [
    "Full-stack Engineer"
  ],
  "coreConcepts": [
    "GitHub Actions",
    "Docker & Containerization",
    "Automated Testing in Pipeline",
    "Deployment Strategies"
  ],
  "courses": [
    {
      "platform": "Udemy",
      "title": "DevOps Bootcamp",
      "url": "https://www.udemy.com/course/decodingdevops/"
    }
  ]
},
{
  "skill": "REST API Integration",
  "applicableRoles": [
    "Full-stack Engineer"
  ],
  "coreConcepts": [
    "HTTP Methods & Status Codes",
    "Authentication (JWT/OAuth)",
    "Pagination & Filtering",
    "Error Handling"
  ],
  "courses": [
    {
      "platform": "Codecademy",
      "title": "Learn REST APIs",
      "url": "https://www.codecademy.com/learn/learn-rest-apis"
    }
  ]
},
{
  "skill": "Product Vision & Strategy",
  "applicableRoles": [
    "Product Manager"
  ],
  "coreConcepts": [
    "OKRs & Goal Setting",
    "Competitive Analysis",
    "Product Roadmapping",
    "Value Proposition Design"
  ],
  "courses": [
    {
      "platform": "Reforge",
      "title": "Product Strategy",
      "url": "https://www.reforge.com/courses/product-strategy"
    }
  ]
},
{
  "skill": "Market Research",
  "applicableRoles": [
    "Product Manager"
  ],
  "coreConcepts": [
    "Customer Interviews",
    "Survey Design",
    "TAM/SAM/SOM Analysis",
    "Trend Forecasting"
  ],
  "courses": [
    {
      "platform": "Coursera",
      "title": "Market Research Specialization",
      "url": "https://www.coursera.org/specializations/market-research"
    }
  ]
},
{
  "skill": "User Story Mapping",
  "applicableRoles": [
    "Product Manager"
  ],
  "coreConcepts": [
    "Epic Breakdown",
    "Acceptance Criteria",
    "Agile Estimation",
    "Backlog Grooming"
  ],
  "courses": [
    {
      "platform": "Udemy",
      "title": "Agile Crash Course",
      "url": "https://www.udemy.com/course/agile-crash-course/"
    }
  ]
},
{
  "skill": "User Research Methods",
  "applicableRoles": [
    "UI/UX Designer"
  ],
  "coreConcepts": [
    "Usability Testing",
    "Contextual Inquiry",
    "Affinity Mapping",
    "Persona Development"
  ],
  "courses": [
    {
      "platform": "Interaction Design Foundation",
      "title": "User Research",
      "url": "https://www.interaction-design.org/courses/user-research-methods-and-best-practices"
    }
  ]
},
{
  "skill": "Information Architecture",
  "applicableRoles": [
    "UI/UX Designer"
  ],
  "coreConcepts": [
    "Card Sorting",
    "Tree Testing",
    "Site Mapping",
    "Navigation Patterns"
  ],
  "courses": [
    {
      "platform": "Coursera",
      "title": "Information Architecture",
      "url": "https://www.coursera.org/learn/information-architecture"
    }
  ]
},
{
  "skill": "Prototyping & Wireframing",
  "applicableRoles": [
    "UI/UX Designer"
  ],
  "coreConcepts": [
    "Low-fi vs High-fi",
    "User Flows",
    "Rapid Prototyping",
    "Feedback Iteration"
  ],
  "courses": [
    {
      "platform": "Coursera",
      "title": "Wireframes and Prototypes",
      "url": "https://www.coursera.org/learn/wireframes-low-fidelity-prototypes"
    }
  ]
},
{
  "skill": "Figma Fundamentals",
  "applicableRoles": [
    "UI/UX Designer"
  ],
  "coreConcepts": [
    "Auto Layout",
    "Components & Variants",
    "Prototyping Tools",
    "Plugins & Exporting"
  ],
  "courses": [
    {
      "platform": "Figma Academy",
      "title": "Learn Figma",
      "url": "https://www.figma.com/resources/learn-design/"
    }
  ]
},
{
  "skill": "Content Strategy & Branding",
  "applicableRoles": [
    "Marketing Manager"
  ],
  "coreConcepts": [
    "Brand Voice & Tone",
    "Content Calendars",
    "Storytelling",
    "Omnichannel Distribution"
  ],
  "courses": [
    {
      "platform": "HubSpot",
      "title": "Content Marketing Certification",
      "url": "https://academy.hubspot.com/courses/content-marketing"
    }
  ]
},
{
  "skill": "Budget Tracking",
  "applicableRoles": [
    "Marketing Manager"
  ],
  "coreConcepts": [
    "Spend Allocation",
    "ROI Forecasting",
    "P&L Management",
    "Variance Analysis"
  ],
  "courses": [
    {
      "platform": "LinkedIn Learning",
      "title": "Marketing Budgeting",
      "url": "https://www.linkedin.com/learning/marketing-budgeting"
    }
  ]
},
{
  "skill": "Social Media Metrics",
  "applicableRoles": [
    "Marketing Manager"
  ],
  "coreConcepts": [
    "Engagement Rates",
    "Conversion Tracking",
    "Audience Insights",
    "Social Listening"
  ],
  "courses": [
    {
      "platform": "Meta Blueprint",
      "title": "Social Media Marketing",
      "url": "https://www.facebook.com/business/learn"
    }
  ]
},
{
  "skill": "Advanced Statistical Modeling",
  "applicableRoles": [
    "Data Scientist"
  ],
  "coreConcepts": [
    "Bayesian Statistics",
    "GLMs",
    "Markov Chains",
    "Monte Carlo Simulations"
  ],
  "courses": [
    {
      "platform": "Coursera",
      "title": "Advanced Statistics",
      "url": "https://www.coursera.org/learn/advanced-statistics-data-science"
    }
  ]
},
{
  "skill": "SQL & Data Wrangling",
  "applicableRoles": [
    "Data Scientist"
  ],
  "coreConcepts": [
    "Complex ETL Pipelines",
    "Data Cleaning Strategies",
    "Window Functions",
    "Regex in SQL"
  ],
  "courses": [
    {
      "platform": "Udacity",
      "title": "Data Wrangling with MongoDB",
      "url": "https://www.udacity.com/course/data-wrangling-with-mongodb--ud032"
    }
  ]
},
{
  "skill": "Cross-functional Collaboration",
  "applicableRoles": [
    "Data Scientist"
  ],
  "coreConcepts": [
    "Translating Tech to Business",
    "Stakeholder Alignment",
    "Agile Workflows",
    "Effective Presentations"
  ],
  "courses": [
    {
      "platform": "LinkedIn Learning",
      "title": "Cross-Functional Teams",
      "url": "https://www.linkedin.com/learning/working-on-a-cross-functional-team-2"
    }
  ]
},
{
  "skill": "General Skill Review",
  "applicableRoles": [
    "All"
  ],
  "coreConcepts": [
    "Industry Standards",
    "Practical Application",
    "Theory vs Practice",
    "Continuous Learning"
  ],
  "courses": [
    {
      "platform": "Coursera",
      "title": "Learning How to Learn",
      "url": "https://www.coursera.org/learn/learning-how-to-learn"
    }
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
        url: "https://www.geeksforgeeks.org/a-b-testing-in-data-science/", 
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
        url: "https://igotanoffer.com/blogs/product-manager/product-manager-interview-questions",
        description: "Product design, strategy, and execution questions."
      },
      {
        title: "Product Sense & Case Studies",
        url: "https://www.tryexponent.com/courses/pm",
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
  },
  {
    role: "Marketing Manager",
    interviewGuides: [
      {
        title: "Top Digital Marketing Interview Questions",
        url: "https://www.edureka.co/blog/digital-marketing-interview-questions/",
        description: "Covers SEO, SEM, analytics, and campaign strategy questions."
      },
      {
        title: "Growth Marketing Case Studies",
        url: "https://growthhackers.com/growth-studies/",
        description: "Real-world examples of successful marketing campaigns and ROI analysis."
      }
    ]
  }
];

export const quizzes = [
  {
    title: "Frontend Foundations",
    domain: "Frontend",
    timeLimitMinutes: 10,
    totalQuestions: 6,
    questions: [
      {
        prompt: "Which React hook is used to manage component state in a function component?",
        skill: "React",
        difficulty: "easy",
        options: [
          { label: "useRef", value: "useRef" },
          { label: "useState", value: "useState" },
          { label: "useEffect", value: "useEffect" },
          { label: "useContext", value: "useContext" }
        ],
        correctAnswer: "useState",
        explanation: "useState stores local reactive state in function components."
      },
      {
        prompt: "Which CSS layout system is best suited for one-dimensional alignment?",
        skill: "CSS",
        difficulty: "easy",
        options: [
          { label: "Grid", value: "Grid" },
          { label: "Flexbox", value: "Flexbox" },
          { label: "Float", value: "Float" },
          { label: "Position", value: "Position" }
        ],
        correctAnswer: "Flexbox",
        explanation: "Flexbox is ideal for one-dimensional row or column layouts."
      },
      {
        prompt: "What is the main benefit of semantic HTML for SDG-aligned accessible learning tools?",
        skill: "Accessibility",
        difficulty: "medium",
        options: [
          { label: "It reduces API calls", value: "reduce-api" },
          { label: "It improves screen-reader comprehension", value: "screen-reader" },
          { label: "It replaces CSS media queries", value: "replace-css" },
          { label: "It removes the need for labels", value: "remove-labels" }
        ],
        correctAnswer: "screen-reader",
        explanation: "Semantic HTML improves structure and accessibility for assistive technologies."
      },
      {
        prompt: "Which strategy helps a UI stay responsive across devices?",
        skill: "Responsive Design",
        difficulty: "medium",
        options: [
          { label: "Only fixed pixel widths", value: "fixed" },
          { label: "CSS media queries and fluid layouts", value: "media-queries" },
          { label: "Inline styles only", value: "inline" },
          { label: "Single-column desktop-first only", value: "single-column" }
        ],
        correctAnswer: "media-queries",
        explanation: "Fluid layouts with breakpoints keep interfaces usable on different screens."
      },
      {
        prompt: "What is the safest way to render data returned from an API in React lists?",
        skill: "API Integration",
        difficulty: "hard",
        options: [
          { label: "Assume the payload always has the right shape", value: "assume" },
          { label: "Validate fields and use stable keys", value: "validate" },
          { label: "Mutate the response directly in JSX", value: "mutate" },
          { label: "Render without loading states", value: "render-fast" }
        ],
        correctAnswer: "validate",
        explanation: "Validation and stable keys protect against UI errors and mismatched renders."
      },
      {
        prompt: "Why is Git useful in collaborative product development?",
        skill: "Git",
        difficulty: "hard",
        options: [
          { label: "It replaces documentation", value: "docs" },
          { label: "It tracks changes and supports teamwork", value: "teamwork" },
          { label: "It hosts databases", value: "db" },
          { label: "It automatically writes code", value: "writes-code" }
        ],
        correctAnswer: "teamwork",
        explanation: "Git gives teams traceable version control and safer collaboration workflows."
      }
    ]
  },
  {
    title: "Full Stack Core Skills",
    domain: "Full Stack",
    timeLimitMinutes: 12,
    totalQuestions: 6,
    questions: [
      {
        prompt: "Which Express middleware is commonly used to parse incoming JSON request bodies?",
        skill: "Express",
        difficulty: "easy",
        options: [
          { label: "express.json()", value: "express.json" },
          { label: "express.static()", value: "express.static" },
          { label: "express.Router()", value: "express.router" },
          { label: "cors()", value: "cors" }
        ],
        correctAnswer: "express.json",
        explanation: "express.json() parses JSON payloads into req.body."
      },
      {
        prompt: "Which MongoDB feature helps represent nested skill data cleanly in a user profile?",
        skill: "MongoDB",
        difficulty: "easy",
        options: [
          { label: "Document schema", value: "document-schema" },
          { label: "Terminal prompts", value: "terminal" },
          { label: "Cron tabs", value: "cron" },
          { label: "Web sockets only", value: "ws" }
        ],
        correctAnswer: "document-schema",
        explanation: "Document-oriented schemas map well to nested profile and skill structures."
      },
      {
        prompt: "What is the main purpose of JWT in a web platform like SkillBridge?",
        skill: "JWT",
        difficulty: "medium",
        options: [
          { label: "Store CSS themes", value: "css" },
          { label: "Persist authentication claims", value: "auth-claims" },
          { label: "Run database migrations", value: "migrations" },
          { label: "Compile React components", value: "compile" }
        ],
        correctAnswer: "auth-claims",
        explanation: "JWT stores signed claims used for stateless authentication."
      },
      {
        prompt: "What is a benefit of separating frontend, backend, and ML services in a modular architecture?",
        skill: "Problem Solving",
        difficulty: "medium",
        options: [
          { label: "Harder deployments", value: "harder" },
          { label: "Independent scaling and easier maintenance", value: "scaling" },
          { label: "No need for API contracts", value: "no-api" },
          { label: "Removes testing", value: "remove-testing" }
        ],
        correctAnswer: "scaling",
        explanation: "Service boundaries make modules easier to evolve and replace."
      },
      {
        prompt: "Which practice best protects API routes that return learner analytics?",
        skill: "REST API",
        difficulty: "hard",
        options: [
          { label: "Public routes with no checks", value: "public" },
          { label: "JWT verification and ownership checks", value: "verify" },
          { label: "Base64 encoding only", value: "base64" },
          { label: "A hidden button in the UI", value: "hidden-button" }
        ],
        correctAnswer: "verify",
        explanation: "Protected analytics routes should verify identity and authorization."
      },
      {
        prompt: "What does Node.js mainly provide in this stack?",
        skill: "Node.js",
        difficulty: "hard",
        options: [
          { label: "A client-side styling engine", value: "styling" },
          { label: "A JavaScript runtime for backend services", value: "runtime" },
          { label: "A replacement for MongoDB", value: "db" },
          { label: "A PDF editor", value: "pdf" }
        ],
        correctAnswer: "runtime",
        explanation: "Node.js runs JavaScript on the server and powers the Express API."
      }
    ]
  }
];


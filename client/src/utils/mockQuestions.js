// Helper to shuffle an array
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Helper to shuffle options and keep track of correct answer string
const randomizeOptions = (question) => {
  return {
    ...question,
    options: shuffleArray(question.options)
  };
};

// Role-specific Aptitude Banks
const dataAptitude = [
  { text: "If the probability of event A is 0.4 and event B is 0.5, and they are independent, what is the probability of both occurring?", options: ["0.9", "0.2", "0.1", "0.8"], correctAnswer: "0.2", section: "aptitude", difficulty: "medium" },
  { text: "A dataset has values: 2, 4, 4, 4, 5, 5, 7, 9. What is the mode?", options: ["4", "5", "7", "9"], correctAnswer: "4", section: "aptitude", difficulty: "easy" },
  { text: "Look at this series: 36, 34, 30, 28, 24, ... What number should come next?", options: ["20", "22", "23", "26"], correctAnswer: "22", section: "aptitude", difficulty: "easy" },
  { text: "If a company's revenue grows by 10% in year 1 and 20% in year 2, what is the total percentage growth?", options: ["30%", "32%", "35%", "25%"], correctAnswer: "32%", section: "aptitude", difficulty: "medium" },
  { text: "Which of the following numbers is completely divisible by 9?", options: ["4213533", "5213634", "6324645", "7325756"], correctAnswer: "5213634", section: "aptitude", difficulty: "medium" }
];

const devAptitude = [
  { text: "What is the next number in the series: 2, 6, 12, 20, 30, ...?", options: ["40", "42", "44", "48"], correctAnswer: "42", section: "aptitude", difficulty: "medium" },
  { text: "If all Bloops are Razzies and all Razzies are Lazzies, which of the following is necessarily true?", options: ["All Lazzies are Bloops", "Some Lazzies are definitely not Bloops", "All Bloops are Lazzies", "No Razzies are Bloops"], correctAnswer: "All Bloops are Lazzies", section: "aptitude", difficulty: "hard" },
  { text: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?", options: ["120 metres", "180 metres", "324 metres", "150 metres"], correctAnswer: "150 metres", section: "aptitude", difficulty: "medium" },
  { text: "If 5 machines take 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?", options: ["1 minute", "5 minutes", "100 minutes", "500 minutes"], correctAnswer: "5 minutes", section: "aptitude", difficulty: "medium" },
  { text: "In a certain code, 'COMPUTER' is written as 'RFUVQNPC'. How is 'MEDICINE' written in that code?", options: ["MFEDJJOE", "EOJDEJFM", "MFEJDJOE", "EOJDJEFM"], correctAnswer: "EOJDJEFM", section: "aptitude", difficulty: "hard" }
];

const productAptitude = [
  { text: "A product's user base doubles every month. If it takes 12 months to reach 100% market penetration, when was it at 50%?", options: ["Month 6", "Month 11", "Month 9", "Month 10"], correctAnswer: "Month 11", section: "aptitude", difficulty: "medium" },
  { text: "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?", options: ["$0.05", "$0.10", "$1.00", "$0.50"], correctAnswer: "$0.05", section: "aptitude", difficulty: "medium" },
  { text: "SCD, TEF, UGH, ____, WKL. What comes in the blank?", options: ["CMN", "UJI", "VIJ", "IJT"], correctAnswer: "VIJ", section: "aptitude", difficulty: "easy" },
  { text: "If 3 PMs can write 3 specs in 3 days, how long does it take 1 PM to write 1 spec?", options: ["1 day", "3 days", "9 days", "0.33 days"], correctAnswer: "3 days", section: "aptitude", difficulty: "medium" },
  { text: "If a project has a 20% chance of failing in phase 1 and a 50% chance of failing in phase 2, what is the chance of succeeding both?", options: ["30%", "40%", "50%", "70%"], correctAnswer: "40%", section: "aptitude", difficulty: "hard" },
  { text: "Which number replaces the question mark? 2, 5, 9, 14, 20, ?", options: ["25", "26", "27", "28"], correctAnswer: "27", section: "aptitude", difficulty: "easy" },
  { text: "Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?", options: ["(1/3)", "(1/8)", "(2/8)", "(1/16)"], correctAnswer: "(1/8)", section: "aptitude", difficulty: "easy" }
];

const uxAptitude = [
  { text: "Which word does not belong with the others?", options: ["Parsley", "Basil", "Dill", "Mayonnaise"], correctAnswer: "Mayonnaise", section: "aptitude", difficulty: "easy" },
  { text: "If you rearrange the letters 'CIFAIPC', you would have the name of a(n):", options: ["City", "Animal", "Ocean", "River"], correctAnswer: "Ocean", section: "aptitude", difficulty: "medium" },
  { text: "Odometer is to mileage as compass is to:", options: ["Speed", "Hiking", "Needle", "Direction"], correctAnswer: "Direction", section: "aptitude", difficulty: "easy" },
  { text: "Window is to pane as book is to:", options: ["Novel", "Glass", "Cover", "Page"], correctAnswer: "Page", section: "aptitude", difficulty: "easy" },
  { text: "Cup is to coffee as bowl is to:", options: ["Dish", "Soup", "Spoon", "Food"], correctAnswer: "Soup", section: "aptitude", difficulty: "easy" },
  { text: "Play is to actor as concert is to:", options: ["Symphony", "Musician", "Piano", "Percussion"], correctAnswer: "Musician", section: "aptitude", difficulty: "easy" },
  { text: "Which number is the odd one out: 9, 16, 25, 36, 42, 49?", options: ["25", "36", "42", "49"], correctAnswer: "42", section: "aptitude", difficulty: "easy" }
];

// Role-specific Verbal Banks
const dataVerbal = [
  { text: "Identify the correct sentence.", options: ["The data is clear.", "The data are clear.", "Both are acceptable.", "Neither is acceptable."], correctAnswer: "Both are acceptable.", section: "verbal", difficulty: "easy" },
  { text: "What is the antonym of 'EMPIRICAL'?", options: ["Theoretical", "Practical", "Factual", "Observational"], correctAnswer: "Theoretical", section: "verbal", difficulty: "medium" },
  { text: "Fill in the blank: The analyst _____ the anomaly to a sensor malfunction.", options: ["attributed", "contributed", "distributed", "retributed"], correctAnswer: "attributed", section: "verbal", difficulty: "medium" },
  { text: "What is the synonym of 'CORRELATE'?", options: ["Separate", "Associate", "Deviate", "Isolate"], correctAnswer: "Associate", section: "verbal", difficulty: "easy" },
  { text: "Fill in the blank: The results were _____ from a large sample size.", options: ["derived", "deprived", "devised", "decided"], correctAnswer: "derived", section: "verbal", difficulty: "easy" }
];

const devVerbal = [
  { text: "Identify the grammatically correct sentence.", options: ["She don't like apples.", "She doesn't likes apples.", "She doesn't like apples.", "She do not likes apples."], correctAnswer: "She doesn't like apples.", section: "verbal", difficulty: "easy" },
  { text: "Fill in the blank: The company decided to _____ its operations due to heavy losses.", options: ["expand", "curtail", "promote", "invest"], correctAnswer: "curtail", section: "verbal", difficulty: "medium" },
  { text: "Which word is spelled correctly?", options: ["Accomodate", "Acommodate", "Accommodate", "Acomodate"], correctAnswer: "Accommodate", section: "verbal", difficulty: "hard" },
  { text: "Choose the correct preposition: He is extremely good _____ mathematics.", options: ["in", "at", "with", "on"], correctAnswer: "at", section: "verbal", difficulty: "easy" },
  { text: "What is the synonym of 'DEPRECATE'?", options: ["Approve", "Disapprove", "Enhance", "Support"], correctAnswer: "Disapprove", section: "verbal", difficulty: "medium" }
];

const productVerbal = [
  { text: "What is the meaning of the idiom 'Bite the bullet'?", options: ["To get angry", "To face a difficult situation with courage", "To eat something hard", "To make a mistake"], correctAnswer: "To face a difficult situation with courage", section: "verbal", difficulty: "medium" },
  { text: "Choose the word most similar in meaning to 'ABUNDANT'.", options: ["Scarce", "Plentiful", "Minimal", "Rare"], correctAnswer: "Plentiful", section: "verbal", difficulty: "easy" },
  { text: "Fill in the blank: The new feature will _____ the overall user experience.", options: ["detract", "enhance", "confuse", "complicate"], correctAnswer: "enhance", section: "verbal", difficulty: "easy" },
  { text: "What is the antonym of 'OBSOLETE'?", options: ["Ancient", "Current", "Outdated", "Antique"], correctAnswer: "Current", section: "verbal", difficulty: "medium" },
  { text: "Fill in the blank: We need to _____ our efforts to meet the deadline.", options: ["consolidate", "mitigate", "delegate", "procrastinate"], correctAnswer: "consolidate", section: "verbal", difficulty: "medium" },
  { text: "What is the synonym of 'VIABLE'?", options: ["Impossible", "Feasible", "Unlikely", "Certain"], correctAnswer: "Feasible", section: "verbal", difficulty: "medium" }
];

const uxVerbal = [
  { text: "Select the pair that expresses a similar relationship to 'Doctor : Hospital'.", options: ["Teacher : School", "Farmer : Crop", "Chef : Food", "Mechanic : Car"], correctAnswer: "Teacher : School", section: "verbal", difficulty: "easy" },
  { text: "What is the synonym of 'AESTHETIC'?", options: ["Ugly", "Functional", "Beautiful", "Practical"], correctAnswer: "Beautiful", section: "verbal", difficulty: "easy" },
  { text: "Fill in the blank: The design was so _____ that it won an award.", options: ["mediocre", "innovative", "mundane", "derivative"], correctAnswer: "innovative", section: "verbal", difficulty: "easy" },
  { text: "What is the antonym of 'INTUITIVE'?", options: ["Natural", "Instinctive", "Confusing", "Innate"], correctAnswer: "Confusing", section: "verbal", difficulty: "medium" },
  { text: "Fill in the blank: Her presentation was highly _____, capturing everyone's attention.", options: ["boring", "engaging", "repetitive", "confusing"], correctAnswer: "engaging", section: "verbal", difficulty: "easy" },
  { text: "What is the synonym of 'ITERATIVE'?", options: ["Final", "Repetitive", "Unique", "Instant"], correctAnswer: "Repetitive", section: "verbal", difficulty: "medium" }
];

const codeReasoningBank = [
  { 
    text: "What does this code output?\n\n```javascript\nlet a = 10;\nlet b = '10';\nconsole.log(a == b, a === b);\n```", 
    options: ["true true", "true false", "false true", "false false"], 
    correctAnswer: "true false", 
    section: "code_reasoning", 
    codeSubtype: "output_prediction",
    difficulty: "hard"
  },
  { 
    text: "Which line contains a bug that will cause an error?\n\n```javascript\n1: const user = { name: 'Alice' };\n2: Object.freeze(user);\n3: user.age = 25;\n4: console.log(user.name);\n```", 
    options: ["Line 1", "Line 2", "Line 3", "Line 4 (None, it just fails silently in non-strict mode but throws in strict mode)"], 
    correctAnswer: "Line 3", 
    section: "code_reasoning", 
    codeSubtype: "bug_spotting",
    difficulty: "hard"
  },
  { 
    text: "Order these lines to correctly fetch data and parse JSON:\n1: const data = await response.json();\n2: const response = await fetch('/api/data');\n3: return data;", 
    options: ["1, 2, 3", "2, 1, 3", "3, 2, 1", "2, 3, 1"], 
    correctAnswer: "2, 1, 3", 
    section: "code_reasoning", 
    codeSubtype: "code_ordering",
    difficulty: "hard"
  },
  { 
    text: "Fill in the blank to filter out odd numbers:\n\n```javascript\nconst evens = [1, 2, 3, 4].filter(num => _______);\n```", 
    options: ["num % 2 == 1", "num % 2 == 0", "num / 2 == 0", "num * 2 == 0"], 
    correctAnswer: "num % 2 == 0", 
    section: "code_reasoning", 
    codeSubtype: "fill_blank",
    difficulty: "medium"
  },
  { 
    text: "What is the output of the following code?\n\n```javascript\nconsole.log(typeof null);\n```", 
    options: ["'null'", "'undefined'", "'object'", "'number'"], 
    correctAnswer: "'object'", 
    section: "code_reasoning", 
    codeSubtype: "output_prediction",
    difficulty: "medium"
  },
  { 
    text: "How do you correctly clone a JavaScript object `obj` without mutating it?", 
    options: ["const newObj = obj;", "const newObj = Object.assign(obj);", "const newObj = { ...obj };", "const newObj = Object.create(obj);"], 
    correctAnswer: "const newObj = { ...obj };", 
    section: "code_reasoning", 
    codeSubtype: "bug_spotting",
    difficulty: "medium"
  }
];

// Role-specific Technical Banks
const dataQuestions = [
  { text: "Which of the following is a common method for handling missing data in a dataset?", options: ["Mean/Median Imputation", "Listwise Deletion", "Data Augmentation", "All of the above"], correctAnswer: "All of the above", section: "technical", skill: "Advanced Domain Concepts", difficulty: "easy" },
  { text: "What is the primary purpose of a validation set in machine learning?", options: ["To train the model", "To tune hyperparameters", "To evaluate final performance", "To clean data"], correctAnswer: "To tune hyperparameters", section: "technical", skill: "Machine Learning Fundamentals", difficulty: "medium" },
  { text: "Which algorithm is typically used for classification tasks?", options: ["Linear Regression", "K-Means Clustering", "Random Forest", "Principal Component Analysis"], correctAnswer: "Random Forest", section: "technical", skill: "Machine Learning Fundamentals", difficulty: "easy" },
  { text: "What does the p-value indicate in hypothesis testing?", options: ["Probability of null hypothesis being true", "Probability of rejecting null hypothesis when true", "Probability of observing the data given the null hypothesis is true", "None of the above"], correctAnswer: "Probability of observing the data given the null hypothesis is true", section: "technical", skill: "Statistical Analysis", difficulty: "hard" },
  { text: "Which evaluation metric is best for imbalanced classification datasets?", options: ["Accuracy", "F1 Score", "Mean Squared Error", "R-squared"], correctAnswer: "F1 Score", section: "technical", skill: "Statistical Analysis", difficulty: "medium" },
  { text: "In SQL, what is the difference between WHERE and HAVING?", options: ["WHERE filters before grouping, HAVING filters after grouping", "HAVING is for joins, WHERE is for selects", "They are identical", "WHERE is only for numeric data"], correctAnswer: "WHERE filters before grouping, HAVING filters after grouping", section: "technical", skill: "SQL & Database Optimization", difficulty: "medium" },
  { text: "What is the curse of dimensionality?", options: ["Algorithms get faster with more dimensions", "Data becomes sparse as dimensions increase, degrading model performance", "Visualizing 3D data is difficult", "None of the above"], correctAnswer: "Data becomes sparse as dimensions increase, degrading model performance", section: "technical", skill: "Advanced Domain Concepts", difficulty: "hard" },
  { text: "Which chart is most appropriate for visualizing the distribution of a single continuous variable?", options: ["Scatter plot", "Pie chart", "Histogram", "Line graph"], correctAnswer: "Histogram", section: "technical", skill: "Data Visualization (Tableau/PowerBI)", difficulty: "easy" },
  { text: "What SQL clause is used to sort the result-set?", options: ["SORT BY", "ORDER BY", "GROUP BY", "ALIGN BY"], correctAnswer: "ORDER BY", section: "technical", skill: "SQL & Database Optimization", difficulty: "easy" },
  { text: "What does a correlation coefficient of -1 indicate?", options: ["No correlation", "A perfect positive correlation", "A perfect negative correlation", "An error in calculation"], correctAnswer: "A perfect negative correlation", section: "technical", skill: "Data Visualization (Tableau/PowerBI)", difficulty: "medium" },
  { text: "Which of the following represents a Left Join in SQL?", options: ["Returns all records from the left table, and matched records from the right table", "Returns all records when there is a match in either left or right table", "Returns records that have matching values in both tables", "Returns all records from the right table"], correctAnswer: "Returns all records from the left table, and matched records from the right table", section: "technical", skill: "SQL & Database Optimization", difficulty: "medium" },
  { text: "What is overfitting in machine learning?", options: ["Model performs well on training data but poorly on unseen data", "Model performs poorly on training data", "Model requires too much computing power", "Model under-represents the data variance"], correctAnswer: "Model performs well on training data but poorly on unseen data", section: "technical", skill: "Machine Learning Fundamentals", difficulty: "easy" },
  { text: "Which pandas function is used to read a CSV file into a DataFrame?", options: ["pd.read_csv()", "pd.open_csv()", "pd.load_csv()", "pd.import_csv()"], correctAnswer: "pd.read_csv()", section: "technical", skill: "Python (Data Science Stack)", difficulty: "easy" },
  { text: "When communicating analytical findings to non-technical stakeholders, what is the best approach?", options: ["Use complex jargon", "Present raw datasets without visualization", "Focus on actionable insights and business impact", "Only show the statistical formulas used"], correctAnswer: "Focus on actionable insights and business impact", section: "technical", skill: "Business Communication", difficulty: "medium" },
  { text: "What defines strategic execution in a data role?", options: ["Running queries as fast as possible", "Aligning data initiatives with broader business goals", "Using the most expensive tools", "Avoiding all meetings"], correctAnswer: "Aligning data initiatives with broader business goals", section: "technical", skill: "Strategic Execution", difficulty: "medium" },
  { text: "How should a data scientist approach cross-functional collaboration with the marketing team?", options: ["Ignore their requests", "Build models without understanding their domain", "Translate their business problems into data questions and communicate progress iteratively", "Tell them data science is too complex to explain"], correctAnswer: "Translate their business problems into data questions and communicate progress iteratively", section: "technical", skill: "Cross-functional Collaboration", difficulty: "easy" }
];

const devQuestions = [
  { text: "In React, what hook is used for side effects?", options: ["useEffect", "useState", "useContext", "useReducer"], correctAnswer: "useEffect", section: "technical", skill: "React & Next.js Performance", difficulty: "easy" },
  { text: "What is the primary benefit of Server-Side Rendering (SSR)?", options: ["Smaller bundle size", "Improved SEO and initial load time", "Easier state management", "Cheaper hosting"], correctAnswer: "Improved SEO and initial load time", section: "technical", skill: "React & Next.js Performance", difficulty: "medium" },
  { text: "Which HTTP method is typically used to partially update a resource?", options: ["POST", "PUT", "PATCH", "DELETE"], correctAnswer: "PATCH", section: "technical", skill: "REST API Development", difficulty: "medium" },
  { text: "What is a closure in JavaScript?", options: ["A function bundled with its lexical environment", "A block of code to handle errors", "A method to close a database connection", "A design pattern for UI components"], correctAnswer: "A function bundled with its lexical environment", section: "technical", skill: "React & Next.js", difficulty: "hard" },
  { text: "What is the purpose of an index in a relational database?", options: ["To define primary keys", "To speed up data retrieval operations", "To encrypt stored data", "To link two tables"], correctAnswer: "To speed up data retrieval operations", section: "technical", skill: "SQL & Database Optimization", difficulty: "medium" },
  { text: "Which tool is commonly used for containerization?", options: ["Webpack", "Git", "Docker", "Jenkins"], correctAnswer: "Docker", section: "technical", skill: "System Design & Architecture", difficulty: "easy" },
  { text: "In Node.js, what is the Event Loop responsible for?", options: ["Rendering HTML", "Handling asynchronous operations", "Compiling TypeScript", "Managing the DOM"], correctAnswer: "Handling asynchronous operations", section: "technical", skill: "Node.js Fundamentals", difficulty: "hard" },
  { text: "What does ACID stand for in the context of databases?", options: ["Atomicity, Consistency, Isolation, Durability", "Asynchronous, Concurrent, Isolated, Distributed", "Authentication, Control, Identification, Data", "Automated, Computed, Iterative, Dynamic"], correctAnswer: "Atomicity, Consistency, Isolation, Durability", section: "technical", skill: "SQL & Database Optimization", difficulty: "medium" },
  { text: "What is the main advantage of a microservices architecture over a monolithic one?", options: ["It is always faster", "It allows independent deployment and scaling of services", "It uses less memory", "It requires no networking"], correctAnswer: "It allows independent deployment and scaling of services", section: "technical", skill: "System Design & Architecture", difficulty: "medium" },
  { text: "What is the utility-first CSS framework that uses classes like 'flex', 'pt-4', and 'text-center'?", options: ["Bootstrap", "Foundation", "Tailwind CSS", "Bulma"], correctAnswer: "Tailwind CSS", section: "technical", skill: "CSS/Tailwind Architecture", difficulty: "easy" },
  { text: "What is the Virtual DOM in React?", options: ["A lightweight copy of the actual DOM", "A CSS framework", "A browser extension for debugging", "A separate hardware component"], correctAnswer: "A lightweight copy of the actual DOM", section: "technical", skill: "React & Next.js", difficulty: "medium" },
  { text: "What does a reverse proxy do?", options: ["Directs client requests to the appropriate backend server", "Encrypts local databases", "Serves as a frontend client", "Stores caching keys only"], correctAnswer: "Directs client requests to the appropriate backend server", section: "technical", skill: "System Design & Architecture", difficulty: "medium" },
  { text: "Which state management library relies heavily on a centralized store, actions, and reducers?", options: ["Redux", "Jotai", "Recoil", "React Query"], correctAnswer: "Redux", section: "technical", skill: "Advanced State Management", difficulty: "medium" },
  { text: "How can you optimize state management in React to avoid unnecessary re-renders?", options: ["Use context for everything", "Split contexts or use atomic state libraries like Jotai/Zustand", "Always use Redux", "Pass all state as props from the root"], correctAnswer: "Split contexts or use atomic state libraries like Jotai/Zustand", section: "technical", skill: "Advanced State Management", difficulty: "hard" }
];

const productQuestions = [
  { text: "What is an MVP (Minimum Viable Product)?", options: ["The most expensive product version", "A product with enough features to attract early adopters and validate ideas", "A completely bug-free release", "The final version of a product"], correctAnswer: "A product with enough features to attract early adopters and validate ideas", section: "technical", skill: "Go-To-Market Strategy", difficulty: "easy" },
  { text: "Which metric is best to measure user retention?", options: ["Daily Active Users (DAU)", "Customer Acquisition Cost (CAC)", "Churn Rate", "Net Promoter Score (NPS)"], correctAnswer: "Churn Rate", section: "technical", skill: "Data-Driven Prioritization", difficulty: "medium" },
  { text: "What is Agile methodology primarily focused on?", options: ["Comprehensive documentation", "Iterative development and rapid delivery", "Rigid planning", "Sequential design processes"], correctAnswer: "Iterative development and rapid delivery", section: "technical", skill: "Agile Fundamentals", difficulty: "easy" },
  { text: "What is a User Story?", options: ["An informal, natural language description of a feature from the perspective of an end user", "A marketing blog post", "A technical architecture document", "A customer support ticket"], correctAnswer: "An informal, natural language description of a feature from the perspective of an end user", section: "technical", skill: "User Story Mapping", difficulty: "medium" },
  { text: "Which prioritization framework uses 'Must have, Should have, Could have, Won't have'?", options: ["RICE", "MoSCoW", "Kano Model", "Value vs Effort"], correctAnswer: "MoSCoW", section: "technical", skill: "Data-Driven Prioritization", difficulty: "easy" },
  { text: "What is the primary goal of product discovery?", options: ["Writing code", "Finding out what to build and why", "Marketing the product", "Hiring engineers"], correctAnswer: "Finding out what to build and why", section: "technical", skill: "Go-To-Market Strategy", difficulty: "medium" },
  { text: "In Scrum, who is responsible for maximizing the value of the product?", options: ["Scrum Master", "Development Team", "Product Owner", "Project Manager"], correctAnswer: "Product Owner", section: "technical", skill: "Agile Fundamentals", difficulty: "easy" },
  { text: "What is A/B testing?", options: ["Testing two versions of a product to see which performs better", "Testing software for bugs", "A method for backend load balancing", "Interviewing two customers simultaneously"], correctAnswer: "Testing two versions of a product to see which performs better", section: "technical", skill: "Data-Driven Prioritization", difficulty: "easy" },
  { text: "When evaluating a new feature request from a large customer, what is the best approach?", options: ["Build it immediately to keep them happy", "Assess how it aligns with the overall product vision and benefits the broader user base", "Ignore it unless multiple customers ask", "Let engineering decide"], correctAnswer: "Assess how it aligns with the overall product vision and benefits the broader user base", section: "technical", skill: "Data-Driven Prioritization", difficulty: "medium" },
  { text: "Which part of a User Story defines when the story is complete?", options: ["The Title", "Acceptance Criteria", "The Description", "The Story Points"], correctAnswer: "Acceptance Criteria", section: "technical", skill: "User Story Mapping", difficulty: "easy" },
  { text: "What does CAC stand for in product analytics?", options: ["Customer Average Cost", "Customer Acquisition Cost", "Company Annual Capital", "Centralized Analytics Center"], correctAnswer: "Customer Acquisition Cost", section: "technical", skill: "Go-To-Market Strategy", difficulty: "easy" },
  { text: "What does NPS measure?", options: ["Network Protocol Security", "Net Promoter Score (customer loyalty)", "New Product Sales", "None of the above"], correctAnswer: "Net Promoter Score (customer loyalty)", section: "technical", skill: "Business Communication", difficulty: "easy" },
  { text: "Which of the following best describes the RICE scoring model?", options: ["Reach, Impact, Confidence, Effort", "Reliability, Integrity, Consistency, Efficiency", "Revenue, Investment, Cost, Earnings", "Research, Ideation, Creation, Evaluation"], correctAnswer: "Reach, Impact, Confidence, Effort", section: "technical", skill: "Data-Driven Prioritization", difficulty: "medium" },
  { text: "Who primarily manages the Product Backlog in Agile Scrum?", options: ["Scrum Master", "Product Owner", "Development Team", "Stakeholders"], correctAnswer: "Product Owner", section: "technical", skill: "Agile Fundamentals", difficulty: "easy" }
];

const uxQuestions = [
  { text: "What does 'Affordance' mean in UX design?", options: ["The cost of a design tool", "Properties of an object that indicate how it can be used", "A legal term for design patents", "The color palette of a UI"], correctAnswer: "Properties of an object that indicate how it can be used", section: "technical", skill: "Interaction Design", difficulty: "medium" },
  { text: "Which law states that the time to acquire a target is a function of the distance to and size of the target?", options: ["Hick's Law", "Fitts's Law", "Miller's Law", "Jakob's Law"], correctAnswer: "Fitts's Law", section: "technical", skill: "Interaction Design", difficulty: "hard" },
  { text: "What is a heuristic evaluation?", options: ["An automated code review", "A usability inspection method where evaluators examine an interface and judge its compliance with usability principles", "A survey given to end users", "A tool for creating wireframes"], correctAnswer: "A usability inspection method where evaluators examine an interface and judge its compliance with usability principles", section: "technical", skill: "User Research Methods", difficulty: "medium" },
  { text: "What is a wireframe?", options: ["A high-fidelity interactive prototype", "A low-fidelity structural representation of a web page layout", "A network diagram", "A database schema"], correctAnswer: "A low-fidelity structural representation of a web page layout", section: "technical", skill: "Prototyping & Wireframing", difficulty: "easy" },
  { text: "In color theory, what are complementary colors?", options: ["Colors next to each other on the color wheel", "Colors opposite each other on the color wheel", "Different shades of the same color", "Colors with the same saturation"], correctAnswer: "Colors opposite each other on the color wheel", section: "technical", skill: "Interaction Design", difficulty: "easy" },
  { text: "What is cognitive load?", options: ["The time it takes for a page to load", "The amount of mental processing power needed to use an interface", "The physical weight of a device", "A metric for server performance"], correctAnswer: "The amount of mental processing power needed to use an interface", section: "technical", skill: "Interaction Design", difficulty: "medium" },
  { text: "Which tool is considered the industry standard for collaborative UI design and prototyping today?", options: ["Adobe Photoshop", "Microsoft Paint", "Figma", "AutoCAD"], correctAnswer: "Figma", section: "technical", skill: "Figma Fundamentals", difficulty: "easy" },
  { text: "What does 'accessibility' (a11y) ensure in digital design?", options: ["The app is free to download", "The app can be used by people with a wide range of abilities and disabilities", "The app works offline", "The app is responsive on mobile devices"], correctAnswer: "The app can be used by people with a wide range of abilities and disabilities", section: "technical", skill: "Interaction Design", difficulty: "medium" },
  { text: "What is a user persona?", options: ["A real customer who uses the product", "A fictional character created to represent a user type that might use a site or product", "A login credential", "A customer support agent"], correctAnswer: "A fictional character created to represent a user type that might use a site or product", section: "technical", skill: "User Research Methods", difficulty: "easy" },
  { text: "What is white space in design?", options: ["Empty areas between design elements", "A specific color code (#FFFFFF)", "A blank HTML document", "A cloud storage area"], correctAnswer: "Empty areas between design elements", section: "technical", skill: "Prototyping & Wireframing", difficulty: "easy" },
  { text: "What is the primary difference between a wireframe and a prototype?", options: ["A wireframe is interactive, a prototype is static", "A wireframe is static and low-fidelity, a prototype is interactive", "They are exactly the same thing", "A wireframe is used for code, a prototype is for design"], correctAnswer: "A wireframe is static and low-fidelity, a prototype is interactive", section: "technical", skill: "Prototyping & Wireframing", difficulty: "medium" },
  { text: "Which research method is best for understanding WHY a user behaves in a certain way?", options: ["A/B Testing", "Analytics tracking", "Qualitative User Interviews", "Heatmaps"], correctAnswer: "Qualitative User Interviews", section: "technical", skill: "User Research Methods", difficulty: "medium" },
  { text: "What is a microinteraction?", options: ["A tiny piece of code", "A small, functional animation or design element that provides feedback", "A brief meeting with a stakeholder", "A small font size"], correctAnswer: "A small, functional animation or design element that provides feedback", section: "technical", skill: "Interaction Design", difficulty: "easy" },
  { text: "According to Hick's Law, what happens when you increase the number of choices?", options: ["Decision time decreases", "Decision time increases logarithmically", "Users make better choices", "It has no effect on decision time"], correctAnswer: "Decision time increases logarithmically", section: "technical", skill: "User Research Methods", difficulty: "hard" }
];

const marketingQuestions = [
  { text: "Which bidding strategy is most appropriate for a campaign focused on lead generation with a strict target cost?", options: ["Target CPA", "Target ROAS", "Maximize Clicks", "Target Impression Share"], correctAnswer: "Target CPA", section: "technical", skill: "Digital Marketing (SEO/SEM)", difficulty: "medium" },
  { text: "What is the primary difference between SEO and SEM?", options: ["SEO is organic traffic, SEM involves paid search", "SEO is paid, SEM is organic", "They are identical terms", "SEO is for social media, SEM is for search engines"], correctAnswer: "SEO is organic traffic, SEM involves paid search", section: "technical", skill: "Digital Marketing (SEO/SEM)", difficulty: "easy" },
  { text: "How do you calculate Customer Acquisition Cost (CAC)?", options: ["Total Sales / Number of Customers", "Total Marketing and Sales Cost / Number of New Customers Acquired", "Total Revenue / Total Ad Spend", "Lifetime Value - Ad Spend"], correctAnswer: "Total Marketing and Sales Cost / Number of New Customers Acquired", section: "technical", skill: "Marketing Analytics (ROI/CAC)", difficulty: "medium" },
  { text: "What is the purpose of UTM parameters in a URL?", options: ["To encrypt the website connection", "To track the source, medium, and campaign name of traffic in Google Analytics", "To improve page loading speed", "To dynamically change the page content"], correctAnswer: "To track the source, medium, and campaign name of traffic in Google Analytics", section: "technical", skill: "Marketing Analytics (ROI/CAC)", difficulty: "easy" },
  { text: "Which element is most critical in direct-response copywriting?", options: ["A clear and compelling Call to Action (CTA)", "Complex vocabulary", "A minimalist design without text", "Using a passive voice"], correctAnswer: "A clear and compelling Call to Action (CTA)", section: "technical", skill: "Content & Copywriting", difficulty: "medium" },
  { text: "What is A/B testing in the context of email marketing?", options: ["Sending an email twice to the same person", "Sending two variations of an email to a subset of subscribers to see which performs better before sending to the rest", "Testing if the email server is online", "Using two different email clients"], correctAnswer: "Sending two variations of an email to a subset of subscribers to see which performs better before sending to the rest", section: "technical", skill: "Marketing Analytics (ROI/CAC)", difficulty: "easy" },
  { text: "When conducting Marketing Mix Modeling, what are you primarily trying to determine?", options: ["Which font to use on a landing page", "The historical impact of various marketing tactics to optimize future spend and predict ROI", "The exact age of your customers", "Which competitor is spending the most"], correctAnswer: "The historical impact of various marketing tactics to optimize future spend and predict ROI", section: "technical", skill: "Budget Optimization", difficulty: "hard" },
  { text: "If your campaign's CPA is rising but your conversion rate is steady, what is likely happening?", options: ["Your Cost Per Click (CPC) or CPM is increasing", "Your website is broken", "You have stopped spending money", "Users are converting more often"], correctAnswer: "Your Cost Per Click (CPC) or CPM is increasing", section: "technical", skill: "Budget Optimization", difficulty: "hard" },
  { text: "What is an effective strategy for aligning the sales and marketing teams?", options: ["Keep them in separate buildings", "Establish shared KPIs (like pipeline generated) and regular feedback loops", "Let marketing dictate all sales scripts", "Only let sales talk to customers"], correctAnswer: "Establish shared KPIs (like pipeline generated) and regular feedback loops", section: "technical", skill: "Cross-functional Collaboration", difficulty: "medium" },
  { text: "Which tool is standard for creating and managing an inbound marketing and sales pipeline?", options: ["Adobe Premiere", "HubSpot", "AutoCAD", "Figma"], correctAnswer: "HubSpot", section: "technical", skill: "Digital Marketing (SEO/SEM)", difficulty: "easy" }
];

export const generateRoleQuestions = (role) => {
  const normalizedRole = role ? role.toLowerCase() : "";
  
  let technicalQuestions = [];
  let aptitudeQuestions = [];
  let verbalQuestions = [];
  let isTechnicalRole = true;

  if (normalizedRole.includes("data") || normalizedRole.includes("analyst") || normalizedRole.includes("scientist") || normalizedRole.includes("machine learning")) {
    technicalQuestions = [...dataQuestions];
    aptitudeQuestions = [...dataAptitude];
    verbalQuestions = [...dataVerbal];
  } else if (normalizedRole.includes("marketing")) {
    technicalQuestions = [...marketingQuestions];
    aptitudeQuestions = [...productAptitude];
    verbalQuestions = [...productVerbal];
    isTechnicalRole = false;
  } else if (normalizedRole.includes("product") || normalizedRole.includes("manager")) {
    technicalQuestions = [...productQuestions];
    aptitudeQuestions = [...productAptitude];
    verbalQuestions = [...productVerbal];
    isTechnicalRole = false;
  } else if (normalizedRole.includes("ux") || normalizedRole.includes("ui") || normalizedRole.includes("design")) {
    technicalQuestions = [...uxQuestions];
    aptitudeQuestions = [...uxAptitude];
    verbalQuestions = [...uxVerbal];
    isTechnicalRole = false;
  } else {
    // Default to Full-stack / Dev
    technicalQuestions = [...devQuestions];
    aptitudeQuestions = [...devAptitude];
    verbalQuestions = [...devVerbal];
  }

  const finalQuestions = [];

  // 1. Aptitude
  finalQuestions.push(...shuffleArray(aptitudeQuestions).slice(0, isTechnicalRole ? 5 : 7));

  // 2. Verbal
  finalQuestions.push(...shuffleArray(verbalQuestions).slice(0, isTechnicalRole ? 5 : 6));

  // 3. Code Reasoning (If technical role)
  if (isTechnicalRole) {
    finalQuestions.push(...shuffleArray(codeReasoningBank).slice(0, 5));
  }

  // 4. Technical
  finalQuestions.push(...shuffleArray(technicalQuestions).slice(0, isTechnicalRole ? 10 : 12));

  // Assign sequential IDs while keeping metadata intact, and randomize the options within each question
  return finalQuestions.map((q, index) => ({
    ...randomizeOptions(q),
    id: `q_${index}`
  }));
};

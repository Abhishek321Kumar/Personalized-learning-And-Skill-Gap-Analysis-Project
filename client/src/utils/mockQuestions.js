export const generateRoleQuestions = (role) => {
  const normalizedRole = role ? role.toLowerCase() : "";
  
  const baseQuestions = [];
  
  if (normalizedRole.includes("data scientist") || normalizedRole.includes("data analyst")) {
    baseQuestions.push(
      { id: 1, text: "Which of the following is a common method for handling missing data in a dataset?", options: ["Mean/Median Imputation", "Listwise Deletion", "Data Augmentation", "All of the above"], correctIndex: 3 },
      { id: 2, text: "What is the primary purpose of a validation set in machine learning?", options: ["To train the model", "To tune hyperparameters", "To evaluate final performance", "To clean data"], correctIndex: 1 },
      { id: 3, text: "Which algorithm is typically used for classification tasks?", options: ["Linear Regression", "K-Means Clustering", "Random Forest", "Principal Component Analysis"], correctIndex: 2 },
      { id: 4, text: "What does the p-value indicate in hypothesis testing?", options: ["Probability of null hypothesis being true", "Probability of rejecting null hypothesis when true", "Probability of observing the data given the null hypothesis is true", "None of the above"], correctIndex: 2 },
      { id: 5, text: "Which evaluation metric is best for imbalanced classification datasets?", options: ["Accuracy", "F1 Score", "Mean Squared Error", "R-squared"], correctIndex: 1 },
      { id: 6, text: "What is the difference between bagging and boosting?", options: ["Bagging uses sequential models, boosting uses parallel", "Boosting reduces bias, bagging reduces variance", "Bagging is used for regression, boosting for classification", "There is no difference"], correctIndex: 1 },
      { id: 7, text: "Which activation function is most commonly used in hidden layers of a neural network?", options: ["Sigmoid", "Tanh", "ReLU", "Softmax"], correctIndex: 2 },
      { id: 8, text: "What is overfitting?", options: ["Model learns training data too well and performs poorly on unseen data", "Model is too simple to capture patterns", "Model requires more features", "Model trains too fast"], correctIndex: 0 },
      { id: 9, text: "In SQL, what is the difference between WHERE and HAVING?", options: ["WHERE filters before grouping, HAVING filters after grouping", "HAVING is for joins, WHERE is for selects", "They are identical", "WHERE is only for numeric data"], correctIndex: 0 },
      { id: 10, text: "What is the curse of dimensionality?", options: ["Algorithms get faster with more dimensions", "Data becomes sparse as dimensions increase, degrading model performance", "Visualizing 3D data is difficult", "None of the above"], correctIndex: 1 }
    );
  } else if (normalizedRole.includes("full-stack") || normalizedRole.includes("engineer") || normalizedRole.includes("developer")) {
    baseQuestions.push(
      { id: 1, text: "In React, what hook is used for side effects?", options: ["useEffect", "useState", "useContext", "useReducer"], correctIndex: 0 },
      { id: 2, text: "What is the primary benefit of Server-Side Rendering (SSR) in Next.js?", options: ["Smaller bundle size", "Improved SEO and initial load time", "Easier state management", "Cheaper hosting"], correctIndex: 1 },
      { id: 3, text: "Which HTTP method is typically used to partially update a resource?", options: ["POST", "PUT", "PATCH", "DELETE"], correctIndex: 2 },
      { id: 4, text: "What is a closure in JavaScript?", options: ["A function bundled with its lexical environment", "A block of code to handle errors", "A method to close a database connection", "A design pattern for UI components"], correctIndex: 0 },
      { id: 5, text: "Which CSS property is used to create a flex container?", options: ["display: grid", "display: flex", "position: absolute", "float: left"], correctIndex: 1 },
      { id: 6, text: "What is the purpose of an index in a relational database?", options: ["To define primary keys", "To speed up data retrieval operations", "To encrypt stored data", "To link two tables"], correctIndex: 1 },
      { id: 7, text: "Which tool is commonly used for containerization?", options: ["Webpack", "Git", "Docker", "Jenkins"], correctIndex: 2 },
      { id: 8, text: "What does CORS stand for?", options: ["Cross-Origin Resource Sharing", "Centralized Object Repository System", "Cascading Order Routing Schema", "None of the above"], correctIndex: 0 },
      { id: 9, text: "In Node.js, what is the Event Loop responsible for?", options: ["Rendering HTML", "Handling asynchronous operations", "Compiling TypeScript", "Managing the DOM"], correctIndex: 1 },
      { id: 10, text: "What is the virtual DOM in React?", options: ["A lightweight in-memory representation of the real DOM", "A separate browser window", "A plugin for Chrome", "A database for React state"], correctIndex: 0 }
    );
  } else if (normalizedRole.includes("product manager")) {
    baseQuestions.push(
      { id: 1, text: "What is an MVP (Minimum Viable Product)?", options: ["The most expensive product version", "A product with enough features to attract early adopters and validate ideas", "A completely bug-free release", "The final version of a product"], correctIndex: 1 },
      { id: 2, text: "Which metric is best to measure user retention?", options: ["Daily Active Users (DAU)", "Customer Acquisition Cost (CAC)", "Churn Rate", "Net Promoter Score (NPS)"], correctIndex: 2 },
      { id: 3, text: "What is Agile methodology primarily focused on?", options: ["Comprehensive documentation", "Iterative development and rapid delivery", "Rigid planning", "Sequential design processes"], correctIndex: 1 },
      { id: 4, text: "What is a User Story?", options: ["An informal, natural language description of a feature from the perspective of an end user", "A marketing blog post", "A technical architecture document", "A customer support ticket"], correctIndex: 0 },
      { id: 5, text: "What does CAC stand for in product analytics?", options: ["Customer Average Cost", "Customer Acquisition Cost", "Company Annual Capital", "Centralized Analytics Center"], correctIndex: 1 },
      { id: 6, text: "Which prioritization framework uses 'Must have, Should have, Could have, Won't have'?", options: ["RICE", "MoSCoW", "Kano Model", "Value vs Effort"], correctIndex: 1 },
      { id: 7, text: "What is A/B testing?", options: ["Testing two versions of a product to see which performs better", "Testing software for bugs", "A method for backend load balancing", "Interviewing two customers simultaneously"], correctIndex: 0 },
      { id: 8, text: "What is the primary goal of product discovery?", options: ["Writing code", "Finding out what to build and why", "Marketing the product", "Hiring engineers"], correctIndex: 1 },
      { id: 9, text: "What does NPS measure?", options: ["Network Protocol Security", "Net Promoter Score (customer loyalty)", "New Product Sales", "None of the above"], correctIndex: 1 },
      { id: 10, text: "In Scrum, who is responsible for maximizing the value of the product?", options: ["Scrum Master", "Development Team", "Product Owner", "Project Manager"], correctIndex: 2 }
    );
  } else if (normalizedRole.includes("ux designer") || normalizedRole.includes("ui designer")) {
    baseQuestions.push(
      { id: 1, text: "What does 'Affordance' mean in UX design?", options: ["The cost of a design tool", "Properties of an object that indicate how it can be used", "A legal term for design patents", "The color palette of a UI"], correctIndex: 1 },
      { id: 2, text: "Which law states that the time to acquire a target is a function of the distance to and size of the target?", options: ["Hick's Law", "Fitts's Law", "Miller's Law", "Jakob's Law"], correctIndex: 1 },
      { id: 3, text: "What is a heuristic evaluation?", options: ["An automated code review", "A usability inspection method where evaluators examine an interface and judge its compliance with usability principles", "A survey given to end users", "A tool for creating wireframes"], correctIndex: 1 },
      { id: 4, text: "What is a wireframe?", options: ["A high-fidelity interactive prototype", "A low-fidelity structural representation of a web page layout", "A network diagram", "A database schema"], correctIndex: 1 },
      { id: 5, text: "In color theory, what are complementary colors?", options: ["Colors next to each other on the color wheel", "Colors opposite each other on the color wheel", "Different shades of the same color", "Colors with the same saturation"], correctIndex: 1 },
      { id: 6, text: "What is cognitive load?", options: ["The time it takes for a page to load", "The amount of mental processing power needed to use an interface", "The physical weight of a device", "A metric for server performance"], correctIndex: 1 },
      { id: 7, text: "Which tool is considered the industry standard for collaborative UI design today?", options: ["Adobe Photoshop", "Microsoft Paint", "Figma", "AutoCAD"], correctIndex: 2 },
      { id: 8, text: "What does 'accessibility' (a11y) ensure in digital design?", options: ["The app is free to download", "The app can be used by people with a wide range of abilities and disabilities", "The app works offline", "The app is responsive on mobile devices"], correctIndex: 1 },
      { id: 9, text: "What is a user persona?", options: ["A real customer who uses the product", "A fictional character created to represent a user type that might use a site or product", "A login credential", "A customer support agent"], correctIndex: 1 },
      { id: 10, text: "What is white space in design?", options: ["Empty areas between design elements", "A specific color code (#FFFFFF)", "A blank HTML document", "A cloud storage area"], correctIndex: 0 }
    );
  }

  // Fallback generic questions to ensure we always have 20 total.
  const genericQuestions = [
    { id: 101, text: "Which of these is a widely used version control system?", options: ["SVN", "Git", "Mercurial", "All of the above"], correctIndex: 3 },
    { id: 102, text: "What does API stand for?", options: ["Application Programming Interface", "Applied Protocol Interface", "Application Process Integration", "Automated Programming Instruction"], correctIndex: 0 },
    { id: 103, text: "Which is a cloud computing platform?", options: ["AWS", "Eclipse", "IntelliJ", "Notepad++"], correctIndex: 0 },
    { id: 104, text: "What is Docker primarily used for?", options: ["Word processing", "Database management", "Containerization", "UI design"], correctIndex: 2 },
    { id: 105, text: "What is a RESTful API?", options: ["An architectural style for network-based applications", "A database engine", "A programming language", "A specific server OS"], correctIndex: 0 },
    { id: 106, text: "What does HTTP stand for?", options: ["Hypertext Transfer Protocol", "Hyper Transfer Text Protocol", "Hypertext Translation Protocol", "Hyper Tool Transfer Protocol"], correctIndex: 0 },
    { id: 107, text: "What is JSON?", options: ["JavaScript Object Notation", "Java Standard Output Network", "JavaScript Output Node", "Java Source Object Network"], correctIndex: 0 },
    { id: 108, text: "What does DNS stand for?", options: ["Dynamic Network System", "Domain Name System", "Distributed Name Server", "Data Network Service"], correctIndex: 1 },
    { id: 109, text: "What is CI/CD?", options: ["Continuous Integration / Continuous Deployment", "Code Inspection / Code Delivery", "Centralized Information / Central Database", "None of the above"], correctIndex: 0 },
    { id: 110, text: "Which protocol is primarily used to securely transfer web data?", options: ["HTTP", "HTTPS", "FTP", "SMTP"], correctIndex: 1 },
    { id: 111, text: "What is a relational database?", options: ["A database structured to recognize relations among stored items of information", "A database that only stores documents", "A graph-based storage system", "A completely unstructured data store"], correctIndex: 0 },
    { id: 112, text: "What does UI stand for?", options: ["User Interface", "User Integration", "Universal Identity", "Unified Information"], correctIndex: 0 },
    { id: 113, text: "Which of the following is NOT an OOP concept?", options: ["Inheritance", "Polymorphism", "Compilation", "Encapsulation"], correctIndex: 2 },
    { id: 114, text: "What is the main purpose of unit testing?", options: ["To test the entire system end-to-end", "To verify that individual components of software work as expected", "To check the user interface colors", "To test server load capacity"], correctIndex: 1 },
    { id: 115, text: "What does SQL stand for?", options: ["Structured Query Language", "Strong Question Language", "Standard Query Logic", "System Query Language"], correctIndex: 0 },
    { id: 116, text: "What is the terminal command to list files in a directory in Unix/Linux?", options: ["dir", "list", "ls", "show"], correctIndex: 2 },
    { id: 117, text: "What is an IP address?", options: ["A unique string of numbers separated by periods that identifies each computer using the Internet Protocol", "A physical location of a server", "A specific website domain name", "A type of firewall"], correctIndex: 0 },
    { id: 118, text: "What is open source software?", options: ["Software with source code that anyone can inspect, modify, and enhance", "Software that costs money", "Software only available to enterprise companies", "Software without bugs"], correctIndex: 0 },
    { id: 119, text: "What does IDE stand for?", options: ["Integrated Development Environment", "Internal Design Engine", "Interactive Data Explorer", "Internet Deployment Entry"], correctIndex: 0 },
    { id: 120, text: "Which command is used to save changes in Git?", options: ["git push", "git save", "git commit", "git add"], correctIndex: 2 }
  ];

  // Combine role-specific and generic questions to guarantee 20.
  const finalQuestions = [...baseQuestions];
  let i = 0;
  while (finalQuestions.length < 20 && i < genericQuestions.length) {
    finalQuestions.push(genericQuestions[i]);
    i++;
  }

  // Ensure unique IDs and limit to exactly 20.
  return finalQuestions.slice(0, 20).map((q, index) => ({
    ...q,
    id: `q_${index}`
  }));
};

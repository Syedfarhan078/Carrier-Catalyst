/**
 * careers.js — Static career path data
 * Includes: roadmap phases, courses, YouTube channels, interview Q&A, study plans
 */

const CAREERS = {
  datascience: {
    label: "Data Science",
    icon: "🧠",
    color: "#6C63FF",
    accent: "#a78bfa",
    description: "Master data analysis, machine learning, and AI to become a top Data Scientist.",

    roadmap: [
      {
        phase: "Foundation",
        steps: [
          "Python Basics",
          "Statistics & Probability",
          "SQL & Databases",
          "Excel / Spreadsheets",
        ],
      },
      {
        phase: "Core Skills",
        steps: [
          "Data Wrangling (Pandas, NumPy)",
          "Exploratory Data Analysis (EDA)",
          "Data Visualization (Matplotlib, Seaborn)",
        ],
      },
      {
        phase: "Machine Learning",
        steps: [
          "Supervised Learning",
          "Unsupervised Learning",
          "Model Evaluation & Tuning",
          "Feature Engineering",
        ],
      },
      {
        phase: "Advanced",
        steps: [
          "Deep Learning (TensorFlow / PyTorch)",
          "NLP & LLMs",
          "MLOps & Deployment",
          "Cloud Platforms (AWS / GCP)",
        ],
      },
    ],

    courses: [
      { title: "Python for Data Science & AI", provider: "Coursera (IBM)", link: "https://www.coursera.org/learn/python-for-applied-data-science-ai", duration: "25 hrs", level: "Beginner" },
      { title: "Mathematics for Machine Learning", provider: "Coursera", link: "https://www.coursera.org/specializations/mathematics-machine-learning", duration: "40 hrs", level: "Intermediate" },
      { title: "SQL for Data Analysis", provider: "Udacity", link: "https://www.udacity.com/course/sql-for-data-analysis--ud198", duration: "15 hrs", level: "Beginner" },
      { title: "Machine Learning Specialization", provider: "Coursera (Andrew Ng)", link: "https://www.coursera.org/specializations/machine-learning-introduction", duration: "90 hrs", level: "Intermediate" },
      { title: "Deep Learning Specialization", provider: "Coursera", link: "https://www.coursera.org/specializations/deep-learning", duration: "80 hrs", level: "Advanced" },
      { title: "LLMs & Prompt Engineering", provider: "DeepLearning.AI", link: "https://www.deeplearning.ai/short-courses/", duration: "10 hrs", level: "Advanced" },
      { title: "MLOps Fundamentals", provider: "Google Cloud", link: "https://www.coursera.org/learn/mlops-fundamentals", duration: "20 hrs", level: "Advanced" },
    ],

    youtube: [
      { channel: "StatQuest with Josh Starmer", topic: "ML & Statistics", link: "https://www.youtube.com/@statquest", subs: "1.1M" },
      { channel: "Sentdex", topic: "Python & ML Projects", link: "https://www.youtube.com/@sentdex", subs: "1.2M" },
      { channel: "3Blue1Brown", topic: "Math Intuition", link: "https://www.youtube.com/@3blue1brown", subs: "6M" },
      { channel: "Andrej Karpathy", topic: "Deep Learning & LLMs", link: "https://www.youtube.com/@AndrejKarpathy", subs: "850K" },
      { channel: "Ken Jee", topic: "Data Science Career", link: "https://www.youtube.com/@KenJee_ds", subs: "420K" },
      { channel: "Krish Naik", topic: "ML & MLOps", link: "https://www.youtube.com/@krishnaik06", subs: "1M" },
    ],

    interview: [
      {
        category: "Python",
        questions: [
          "What is a list comprehension? Give an example.",
          "Difference between deep copy and shallow copy?",
          "What are decorators in Python?",
          "How does garbage collection work in Python?",
          "What is the difference between a list and a tuple?",
        ],
      },
      {
        category: "Statistics",
        questions: [
          "Explain p-value in simple terms.",
          "What is the Central Limit Theorem?",
          "Difference between Type I and Type II errors?",
          "What is Bayes' Theorem and when do you use it?",
          "Explain the difference between correlation and causation.",
        ],
      },
      {
        category: "Machine Learning",
        questions: [
          "What is the bias-variance tradeoff?",
          "How does gradient descent work?",
          "What is overfitting and how do you prevent it?",
          "Explain Random Forest vs Gradient Boosting.",
          "How do you handle imbalanced datasets?",
        ],
      },
      {
        category: "SQL",
        questions: [
          "What is a JOIN? Explain types of JOINs.",
          "Window functions vs GROUP BY — when to use which?",
          "How would you find duplicate rows in a table?",
          "Explain HAVING vs WHERE.",
          "What is a subquery vs a CTE?",
        ],
      },
    ],

    plan: [
      { week: "Week 1–2",  focus: "Python + Statistics",    tasks: ["Complete Python basics: loops, functions, OOP", "Statistics: mean, median, variance, distributions", "Solve 10 Python exercises on HackerRank"] },
      { week: "Week 3–4",  focus: "SQL + Pandas",           tasks: ["Learn SQL: SELECT, JOIN, GROUP BY, subqueries", "Practice on Mode Analytics or LeetCode SQL", "Pandas: DataFrames, merge, groupby, pivot tables"] },
      { week: "Week 5–8",  focus: "EDA + Visualization",   tasks: ["EDA on Titanic / Iris / Housing datasets", "Matplotlib & Seaborn: charts, heatmaps, histograms", "Kaggle: participate in your first beginner competition"] },
      { week: "Week 9–16", focus: "Machine Learning",       tasks: ["Linear & Logistic Regression from scratch", "Decision Trees, Random Forest, XGBoost", "Build 3 ML projects with Streamlit deployment"] },
      { week: "Week 17–24",focus: "Deep Learning + LLMs",   tasks: ["Neural Networks from scratch with NumPy", "CNNs for image tasks, LSTMs for sequence data", "Fine-tune an LLM using HuggingFace Transformers"] },
    ],
  },

  webdev: {
    label: "Web Development",
    icon: "🌐",
    color: "#F97316",
    accent: "#fb923c",
    description: "Build modern full-stack web applications from front to back end.",

    roadmap: [
      {
        phase: "Frontend Basics",
        steps: [
          "HTML5 Semantics & Structure",
          "CSS3, Flexbox & Grid",
          "JavaScript ES6+",
          "Responsive Design",
        ],
      },
      {
        phase: "Frontend Advanced",
        steps: [
          "React.js",
          "State Management (Redux / Zustand)",
          "TypeScript",
          "Tailwind CSS",
        ],
      },
      {
        phase: "Backend",
        steps: [
          "Node.js & Express",
          "REST APIs & GraphQL",
          "Authentication (JWT, OAuth)",
          "SQL & NoSQL Databases",
        ],
      },
      {
        phase: "DevOps & Deployment",
        steps: [
          "Git & GitHub",
          "Docker & Containers",
          "CI/CD Pipelines",
          "Cloud Deployment (Vercel / AWS)",
        ],
      },
    ],

    courses: [
      { title: "The Complete Web Developer Bootcamp", provider: "Udemy (Angela Yu)", link: "https://www.udemy.com/course/the-complete-web-development-bootcamp/", duration: "65 hrs", level: "Beginner" },
      { title: "JavaScript: The Complete Guide", provider: "Udemy", link: "https://www.udemy.com/course/javascript-the-complete-guide-2020-beginner-advanced/", duration: "52 hrs", level: "Beginner–Adv" },
      { title: "React — The Complete Guide", provider: "Udemy", link: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/", duration: "68 hrs", level: "Intermediate" },
      { title: "Node.js Developer Course", provider: "Udemy", link: "https://www.udemy.com/course/the-complete-nodejs-developer-course-2/", duration: "35 hrs", level: "Intermediate" },
      { title: "Full Stack Open", provider: "University of Helsinki", link: "https://fullstackopen.com/", duration: "Free + Cert", level: "Intermediate" },
      { title: "CS50's Web Programming", provider: "Harvard / edX", link: "https://cs50.harvard.edu/web/", duration: "Free", level: "Intermediate" },
      { title: "TypeScript Deep Dive", provider: "Basarat (Free Book)", link: "https://basarat.gitbook.io/typescript/", duration: "Self-paced", level: "Intermediate" },
    ],

    youtube: [
      { channel: "Traversy Media", topic: "Full Stack Tutorials", link: "https://www.youtube.com/@TraversyMedia", subs: "2.2M" },
      { channel: "Fireship", topic: "Modern Web Dev (100-second series)", link: "https://www.youtube.com/@Fireship", subs: "2.5M" },
      { channel: "Kevin Powell", topic: "CSS Mastery", link: "https://www.youtube.com/@KevinPowell", subs: "1M" },
      { channel: "Web Dev Simplified", topic: "React & JavaScript", link: "https://www.youtube.com/@WebDevSimplified", subs: "1.3M" },
      { channel: "Theo (t3.gg)", topic: "TypeScript / Next.js / tRPC", link: "https://www.youtube.com/@t3dotgg", subs: "270K" },
      { channel: "The Net Ninja", topic: "Vue, React, Node", link: "https://www.youtube.com/@NetNinja", subs: "1.1M" },
    ],

    interview: [
      {
        category: "HTML & CSS",
        questions: [
          "Explain the CSS box model.",
          "Difference between em, rem, and px?",
          "What are CSS specificity rules?",
          "What is semantic HTML and why does it matter?",
          "How does CSS Grid differ from Flexbox?",
        ],
      },
      {
        category: "JavaScript",
        questions: [
          "Explain the JavaScript event loop.",
          "What is a closure? Give an example.",
          "Promise vs async/await — differences and use cases?",
          "Difference between == and ===?",
          "What is prototypal inheritance?",
        ],
      },
      {
        category: "React",
        questions: [
          "What is the virtual DOM and how does it work?",
          "useState vs useReducer — when do you choose each?",
          "How does useEffect work and what are its dependencies?",
          "What is lifting state up?",
          "How do you optimize a React app's performance?",
        ],
      },
      {
        category: "Backend & Databases",
        questions: [
          "REST vs GraphQL — pros and cons?",
          "What is middleware in Express?",
          "Explain JWT authentication flow.",
          "SQL vs NoSQL — when to use which?",
          "What is database indexing and why does it matter?",
        ],
      },
    ],

    plan: [
      { week: "Week 1–2",  focus: "HTML + CSS",           tasks: ["Build 3 static pages from scratch", "Master Flexbox and CSS Grid layouts", "Responsive design with media queries"] },
      { week: "Week 3–4",  focus: "JavaScript",           tasks: ["DOM manipulation and events", "Fetch API and async/await patterns", "Build a weather app using a public API"] },
      { week: "Week 5–8",  focus: "React.js",             tasks: ["Components, props, state, and hooks", "React Router for multi-page navigation", "Build a full CRUD app (Todo / Notes App)"] },
      { week: "Week 9–12", focus: "Node.js + Express",    tasks: ["Build a REST API with Express", "Connect to PostgreSQL with Prisma ORM", "User auth: Register & Login with JWT"] },
      { week: "Week 13–16",focus: "Full Stack + Deploy",  tasks: ["Deploy full stack app to Vercel + Railway", "Add CI/CD pipeline with GitHub Actions", "Polish portfolio with 3 live deployed projects"] },
    ],
  },
};

export default CAREERS;

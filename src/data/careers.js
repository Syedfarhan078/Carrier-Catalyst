/**
 * careers.js — Static career path data
 * Includes: roadmap phases, courses, YouTube channels, interview Q&A, study plans
 */

import { BrainIcon, GlobeIcon, LockIcon, SettingsIcon } from "../components/Icons";

const CAREERS = {
  datascience: {
    label: "Data Science",
    icon: <BrainIcon size={32} color="currentColor" />,
    iconText: "🧠",
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
    icon: <GlobeIcon size={32} color="currentColor" />,
    iconText: "🌐",
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

  cybersecurity: {
    label: "Cybersecurity",
    icon: <LockIcon size={32} color="currentColor" />,
    iconText: "🛡️",
    color: "#3B82F6",
    accent: "#60A5FA",
    description: "Protect networks, systems, and data from digital attacks as a security expert.",

    roadmap: [
      {
        phase: "Fundamentals",
        steps: [
          "Networking Basics (TCP/IP, OSI)",
          "Operating Systems (Linux, Windows)",
          "Scripting (Python, Bash)",
          "Security Concepts (CIA Triad)",
        ],
      },
      {
        phase: "Defense & Defense",
        steps: [
          "Network Security & Firewalls",
          "Identity & Access Management (IAM)",
          "Cryptography",
          "Endpoint Protection",
        ],
      },
      {
        phase: "Offensive Security",
        steps: [
          "Vulnerability Assessment",
          "Penetration Testing",
          "Web Application Security",
          "Social Engineering",
        ],
      },
      {
        phase: "Advanced & Certs",
        steps: [
          "Incident Response",
          "Security Operations (SOC)",
          "CompTIA Security+",
          "CEH / CISSP Preparation",
        ],
      },
    ],

    courses: [
      { title: "Google Cybersecurity Professional Certificate", provider: "Coursera", link: "https://www.coursera.org/professional-certificates/google-cybersecurity", duration: "120 hrs", level: "Beginner" },
      { title: "IBM Cybersecurity Analyst", provider: "Coursera", link: "https://www.coursera.org/professional-certificates/ibm-cybersecurity-analyst", duration: "60 hrs", level: "Beginner" },
      { title: "CompTIA Security+ (SY0-601)", provider: "Udemy", link: "https://www.udemy.com/course/securityplus/", duration: "25 hrs", level: "Intermediate" },
      { title: "Practical Ethical Hacking", provider: "TCM Security", link: "https://academy.tcm-sec.com/p/practical-ethical-hacking-the-complete-course", duration: "25 hrs", level: "Intermediate" },
      { title: "Web Security Academy", provider: "PortSwigger", link: "https://portswigger.net/web-security", duration: "Self-paced", level: "Advanced" },
    ],

    youtube: [
      { channel: "NetworkChuck", topic: "Networking & Security", link: "https://www.youtube.com/@NetworkChuck", subs: "3.5M" },
      { channel: "David Bombal", topic: "Cybersecurity & Cisco", link: "https://www.youtube.com/@davidbombal", subs: "2M" },
      { channel: "John Hammond", topic: "CTF & Malware Analysis", link: "https://www.youtube.com/@_JohnHammond", subs: "1M" },
      { channel: "HackerSploit", topic: "Ethical Hacking & Pen Testing", link: "https://www.youtube.com/@HackerSploit", subs: "800K" },
    ],

    interview: [
      {
        category: "Networking & OS",
        questions: [
          "What is the OSI model? Explain each layer briefly.",
          "Difference between TCP and UDP?",
          "How does DNS work?",
          "What are the differences between symmetric and asymmetric encryption?",
        ],
      },
      {
        category: "Security Concepts",
        questions: [
          "What is the CIA triad?",
          "Explain Cross-Site Scripting (XSS) and how to prevent it.",
          "What is SQL Injection?",
          "How do you secure a web server?",
        ],
      },
    ],

    plan: [
      { week: "Week 1–2",  focus: "Networking & OS", tasks: ["Learn OSI Model, TCP/IP, DNS, HTTP", "Set up a Linux VM and learn basic bash commands", "Understand subnetting and routing"] },
      { week: "Week 3–4",  focus: "Security Fundamentals", tasks: ["Study the CIA triad and access controls", "Learn basic cryptography concepts", "Complete rooms on TryHackMe (Beginner path)"] },
      { week: "Week 5–8",  focus: "Offensive Basics", tasks: ["Use Nmap for network scanning", "Learn Burp Suite for web vulnerability scanning", "Practice OWASP Top 10 vulnerabilities"] },
      { week: "Week 9–12", focus: "Defense & SIEM", tasks: ["Configure a firewall (ufw/iptables)", "Set up and monitor Splunk or ELK stack", "Analyze sample PCAP files with Wireshark"] },
      { week: "Week 13–16",focus: "Certification Prep", tasks: ["Take Security+ practice exams", "Build a home lab and document your process", "Participate in beginner CTFs (Capture The Flag)"] },
    ],
  },

  devops: {
    label: "Cloud & DevOps",
    icon: <SettingsIcon size={32} color="currentColor" />,
    iconText: "⚙️",
    color: "#10B981",
    accent: "#34D399",
    description: "Master cloud infrastructure, automation, and CI/CD pipelines to streamline deployment.",

    roadmap: [
      {
        phase: "Prerequisites",
        steps: [
          "Linux & Terminal Mastery",
          "Networking Protocols",
          "Scripting (Bash/Python)",
          "Git Version Control",
        ],
      },
      {
        phase: "Containers & CI/CD",
        steps: [
          "Docker & Containerization",
          "GitHub Actions / GitLab CI",
          "Jenkins",
          "Artifact Management",
        ],
      },
      {
        phase: "Cloud Providers",
        steps: [
          "AWS / Azure / GCP Basics",
          "IAM & Security",
          "Compute & Storage",
          "Serverless Architectures",
        ],
      },
      {
        phase: "Infrastructure & Orch.",
        steps: [
          "Terraform (IaC)",
          "Kubernetes (K8s)",
          "Ansible (Configuration Mgmt)",
          "Monitoring (Prometheus/Grafana)",
        ],
      },
    ],

    courses: [
      { title: "DevOps Bootcamp", provider: "Udemy", link: "https://www.udemy.com/course/decodingdevops/", duration: "45 hrs", level: "Beginner-Adv" },
      { title: "Docker Mastery", provider: "Udemy", link: "https://www.udemy.com/course/docker-mastery/", duration: "20 hrs", level: "Beginner" },
      { title: "AWS Certified Solutions Architect", provider: "Udemy (Stephane Maarek)", link: "https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/", duration: "27 hrs", level: "Intermediate" },
      { title: "Kubernetes for Developers", provider: "Pluralsight", link: "https://www.pluralsight.com/courses/kubernetes-getting-started", duration: "4 hrs", level: "Intermediate" },
      { title: "Terraform for AWS", provider: "FreeCodeCamp", link: "https://www.youtube.com/watch?v=7xngnjfIlK4", duration: "13 hrs", level: "Beginner" },
    ],

    youtube: [
      { channel: "TechWorld with Nana", topic: "DevOps & Kubernetes", link: "https://www.youtube.com/@TechWorldwithNana", subs: "850K" },
      { channel: "KodeKloud", topic: "DevOps Training", link: "https://www.youtube.com/@KodeKloud", subs: "150K" },
      { channel: "Gaurav Sharma", topic: "Cloud & DevOps Projects", link: "https://www.youtube.com/@GauravSharmaDevOps", subs: "100K" },
      { channel: "Christian Lempa", topic: "Home Lab & Linux", link: "https://www.youtube.com/@christianlempa", subs: "250K" },
    ],

    interview: [
      {
        category: "Linux & Git",
        questions: [
          "How do you check system performance in Linux?",
          "Explain the difference between git merge and git rebase.",
          "How would you securely store secrets in version control?",
        ],
      },
      {
        category: "Containers & CI/CD",
        questions: [
          "What is the difference between a virtual machine and a container?",
          "Explain a CI/CD pipeline and its benefits.",
          "How do you persist data in Docker?",
        ],
      },
      {
        category: "Cloud & IaC",
        questions: [
          "What is Infrastructure as Code (IaC)?",
          "Explain Terraform state and why it's important.",
          "Differences between AWS S3 and EBS?",
        ],
      },
    ],

    plan: [
      { week: "Week 1–2",  focus: "Linux & Scripting", tasks: ["Master Linux CLI (navigation, permissions, processes)", "Write 5 bash scripts for automation", "Learn Git branching and merging"] },
      { week: "Week 3–4",  focus: "Containers", tasks: ["Learn Docker architecture and Dockerfiles", "Containerize a Node.js or Python application", "Use Docker Compose for multi-container apps"] },
      { week: "Week 5–8",  focus: "CI/CD & Cloud", tasks: ["Set up a GitHub Actions pipeline", "Deploy a web app to AWS EC2", "Learn AWS IAM, S3, and VPC basics"] },
      { week: "Week 9–12", focus: "IaC & Config", tasks: ["Provision AWS infrastructure using Terraform", "Configure servers automatically using Ansible", "Deploy a 3-tier architecture with IaC"] },
      { week: "Week 13–16",focus: "Kubernetes & Monitoring", tasks: ["Set up a local Minikube cluster", "Deploy your containerized app to K8s", "Add basic monitoring with Prometheus and Grafana"] },
    ],
  },
};

export default CAREERS;

// ─── Skills Database ──────────────────────────────────────────────────────────

export const skillsDatabase = [
  // Languages
  { name: "Python",       category: "Language",    weight: 10 },
  { name: "Java",         category: "Language",    weight: 9  },
  { name: "C++",          category: "Language",    weight: 8  },
  { name: "C#",           category: "Language",    weight: 8  },
  { name: "JavaScript",   category: "Language",    weight: 10 },
  { name: "TypeScript",   category: "Language",    weight: 9  },
  { name: "Go",           category: "Language",    weight: 7  },
  { name: "Rust",         category: "Language",    weight: 7  },
  { name: "Kotlin",       category: "Language",    weight: 7  },
  { name: "Swift",        category: "Language",    weight: 7  },
  { name: "PHP",          category: "Language",    weight: 6  },
  { name: "Ruby",         category: "Language",    weight: 6  },
  { name: "R",            category: "Language",    weight: 7  },
  { name: "Scala",        category: "Language",    weight: 6  },
  { name: "MATLAB",       category: "Language",    weight: 5  },

  // Frontend
  { name: "React",        category: "Frontend",    weight: 10 },
  { name: "Vue",          category: "Frontend",    weight: 8  },
  { name: "Angular",      category: "Frontend",    weight: 8  },
  { name: "Next.js",      category: "Frontend",    weight: 9  },
  { name: "HTML",         category: "Frontend",    weight: 7  },
  { name: "CSS",          category: "Frontend",    weight: 7  },
  { name: "Tailwind",     category: "Frontend",    weight: 7  },
  { name: "Redux",        category: "Frontend",    weight: 7  },
  { name: "GraphQL",      category: "Frontend",    weight: 7  },
  { name: "Webpack",      category: "Frontend",    weight: 6  },

  // Backend
  { name: "Node.js",      category: "Backend",     weight: 9  },
  { name: "Django",       category: "Backend",     weight: 8  },
  { name: "Flask",        category: "Backend",     weight: 7  },
  { name: "Spring",       category: "Backend",     weight: 8  },
  { name: "FastAPI",      category: "Backend",     weight: 8  },
  { name: "Express",      category: "Backend",     weight: 8  },
  { name: "REST API",     category: "Backend",     weight: 8  },
  { name: "Microservices",category: "Backend",     weight: 8  },

  // Database
  { name: "SQL",          category: "Database",    weight: 9  },
  { name: "MongoDB",      category: "Database",    weight: 8  },
  { name: "PostgreSQL",   category: "Database",    weight: 8  },
  { name: "MySQL",        category: "Database",    weight: 7  },
  { name: "Redis",        category: "Database",    weight: 7  },
  { name: "Elasticsearch",category: "Database",    weight: 7  },
  { name: "Cassandra",    category: "Database",    weight: 6  },

  // AI / ML
  { name: "Machine Learning", category: "AI/ML",   weight: 10 },
  { name: "Deep Learning",    category: "AI/ML",   weight: 10 },
  { name: "TensorFlow",       category: "AI/ML",   weight: 9  },
  { name: "PyTorch",          category: "AI/ML",   weight: 9  },
  { name: "Scikit-learn",     category: "AI/ML",   weight: 8  },
  { name: "NLP",              category: "AI/ML",   weight: 8  },
  { name: "Computer Vision",  category: "AI/ML",   weight: 8  },
  { name: "Data Science",     category: "AI/ML",   weight: 9  },
  { name: "Statistics",       category: "AI/ML",   weight: 8  },
  { name: "Pandas",           category: "AI/ML",   weight: 7  },
  { name: "NumPy",            category: "AI/ML",   weight: 7  },
  { name: "Keras",            category: "AI/ML",   weight: 7  },
  { name: "OpenCV",           category: "AI/ML",   weight: 7  },
  { name: "LLM",              category: "AI/ML",   weight: 9  },

  // DevOps / Cloud
  { name: "Docker",       category: "DevOps",      weight: 9  },
  { name: "Kubernetes",   category: "DevOps",      weight: 9  },
  { name: "AWS",          category: "Cloud",       weight: 10 },
  { name: "Azure",        category: "Cloud",       weight: 9  },
  { name: "GCP",          category: "Cloud",       weight: 8  },
  { name: "Terraform",    category: "DevOps",      weight: 8  },
  { name: "CI/CD",        category: "DevOps",      weight: 8  },
  { name: "Jenkins",      category: "DevOps",      weight: 7  },
  { name: "GitHub Actions",category:"DevOps",      weight: 7  },
  { name: "Ansible",      category: "DevOps",      weight: 7  },
  { name: "Linux",        category: "DevOps",      weight: 8  },
  { name: "Nginx",        category: "DevOps",      weight: 6  },

  // Security
  { name: "Cybersecurity",category: "Security",    weight: 9  },
  { name: "Penetration Testing", category:"Security", weight:9 },
  { name: "OWASP",        category: "Security",    weight: 8  },
  { name: "Cryptography", category: "Security",    weight: 7  },
  { name: "Networking",   category: "Security",    weight: 7  },
  { name: "Firewall",     category: "Security",    weight: 6  },

  // Tools
  { name: "Git",          category: "Tools",       weight: 8  },
  { name: "Jira",         category: "Tools",       weight: 6  },
  { name: "Agile",        category: "Tools",       weight: 7  },
  { name: "Scrum",        category: "Tools",       weight: 7  },
  { name: "Figma",        category: "Tools",       weight: 6  },
];

// ─── Career Paths with Required Skills ───────────────────────────────────────

export const careerPaths = {
  "Data Scientist": {
    icon: "📊",
    color: "#06b6d4",
    required: ["Python", "Statistics", "Machine Learning", "SQL", "Pandas", "NumPy", "Data Science", "Scikit-learn"],
    preferred: ["Deep Learning", "TensorFlow", "R", "Spark", "Tableau"]
  },
  "Frontend Developer": {
    icon: "🎨",
    color: "#f59e0b",
    required: ["JavaScript", "React", "HTML", "CSS", "TypeScript"],
    preferred: ["Next.js", "Redux", "GraphQL", "Vue", "Tailwind", "Webpack"]
  },
  "Backend Developer": {
    icon: "⚙️",
    color: "#8b5cf6",
    required: ["Python", "Node.js", "SQL", "REST API", "Git"],
    preferred: ["Docker", "MongoDB", "PostgreSQL", "Microservices", "Redis"]
  },
  "Full Stack Developer": {
    icon: "🔗",
    color: "#10b981",
    required: ["JavaScript", "React", "Node.js", "SQL", "HTML", "CSS", "Git"],
    preferred: ["TypeScript", "MongoDB", "Docker", "AWS", "GraphQL"]
  },
  "AI/ML Engineer": {
    icon: "🤖",
    color: "#ef4444",
    required: ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "Statistics", "NumPy"],
    preferred: ["PyTorch", "Scikit-learn", "NLP", "Computer Vision", "Pandas", "Keras"]
  },
  "DevOps Engineer": {
    icon: "🚀",
    color: "#f97316",
    required: ["Docker", "Kubernetes", "Linux", "CI/CD", "AWS", "Git"],
    preferred: ["Terraform", "Ansible", "Jenkins", "Python", "Monitoring", "Nginx"]
  },
  "Cybersecurity Analyst": {
    icon: "🛡️",
    color: "#3b82f6",
    required: ["Cybersecurity", "Networking", "Linux", "Python"],
    preferred: ["Penetration Testing", "OWASP", "Cryptography", "Firewall", "Cloud Security"]
  },
  "Cloud Engineer": {
    icon: "☁️",
    color: "#06b6d4",
    required: ["AWS", "Docker", "Linux", "Terraform", "Networking"],
    preferred: ["Kubernetes", "Azure", "GCP", "Python", "CI/CD", "Ansible"]
  }
};

// ─── Assessment Recommendations ───────────────────────────────────────────────

export const assessmentMap = {
  "Python":           { title: "Python Coding Test",         icon: "🐍", difficulty: "Intermediate", duration: "45 min" },
  "JavaScript":       { title: "JavaScript Fundamentals",    icon: "🟨", difficulty: "Intermediate", duration: "40 min" },
  "TypeScript":       { title: "TypeScript Assessment",      icon: "🔷", difficulty: "Intermediate", duration: "40 min" },
  "Java":             { title: "Java OOP Challenge",         icon: "☕", difficulty: "Advanced",     duration: "60 min" },
  "C++":              { title: "C++ Systems Programming",    icon: "⚡", difficulty: "Advanced",     duration: "60 min" },
  "React":            { title: "Frontend React Assessment",  icon: "⚛️", difficulty: "Intermediate", duration: "45 min" },
  "Next.js":          { title: "Next.js Full-Stack Test",    icon: "▲",  difficulty: "Advanced",     duration: "50 min" },
  "Node.js":          { title: "Node.js Backend Challenge",  icon: "🟢", difficulty: "Intermediate", duration: "45 min" },
  "SQL":              { title: "SQL Query Challenge",        icon: "🗄️", difficulty: "Beginner",     duration: "30 min" },
  "MongoDB":          { title: "NoSQL Database Test",        icon: "🍃", difficulty: "Intermediate", duration: "30 min" },
  "Machine Learning": { title: "ML Fundamentals Test",       icon: "🧠", difficulty: "Advanced",     duration: "60 min" },
  "Deep Learning":    { title: "Deep Learning Challenge",    icon: "🔮", difficulty: "Expert",       duration: "75 min" },
  "TensorFlow":       { title: "TensorFlow Practical",       icon: "📈", difficulty: "Advanced",     duration: "60 min" },
  "Docker":           { title: "Docker & Containers Quiz",   icon: "🐳", difficulty: "Intermediate", duration: "35 min" },
  "Kubernetes":       { title: "Kubernetes Orchestration",   icon: "⚙️", difficulty: "Advanced",     duration: "50 min" },
  "AWS":              { title: "AWS Cloud Practitioner",     icon: "☁️", difficulty: "Intermediate", duration: "45 min" },
  "Data Science":     { title: "Data Science Case Study",    icon: "📊", difficulty: "Advanced",     duration: "90 min" },
  "Cybersecurity":    { title: "Security Fundamentals Test", icon: "🛡️", difficulty: "Intermediate", duration: "45 min" },
};

// ─── Category Colors ──────────────────────────────────────────────────────────

export const categoryConfig = {
  "Language":  { color: "#06b6d4", bg: "rgba(6,182,212,0.1)",   border: "rgba(6,182,212,0.3)"   },
  "Frontend":  { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.3)"  },
  "Backend":   { color: "#8b5cf6", bg: "rgba(139,92,246,0.1)",  border: "rgba(139,92,246,0.3)"  },
  "Database":  { color: "#10b981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.3)"  },
  "AI/ML":     { color: "#ef4444", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.3)"   },
  "DevOps":    { color: "#f97316", bg: "rgba(249,115,22,0.1)",  border: "rgba(249,115,22,0.3)"  },
  "Cloud":     { color: "#06b6d4", bg: "rgba(6,182,212,0.1)",   border: "rgba(6,182,212,0.3)"   },
  "Security":  { color: "#3b82f6", bg: "rgba(59,130,246,0.1)",  border: "rgba(59,130,246,0.3)"  },
  "Tools":     { color: "#6b7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.3)" },
};
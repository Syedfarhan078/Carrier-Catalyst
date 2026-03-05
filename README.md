# 🎯 SkillPath — AI-Powered Smart Career Path Recommendation System

> Converted from HTML/CSS/JavaScript → **React + SQL (localStorage-backed)**

---

## 📁 Project Structure

```
skillpath/
├── public/
│   └── index.html
├── src/
│   ├── index.js                  ← React entry point
│   ├── App.js                    ← Root app + routing logic
│   │
│   ├── context/
│   │   └── AuthContext.js        ← Global auth state (login/logout)
│   │
│   ├── data/
│   │   ├── db.js                 ← SQL-style in-memory database (4 tables)
│   │   └── careers.js            ← All career data (DS + Web Dev)
│   │
│   ├── components/
│   │   ├── CareerLayout.js       ← Sidebar + page switcher
│   │   └── PageHeader.js         ← Reusable page header component
│   │
│   ├── pages/
│   │   ├── AuthPage.js           ← Login & Register
│   │   ├── HomePage.js           ← Career path selection
│   │   ├── RoadmapPage.js        ← Interactive learning roadmap
│   │   ├── CoursesPage.js        ← Curated course listings
│   │   ├── YouTubePage.js        ← YouTube channel recommendations
│   │   ├── InterviewPage.js      ← Interview Q&A accordion
│   │   ├── PlannerPage.js        ← Weekly study planner
│   │   └── ProgressPage.js       ← Progress tracker + SQL view
│   │
│   └── styles/
│       └── global.css            ← Base styles
│
├── package.json
└── README.md
```

---

## 🗄️ SQL Database Schema

```sql
CREATE TABLE users (
  id         INTEGER PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT UNIQUE NOT NULL,
  password   TEXT NOT NULL,
  created_at TEXT
);

CREATE TABLE sessions (
  id         INTEGER PRIMARY KEY,
  user_id    INTEGER REFERENCES users(id),
  career     TEXT,
  created_at TEXT
);

CREATE TABLE progress (
  id         INTEGER PRIMARY KEY,
  user_id    INTEGER REFERENCES users(id),
  career     TEXT,
  topic      TEXT,
  completed  BOOLEAN DEFAULT FALSE,
  updated_at TEXT
);

CREATE TABLE planner (
  id      INTEGER PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  career  TEXT,
  day     TEXT,
  task    TEXT,
  done    BOOLEAN DEFAULT FALSE
);
```

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm start

# 3. Open http://localhost:3000
```

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Auth | Register & login with localStorage-backed SQL users table |
| 🗺 Roadmap | Phase-by-phase learning roadmap with checkboxes |
| 📚 Courses | Curated courses with level, duration, and direct links |
| ▶ YouTube | Top learning channels per career |
| 💼 Interview | Expandable Q&A by category |
| 📅 Planner | Weekly task planner with add/complete/delete |
| ✅ Progress | Stats, phase breakdown, SQL query view, data table |

---

## 🛤️ Career Paths

- **🧠 Data Science** — Python, SQL, EDA, ML, Deep Learning, LLMs, MLOps
- **🌐 Web Development** — HTML/CSS, JavaScript, React, Node.js, Databases, DevOps

---

## 🏗️ Tech Stack

- **Frontend:** React 18, React Router v6
- **Database:** SQL schema (simulated via localStorage)
- **Styling:** Inline styles + CSS module (dark theme)
- **State:** React hooks + Context API

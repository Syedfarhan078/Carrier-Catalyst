<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js" />
  <img src="https://img.shields.io/badge/ThreeJs-black?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue" alt="Framer Motion" />
  
  <br/><br/>
  <h1>🎯 Career Catalyst</h1>
  <p><strong>AI-Powered Smart Career Path & Mentorship Platform</strong></p>
  <p><i>A beautifully designed, full-stack application featuring immersive 3D experiences, real-time market trends, and an interactive mentor marketplace.</i></p>
</div>

---

## ✨ Overview

Career Catalyst has evolved from a simple static web page into a **production-ready full-stack SaaS platform**. It provides structured learning roadmaps, AI-driven insights, live market intelligence, and a fully functional Mentor Marketplace to help users navigate their professional journey in domains like **Data Science** and **Web Development**.

Built with a **React + Node.js/Express** architecture, the platform features a custom RESTful API, centralized Axios state management, edge-ready 3D components, and highly polished Framer Motion animations.

---

## 🚀 Key Features

| Feature | Description |
|---|---|
| 🔐 **Secure Authentication** | Full backend-driven register & login system with Bearer token session management and sleek glassmorphism UI. |
| 👤 **User Learning Profile** | A personalized dashboard displaying learning progress, streak tracking, active career tracks, and recent achievements. |
| 📊 **Live Market Trends** | A real-time, cached intelligence dashboard simulating live job demand, Month-over-Month growth, and trend scores across top tech careers. |
| 🧑‍🏫 **Mentor Marketplace** | Browse, filter, and book 1:1 sessions with industry experts. Features dynamic availability & mock payment flows. |
| 📄 **AI Resume Analyzer** | On-device AI processing via TensorFlow.js to extract skills and recommend career paths without sending data to the cloud. |
| 🧊 **Immersive WebGL UI** | Custom vertex/fragment shaders and React Three Fiber components for atmospheric 3D backgrounds and interactive elements. |
| 🗺 **Interactive Roadmaps** | Phase-by-phase learning roadmap with real-time backend progress tracking. |
| ✨ **Tactile Physics Interactions** | Framer Motion integration for snappy, spring-based micro-interactions and layout transitions. |
| ⚡ **Robust API Layer** | Centralized Axios configuration with global interceptors, automatic 401 handling, and graceful UI fallbacks. |

---

## 🛠️ Tech Stack

### **Frontend**
- **Core:** React 18, React Router v6
- **API Client:** Axios (Custom interceptors & token management)
- **3D Graphics:** Three.js, React Three Fiber (R3F), Drei, CSS 3D Transforms
- **Animations:** Framer Motion
- **AI/ML:** TensorFlow.js (In-browser inference)
- **Styling:** CSS Modules, Modern Vanilla CSS (Dark Theme, Glassmorphism)

### **Backend**
- **Core:** Node.js, Express.js
- **Architecture:** Domain-Driven Design (Controllers, Routes, Middleware, Utils)
- **Security:** CORS, Custom Error Handlers, Request Validation
- **Database:** Modular In-Memory Data Store (Ready for PostgreSQL/MongoDB migration)

---

## 📂 Project Structure

```text
skillpath-react/skillpath/
├── backend/                      ← ⚙️ Node.js / Express API Server
│   ├── controllers/              # Business logic (auth, trends, mentors, users)
│   ├── routes/                   # Express router definitions
│   ├── middleware/               # Error handling & logging
│   ├── data/                     # In-memory data store
│   └── server.js                 # Backend entry point (Port 5000)
│
├── src/                          ← 🎨 React Frontend
│   ├── api/                      # Axios config & API service layer
│   ├── components/               # UI Components
│   │   ├── 3d/                   # R3F WebGL Components
│   │   └── assessment/           # Assessment UI
│   ├── context/                  # Global React Context (Auth)
│   ├── pages/                    # App Views (Profile, Trends, MentorList, etc.)
│   └── styles/                   # CSS Design System
│
└── package.json
```

---

## 🔌 API Architecture

The frontend seamlessly communicates with the backend via a structured API layer.

- **Authentication:** `POST /api/auth/signup`, `POST /api/auth/login`
- **Users:** `GET /api/users`, `GET /api/users/:id`
- **Market Trends:** `GET /api/trends`
- **Mentors:** `GET /api/mentors`, `GET /api/mentors/:id`
- **Progress:** `GET /api/progress/:userId`, `POST /api/progress`

*Note: The frontend API layer includes graceful fallbacks, ensuring the application remains interactive even if the backend goes offline.*

---

## 🏃 Getting Started

### 1. Clone the repository
```bash
cd skillpath-react/skillpath
```

### 2. Start the Backend Server
```bash
cd backend
npm install
npm start
# Server runs on http://localhost:5000
```

### 3. Start the Frontend Application
Open a new terminal window:
```bash
# Assuming you are in the skillpath directory
npm install
npm start
# App runs on http://localhost:3000
```

---

<div align="center">
  <p>Built with ❤️ for a better learning experience.</p>
  <p> SYED FARHAN AHMED </p>
</div>

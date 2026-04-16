import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useLocation } from "react-router-dom";
import CareerSelectPage from "./pages/CareerSelectPage";
// import MentorConnect from './pages/MentorConnect';
import ResumeAnalyzer from "./pages/ResumeAnalyzer";

import MentorListPage from "./pages/MentorListPage";
import MentorProfilePage from "./pages/MentorProfilePage";
import BookingPage from "./pages/BookingPage";

import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import CareerLayout from "./components/CareerLayout";
import AssessmentPage from "./components/assessment/AssessmentPage";

import CoursesPage from "./pages/CoursesPage";
import RoadmapPage from "./pages/RoadmapPage";

import DB from "./data/db";

function AppInner() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [page, setPage] = useState("home");
  const [career, setCareer] = useState(null);

useEffect(() => {
  if (location.state?.career) {
    const { career: selectedCareer, page: selectedPage } = location.state;
    setCareer(selectedCareer);
    setPage(selectedPage || "roadmap");
  }
}, [location.state]);

  const navigate = (p, c = null) => {
    setPage(p);
    if (c) {
      setCareer(c);
      if (user) DB.logSession(user.id, c);
    }
  };

  const handleLogout = () => {
    logout();
    setPage("home");
    setCareer(null);
  };

  if (!user) return <AuthPage />;

  return (

    <Routes>
      <Route
        path="/"
        element={
          career && page !== "home" ? (
            <CareerLayout
              career={career}
              page={page}
              navigate={navigate}
              user={user}
              onLogout={handleLogout}
            />
          ) : (
            <HomePage navigate={navigate} user={user} onLogout={handleLogout} />
            
          )
        }
      />

      <Route path="/assessment" element={<AssessmentPage />} />
      {/* <Route path="/mentors" element={<MentorConnect />} /> */}
      <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />

      <Route path="/mentors" element={<MentorListPage />} />
      <Route path="/mentor/:id" element={<MentorProfilePage />} />
      <Route path="/booking/:id" element={<BookingPage />} />

      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/roadmap" element={<RoadmapPage />} />

      <Route path="/select-career" element={<CareerSelectPage />} />

    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppInner />
      </Router>
    </AuthProvider>
  );
}
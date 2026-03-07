import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import MentorConnect from './pages/MentorConnect';

import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import CareerLayout from "./components/CareerLayout";
import AssessmentPage from "./components/assessment/AssessmentPage";

import DB from "./data/db";

function AppInner() {
  const { user, logout } = useAuth();
  const [page, setPage] = useState("home");
  const [career, setCareer] = useState(null);

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
      <Route path="/mentors" element={<MentorConnect />} />
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
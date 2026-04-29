import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useLocation } from "react-router-dom";
import LoadingSpinner from "./components/ui/LoadingSpinner";

import DB from "./data/db";

// ──── Lazy-loaded Pages (Code Splitting) ────
// Each page is loaded on-demand, reducing initial bundle size
const AuthPage = lazy(() => import("./pages/AuthPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const CareerSelectPage = lazy(() => import("./pages/CareerSelectPage"));
const ResumeAnalyzer = lazy(() => import("./pages/ResumeAnalyzer"));
const MentorListPage = lazy(() => import("./pages/MentorListPage"));
const MentorProfilePage = lazy(() => import("./pages/MentorProfilePage"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const CoursesPage = lazy(() => import("./pages/CoursesPage"));
const RoadmapPage = lazy(() => import("./pages/RoadmapPage"));

// ──── Lazy-loaded Components ────
const CareerLayout = lazy(() => import("./components/CareerLayout"));
const AssessmentPage = lazy(() => import("./components/assessment/AssessmentPage"));

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

  if (!user) return (
    <Suspense fallback={<LoadingSpinner />}>
      <AuthPage />
    </Suspense>
  );

  return (
    <Routes>
      <Route
        path="/"
        element={
          career && page !== "home" ? (
            <Suspense fallback={<LoadingSpinner />}>
              <CareerLayout
                career={career}
                page={page}
                navigate={navigate}
                user={user}
                onLogout={handleLogout}
              />
            </Suspense>
          ) : (
            <Suspense fallback={<LoadingSpinner />}>
              <HomePage navigate={navigate} user={user} onLogout={handleLogout} />
            </Suspense>
          )
        }
      />

      <Route path="/assessment" element={
        <Suspense fallback={<LoadingSpinner />}>
          <AssessmentPage />
        </Suspense>
      } />

      <Route path="/resume-analyzer" element={
        <Suspense fallback={<LoadingSpinner />}>
          <ResumeAnalyzer />
        </Suspense>
      } />

      <Route path="/mentors" element={
        <Suspense fallback={<LoadingSpinner />}>
          <MentorListPage />
        </Suspense>
      } />

      <Route path="/mentor/:id" element={
        <Suspense fallback={<LoadingSpinner />}>
          <MentorProfilePage />
        </Suspense>
      } />

      <Route path="/booking/:id" element={
        <Suspense fallback={<LoadingSpinner />}>
          <BookingPage />
        </Suspense>
      } />

      <Route path="/courses" element={
        <Suspense fallback={<LoadingSpinner />}>
          <CoursesPage />
        </Suspense>
      } />

      <Route path="/roadmap" element={
        <Suspense fallback={<LoadingSpinner />}>
          <RoadmapPage />
        </Suspense>
      } />

      <Route path="/select-career" element={
        <Suspense fallback={<LoadingSpinner />}>
          <CareerSelectPage />
        </Suspense>
      } />
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
import CAREERS from "../data/careers";
import { lazy, Suspense } from "react";
import LoadingSpinner from "./ui/LoadingSpinner";

// ──── Lazy-loaded Career Pages (Code Splitting) ────
const RoadmapPage = lazy(() => import("../pages/RoadmapPage"));
const CoursesPage = lazy(() => import("../pages/CoursesPage"));
const YouTubePage = lazy(() => import("../pages/YouTubePage"));
const InterviewPage = lazy(() => import("../pages/InterviewPage"));
const PlannerPage = lazy(() => import("../pages/PlannerPage"));
const ProgressPage = lazy(() => import("../pages/ProgressPage"));

import { RoadmapIcon, CourseIcon, YoutubeIcon, InterviewIcon, PlannerIcon, ProgressIcon, UserIcon } from "./Icons";

const TABS = [
  { id: "roadmap",   Icon: RoadmapIcon,   text: "Roadmap"   },
  { id: "courses",   Icon: CourseIcon,    text: "Courses"   },
  { id: "youtube",   Icon: YoutubeIcon,   text: "YouTube"   },
  { id: "interview", Icon: InterviewIcon, text: "Interview" },
  { id: "planner",   Icon: PlannerIcon,   text: "Planner"   },
  { id: "progress",  Icon: ProgressIcon,  text: "Progress"  },
];

export default function CareerLayout({ career, page, navigate, user, onLogout }) {
  // Best practice: Always validate dynamic keys against your data object.
  // If 'career' is undefined or not a valid key in CAREERS, 'c' will be undefined.
  const c = CAREERS[career];

  // Prevent runtime crash by showing a fallback UI if the career doesn't exist.
  if (!c) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", color: "var(--text-primary)" }}>
        <h2>Career path not found</h2>
        <p style={{ opacity: 0.7, marginBottom: "1.5rem" }}>The career "{career}" does not exist or is unavailable.</p>
        <button onClick={() => navigate("home")} className="btn btn-secondary">
          ← Go back home
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        className="sidebar-premium"
        style={{ animation: "slideInLeft 0.4s ease-out" }}
      >
        {/* Brand */}
        <div className="sidebar-header">
          <div
            className="sidebar-brand"
            style={{ animation: "scaleIn 0.3s ease-out 0.1s both" }}
          >
            <span className="sidebar-icon">{c.icon}</span>
            <span className="sidebar-title">{c.label}</span>
          </div>

          <button
            onClick={() => navigate("home")}
            className="btn btn-secondary"
            style={{
              width: "100%",
              justifyContent: "center",
              fontSize: "0.875rem",
              padding: "8px 12px",
              cursor: "pointer"
            }}
          >
            ← All Careers
          </button>
        </div>

        {/* Nav tabs */}
        <nav className="sidebar-nav">
          {TABS.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => navigate(t.id, career)}
              className={`sidebar-tab ${page === t.id ? "active" : ""}`}
              style={{
                color: page === t.id ? "#6366f1" : undefined,
                animation: `slideInLeft 0.3s ease-out ${idx * 0.05}s both`
              }}
            >
              <span className="sidebar-tab-icon"><t.Icon size={18} /></span>
              {t.text}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <span
            className="sidebar-user"
            style={{ animation: "fadeIn 0.3s ease-out 0.4s both", display: "flex", alignItems: "center", gap: "8px" }}
          >
            <UserIcon size={16} /> {user.name}
          </span>
          <button
            onClick={onLogout}
            className="sidebar-logout"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          background: "var(--bg-secondary)",
          animation: "fadeInUp 0.4s ease-out 0.2s both"
        }}
      >
        {page === "roadmap"   && <Suspense fallback={<LoadingSpinner />}><RoadmapPage   career={career} user={user} /></Suspense>}
        {page === "courses"   && <Suspense fallback={<LoadingSpinner />}><CoursesPage   career={career} /></Suspense>}
        {page === "youtube"   && <Suspense fallback={<LoadingSpinner />}><YouTubePage   career={career} /></Suspense>}
        {page === "interview" && <Suspense fallback={<LoadingSpinner />}><InterviewPage career={career} /></Suspense>}
        {page === "planner"   && <Suspense fallback={<LoadingSpinner />}><PlannerPage   career={career} user={user} /></Suspense>}
        {page === "progress"  && <Suspense fallback={<LoadingSpinner />}><ProgressPage  career={career} user={user} /></Suspense>}
      </main>
    </div>
  );
}

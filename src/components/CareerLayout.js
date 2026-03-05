import CAREERS from "../data/careers";
import RoadmapPage   from "../pages/RoadmapPage";
import CoursesPage   from "../pages/CoursesPage";
import YouTubePage   from "../pages/YouTubePage";
import InterviewPage from "../pages/InterviewPage";
import PlannerPage   from "../pages/PlannerPage";
import ProgressPage  from "../pages/ProgressPage";

const TABS = [
  { id: "roadmap",   label: "🗺",  text: "Roadmap"   },
  { id: "courses",   label: "📚", text: "Courses"   },
  { id: "youtube",   label: "▶",  text: "YouTube"   },
  { id: "interview", label: "💼", text: "Interview"  },
  { id: "planner",   label: "📅", text: "Planner"   },
  { id: "progress",  label: "✅", text: "Progress"  },
];

export default function CareerLayout({ career, page, navigate, user, onLogout }) {
  const c = CAREERS[career];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        {/* Brand */}
        <div style={s.sideTop}>
          <div style={s.sideBrand}>
            <span style={{ fontSize: 26 }}>{c.icon}</span>
            <span style={s.sideBrandName}>{c.label}</span>
          </div>
          <button onClick={() => navigate("home")} style={s.backBtn}>
            ← All Careers
          </button>
        </div>

        {/* Nav tabs */}
        <nav style={{ padding: "12px 8px", flex: 1 }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => navigate(t.id, career)}
              style={{
                ...s.sideTab,
                ...(page === t.id
                  ? { background: c.color + "22", color: c.accent, borderLeft: `3px solid ${c.color}` }
                  : {}),
              }}
            >
              <span style={{ fontSize: 16 }}>{t.label}</span>
              {t.text}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div style={s.sideFooter}>
          <span style={{ color: "#444", fontSize: 12 }}>👤 {user.name}</span>
          <button onClick={onLogout} style={s.sideLogout}>Logout</button>
        </div>
      </aside>

      {/* Main content */}
      <main style={s.main}>
        {page === "roadmap"   && <RoadmapPage   career={career} user={user} />}
        {page === "courses"   && <CoursesPage   career={career} />}
        {page === "youtube"   && <YouTubePage   career={career} />}
        {page === "interview" && <InterviewPage career={career} />}
        {page === "planner"   && <PlannerPage   career={career} user={user} />}
        {page === "progress"  && <ProgressPage  career={career} user={user} />}
      </main>
    </div>
  );
}

const s = {
  sidebar: {
    width: 230,
    minHeight: "100vh",
    background: "#0a0a14",
    borderRight: "1px solid #1e1e2e",
    display: "flex",
    flexDirection: "column",
    position: "sticky",
    top: 0,
    height: "100vh",
    overflowY: "auto",
    flexShrink: 0,
  },
  sideTop: {
    padding: "24px 16px 16px",
    borderBottom: "1px solid #1e1e2e",
  },
  sideBrand: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12 },
  sideBrandName: { color: "#fff", fontWeight: 700, fontSize: 16 },
  backBtn: {
    background: "transparent",
    border: "1px solid #1e1e2e",
    color: "#666",
    borderRadius: 8,
    padding: "7px 12px",
    cursor: "pointer",
    fontSize: 12,
    width: "100%",
  },
  sideTab: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    padding: "11px 18px",
    background: "transparent",
    border: "none",
    borderLeft: "3px solid transparent",
    color: "#666",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
    textAlign: "left",
    transition: "all 0.15s",
  },
  sideFooter: {
    padding: "16px",
    borderTop: "1px solid #1e1e2e",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  sideLogout: {
    background: "#1e1e2e",
    border: "none",
    color: "#555",
    borderRadius: 8,
    padding: "7px 12px",
    cursor: "pointer",
    fontSize: 12,
  },
  main: {
    flex: 1,
    overflowY: "auto",
    background: "#0f0f1a",
  },
};

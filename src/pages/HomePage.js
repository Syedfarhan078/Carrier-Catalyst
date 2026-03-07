import CAREERS from "../data/careers";
import { useNavigate } from "react-router-dom";
import { MentorConnectButton } from "./HomePage";
import ResumeAnalyzerButton from "../components/ResumeAnalyzerButton";


export default function HomePage({ navigate, user, onLogout }) {
  const routerNavigate = useNavigate();
  return (
    <div style={s.bg}>
      {/* Navbar */}
      <nav style={s.nav}>
        <div style={s.navBrand}>
          <span style={{ fontSize: 28 }}>🚀</span>
          <span style={s.navTitle}>Carrer Catalyst</span>
        </div>
        <div style={s.navRight}>
          <span style={s.navGreet}>👤 {user.name}</span>
          <button onClick={onLogout} style={s.logoutBtn}>Logout</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={s.hero}>
        <div style={s.heroTag}>✦ AI-POWERED CAREER GUIDANCE</div>
        <h1 style={s.heroTitle}>
          Find Your <span style={s.heroHighlight}>Carrer Catalyst</span>
        </h1>
        <p style={s.heroSub}>
          Personalized roadmaps, curated courses, interview prep, and weekly study plans —
          everything you need to land your dream tech job.
        </p>
      </div>

      {/* Career Cards */}
      <div style={s.grid}>
        {Object.entries(CAREERS).map(([key, c]) => (
          <div
            key={key}
            className="career-card"
            style={{ ...s.card, borderTop: `4px solid ${c.color}` }}
            onClick={() => navigate("roadmap", key)}
          >
            <div style={{ fontSize: 60, marginBottom: 16 }}>{c.icon}</div>
            <h2 style={{ ...s.cardTitle, color: c.color }}>{c.label}</h2>
            <p style={s.cardDesc}>{c.description}</p>
            <div style={s.tagRow}>
              {["Roadmap", "Courses", "YouTube", "Interview", "Planner", "Progress"].map((f) => (
                <span key={f} style={{ ...s.tag, background: c.color + "22", color: c.color }}>
                  {f}
                </span>
              ))}
            </div>
            <button style={{ ...s.cardBtn, background: c.color }}>
              Start Learning →
            </button>
          </div>
        ))}
      </div>


      {/* AI Assessment Section */}
<div style={{ textAlign: "center", marginBottom: 50 }}>
  <button
    onClick={() => routerNavigate("/assessment")}
    style={{
      padding: "16px 34px",
      fontSize: 16,
      fontWeight: 700,
      background: "#6C63FF",
      border: "none",
      borderRadius: 12,
      color: "#fff",
      cursor: "pointer"
    }}
  >
    💻 Start AI Proctored Assessment
  </button>
</div>

{/* Connect Button */}
<div style={{ textAlign: "center", marginTop: 30 }}>
  <button
    onClick={() => routerNavigate("/mentors")}
    style={{
      padding: "16px 34px",
      fontSize: 16,
      fontWeight: 700,
      background: "#FF7A18",
      border: "none",
      borderRadius: 12,
      color: "#fff",
      cursor: "pointer",
      boxShadow: "0 8px 24px rgba(0,0,0,0.4)"
    }}
  >
    🤝 Connect With Industry Mentors
  </button>
</div>

<ResumeAnalyzerButton />
      
      {/* Stats bar */}
      <div style={s.statsBar}>
        {[
          ["2", "Career Tracks"],
          ["30+", "Curated Courses"],
          ["100+", "Interview Q&As"],
          ["5+", "Study Schedules"],
        ].map(([n, l]) => (
          <div key={l} style={s.statItem}>
            <span style={s.statNum}>{n}</span>
            <span style={s.statLabel}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  bg: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #0a0a14 0%, #0f0f1a 100%)",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 48px",
    borderBottom: "1px solid #1e1e2e",
  },
  navBrand: { display: "flex", alignItems: "center", gap: 10 },
  navTitle: { fontSize: 22, fontWeight: 800, color: "#6C63FF" },
  navRight: { display: "flex", alignItems: "center", gap: 16 },
  navGreet: { color: "#888", fontSize: 14 },
  logoutBtn: {
    background: "#1e1e2e",
    border: "1px solid #2e2e4e",
    color: "#aaa",
    borderRadius: 8,
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: 13,
  },
  hero: { textAlign: "center", padding: "80px 40px 48px" },
  heroTag: {
    color: "#6C63FF",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 3,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 54,
    fontWeight: 900,
    color: "#fff",
    margin: "0 0 20px",
    lineHeight: 1.1,
  },
  heroHighlight: { color: "#6C63FF" },
  heroSub: {
    color: "#888",
    maxWidth: 580,
    margin: "0 auto",
    fontSize: 17,
    lineHeight: 1.7,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: 28,
    padding: "20px 48px 60px",
    maxWidth: 960,
    margin: "0 auto",
  },
  card: {
    background: "#12121f",
    borderRadius: 22,
    padding: 36,
    cursor: "pointer",
    transition: "transform 0.25s, box-shadow 0.25s",
    border: "1px solid #1e1e2e",
  },
  cardTitle: { fontSize: 26, fontWeight: 800, margin: "0 0 10px" },
  cardDesc: { color: "#888", fontSize: 14, lineHeight: 1.7, marginBottom: 22 },
  tagRow: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 },
  tag: { padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700 },
  cardBtn: {
    width: "100%",
    padding: "13px",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  statsBar: {
    display: "flex",
    justifyContent: "center",
    gap: 64,
    padding: "36px",
    borderTop: "1px solid #1e1e2e",
  },
  statItem: { display: "flex", flexDirection: "column", alignItems: "center" },
  statNum: { fontSize: 38, fontWeight: 900, color: "#6C63FF" },
  statLabel: { color: "#555", fontSize: 13, marginTop: 2 },
};

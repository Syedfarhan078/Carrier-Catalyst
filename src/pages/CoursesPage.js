import CAREERS from "../data/careers";
import PageHeader from "../components/PageHeader";


const LEVEL_COLORS = {
  Beginner:       "#22c55e",
  Intermediate:   "#f59e0b",
  Advanced:       "#ef4444",
  "Beginner–Adv": "#8b5cf6",
  Free:           "#06b6d4",
  "Free + Cert":  "#06b6d4",
  "Self-paced":   "#06b6d4",
};

export default function CoursesPage({ career }) {
  const c = CAREERS[career] || Object.values(CAREERS)[0];

  return (
    <div style={s.page}>
      <PageHeader icon="📚" title="Curated Courses" sub="Hand-picked courses to accelerate your learning" color={c?.color || "#6C63FF"} />

      <div style={s.grid}>
        {c?.courses?.map((course, i) => {
          const lvlColor = LEVEL_COLORS[course.level] || "#888";
          return (
            <div key={i} style={s.card}>
              <div style={s.cardTop}>
                <span style={{ ...s.badge, background: lvlColor + "22", color: lvlColor }}>
                  {course.level}
                </span>
                <span style={s.dur}>⏱ {course.duration}</span>
              </div>
              <h3 style={s.title}>{course.title}</h3>
              <p style={s.provider}>by {course.provider}</p>
              <a
                href={course.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...s.btn, background: c.color }}
              >
                View Course →
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const s = {
  page: { padding: "40px 48px", maxWidth: 960, margin: "0 auto" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 },
  card: { background: "#12121f", border: "1px solid #1e1e2e", borderRadius: 18, padding: 26 },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  badge: { padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700 },
  dur: { color: "#555", fontSize: 12 },
  title: { color: "#fff", fontSize: 16, fontWeight: 700, margin: "0 0 6px", lineHeight: 1.4 },
  provider: { color: "#777", fontSize: 13, margin: "0 0 20px" },
  btn: {
    display: "block",
    textAlign: "center",
    padding: "11px",
    borderRadius: 10,
    color: "#fff",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 700,
  },
};

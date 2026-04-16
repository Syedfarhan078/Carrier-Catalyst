import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import CAREERS from "../data/careers";
import PageHeader from "../components/PageHeader";

export default function RoadmapPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const careerKey = params.get("career");

  // ✅ ALWAYS declare hooks first
  const [completed, setCompleted] = useState({});

  // ❗ Now safe to check condition
  if (!careerKey || !CAREERS[careerKey]) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1 style={{ color: "white", marginBottom: "30px" }}>
          Select a Career Path 🚀
        </h1>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          maxWidth: "800px",
          margin: "0 auto"
        }}>
          {Object.entries(CAREERS).map(([key, c]) => (
            <div
              key={key}
              onClick={() => navigate(`/roadmap?career=${key}`)}
              style={{
                padding: "20px",
                borderRadius: "12px",
                background: "#12121f",
                border: "1px solid #2e2e4e",
                cursor: "pointer",
                color: "#fff"
              }}
            >
              <h2 style={{ color: c.color }}>{c.label}</h2>
              <p style={{ fontSize: "14px", color: "#aaa" }}>
                {c.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const c = CAREERS[careerKey];

  const toggle = (topic) => {
    setCompleted((prev) => ({
      ...prev,
      [topic]: !prev[topic],
    }));
  };

  const allTopics = c.roadmap.flatMap((p) => p.steps);
  const doneCount = allTopics.filter((t) => completed[t]).length;
  const pct = Math.round((doneCount / allTopics.length) * 100);

  return (
    <div style={s.page}>
      <PageHeader
        icon="🗺"
        title="Learning Roadmap"
        sub={`Track your journey through ${c.label}`}
        color={c.color}
      />

      <div style={s.progressWrap}>
        <div style={s.progressMeta}>
          <span style={{ color: "#888" }}>Overall Progress</span>
          <span style={{ color: c.color }}>
            {doneCount}/{allTopics.length} ({pct}%)
          </span>
        </div>

        <div style={s.track}>
          <div style={{ ...s.fill, width: `${pct}%`, background: c.color }} />
        </div>
      </div>

      <div style={s.grid}>
        {c.roadmap.map((phase, pi) => (
          <div key={pi} style={{ ...s.card, borderTop: `3px solid ${c.color}` }}>
            <h3 style={{ color: c.color }}>
              Phase {pi + 1} — {phase.phase}
            </h3>

            {phase.steps.map((step, si) => (
              <div key={si} style={s.stepRow} onClick={() => toggle(step)}>
                <div
                  style={{
                    ...s.checkbox,
                    ...(completed[step]
                      ? { background: c.color, borderColor: c.color }
                      : {}),
                  }}
                >
                  {completed[step] && "✓"}
                </div>

                <span
                  style={{
                    color: completed[step] ? "#444" : "#ddd",
                    textDecoration: completed[step] ? "line-through" : "none",
                  }}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}


const s = {
  page: {
    padding: "40px 48px",
    maxWidth: 960,
    margin: "0 auto",
  },

  progressWrap: {
    marginBottom: 36,
  },

  progressMeta: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
    fontSize: 14,
  },

  track: {
    height: 10,
    background: "#1e1e2e",
    borderRadius: 6,
    overflow: "hidden",
  },

  fill: {
    height: "100%",
    borderRadius: 6,
    transition: "width 0.4s ease",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 20,
  },

  card: {
    background: "#12121f",
    border: "1px solid #1e1e2e",
    borderRadius: 18,
    padding: 20,
  },

  stepRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "8px 0",
    cursor: "pointer",
  },

  checkbox: {
    width: 18,
    height: 18,
    border: "2px solid #555",
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
  },
};
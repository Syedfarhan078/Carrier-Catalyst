import { useState } from "react";
import CAREERS from "../data/careers";
import DB from "../data/db";
import PageHeader from "../components/PageHeader";

export default function RoadmapPage({ career, user }) {
  const c = CAREERS[career];

  const [completed, setCompleted] = useState(() => {
    const rows = DB.getProgress(user.id, career);
    return rows.reduce((acc, r) => { acc[r.topic] = r.completed; return acc; }, {});
  });

  const toggle = (topic) => {
    const val = !completed[topic];
    setCompleted((prev) => ({ ...prev, [topic]: val }));
    DB.setProgress(user.id, career, topic, val);
  };

  const allTopics = c.roadmap.flatMap((p) => p.steps);
  const doneCount = allTopics.filter((t) => completed[t]).length;
  const pct = Math.round((doneCount / allTopics.length) * 100);

  return (
    <div style={s.page}>
      <PageHeader icon="🗺" title="Learning Roadmap" sub={`Track your journey through ${c.label}`} color={c.color} />

      {/* Progress bar */}
      <div style={s.progressWrap}>
        <div style={s.progressMeta}>
          <span style={{ color: "#888" }}>Overall Progress</span>
          <span style={{ color: c.color, fontWeight: 700 }}>{doneCount} / {allTopics.length} topics ({pct}%)</span>
        </div>
        <div style={s.track}>
          <div style={{ ...s.fill, width: `${pct}%`, background: c.color }} />
        </div>
      </div>

      {/* Phases grid */}
      <div style={s.grid}>
        {c.roadmap.map((phase, pi) => {
          const phaseDone = phase.steps.filter((t) => completed[t]).length;
          return (
            <div key={pi} style={{ ...s.card, borderTop: `3px solid ${c.color}` }}>
              <div style={s.phaseHeader}>
                <span style={{ ...s.phaseLabel, color: c.accent }}>
                  Phase {pi + 1} — {phase.phase}
                </span>
                <span style={s.phaseCount}>{phaseDone}/{phase.steps.length}</span>
              </div>
              {phase.steps.map((step, si) => (
                <div key={si} style={s.stepRow} onClick={() => toggle(step)}>
                  <div style={{ ...s.checkbox, ...(completed[step] ? { background: c.color, borderColor: c.color } : {}) }}>
                    {completed[step] && <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>✓</span>}
                  </div>
                  <span
                    style={{
                      color: completed[step] ? "#444" : "#ddd",
                      textDecoration: completed[step] ? "line-through" : "none",
                      fontSize: 14,
                      transition: "all 0.2s",
                    }}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const s = {
  page: { padding: "40px 48px", maxWidth: 960, margin: "0 auto" },
  progressWrap: { marginBottom: 36 },
  progressMeta: { display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 14 },
  track: { height: 10, background: "#1e1e2e", borderRadius: 6, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 6, transition: "width 0.4s ease" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 },
  card: { background: "#12121f", border: "1px solid #1e1e2e", borderRadius: 18, padding: 26 },
  phaseHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
  phaseLabel: { fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 },
  phaseCount: { color: "#444", fontSize: 12 },
  stepRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "9px 0",
    cursor: "pointer",
    borderBottom: "1px solid #0f0f1a",
    userSelect: "none",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    border: "2px solid #2e2e4e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "all 0.2s",
  },
};

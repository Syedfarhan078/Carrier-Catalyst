import { useState } from "react";
import CAREERS from "../data/careers";
import PageHeader from "../components/PageHeader";

export default function InterviewPage({ career }) {
  const c = CAREERS[career];
  const [open, setOpen] = useState({});

  const toggle = (key) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div style={s.page}>
      <PageHeader icon="💼" title="Interview Preparation" sub="Common questions asked in real interviews" color={c.color} />

      {c.interview.map((cat, ci) => (
        <div key={ci} style={s.section}>
          <h2 style={{ ...s.catTitle, borderLeft: `4px solid ${c.color}` }}>
            {cat.category}
          </h2>
          <div style={s.questions}>
            {cat.questions.map((q, qi) => {
              const key = `${ci}-${qi}`;
              const isOpen = !!open[key];
              return (
                <div key={qi} style={s.qCard} onClick={() => toggle(key)}>
                  <div style={s.qRow}>
                    <span style={s.qNum}>Q{qi + 1}</span>
                    <span style={s.qText}>{q}</span>
                    <span style={{ color: c.color, fontSize: 12 }}>{isOpen ? "▲" : "▼"}</span>
                  </div>
                  {isOpen && (
                    <div style={s.hint}>
                      💡 <strong>Study tip:</strong> Focus on the definition, a real-world example,
                      common edge cases, and how this concept applies to {c.label} engineering roles.
                      Practice explaining it out loud.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

const s = {
  page: { padding: "40px 48px", maxWidth: 860, margin: "0 auto" },
  section: { marginBottom: 40 },
  catTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: 800,
    paddingLeft: 16,
    marginBottom: 16,
  },
  questions: { display: "flex", flexDirection: "column", gap: 8 },
  qCard: {
    background: "#12121f",
    border: "1px solid #1e1e2e",
    borderRadius: 12,
    padding: "16px 20px",
    cursor: "pointer",
    transition: "border-color 0.2s",
  },
  qRow: { display: "flex", alignItems: "center", gap: 12 },
  qNum: {
    color: "#444",
    fontSize: 11,
    fontWeight: 700,
    background: "#1e1e2e",
    padding: "3px 7px",
    borderRadius: 6,
    flexShrink: 0,
  },
  qText: { color: "#ddd", fontSize: 14, flex: 1, lineHeight: 1.5 },
  hint: {
    marginTop: 14,
    padding: "12px 16px",
    background: "#0a0a14",
    borderRadius: 10,
    color: "#888",
    fontSize: 13,
    lineHeight: 1.7,
    border: "1px solid #1a1a2e",
  },
};

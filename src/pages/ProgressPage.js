import CAREERS from "../data/careers";
import DB from "../data/db";
import PageHeader from "../components/PageHeader";

export default function ProgressPage({ career, user }) {
  const c = CAREERS[career];
  const progress     = DB.getProgress(user.id, career);
  const plannerTasks = DB.getPlanner(user.id, career);
  const sessionCount = DB.getSessionCount(user.id, career);

  const allTopics  = c.roadmap.flatMap((p) => p.steps);
  const doneTopics = progress.filter((p) => p.completed).length;
  const pct        = allTopics.length ? Math.round((doneTopics / allTopics.length) * 100) : 0;
  const planDone   = plannerTasks.filter((t) => t.done).length;

  const stats = [
    { label: "Roadmap Complete", value: `${pct}%`, sub: `${doneTopics} of ${allTopics.length} topics`, color: c.color },
    { label: "Tasks Completed",  value: planDone,   sub: `of ${plannerTasks.length} planner tasks`,    color: "#22c55e" },
    { label: "Study Sessions",   value: sessionCount, sub: "visits logged",                              color: "#f59e0b" },
    { label: "Current Track",    value: c.icon,      sub: c.label,                                       color: c.accent },
  ];

  return (
    <div style={s.page}>
      <PageHeader icon="✅" title="My Progress" sub="Your learning achievements at a glance" color={c.color} />

      {/* Stat cards */}
      <div style={s.statsGrid}>
        {stats.map((st, i) => (
          <div key={i} style={s.statCard}>
            <div style={{ ...s.bigVal, color: st.color }}>{st.value}</div>
            <div style={s.statLabel}>{st.label}</div>
            <div style={s.statSub}>{st.sub}</div>
          </div>
        ))}
      </div>

      {/* Phase breakdown */}
      <div style={s.card}>
        <h3 style={s.sectionTitle}>Phase-by-Phase Breakdown</h3>
        {c.roadmap.map((phase, pi) => {
          const done = phase.steps.filter((step) =>
            progress.find((p) => p.topic === step && p.completed)
          ).length;
          const phasePct = Math.round((done / phase.steps.length) * 100);
          return (
            <div key={pi} style={{ marginBottom: 20 }}>
              <div style={s.phaseRow}>
                <span style={{ color: "#ccc", fontSize: 14 }}>Phase {pi + 1}: {phase.phase}</span>
                <span style={{ color: c.color, fontSize: 13, fontWeight: 700 }}>{done}/{phase.steps.length}</span>
              </div>
              <div style={s.track}>
                <div style={{ ...s.fill, width: `${phasePct}%`, background: c.color }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* SQL snapshot */}
      <div style={s.card}>
        <h3 style={s.sectionTitle}>🗄️ SQL Query — Progress Table</h3>
        <pre style={s.codeBlock}>
          <span style={{ color: "#7c3aed" }}>SELECT</span> topic, completed, updated_at{"\n"}
          <span style={{ color: "#7c3aed" }}>FROM</span> progress{"\n"}
          <span style={{ color: "#7c3aed" }}>WHERE</span> user_id = <span style={{ color: "#f59e0b" }}>{user.id}</span>{"\n"}
          {"  "}<span style={{ color: "#7c3aed" }}>AND</span> career = <span style={{ color: "#22c55e" }}>'{career}'</span>;{"\n\n"}
          <span style={{ color: "#22c55e" }}>→ {progress.length} row(s) returned | {doneTopics} completed</span>
        </pre>
      </div>

      {/* Recent progress rows */}
      {progress.length > 0 && (
        <div style={s.card}>
          <h3 style={s.sectionTitle}>Recent Progress Rows</h3>
          <table style={s.table}>
            <thead>
              <tr>
                {["topic", "completed", "updated_at"].map((col) => (
                  <th key={col} style={s.th}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {progress.slice(-8).reverse().map((row, i) => (
                <tr key={i}>
                  <td style={s.td}>{row.topic}</td>
                  <td style={{ ...s.td, color: row.completed ? "#22c55e" : "#ef4444" }}>
                    {row.completed ? "TRUE" : "FALSE"}
                  </td>
                  <td style={{ ...s.td, color: "#555", fontSize: 11 }}>
                    {new Date(row.updated_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const s = {
  page: { padding: "40px 48px", maxWidth: 960, margin: "0 auto" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 28 },
  statCard: { background: "#12121f", border: "1px solid #1e1e2e", borderRadius: 18, padding: 26, textAlign: "center" },
  bigVal: { fontSize: 42, fontWeight: 900, marginBottom: 8, lineHeight: 1 },
  statLabel: { color: "#ddd", fontWeight: 700, fontSize: 14, marginBottom: 6 },
  statSub: { color: "#555", fontSize: 12 },
  card: { background: "#12121f", border: "1px solid #1e1e2e", borderRadius: 18, padding: 28, marginBottom: 20 },
  sectionTitle: { color: "#888", fontSize: 12, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700, marginBottom: 20 },
  phaseRow: { display: "flex", justifyContent: "space-between", marginBottom: 8 },
  track: { height: 8, background: "#1e1e2e", borderRadius: 4, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 4, transition: "width 0.5s ease" },
  codeBlock: {
    background: "#0a0a14",
    borderRadius: 10,
    padding: "18px 20px",
    fontSize: 13,
    lineHeight: 2,
    color: "#ccc",
    border: "1px solid #1a1a2e",
    overflowX: "auto",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { color: "#555", fontSize: 11, fontWeight: 700, textAlign: "left", padding: "8px 12px", textTransform: "uppercase", borderBottom: "1px solid #1e1e2e", letterSpacing: 1 },
  td: { color: "#ccc", fontSize: 13, padding: "10px 12px", borderBottom: "1px solid #0f0f1a" },
};

import { useState } from "react";
import CAREERS from "../data/careers";
import DB from "../data/db";
import PageHeader from "../components/PageHeader";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function PlannerPage({ career, user }) {
  const c = CAREERS[career];
  const [tasks, setTasks] = useState(() => DB.getPlanner(user.id, career));
  const [newTask, setNewTask] = useState({ day: "Monday", task: "" });

  const refresh = () => setTasks(DB.getPlanner(user.id, career));

  const add = () => {
    if (!newTask.task.trim()) return;
    DB.addPlannerTask(user.id, career, newTask.day, newTask.task.trim());
    setNewTask((p) => ({ ...p, task: "" }));
    refresh();
  };

  const toggle = (id) => { DB.togglePlannerTask(id); refresh(); };
  const del    = (id) => { DB.deletePlannerTask(id); refresh(); };

  const userTasksByDay = DAYS.reduce((acc, day) => {
    acc[day] = tasks.filter((t) => t.day === day);
    return acc;
  }, {});

  return (
    <div style={s.page}>
      <PageHeader icon="📅" title="Study Planner" sub="Plan your weekly study schedule and track tasks" color={c.color} />

      {/* Add task */}
      <div style={s.addRow}>
        <select
          value={newTask.day}
          onChange={(e) => setNewTask((p) => ({ ...p, day: e.target.value }))}
          style={s.select}
        >
          {DAYS.map((d) => <option key={d}>{d}</option>)}
        </select>
        <input
          value={newTask.task}
          onChange={(e) => setNewTask((p) => ({ ...p, task: e.target.value }))}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add a study task..."
          style={s.input}
        />
        <button onClick={add} style={{ ...s.addBtn, background: c.color }}>
          + Add
        </button>
      </div>

      {/* Recommended plan */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={s.sectionTitle}>📋 Recommended Study Plan</h2>
        <div style={s.planGrid}>
          {c.plan.map((p, i) => (
            <div key={i} style={s.planCard}>
              <div style={s.planTop}>
                <span style={{ ...s.planWeek, color: c.accent }}>{p.week}</span>
                <span style={s.planFocus}>{p.focus}</span>
              </div>
              {p.tasks.map((t, ti) => (
                <div key={ti} style={s.planTask}>
                  <span style={{ color: c.color, marginRight: 6 }}>→</span>
                  {t}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* User tasks by day */}
      <section>
        <h2 style={s.sectionTitle}>📌 My Tasks This Week</h2>
        {DAYS.map((day) => {
          const dayTasks = userTasksByDay[day];
          if (!dayTasks.length) return null;
          return (
            <div key={day} style={s.dayBlock}>
              <h3 style={{ ...s.dayTitle, color: c.color }}>{day}</h3>
              {dayTasks.map((t) => (
                <div key={t.id} style={s.taskRow}>
                  <div
                    style={{ ...s.check, ...(t.done ? { background: c.color, borderColor: c.color } : {}) }}
                    onClick={() => toggle(t.id)}
                  >
                    {t.done && <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>✓</span>}
                  </div>
                  <span style={{ flex: 1, color: t.done ? "#444" : "#ddd", textDecoration: t.done ? "line-through" : "none", fontSize: 14 }}>
                    {t.task}
                  </span>
                  <button onClick={() => del(t.id)} style={s.delBtn}>✕</button>
                </div>
              ))}
            </div>
          );
        })}
        {tasks.length === 0 && (
          <p style={{ color: "#444", fontSize: 14 }}>No tasks added yet. Add one above!</p>
        )}
      </section>
    </div>
  );
}

const s = {
  page: { padding: "40px 48px", maxWidth: 960, margin: "0 auto" },
  addRow: { display: "flex", gap: 10, marginBottom: 40, alignItems: "center" },
  select: {
    padding: "12px 16px",
    background: "#0a0a14",
    border: "1px solid #1e1e2e",
    borderRadius: 10,
    color: "#fff",
    fontSize: 13,
    flexShrink: 0,
  },
  input: {
    flex: 1,
    padding: "12px 16px",
    background: "#0a0a14",
    border: "1px solid #1e1e2e",
    borderRadius: 10,
    color: "#fff",
    fontSize: 14,
    outline: "none",
  },
  addBtn: {
    padding: "12px 22px",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    flexShrink: 0,
  },
  sectionTitle: {
    color: "#888",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 18,
    fontWeight: 700,
  },
  planGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 },
  planCard: { background: "#12121f", border: "1px solid #1e1e2e", borderRadius: 16, padding: 22 },
  planTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  planWeek: { fontWeight: 800, fontSize: 13 },
  planFocus: { color: "#555", fontSize: 12 },
  planTask: { color: "#bbb", fontSize: 13, padding: "5px 0", borderBottom: "1px solid #1a1a2e", lineHeight: 1.5 },
  dayBlock: { background: "#12121f", border: "1px solid #1e1e2e", borderRadius: 16, padding: 22, marginBottom: 14 },
  dayTitle: { fontSize: 14, fontWeight: 700, marginBottom: 12 },
  taskRow: { display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: "1px solid #0f0f1a" },
  check: {
    width: 22,
    height: 22,
    borderRadius: 6,
    border: "2px solid #2e2e4e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
    transition: "all 0.2s",
  },
  delBtn: {
    background: "transparent",
    border: "none",
    color: "#333",
    cursor: "pointer",
    fontSize: 15,
    padding: "0 4px",
    flexShrink: 0,
  },
};

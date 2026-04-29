import { useState } from "react";
import CAREERS from "../data/careers";
import DB from "../data/db";
import PageHeader from "../components/PageHeader";
import { validateTask, normalizeWhitespace } from "../utils/validators";
import "../styles/advancedCareer.css";
import { CalendarIcon, ClipboardIcon } from "../components/Icons";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function PlannerPage({ career, user }) {
  const c = CAREERS[career];
  const [tasks, setTasks] = useState(() => DB.getPlanner(user.id, career));
  const [newTask, setNewTask] = useState({ day: "Monday", task: "" });

  const refresh = () => setTasks(DB.getPlanner(user.id, career));

  const add = () => {
    const validation = validateTask(newTask.task);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }
    
    const sanitizedTask = normalizeWhitespace(newTask.task);
    DB.addPlannerTask(user.id, career, newTask.day, sanitizedTask);
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
    <div className="advanced-container">
      <div className="advanced-wrapper">
        <PageHeader
          icon="📅"
          title="Study Planner"
          sub="Organize your learning schedule and track your weekly progress"
          color={c.color}
        />

        {/* Add Task Section */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          gap: "12px",
          marginBottom: "48px",
          animation: "fadeInDown 0.8s ease-out"
        }}>
          <select
            value={newTask.day}
            onChange={(e) => setNewTask((p) => ({ ...p, day: e.target.value }))}
            style={{
              padding: "14px 16px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "0.95rem",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all var(--transition-fast)"
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)";
              e.currentTarget.style.background = "rgba(99,102,241,0.08)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)";
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            }}
          >
            {DAYS.map((d) => <option key={d}>{d}</option>)}
          </select>

          <input
            value={newTask.task}
            onChange={(e) => setNewTask((p) => ({ ...p, task: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder="Add a study task for this day..."
            style={{
              padding: "14px 20px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "0.95rem",
              outline: "none",
              transition: "all var(--transition-fast)"
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)";
              e.currentTarget.style.background = "rgba(99,102,241,0.08)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)";
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            }}
          />

          <button
            onClick={add}
            style={{
              padding: "14px 28px",
              background: c.color,
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontSize: "0.95rem",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all var(--transition-standard)",
              boxShadow: `0 8px 24px ${c.color}40`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 12px 32px ${c.color}60`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = `0 8px 24px ${c.color}40`;
            }}
          >
            + Add Task
          </button>
        </div>

        {/* Recommended Study Plan */}
        {c.plan && c.plan.length > 0 && (
          <section style={{ marginBottom: "60px", animation: "fadeInUp 0.8s ease-out 0.1s both" }}>
            <h2 style={{
              fontSize: "1.3rem",
              fontWeight: "800",
              color: "#fff",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <ClipboardIcon size={24} color="#fff" />
              Recommended Study Plan
            </h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px"
            }}>
              {c.plan.map((p, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(99,102,241,0.2)",
                    borderRadius: "16px",
                    padding: "24px",
                    transition: "all var(--transition-standard)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(99,102,241,0.12)";
                    e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <span style={{
                      fontSize: "0.9rem",
                      fontWeight: "800",
                      color: c.accent,
                      textTransform: "uppercase",
                      letterSpacing: "1px"
                    }}>
                      {p.week}
                    </span>
                    <span style={{
                      fontSize: "0.85rem",
                      color: "rgba(255,255,255,0.5)",
                      background: "rgba(99,102,241,0.1)",
                      padding: "4px 10px",
                      borderRadius: "6px"
                    }}>
                      {p.focus}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {p.tasks.map((t, ti) => (
                      <div key={ti} style={{
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "0.95rem",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "8px",
                        lineHeight: "1.5"
                      }}>
                        <span style={{ color: c.color, fontWeight: "700", marginTop: "2px" }}>→</span>
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* My Tasks This Week */}
        <section style={{ animation: "fadeInUp 0.8s ease-out 0.2s both" }}>
          <h2 style={{
            fontSize: "1.3rem",
            fontWeight: "800",
            color: "#fff",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            📌 My Tasks This Week
          </h2>

          {DAYS.map((day) => {
            const dayTasks = userTasksByDay[day];
            if (!dayTasks.length) return null;

            return (
              <div key={day} style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(99,102,241,0.2)",
                borderRadius: "16px",
                padding: "24px",
                marginBottom: "16px",
                transition: "all var(--transition-standard)"
              }}>
                <h3 style={{
                  color: c.color,
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  marginBottom: "16px",
                  paddingBottom: "12px",
                  borderBottom: `1px solid rgba(99,102,241,0.2)`
                }}>
                  {day}
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {dayTasks.map((t) => (
                    <div
                      key={t.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px",
                        background: t.done ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.02)",
                        borderRadius: "10px",
                        transition: "all var(--transition-fast)"
                      }}
                    >
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "6px",
                          border: `2px solid ${t.done ? c.color : "rgba(255,255,255,0.3)"}`,
                          background: t.done ? c.color : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          flexShrink: 0,
                          transition: "all var(--transition-fast)"
                        }}
                        onClick={() => toggle(t.id)}
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "6px",
                          border: `2px solid ${t.done ? c.color : "rgba(255,255,255,0.3)"}`,
                          background: t.done ? c.color : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          flexShrink: 0,
                          transition: "all var(--transition-fast)"
                        }}
                      >
                        {t.done && <span style={{ color: "#fff", fontSize: "12px", fontWeight: "700" }}>✓</span>}
                      </div>

                      <span style={{
                        flex: 1,
                        color: t.done ? "rgba(255,255,255,0.4)" : "#fff",
                        textDecoration: t.done ? "line-through" : "none",
                        fontSize: "0.95rem",
                        transition: "all var(--transition-fast)"
                      }}>
                        {t.task}
                      </span>

                      <button
                        onClick={() => del(t.id)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "rgba(255,255,255,0.3)",
                          cursor: "pointer",
                          fontSize: "1.2rem",
                          padding: "4px 8px",
                          flexShrink: 0,
                          transition: "all var(--transition-fast)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#ff6b6b";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "rgba(255,255,255,0.3)";
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {tasks.length === 0 && (
            <div style={{
              textAlign: "center",
              padding: "40px 20px",
              color: "rgba(255,255,255,0.5)"
            }}>
              <p style={{ fontSize: "1rem", marginBottom: "16px" }}>No tasks added yet</p>
              <p style={{ fontSize: "0.9rem" }}>Start planning your week by adding tasks above!</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

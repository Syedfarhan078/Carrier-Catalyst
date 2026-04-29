import CAREERS from "../data/careers";
import DB from "../data/db";
import PageHeader from "../components/PageHeader";
import { Suspense, lazy } from "react";
import "../styles/advancedCareer.css";
import { TrendingUpIcon, CheckIcon, AwardIcon } from "../components/Icons";

const ProgressBar3D = lazy(() => import("../components/3d/ProgressBar3D"));

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
    { label: "Roadmap Complete", value: `${pct}%`, sub: `${doneTopics} of ${allTopics.length} topics`, color: c.color, icon: "🎯", iconComp: <TrendingUpIcon size={24} color={c.color} /> },
    { label: "Tasks Completed",  value: planDone,   sub: `of ${plannerTasks.length} planner tasks`,    color: "#22c55e", icon: "✅", iconComp: <CheckIcon size={24} color="#22c55e" /> },
    { label: "Study Sessions",   value: sessionCount, sub: "visits logged",                              color: "#f59e0b", icon: "📚", iconComp: <AwardIcon size={24} color="#f59e0b" /> },
    { label: "Current Track",    value: c.icon,      sub: c.label,                                       color: c.accent, icon: "🎓", iconComp: <AwardIcon size={24} color={c.accent} /> },
  ];

  return (
    <div className="advanced-container">
      <div className="advanced-wrapper">
        <PageHeader
          icon="✓"
          title="My Progress"
          sub="Track your learning achievements, goals, and milestones"
          color={c.color}
        />

        {/* Stat cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
          marginBottom: "48px",
          animation: "fadeInUp 0.8s ease-out 0.1s both"
        }}>
          {stats.map((st, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(99,102,241,0.2)",
                borderRadius: "16px",
                padding: "28px 24px",
                textAlign: "center",
                transition: "all var(--transition-standard)",
                cursor: "default"
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
              <div style={{ fontSize: "2rem", marginBottom: "12px" }}>{st.iconComp}</div>
              <div style={{
                fontSize: "2.5rem",
                fontWeight: "900",
                color: st.color,
                marginBottom: "12px",
                lineHeight: "1"
              }}>
                {st.value}
              </div>
              <div style={{
                color: "#fff",
                fontWeight: "700",
                fontSize: "0.95rem",
                marginBottom: "8px"
              }}>
                {st.label}
              </div>
              <div style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "0.85rem",
                lineHeight: "1.4"
              }}>
                {st.sub}
              </div>
            </div>
          ))}
        </div>

        {/* 3D Progress Visualization */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: "16px",
          padding: "40px 24px",
          textAlign: "center",
          marginBottom: "40px",
          animation: "fadeInUp 0.8s ease-out 0.2s both"
        }}>
          <h3 style={{
            color: "#fff",
            fontSize: "1.1rem",
            fontWeight: "800",
            marginBottom: "28px",
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "rgba(255,255,255,0.8)"
          }}>
            📊 Your Progress Visualization
          </h3>
          <Suspense fallback={
            <div style={{
              padding: "40px",
              color: "#6366f1",
              fontSize: "1rem"
            }}>
              Loading 3D visualization...
            </div>
          }>
            <ProgressBar3D progress={pct} size={250} />
          </Suspense>
        </div>

        {/* Phase breakdown */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: "16px",
          padding: "32px",
          marginBottom: "40px",
          animation: "fadeInUp 0.8s ease-out 0.3s both"
        }}>
          <h3 style={{
            color: "#fff",
            fontSize: "1.1rem",
            fontWeight: "800",
            marginBottom: "28px",
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "rgba(255,255,255,0.8)"
          }}>
            🎯 Phase-by-Phase Breakdown
          </h3>
          <div style={{ display: "grid", gap: "24px" }}>
            {c.roadmap.map((phase, pi) => {
              const done = phase.steps.filter((step) =>
                progress.find((p) => p.topic === step && p.completed)
              ).length;
              const phasePct = Math.round((done / phase.steps.length) * 100);
              return (
                <div key={pi}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px"
                  }}>
                    <span style={{
                      color: "#fff",
                      fontSize: "0.95rem",
                      fontWeight: "600"
                    }}>
                      {phase.phase}
                    </span>
                    <span style={{
                      color: c.color,
                      fontSize: "0.9rem",
                      fontWeight: "700"
                    }}>
                      {done}/{phase.steps.length} ({phasePct}%)
                    </span>
                  </div>
                  <div style={{
                    height: "8px",
                    background: "rgba(255,255,255,0.08)",
                    borderRadius: "4px",
                    overflow: "hidden",
                    border: "1px solid rgba(99,102,241,0.1)"
                  }}>
                    <div style={{
                      height: "100%",
                      width: `${phasePct}%`,
                      background: `linear-gradient(90deg, ${c.color} 0%, ${c.accent} 100%)`,
                      borderRadius: "4px",
                      transition: "width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      boxShadow: `0 0 8px ${c.color}80`
                    }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent progress rows */}
        {progress.length > 0 && (
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: "16px",
            padding: "32px",
            animation: "fadeInUp 0.8s ease-out 0.4s both"
          }}>
            <h3 style={{
              color: "#fff",
              fontSize: "1.1rem",
              fontWeight: "800",
              marginBottom: "28px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "rgba(255,255,255,0.8)"
            }}>
              📋 Recent Achievements
            </h3>
            <div style={{
              display: "grid",
              gap: "12px",
              maxHeight: "400px",
              overflowY: "auto"
            }}>
              {progress.slice(-8).reverse().map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 16px",
                    background: row.completed ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                    border: `1px solid ${row.completed ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                    borderRadius: "10px",
                    transition: "all var(--transition-fast)"
                  }}
                >
                  <span style={{
                    color: "#fff",
                    fontSize: "0.95rem",
                    fontWeight: "500"
                  }}>
                    {row.topic}
                  </span>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px"
                  }}>
                    <span style={{
                      color: row.completed ? "#22c55e" : "#ef4444",
                      fontSize: "0.9rem",
                      fontWeight: "700",
                      padding: "4px 10px",
                      background: row.completed ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                      borderRadius: "6px"
                    }}>
                      {row.completed ? "✓ Done" : "⧖ Pending"}
                    </span>
                    <span style={{
                      color: "rgba(255,255,255,0.4)",
                      fontSize: "0.8rem"
                    }}>
                      {new Date(row.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

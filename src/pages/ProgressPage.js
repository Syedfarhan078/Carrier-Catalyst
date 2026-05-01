import CAREERS from "../data/careers";
import PageHeader from "../components/PageHeader";
import { Suspense, lazy, useState, useEffect } from "react";
import "../styles/advancedCareer.css";
import { TrendingUpIcon, CheckIcon, AwardIcon } from "../components/Icons";
import { fetchProgress } from "../api/progressApi";

const ProgressBar3D = lazy(() => import("../components/3d/ProgressBar3D"));

export default function ProgressPage({ career, user }) {
  const c = CAREERS[career];

  // ── API State ──
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch progress from the backend API
  useEffect(() => {
    const loadProgress = async () => {
      try {
        setLoading(true);
        const data = await fetchProgress(user.id);
        setProgressData(data);
      } catch (err) {
        console.error("[ProgressPage] Error fetching progress:", err);
        // Fallback to empty progress
        setProgressData({ completedTopics: [], streakDays: 0, totalHours: 0 });
      } finally {
        setLoading(false);
      }
    };
    loadProgress();
  }, [user.id, career]);

  // Show loading while fetching from API
  if (loading || !progressData) {
    return (
      <div className="advanced-container">
        <div className="advanced-wrapper" style={{ textAlign: "center", padding: "80px 20px" }}>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1rem", animation: "pulse 2s ease-in-out infinite" }}>
            ⏳ Loading your progress...
          </p>
        </div>
      </div>
    );
  }

  // Build progress data from API response
  const completedTopics = progressData.completedTopics || [];
  const allTopics  = c.roadmap.flatMap((p) => p.steps);
  const doneTopics = completedTopics.length;
  const pct        = allTopics.length ? Math.round((doneTopics / allTopics.length) * 100) : 0;

  // Build a lookup set for quick "is this topic completed?" checks
  const completedSet = new Set(completedTopics);

  const stats = [
    { label: "Roadmap Complete", value: `${pct}%`, sub: `${doneTopics} of ${allTopics.length} topics`, color: c.color, iconComp: <TrendingUpIcon size={24} color={c.color} /> },
    { label: "Streak Days", value: progressData.streakDays || 0, sub: "consecutive days", color: "#22c55e", iconComp: <CheckIcon size={24} color="#22c55e" /> },
    { label: "Total Hours",  value: progressData.totalHours || 0, sub: "hours learned", color: "#f59e0b", iconComp: <AwardIcon size={24} color="#f59e0b" /> },
    { label: "Current Track", value: c.icon, sub: c.label, color: c.accent, iconComp: <AwardIcon size={24} color={c.accent} /> },
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
                completedSet.has(step)
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
        {completedTopics.length > 0 && (
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
              📋 Completed Topics
            </h3>
            <div style={{
              display: "grid",
              gap: "12px",
              maxHeight: "400px",
              overflowY: "auto"
            }}>
              {completedTopics.map((topic, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 16px",
                    background: "rgba(34,197,94,0.1)",
                    border: "1px solid rgba(34,197,94,0.2)",
                    borderRadius: "10px",
                  }}
                >
                  <span style={{ color: "#fff", fontSize: "0.95rem", fontWeight: "500" }}>
                    {topic}
                  </span>
                  <span style={{
                    color: "#22c55e",
                    fontSize: "0.9rem",
                    fontWeight: "700",
                    padding: "4px 10px",
                    background: "rgba(34,197,94,0.15)",
                    borderRadius: "6px"
                  }}>
                    ✓ Done
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

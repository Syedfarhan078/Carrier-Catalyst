import { useState } from "react";
import CAREERS from "../data/careers";
import PageHeader from "../components/PageHeader";
import "../styles/advancedCareer.css";
import { BriefcaseIcon, ChevronDownIcon } from "../components/Icons";

export default function InterviewPage({ career }) {
  const c = CAREERS[career];
  const [open, setOpen] = useState({});
  const [activeCategory, setActiveCategory] = useState(0);

  const toggle = (key) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="advanced-container">
      <div className="advanced-wrapper">
        <PageHeader
          icon="💼"
          title="Interview Preparation"
          sub="Real questions asked in technical interviews with expert guidance"
          color={c.color}
        />

        {/* Category Tabs */}
        <div style={{
          display: "flex",
          gap: "12px",
          marginBottom: "40px",
          flexWrap: "wrap",
          animation: "fadeInDown 0.8s ease-out"
        }}>
          {c.interview.map((cat, ci) => (
            <button
              key={ci}
              className={`filter-btn ${activeCategory === ci ? 'active' : ''}`}
              onClick={() => setActiveCategory(ci)}
              style={{ marginBottom: "0" }}
            >
              {cat.category}
            </button>
          ))}
        </div>

        {/* Questions for Active Category */}
        <div style={{ animation: "fadeInUp 0.8s ease-out 0.2s both" }}>
          {c.interview.map((cat, ci) => {
            if (activeCategory !== ci) return null;
            return (
              <div key={ci}>
                <h2 style={{
                  color: c.color,
                  fontSize: "1.5rem",
                  fontWeight: "800",
                  marginBottom: "24px"
                }}>
                  {cat.category} Questions
                </h2>
                
                <div style={{ display: "grid", gap: "16px" }}>
                  {cat.questions.map((q, qi) => {
                    const key = `${ci}-${qi}`;
                    const isOpen = !!open[key];
                    return (
                      <div
                        key={qi}
                        onClick={() => toggle(key)}
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: `1px solid ${isOpen ? "rgba(99,102,241,0.4)" : "rgba(99,102,241,0.2)"}`,
                          borderRadius: "16px",
                          padding: "24px",
                          cursor: "pointer",
                          transition: "all var(--transition-standard)",
                          overflow: "hidden"
                        }}
                        onMouseEnter={(e) => {
                          if (!isOpen) {
                            e.currentTarget.style.background = "rgba(99,102,241,0.08)";
                            e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isOpen) {
                            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                            e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)";
                          }
                        }}
                      >
                        <div style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "16px"
                        }}>
                          <span style={{
                            color: "#888",
                            fontSize: "0.9rem",
                            fontWeight: "700",
                            background: "rgba(99,102,241,0.1)",
                            padding: "6px 10px",
                            borderRadius: "6px",
                            flexShrink: 0,
                            minWidth: "45px",
                            textAlign: "center"
                          }}>
                            Q{qi + 1}
                          </span>
                          <div style={{ flex: 1 }}>
                            <p style={{
                              color: "#fff",
                              fontSize: "1.05rem",
                              fontWeight: "600",
                              margin: "0",
                              lineHeight: "1.6"
                            }}>
                              {q}
                            </p>
                          </div>
                          <span style={{
                            color: c.color,
                            fontSize: "0.9rem",
                            fontWeight: "700",
                            transition: "transform var(--transition-fast)",
                            transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center"
                          }}>
                            <ChevronDownIcon size={18} color={c.color} />
                          </span>
                        </div>

                        {isOpen && (
                          <div style={{
                            marginTop: "20px",
                            padding: "16px",
                            background: "rgba(99,102,241,0.1)",
                            borderRadius: "12px",
                            border: `1px solid rgba(99,102,241,0.2)`,
                            animation: "slideInLeft 0.3s ease-out"
                          }}>
                            <div style={{
                              color: "rgba(255,255,255,0.8)",
                              fontSize: "0.95rem",
                              lineHeight: "1.8"
                            }}>
                              <strong style={{ color: c.color }}>★ Study Tip:</strong>
                              <p style={{ margin: "8px 0 0" }}>
                                Focus on the definition, a real-world example, common edge cases, and how this concept applies to {c.label} engineering roles. Practice explaining it out loud and be ready to discuss related concepts.
                              </p>
                              <p style={{ margin: "12px 0 0", color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>
                                💬 Tip: Answer with clarity, provide examples, and show your thought process. Interviewers appreciate candidates who can explain complex concepts simply.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

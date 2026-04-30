import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import CAREERS from "../data/careers";
import PageHeader from "../components/PageHeader";
import "../styles/advancedCareer.css";
import { RoadmapIcon, TargetIcon, CheckIcon, CatalystIcon } from "../components/Icons";
import { motion } from "framer-motion";

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
      <div className="advanced-container">
        <div className="advanced-wrapper">
          <div className="career-nav-bar">
            <div 
              className="career-nav-brand" 
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') navigate("/", { state: { page: "home" } }) }}
              onClick={() => navigate("/", { state: { page: "home" } })}
              aria-label="Return to Home"
            >
              <CatalystIcon size={24} color="#6366f1" />
              <span>Career Catalyst</span>
            </div>
            <button
              onClick={() => navigate("/", { state: { page: "home" } })}
              className="career-nav-back"
            >
              ← Back to Home
            </button>
          </div>
          
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <h1 style={{ color: "white", marginBottom: "30px", fontSize: "2.5rem", fontWeight: "900" }}>
              Select a Career Path
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "40px", fontSize: "1.1rem" }}>
              Choose from our carefully curated career tracks
            </p>

            <div className="career-grid career-grid-large">
              {Object.entries(CAREERS).map(([key, c], idx) => (
                <motion.div
                  key={key}
                  className="career-card-advanced"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') navigate(`/roadmap?career=${key}`) }}
                  onClick={() => navigate(`/roadmap?career=${key}`)}
                  aria-label={`View roadmap for ${c.label}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                  whileHover={{ scale: 1.03, y: -5, boxShadow: `0 15px 30px ${c.color}22` }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div>
                    <div className="career-card-icon">{c.icon}</div>
                    <h2 className="career-card-title" style={{ color: c.color }}>
                      {c.label}
                    </h2>
                    <p className="career-card-description">
                      {c.description}
                    </p>
                  </div>
                  <div className="career-card-cta">
                    View Roadmap →
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
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
    <div className="advanced-container">
      <div className="advanced-wrapper">
        {/* Navigation Bar */}
        <div className="career-nav-bar">
          <div 
            className="career-nav-brand" 
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') navigate("/", { state: { page: "home" } }) }}
            onClick={() => navigate("/", { state: { page: "home" } })}
            aria-label="Return to Home"
          >
            <CatalystIcon size={24} color="#6366f1" />
            <span>Career Catalyst</span>
          </div>
          <button
            onClick={() => navigate("/", { state: { page: "home" } })}
            className="career-nav-back"
          >
            ← Back to Home
          </button>
        </div>

        {/* Page Header */}
        <div className="roadmap-header">
          <PageHeader
            icon={<RoadmapIcon size={36} color={c.color} />}
            title="Learning Roadmap"
            sub={`Master ${c.label} with our structured learning path`}
            color={c.color}
          />
        </div>

        {/* Progress Section */}
        <div className="roadmap-progress-section">
          <div className="roadmap-progress-header">
            <span className="roadmap-progress-label">Your Progress</span>
            <span className="roadmap-progress-value">{pct}% Complete</span>
          </div>
          <div className="roadmap-progress-bar">
            <div 
              className="roadmap-progress-fill"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div style={{ 
            marginTop: "12px", 
            fontSize: "0.9rem", 
            color: "rgba(255,255,255,0.5)",
            textAlign: "right"
          }}>
            {doneCount} of {allTopics.length} topics completed
          </div>
        </div>

        {/* Learning Phases Timeline */}
        <div className="roadmap-timeline">
          {c.roadmap.map((phase, phaseIdx) => (
            <div key={phaseIdx} className="roadmap-phase">
              <h3 className="roadmap-phase-title">
                {phase.phase}
              </h3>
              
              <ul className="roadmap-steps-list">
                {phase.steps.map((step, stepIdx) => (
                  <motion.li
                    key={stepIdx}
                    className={`roadmap-step ${completed[step] ? 'completed' : ''}`}
                    role="checkbox"
                    aria-checked={!!completed[step]}
                    tabIndex={0}
                    onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(step); } }}
                    onClick={() => toggle(step)}
                    whileHover={{ scale: 1.01, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <div className="roadmap-checkbox">
                      {completed[step] && <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:"spring"}}><CheckIcon size={14} color="#000" /></motion.div>}
                    </div>
                    <span className="roadmap-step-text">{step}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
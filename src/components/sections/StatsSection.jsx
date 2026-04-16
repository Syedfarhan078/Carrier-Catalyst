import React from "react";

const STATS = [
  { value: "2", label: "Career Tracks", color: "purple" },
  { value: "30+", label: "Curated Courses", color: "white" },
  { value: "100+", label: "Interview Q&As", color: "orange" },
  { value: "5+", label: "Study Schedules", color: "white" },
];

const StatsSection = () => {
  return (
    <div className="cc-stats">
      {STATS.map((s) => (
        <div key={s.label} className="cc-stat-item">
          <div className={`cc-stat-num ${s.color}`}>{s.value}</div>
          <div className="cc-stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsSection;
import React from "react";
import { useCountUp } from "../../hooks/useScrollAnimations";
import ScrollReveal from "../ui/ScrollReveal";

const StatItem = ({ value, suffix, label, color, delay }) => {
  const numericValue = parseInt(value, 10);
  const [ref, count] = useCountUp(isNaN(numericValue) ? 0 : numericValue, 2200);

  return (
    <ScrollReveal delay={delay}>
      <div ref={ref} className="stat-card-experiential">
        <div className={`stat-number ${color}`}>
          {isNaN(numericValue) ? value : count}
          {suffix && <span className="stat-suffix">{suffix}</span>}
        </div>
        <div className="stat-label-exp">{label}</div>
      </div>
    </ScrollReveal>
  );
};

const STATS = [
  { value: "4", label: "Career Tracks", color: "purple" },
  { value: "50", suffix: "+", label: "Curated Courses", color: "white" },
  { value: "150", suffix: "+", label: "Interview Q&As", color: "orange" },
  { value: "20", suffix: "+", label: "Study Schedules", color: "white" },
];

const ExperientialStats = () => {
  return (
    <section className="stats-experiential">
      <div className="stats-grid-experiential">
        {STATS.map((stat, i) => (
          <StatItem
            key={stat.label}
            value={stat.value}
            suffix={stat.suffix}
            label={stat.label}
            color={stat.color}
            delay={i + 1}
          />
        ))}
      </div>
    </section>
  );
};

export default ExperientialStats;

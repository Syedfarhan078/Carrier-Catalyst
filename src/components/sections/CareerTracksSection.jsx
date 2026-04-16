import React, { useRef } from "react";

const TRACKS = [
  {
    id: "data-science",
    emoji: "🧠",
    title: "Data Science",
    titleColor: "#9b96ff",
    description:
      "Master data analysis, machine learning, and AI to become a top Data Scientist.",
    tags: ["Roadmap", "Courses", "YouTube", "Interview", "Planner", "Progress"],
    ctaClass: "cta-ds",
    hoverClass: "track-ds",
    ctaText: "Start Learning →",
  },
  {
    id: "web-development",
    emoji: "🌐",
    title: "Web Development",
    titleColor: "#FF7A18",
    description:
      "Build modern full-stack web applications from front to back end.",
    tags: ["Roadmap", "Courses", "YouTube", "Interview", "Planner", "Progress"],
    ctaClass: "cta-wd",
    hoverClass: "track-wd",
    ctaText: "Start Learning →",
  },
];

const TrackCard = ({ track, onLearn }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const tiltX = (y / rect.height) * 2 * -4;
    const tiltY = (x / rect.width) * 2 * 4;
    card.style.transform = `translateY(-2px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = "";
  };

  return (
    <div
      ref={cardRef}
      className={`cc-track-card ${track.hoverClass}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <span style={{ fontSize: 28, marginBottom: 14, display: "block" }}>
        {track.emoji}
      </span>
      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 20,
          fontWeight: 700,
          color: track.titleColor,
          marginBottom: 8,
        }}
      >
        {track.title}
      </div>
      <p
        style={{
          fontSize: 13,
          color: "rgba(232,230,255,0.5)",
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {track.description}
      </p>
      <div className="cc-tags">
        {track.tags.map((tag) => (
          <span key={tag} className="cc-tag">
            {tag}
          </span>
        ))}
      </div>
      <button
        className={`cc-track-cta ${track.ctaClass}`}
        onClick={() => onLearn?.(track.id)}
      >
        {track.ctaText}
      </button>
    </div>
  );
};

const CareerTracksSection = ({ onLearn }) => {
  return (
    <section className="cc-section">
      <div className="cc-section-label">Career Tracks</div>
      <h2 className="cc-section-title">Choose your path</h2>
      <p className="cc-section-sub">
        Structured learning tracks from beginner to job-ready.
      </p>
      <div className="cc-tracks-grid">
        {TRACKS.map((track) => (
          <TrackCard key={track.id} track={track} onLearn={onLearn} />
        ))}
      </div>
    </section>
  );
};

export default CareerTracksSection;
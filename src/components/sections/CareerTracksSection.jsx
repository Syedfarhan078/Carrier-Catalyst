import React, { useRef } from "react";
import { BrainIcon, GlobeIcon, LockIcon, SettingsIcon } from "../Icons";

const TRACKS = [
  {
    id: "datascience",
    icon: <BrainIcon size={28} color="#9b96ff" />,
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
    id: "webdev",
    icon: <GlobeIcon size={28} color="#FF7A18" />,
    title: "Web Development",
    titleColor: "#FF7A18",
    description:
      "Build modern full-stack web applications from front to back end.",
    tags: ["Roadmap", "Courses", "YouTube", "Interview", "Planner", "Progress"],
    ctaClass: "cta-wd",
    hoverClass: "track-wd",
    ctaText: "Start Learning →",
  },
  {
    id: "cybersecurity",
    icon: <LockIcon size={28} color="#60A5FA" />,
    title: "Cybersecurity",
    titleColor: "#60A5FA",
    description:
      "Protect networks, systems, and data from digital attacks as a security expert.",
    tags: ["Roadmap", "Courses", "YouTube", "Interview", "Planner", "Progress"],
    ctaClass: "cta-cyber",
    hoverClass: "track-cyber",
    ctaText: "Start Learning →",
  },
  {
    id: "devops",
    icon: <SettingsIcon size={28} color="#34D399" />,
    title: "Cloud & DevOps",
    titleColor: "#34D399",
    description:
      "Master cloud infrastructure, automation, and CI/CD pipelines to streamline deployment.",
    tags: ["Roadmap", "Courses", "YouTube", "Interview", "Planner", "Progress"],
    ctaClass: "cta-devops",
    hoverClass: "track-devops",
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
    
    // Set variables for the cursor tracking glow
    card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
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
      <span style={{ marginBottom: 14, display: "block" }}>
        {track.icon}
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

const CareerTracksSection = ({ navigate, onLearn }) => {
  const handleLearn = (id) => {
    if (onLearn) return onLearn(id);
    if (navigate) return navigate("roadmap", id);
  };

  return (
    <section className="cc-section">
      <div className="cc-section-label">Career Tracks</div>
      <h2 className="cc-section-title">Choose your path</h2>
      <p className="cc-section-sub">
        Structured learning tracks from beginner to job-ready.
      </p>
      <div className="cc-tracks-grid">
        {TRACKS.map((track) => (
          <TrackCard key={track.id} track={track} onLearn={handleLearn} />
        ))}
      </div>
    </section>
  );
};

export default CareerTracksSection;
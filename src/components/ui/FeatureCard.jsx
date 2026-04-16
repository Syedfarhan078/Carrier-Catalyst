import React, { useRef } from "react";

const FeatureCard = ({
  badge,
  badgeVariant = "purple",
  icon,
  title,
  description,
  ctaText,
  ctaVariant = "purple",
  onCTA,
  isFeatured = false,
  stats,
}) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const tiltX = (y / rect.height) * 2 * -5;
    const tiltY = (x / rect.width) * 2 * 5;
    card.style.transform = `translateY(-3px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "";
  };

  return (
    <div
      ref={cardRef}
      className={`cc-feature-card${isFeatured ? " fc-featured" : ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {isFeatured && <div className="fc-glow" />}

      {badge && (
        <div className={`fc-badge fc-badge-${badgeVariant}`}>{badge}</div>
      )}

      <div className={`fc-featured-row${isFeatured ? " is-featured" : ""}`}>
        <div className="fc-main-content">
          <div className={`fc-icon fc-icon-${ctaVariant}`}>{icon}</div>
          <div className="fc-title">{title}</div>
          <p className="fc-desc">{description}</p>
          <button
            className={`fc-cta fc-cta-${ctaVariant}`}
            onClick={onCTA}
          >
            {ctaText}
          </button>
        </div>

        {stats && (
          <div className="fc-mentor-stats">
            {stats.map((s, i) => (
              <div key={i} className="fc-stat">
                <div className="fc-stat-num">{s.value}</div>
                <div className="fc-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureCard;
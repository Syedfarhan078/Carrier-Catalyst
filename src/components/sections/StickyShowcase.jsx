import React from "react";
import { useStickyReveal } from "../../hooks/useScrollAnimations";

/**
 * StickyShowcase — Apple-style pinned section that swaps content as you scroll.
 * Each feature is revealed one at a time while the section stays sticky.
 */
const StickyShowcase = ({ features = [], onCTA }) => {
  const [containerRef, activeIndex] = useStickyReveal(features.length);

  // Height per item = 100vh of scroll space
  const totalHeight = features.length * 100;

  return (
    <div
      ref={containerRef}
      className="sticky-showcase"
      style={{ height: `${totalHeight}vh` }}
    >
      <div className="sticky-showcase-inner">
        {/* Background blobs */}
        {features[activeIndex] && (
          <>
            <div
              className="showcase-blob"
              style={{
                width: 300,
                height: 300,
                top: "20%",
                right: "10%",
                background: features[activeIndex].blobColor || "rgba(108,99,255,0.08)",
              }}
            />
            <div
              className="showcase-blob"
              style={{
                width: 200,
                height: 200,
                bottom: "20%",
                left: "15%",
                background: features[activeIndex].blobColor2 || "rgba(139,92,246,0.06)",
                animationDelay: "-3s",
              }}
            />
          </>
        )}

        {features.map((feature, i) => (
          <div
            key={feature.id}
            className={`showcase-slide ${i === activeIndex ? "is-active" : ""}`}
          >
            <div className="showcase-content">
              {/* Text side */}
              <div className="showcase-text">
                <div className={`showcase-label showcase-label-${feature.color}`}>
                  <span style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "currentColor",
                    display: "inline-block",
                  }} />
                  {feature.label}
                </div>

                <h2 className="showcase-title">{feature.title}</h2>
                <p className="showcase-desc">{feature.description}</p>

                <button
                  className={`showcase-cta showcase-cta-${feature.color}`}
                  onClick={() => onCTA?.(feature.action)}
                >
                  {feature.ctaText}
                  <span style={{ fontSize: 18 }}>→</span>
                </button>
              </div>

              {/* Visual side */}
              <div className="showcase-visual">
                <div className="showcase-card-preview">
                  <div className={`showcase-icon-large showcase-icon-${feature.color}`}>
                    {feature.icon}
                  </div>
                  <div className="showcase-card-title">{feature.title}</div>
                  {feature.stats && (
                    <div className="showcase-card-stats">
                      {feature.stats.map((stat, si) => (
                        <div key={si}>
                          <div className="showcase-card-stat-value">{stat.value}</div>
                          <div className="showcase-card-stat-label">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Scroll progress dots */}
        <div style={{
          position: "absolute",
          right: 32,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          zIndex: 20,
        }}>
          {features.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === activeIndex ? 8 : 6,
                height: i === activeIndex ? 24 : 6,
                borderRadius: 4,
                background: i === activeIndex
                  ? "rgba(108, 99, 255, 0.8)"
                  : "rgba(255, 255, 255, 0.15)",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StickyShowcase;

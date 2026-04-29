import CAREERS from "../data/careers";
import PageHeader from "../components/PageHeader";
import "../styles/advancedCareer.css";
import { YoutubeIcon } from "../components/Icons";

export default function YouTubePage({ career }) {
  const c = CAREERS[career];

  return (
    <div className="advanced-container">
      <div className="advanced-wrapper">
        <PageHeader
          icon="▸"
          title="Top YouTube Channels"
          sub="Learn from industry experts and content creators with millions of subscribers"
          color={c.color}
        />

        <div style={{ display: "grid", gap: "20px", animation: "fadeInUp 0.8s ease-out 0.2s both" }}>
          {c.youtube.map((ch, i) => (
            <a
              key={i}
              href={ch.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                padding: "28px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(99,102,241,0.2)",
                borderRadius: "16px",
                textDecoration: "none",
                cursor: "pointer",
                transition: "all var(--transition-standard)",
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
              {/* Avatar */}
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: "900",
                  fontSize: "24px",
                  flexShrink: 0,
                  background: `linear-gradient(135deg, ${c.color} 0%, ${c.accent} 100%)`,
                }}>
                {ch.channel[0]}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <h3 style={{
                  color: "#fff",
                  margin: "0 0 8px",
                  fontSize: "1.1rem",
                  fontWeight: "700"
                }}>
                  {ch.channel}
                </h3>
                <p style={{
                  color: "rgba(255,255,255,0.6)",
                  margin: "0 0 8px",
                  fontSize: "0.95rem"
                }}>
                  {ch.topic}
                </p>
                <span style={{
                  color: c.accent,
                  fontSize: "0.9rem",
                  fontWeight: "600"
                }}>
                  ● {ch.subs} subscribers
                </span>
              </div>

              {/* YouTube icon */}
              <span style={{
                color: "#ff0000",
                fontSize: "28px",
                transition: "transform var(--transition-standard)"
              }}>
                <YoutubeIcon size={28} color="#ff0000" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

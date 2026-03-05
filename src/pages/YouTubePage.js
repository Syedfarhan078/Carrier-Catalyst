import CAREERS from "../data/careers";
import PageHeader from "../components/PageHeader";

export default function YouTubePage({ career }) {
  const c = CAREERS[career];

  return (
    <div style={s.page}>
      <PageHeader icon="▶" title="YouTube Channels" sub="Top creators for free, high-quality learning" color={c.color} />

      <div style={s.list}>
        {c.youtube.map((ch, i) => (
          <a
            key={i}
            href={ch.link}
            target="_blank"
            rel="noopener noreferrer"
            style={s.card}
          >
            {/* Avatar */}
            <div style={{ ...s.avatar, background: c.color }}>
              {ch.channel[0]}
            </div>
            {/* Info */}
            <div style={{ flex: 1 }}>
              <h3 style={s.name}>{ch.channel}</h3>
              <p style={s.topic}>{ch.topic}</p>
              <span style={{ ...s.subs, color: c.accent }}>
                👥 {ch.subs} subscribers
              </span>
            </div>
            {/* YouTube icon */}
            <span style={s.ytIcon}>▶</span>
          </a>
        ))}
      </div>
    </div>
  );
}

const s = {
  page: { padding: "40px 48px", maxWidth: 860, margin: "0 auto" },
  list: { display: "flex", flexDirection: "column", gap: 14 },
  card: {
    display: "flex",
    alignItems: "center",
    gap: 18,
    background: "#12121f",
    border: "1px solid #1e1e2e",
    borderRadius: 16,
    padding: "20px 24px",
    textDecoration: "none",
    cursor: "pointer",
    transition: "border-color 0.2s",
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 900,
    fontSize: 22,
    flexShrink: 0,
  },
  name: { color: "#fff", margin: "0 0 4px", fontSize: 16, fontWeight: 700 },
  topic: { color: "#777", fontSize: 13, margin: "0 0 6px" },
  subs: { fontSize: 12, fontWeight: 600 },
  ytIcon: { color: "#ff0000", fontSize: 22 },
};

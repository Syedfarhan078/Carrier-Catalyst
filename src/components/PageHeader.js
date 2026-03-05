export default function PageHeader({ icon, title, sub, color }) {
  return (
    <div style={{ ...s.header, borderBottom: `2px solid ${color}22` }}>
      <span style={{ fontSize: 36 }}>{icon}</span>
      <div>
        <h1 style={s.title}>{title}</h1>
        <p style={s.sub}>{sub}</p>
      </div>
    </div>
  );
}

const s = {
  header: {
    display: "flex",
    alignItems: "center",
    gap: 18,
    paddingBottom: 28,
    marginBottom: 36,
  },
  title: { color: "#fff", margin: 0, fontSize: 26, fontWeight: 800 },
  sub: { color: "#666", margin: "5px 0 0", fontSize: 14 },
};

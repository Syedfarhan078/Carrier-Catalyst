import CAREERS from "../data/careers";
import { useNavigate } from "react-router-dom";

export default function CareerSelectPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1 style={{ color: "#fff", marginBottom: "40px" }}>
        Choose Your Career 🚀
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        {Object.entries(CAREERS).map(([key, c]) => (
          <div
            key={key}
            onClick={() =>
              navigate("/", { state: { career: key, page: "roadmap" } })
            }
            style={{
              padding: "20px",
              borderRadius: "12px",
              background: "#12121f",
              border: "1px solid #2e2e4e",
              cursor: "pointer",
              color: "#fff",
            }}
          >
            <h2 style={{ color: c.color }}>{c.label}</h2>
            <p style={{ fontSize: "14px", color: "#aaa" }}>
              {c.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
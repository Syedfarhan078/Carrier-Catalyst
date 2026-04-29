import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import DB from "../data/db";

export default function AuthPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const switchMode = (m) => {
    setMode(m);
    setError("");
    setSuccess("");
    setForm({ name: "", email: "", password: "" });
  };

  const submit = () => {
    setError("");
    setSuccess("");

    if (!form.email || !form.password) return setError("Email and password are required.");

    if (mode === "register") {
      if (!form.name.trim()) return setError("Full name is required.");
      if (form.password.length < 6) return setError("Password must be at least 6 characters.");
      if (DB.userExists(form.email)) return setError("Email already registered. Please sign in.");
      DB.insertUser(form.name.trim(), form.email.trim(), form.password);
      setSuccess("Account created successfully! You can now sign in.");
      switchMode("login");
      setForm(f => ({ ...f, email: form.email, password: "" }));
    } else {
      const u = DB.loginUser(form.email.trim(), form.password);
      if (!u) return setError("Invalid email or password.");
      login(u);
    }
  };

  return (
    <div style={s.bg}>
      <div style={s.card}>
        {/* Brand */}
        <div style={s.brand}>
          <span style={{ fontSize: 44 }}>🎯</span>
          <div>
            <h1 style={s.brandName}>SkillPath</h1>
            <p style={s.brandTagline}>AI-Powered Career Compass</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={s.tabs}>
          {["login", "register"].map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              style={{ ...s.tab, ...(mode === m ? s.tabActive : {}) }}
            >
              {m === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Form */}
        {mode === "register" && (
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handle}
            style={s.input}
          />
        )}
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handle}
          style={s.input}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handle}
          style={s.input}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />

        {error   && <div style={s.errorBox}>{error}</div>}
        {success && <div style={s.successBox}>{success}</div>}

        <button onClick={submit} style={s.submitBtn}>
          {mode === "login" ? "Sign In →" : "Create Account →"}
        </button>

        <p style={s.switchText}>
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            style={s.switchLink}
            onClick={() => switchMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "Sign Up" : "Sign In"}
          </span>
        </p>

        <div style={s.dbBadge}>
          🗄️ Backed by SQL — users · sessions · progress · planner
        </div>
      </div>
    </div>
  );
}

const s = {
  bg: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 50%, #0a0a14 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    background: "#12121f",
    border: "1px solid #1e1e3a",
    borderRadius: 24,
    padding: "44px 40px",
    width: "100%",
    maxWidth: 420,
    boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    justifyContent: "center",
    marginBottom: 28,
  },
  brandName: { fontSize: 30, fontWeight: 900, color: "#6C63FF", margin: 0 },
  brandTagline: { color: "#666", fontSize: 13, margin: 0 },
  tabs: {
    display: "flex",
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid #1e1e3a",
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    padding: "11px 0",
    background: "transparent",
    border: "none",
    color: "#666",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    transition: "all 0.2s",
  },
  tabActive: { background: "#6C63FF22", color: "#6C63FF" },
  input: {
    width: "100%",
    padding: "13px 16px",
    marginBottom: 12,
    background: "#0a0a14",
    border: "1px solid #1e1e3a",
    borderRadius: 12,
    color: "#fff",
    fontSize: 14,
    outline: "none",
    display: "block",
  },
  errorBox: {
    background: "#ef444422",
    border: "1px solid #ef4444",
    borderRadius: 10,
    padding: "10px 14px",
    color: "#ef4444",
    fontSize: 13,
    marginBottom: 12,
  },
  successBox: {
    background: "#22c55e22",
    border: "1px solid #22c55e",
    borderRadius: 10,
    padding: "10px 14px",
    color: "#22c55e",
    fontSize: 13,
    marginBottom: 12,
  },
  submitBtn: {
    width: "100%",
    padding: "13px 24px",
    background: "linear-gradient(135deg, #6C63FF, #8b5cf6)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 4,
  },
  switchText: {
    textAlign: "center",
    color: "#555",
    fontSize: 13,
    marginTop: 18,
  },
  switchLink: { color: "#6C63FF", cursor: "pointer", textDecoration: "underline" },
  dbBadge: {
    marginTop: 24,
    padding: "8px 14px",
    background: "#0a0a14",
    borderRadius: 8,
    color: "#333",
    fontSize: 11,
    textAlign: "center",
    border: "1px solid #1a1a2e",
  },
};

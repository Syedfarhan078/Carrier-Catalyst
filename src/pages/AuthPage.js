import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loginUser, signupUser } from "../api/authApi";
import { validateEmail, validatePassword, validateName, validateLoginForm, validateRegistrationForm, normalizeWhitespace } from "../utils/validators";
import { CatalystIcon } from "../components/Icons";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/AuthPage.css";

export default function AuthPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handle = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    let fieldError = "";
    if (value.trim()) {
      if (name === "name" && mode === "register") {
        const validation = validateName(value);
        if (!validation.isValid) fieldError = validation.error;
      } else if (name === "email") {
        const validation = validateEmail(value);
        if (!validation.isValid) fieldError = validation.error;
      } else if (name === "password") {
        const validation = validatePassword(value, false);
        if (!validation.isValid) fieldError = validation.error;
      }
    }
    
    setFieldErrors({ ...fieldErrors, [name]: fieldError });
  };

  const switchMode = (m) => {
    setMode(m);
    setError("");
    setSuccess("");
    setForm({ name: "", email: "", password: "" });
    setFieldErrors({});
  };

  const submit = async () => {
    setError("");
    setSuccess("");

    if (mode === "register") {
      const validation = validateRegistrationForm({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      if (!validation.isValid) {
        const firstError = Object.values(validation.errors)[0];
        return setError(firstError);
      }

      const sanitizedName = normalizeWhitespace(form.name);
      const sanitizedEmail = form.email.trim().toLowerCase();

      setLoading(true);
      try {
        await signupUser(sanitizedName, sanitizedEmail, form.password);
        setSuccess("✅ Account created successfully! Redirecting to sign in...");
        
        setTimeout(() => {
          switchMode("login");
          setForm(f => ({ ...f, email: sanitizedEmail, password: "" }));
        }, 1500);
      } catch (err) {
        const apiMessage = err.displayMessage || err.response?.data?.error?.message;
        setError(apiMessage || "Failed to create account. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      const validation = validateLoginForm({
        email: form.email,
        password: form.password,
      });

      if (!validation.isValid) {
        const firstError = Object.values(validation.errors)[0];
        return setError(firstError);
      }

      const sanitizedEmail = form.email.trim().toLowerCase();

      setLoading(true);
      try {
        const { user } = await loginUser(sanitizedEmail, form.password);
        login(user);
        setSuccess("✅ Signed in successfully!");
      } catch (err) {
        const apiMessage = err.displayMessage || err.response?.data?.error?.message;
        setError(apiMessage || "Invalid email or password. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="auth-page-container">
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Brand */}
        <div className="auth-brand">
          <CatalystIcon size={44} color="#6366f1" />
          <div className="auth-brand-text">
            <h1>Career Catalyst</h1>
            <p>AI-Powered Career Compass</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          {["login", "register"].map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`auth-tab ${mode === m ? "active" : ""}`}
            >
              {m === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Form */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
            transition={{ duration: 0.2 }}
          >
            {mode === "register" && (
              <div className="auth-input-group">
                <input
                  name="name"
                  placeholder="Full Name"
                  aria-label="Full Name"
                  value={form.name}
                  onChange={handle}
                  className={`auth-input ${fieldErrors.name ? 'error' : ''}`}
                />
                {fieldErrors.name && <div className="auth-field-hint">{fieldErrors.name}</div>}
              </div>
            )}

            <div className="auth-input-group">
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                aria-label="Email Address"
                value={form.email}
                onChange={handle}
                className={`auth-input ${fieldErrors.email ? 'error' : ''}`}
              />
              {fieldErrors.email && <div className="auth-field-hint">{fieldErrors.email}</div>}
            </div>

            <div className="auth-input-group">
              <input
                name="password"
                type="password"
                placeholder="Password"
                aria-label="Password"
                value={form.password}
                onChange={handle}
                className={`auth-input ${fieldErrors.password ? 'error' : ''}`}
                onKeyDown={(e) => e.key === "Enter" && submit()}
              />
              {fieldErrors.password && <div className="auth-field-hint">{fieldErrors.password}</div>}
              {mode === "register" && form.password && !fieldErrors.password && (
                <div className="auth-field-hint success">✓ Password is valid</div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {error   && <div className="auth-message error">{error}</div>}
        {success && <div className="auth-message success">{success}</div>}

        <button 
          className="auth-submit-btn"
          onClick={submit} 
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : mode === "login" ? "Sign In →" : "Create Account →"
          }
        </button>

        <p className="auth-switch-text">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="auth-switch-link"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') switchMode(mode === "login" ? "register" : "login") }}
            onClick={() => switchMode(mode === "login" ? "register" : "login")}
            aria-label={mode === "login" ? "Switch to Sign Up" : "Switch to Sign In"}
          >
            {mode === "login" ? "Sign Up" : "Sign In"}
          </span>
        </p>

        <div className={`auth-db-badge ${error?.includes("Cannot connect") ? 'error' : ''}`}>
          {error?.includes("Cannot connect") 
            ? "⚠️ API Server is Offline" 
            : "🔗 Connected to API Server"}
        </div>
      </motion.div>
    </div>
  );
}

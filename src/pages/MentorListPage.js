// ─────────────────────────────────────────────────────────────
// MentorListPage.js — Browse & filter all mentors
// ─────────────────────────────────────────────────────────────

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MentorCard from "../components/MentorCard";
import { mentorsData } from "../data/mentorsData";

const roles = ["All", "Frontend Developer", "Backend Engineer", "Data Scientist", "AI/ML Researcher", "Full Stack Developer", "DevOps Engineer", "Product Manager", "UI/UX Designer"];

const MentorListPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [sortBy, setSortBy] = useState("rating"); // 'rating' | 'price_asc' | 'price_desc'

  // Filter + Search + Sort
  const filteredMentors = useMemo(() => {
    let result = [...mentorsData];

    // Filter by role
    if (selectedRole !== "All") {
      result = result.filter((m) => m.role === selectedRole);
    }

    // Search by name, role, skills
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.role.toLowerCase().includes(q) ||
          m.skills.some((s) => s.toLowerCase().includes(q)) ||
          m.company.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "price_asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price_desc") result.sort((a, b) => b.price - a.price);

    return result;
  }, [search, selectedRole, sortBy]);

  return (

    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0F0A1E 0%, #0F172A 50%, #0A0A1A 100%)",
      color: "#F9FAFB",
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>

          <div
      style={{
        padding: "20px 24px 0",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
           <button
        onClick={() => navigate("/", { state: { page: "home" } })}
        style={{
          padding: "8px 16px",
          background: "#6C63FF",
          border: "none",
          borderRadius: "8px",
          color: "#fff",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        ← Back to Home
      </button> 
    </div>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(234,88,12,0.08) 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "48px 24px 40px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <span style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(234,88,12,0.2))",
            border: "1px solid rgba(124,58,237,0.3)",
            borderRadius: "20px", padding: "5px 14px",
            fontSize: "12px", color: "#C4B5FD", fontWeight: "600",
            letterSpacing: "0.5px", marginBottom: "16px", display: "inline-block",
          }}>
            🚀 MENTOR MARKETPLACE
          </span>
          <h1 style={{
            margin: "12px 0 10px", fontSize: "clamp(28px, 5vw, 42px)",
            fontWeight: "800", lineHeight: "1.2",
            background: "linear-gradient(135deg, #F9FAFB 0%, #C4B5FD 50%, #F97316 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Learn from Industry Experts
          </h1>
          <p style={{ color: "#9CA3AF", fontSize: "16px", margin: 0 }}>
            Book 1:1 sessions with top professionals from Google, Amazon, Flipkart & more
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Search + Sort */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "240px", position: "relative" }}>
            <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>🔍</span>
            <input
              type="text"
              placeholder="Search by name, role, skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%", boxSizing: "border-box",
                padding: "12px 14px 12px 42px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px", color: "#F9FAFB", fontSize: "14px",
                outline: "none",
              }}
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "12px 16px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px", color: "#D1D5DB", fontSize: "14px",
              outline: "none", cursor: "pointer",
            }}
          >
            <option value="rating" style={{ background: "#1A1035" }}>Sort: Top Rated</option>
            <option value="price_asc" style={{ background: "#1A1035" }}>Sort: Price ↑</option>
            <option value="price_desc" style={{ background: "#1A1035" }}>Sort: Price ↓</option>
          </select>
        </div>

        {/* Role filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "32px" }}>
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              style={{
                padding: "8px 16px", borderRadius: "20px", fontSize: "13px",
                fontWeight: "500", cursor: "pointer", transition: "all 0.2s",
                border: selectedRole === role ? "1px solid #7C3AED" : "1px solid rgba(255,255,255,0.1)",
                background: selectedRole === role ? "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(79,70,229,0.2))" : "rgba(255,255,255,0.03)",
                color: selectedRole === role ? "#C4B5FD" : "#9CA3AF",
              }}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "14px", color: "#6B7280" }}>
            Showing <strong style={{ color: "#D1D5DB" }}>{filteredMentors.length}</strong> mentors
          </span>
        </div>

        {/* Mentor grid */}
        {filteredMentors.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}>
            {filteredMentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
            <h3 style={{ color: "#9CA3AF", fontWeight: "600", margin: "0 0 8px" }}>No mentors found</h3>
            <p style={{ color: "#6B7280", fontSize: "14px" }}>Try a different search term or filter</p>
            <button
              onClick={() => { setSearch(""); setSelectedRole("All"); }}
              style={{
                marginTop: "16px", padding: "10px 24px",
                background: "linear-gradient(135deg, #7C3AED, #4F46E5)",
                border: "none", borderRadius: "10px", color: "#fff",
                fontSize: "14px", cursor: "pointer",
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorListPage;
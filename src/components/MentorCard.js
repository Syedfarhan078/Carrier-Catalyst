// ─────────────────────────────────────────────────────────────
// MentorCard.js — Reusable card component for mentor listing
// ─────────────────────────────────────────────────────────────

import React from "react";
import { useNavigate } from "react-router-dom";

const MentorCard = ({ mentor }) => {
  const navigate = useNavigate();

  // Render star rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < Math.floor(rating) ? "#FBBF24" : "#374151", fontSize: "14px" }}>
        ★
      </span>
    ));
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "16px",
        padding: "24px",
        transition: "all 0.3s ease",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px) scale(1.01)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(124, 58, 237, 0.25)";
        e.currentTarget.style.borderColor = "rgba(124, 58, 237, 0.5)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
      }}
    >
      {/* Top glow accent */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "2px",
        background: `linear-gradient(90deg, ${mentor.avatarColor}, #EA580C)`,
        borderRadius: "16px 16px 0 0",
      }} />

      {/* Header: Avatar + Name */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
        <div style={{
          width: "52px", height: "52px", borderRadius: "14px",
          background: `linear-gradient(135deg, ${mentor.avatarColor}, #1E1B4B)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px", fontWeight: "700", color: "#fff", flexShrink: 0,
        }}>
          {mentor.avatar}
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#F9FAFB" }}>
            {mentor.name}
          </h3>
          <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#9CA3AF" }}>
            {mentor.role} · {mentor.company}
          </p>
        </div>
      </div>

      {/* Rating + Experience */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {renderStars(mentor.rating)}
          <span style={{ fontSize: "13px", color: "#D1D5DB", marginLeft: "4px" }}>
            {mentor.rating} ({mentor.totalReviews})
          </span>
        </div>
      </div>

      {/* Skills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
        {mentor.skills.slice(0, 4).map((skill) => (
          <span key={skill} style={{
            background: "rgba(124, 58, 237, 0.15)",
            border: "1px solid rgba(124, 58, 237, 0.3)",
            color: "#C4B5FD",
            padding: "3px 10px",
            borderRadius: "20px",
            fontSize: "11px",
            fontWeight: "500",
          }}>
            {skill}
          </span>
        ))}
        {mentor.skills.length > 4 && (
          <span style={{
            background: "rgba(255,255,255,0.05)",
            color: "#6B7280",
            padding: "3px 10px",
            borderRadius: "20px",
            fontSize: "11px",
          }}>
            +{mentor.skills.length - 4}
          </span>
        )}
      </div>

      {/* Info row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
        <div>
          <span style={{ fontSize: "11px", color: "#6B7280" }}>Experience</span>
          <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#E5E7EB", fontWeight: "600" }}>
            {mentor.experience}
          </p>
        </div>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: "11px", color: "#6B7280" }}>Sessions</span>
          <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#E5E7EB", fontWeight: "600" }}>
            {mentor.sessions}+
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: "11px", color: "#6B7280" }}>Per Session</span>
          <p style={{ margin: "2px 0 0", fontSize: "16px", color: "#F97316", fontWeight: "700" }}>
            ₹{mentor.price}
          </p>
        </div>
      </div>

      {/* Next available */}
      <div style={{
        background: "rgba(16, 185, 129, 0.1)",
        border: "1px solid rgba(16, 185, 129, 0.2)",
        borderRadius: "8px",
        padding: "8px 12px",
        marginBottom: "16px",
        fontSize: "12px",
        color: "#6EE7B7",
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}>
        🕐 Next: {mentor.nextSlot}
      </div>

      {/* CTA Button */}
      <button
        onClick={() => navigate(`/mentor/${mentor.id}`)}
        style={{
          width: "100%",
          padding: "12px",
          background: "linear-gradient(135deg, #7C3AED, #4F46E5)",
          border: "none",
          borderRadius: "10px",
          color: "#fff",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.2s ease",
          letterSpacing: "0.3px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "linear-gradient(135deg, #6D28D9, #4338CA)";
          e.currentTarget.style.transform = "scale(1.01)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "linear-gradient(135deg, #7C3AED, #4F46E5)";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        View Profile →
      </button>
    </div>
  );
};

export default MentorCard;
// ─────────────────────────────────────────────────────────────
// MentorProfilePage.js — Full mentor profile with booking
// ─────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mentorsData } from "../data/mentorsData";
import SlotSelector from "../components/SlotSelector";
import { getBookedSlots, hasActiveBooking, getBookingForMentor } from "../utils/bookingUtils";

const MentorProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const mentor = mentorsData.find((m) => m.id === parseInt(id));

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [toast, setToast] = useState("");

  if (!mentor) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px", color: "#9CA3AF" }}>
        <h2>Mentor not found</h2>
        <button onClick={() => navigate("/mentors")} style={{ marginTop: "16px", padding: "10px 24px", background: "#7C3AED", border: "none", borderRadius: "10px", color: "#fff", cursor: "pointer" }}>
          Back to Mentors
        </button>
      </div>
    );
  }

  const bookedSlots = getBookedSlots(mentor.id);
  const userHasBooked = hasActiveBooking(mentor.id);
  const booking = getBookingForMentor(mentor.id);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleBookSession = () => {
    if (!selectedSlot) {
      showToast("⚠️ Please select a time slot first!");
      return;
    }
    navigate(`/booking/${mentor.id}`, { state: { slot: selectedSlot } });
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < Math.floor(rating) ? "#FBBF24" : "#374151", fontSize: "16px" }}>★</span>
    ));

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0F0A1E 0%, #0F172A 50%, #0A0A1A 100%)",
      color: "#F9FAFB",
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      {/* Toast notification */}
      {toast && (
        <div style={{
          position: "fixed", top: "20px", right: "20px", zIndex: 9999,
          background: "#1E1B4B", border: "1px solid rgba(124,58,237,0.4)",
          borderRadius: "12px", padding: "14px 20px",
          color: "#C4B5FD", fontSize: "14px", fontWeight: "500",
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
          animation: "slideIn 0.3s ease",
        }}>
          {toast}
        </div>
      )}
      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }`}</style>

      {/* Back button */}
      <div style={{ padding: "20px 24px 0", maxWidth: "900px", margin: "0 auto" }}>
        <button
          onClick={() => navigate("/mentors")}
          style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px", padding: "8px 16px", color: "#9CA3AF",
            cursor: "pointer", fontSize: "13px", transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#F9FAFB"; e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#9CA3AF"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
        >
          ← Back to Mentors
        </button>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>
        {/* Profile hero */}
        <div style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "20px", padding: "32px",
          marginBottom: "24px", position: "relative", overflow: "hidden",
        }}>
          {/* Gradient top border */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "3px",
            background: `linear-gradient(90deg, ${mentor.avatarColor}, #EA580C)`,
          }} />

          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {/* Avatar */}
            <div style={{
              width: "88px", height: "88px", borderRadius: "20px", flexShrink: 0,
              background: `linear-gradient(135deg, ${mentor.avatarColor}, #1E1B4B)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "28px", fontWeight: "800", color: "#fff",
            }}>
              {mentor.avatar}
            </div>

            <div style={{ flex: 1, minWidth: "200px" }}>
              <h1 style={{ margin: "0 0 4px", fontSize: "26px", fontWeight: "800" }}>{mentor.name}</h1>
              <p style={{ margin: "0 0 12px", color: "#9CA3AF", fontSize: "15px" }}>
                {mentor.role} · {mentor.company} · {mentor.experience}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  {renderStars(mentor.rating)}
                  <span style={{ color: "#D1D5DB", fontSize: "14px", marginLeft: "6px" }}>
                    {mentor.rating} ({mentor.totalReviews} reviews)
                  </span>
                </div>
                <span style={{ color: "#6B7280", fontSize: "13px" }}>✓ {mentor.sessions}+ sessions</span>
              </div>
            </div>

            {/* Price card */}
            <div style={{
              background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.25)",
              borderRadius: "14px", padding: "16px 20px", textAlign: "center", flexShrink: 0,
            }}>
              <p style={{ margin: "0 0 4px", fontSize: "11px", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.5px" }}>Per Session</p>
              <p style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: "#F97316" }}>₹{mentor.price}</p>
            </div>
          </div>

          {/* Bio */}
          <p style={{ marginTop: "20px", color: "#D1D5DB", lineHeight: "1.7", fontSize: "15px" }}>
            {mentor.bio}
          </p>

          {/* Skills */}
          <div style={{ marginTop: "16px" }}>
            <p style={{ margin: "0 0 10px", fontSize: "12px", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>Skills</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {mentor.skills.map((skill) => (
                <span key={skill} style={{
                  background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)",
                  color: "#C4B5FD", padding: "5px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: "500",
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", flexWrap: "wrap" }}>
          {/* Left: Booking + Reviews */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Slot Selector */}
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px", padding: "24px",
            }}>
              <h3 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: "700" }}>📅 Book a Session</h3>
              <SlotSelector
                slots={mentor.availability}
                bookedSlots={bookedSlots}
                selectedSlot={selectedSlot}
                onSelectSlot={setSelectedSlot}
              />
              <button
                onClick={handleBookSession}
                style={{
                  marginTop: "20px", width: "100%", padding: "14px",
                  background: selectedSlot
                    ? "linear-gradient(135deg, #7C3AED, #4F46E5)"
                    : "rgba(255,255,255,0.05)",
                  border: selectedSlot ? "none" : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px", color: selectedSlot ? "#fff" : "#6B7280",
                  fontSize: "15px", fontWeight: "600", cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {selectedSlot ? `Book Session for ${selectedSlot} →` : "Select a slot to continue"}
              </button>
            </div>

            {/* Reviews */}
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px", padding: "24px",
            }}>
              <h3 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: "700" }}>⭐ Reviews</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {mentor.reviews.map((review, i) => (
                  <div key={i} style={{
                    background: "rgba(255,255,255,0.02)", borderRadius: "12px", padding: "16px",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#E5E7EB" }}>{review.name}</span>
                      <div>{Array.from({ length: review.rating }, (_, j) => <span key={j} style={{ color: "#FBBF24", fontSize: "13px" }}>★</span>)}</div>
                    </div>
                    <p style={{ margin: 0, fontSize: "13px", color: "#9CA3AF", lineHeight: "1.6" }}>{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Info + Contact */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Availability info */}
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px", padding: "20px",
            }}>
              <h4 style={{ margin: "0 0 14px", fontSize: "14px", fontWeight: "700", color: "#D1D5DB" }}>
                🕐 Availability
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {mentor.availability.map((slot) => {
                  const booked = bookedSlots.includes(slot);
                  return (
                    <div key={slot} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "8px 12px", borderRadius: "8px",
                      background: booked ? "rgba(239,68,68,0.08)" : "rgba(16,185,129,0.08)",
                      border: booked ? "1px solid rgba(239,68,68,0.15)" : "1px solid rgba(16,185,129,0.15)",
                    }}>
                      <span style={{ fontSize: "13px", color: "#D1D5DB" }}>{slot}</span>
                      <span style={{ fontSize: "12px", color: booked ? "#EF4444" : "#10B981" }}>
                        {booked ? "Booked ❌" : "Available ✅"}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div style={{
                marginTop: "12px", padding: "10px 12px", borderRadius: "8px",
                background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)",
              }}>
                <p style={{ margin: 0, fontSize: "12px", color: "#6EE7B7" }}>
                  🔔 Next available: {mentor.nextSlot}
                </p>
              </div>
            </div>

            {/* Contact unlock box */}
            <div style={{
              background: userHasBooked
                ? "rgba(16,185,129,0.08)"
                : "rgba(255,255,255,0.03)",
              border: userHasBooked
                ? "1px solid rgba(16,185,129,0.25)"
                : "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px", padding: "20px",
            }}>
              <h4 style={{ margin: "0 0 14px", fontSize: "14px", fontWeight: "700", color: "#D1D5DB" }}>
                📞 Contact Details
              </h4>
              {userHasBooked ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <p style={{ margin: "0 0 10px", fontSize: "12px", color: "#6EE7B7" }}>
                    ✅ Unlocked after payment
                  </p>
                  <a
                    href={`https://wa.me/${mentor.contact.whatsapp}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.3)",
                      borderRadius: "10px", padding: "10px 14px", color: "#4ADE80",
                      textDecoration: "none", fontSize: "13px", fontWeight: "600",
                    }}
                  >
                    <span>📱</span> WhatsApp
                  </a>
                  <a
                    href={mentor.contact.zoom}
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)",
                      borderRadius: "10px", padding: "10px 14px", color: "#60A5FA",
                      textDecoration: "none", fontSize: "13px", fontWeight: "600",
                    }}
                  >
                    <span>🎥</span> Zoom Link
                  </a>
                </div>
              ) : (
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  padding: "20px", textAlign: "center",
                }}>
                  <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔒</div>
                  <p style={{ margin: "0 0 6px", fontSize: "13px", color: "#9CA3AF", fontWeight: "600" }}>
                    Contact available after booking
                  </p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#6B7280" }}>
                    Book and pay to unlock WhatsApp & Zoom details
                  </p>
                </div>
              )}
            </div>

            {/* Stats */}
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px", padding: "20px",
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px",
            }}>
              {[
                { label: "Rating", value: mentor.rating, icon: "⭐" },
                { label: "Reviews", value: mentor.totalReviews, icon: "💬" },
                { label: "Sessions", value: `${mentor.sessions}+`, icon: "🎓" },
                { label: "Experience", value: mentor.experience, icon: "💼" },
              ].map((stat) => (
                <div key={stat.label} style={{
                  textAlign: "center", background: "rgba(255,255,255,0.03)",
                  borderRadius: "10px", padding: "12px 8px",
                }}>
                  <div style={{ fontSize: "20px", marginBottom: "4px" }}>{stat.icon}</div>
                  <div style={{ fontSize: "15px", fontWeight: "700", color: "#F9FAFB" }}>{stat.value}</div>
                  <div style={{ fontSize: "11px", color: "#6B7280", marginTop: "2px" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProfilePage;
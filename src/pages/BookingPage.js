// ─────────────────────────────────────────────────────────────
// BookingPage.js — Booking confirmation + payment flow + history
// ─────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { mentorsData } from "../data/mentorsData";
import PaymentModal from "../components/PaymentModal";
import {
  saveBooking,
  markBookingPaid,
  isSlotBooked,
  getUserBookings,
  formatBookingDate,
} from "../utils/bookingUtils";

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const mentor = mentorsData.find((m) => m.id === parseInt(id));
  const slot = location.state?.slot;

  const [step, setStep] = useState("confirm"); // 'confirm' | 'booked' | 'payment' | 'done' | 'history'
  const [currentBooking, setCurrentBooking] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  if (!mentor) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px", color: "#9CA3AF", fontFamily: "'Inter', sans-serif" }}>
        <h2>Mentor not found.</h2>
        <button onClick={() => navigate("/mentors")} style={{ marginTop: "16px", padding: "10px 24px", background: "#7C3AED", border: "none", borderRadius: "10px", color: "#fff", cursor: "pointer" }}>
          Back to Mentors
        </button>
      </div>
    );
  }

  // Redirect if no slot selected
  if (!slot && step === "confirm") {
    navigate(`/mentor/${id}`);
    return null;
  }

  // Check slot availability
  const alreadyBooked = isSlotBooked(mentor.id, slot);

  // ── Confirm booking (save to localStorage) ──
  const handleConfirmBooking = () => {
    if (isSlotBooked(mentor.id, slot)) {
      alert("This slot was just booked by someone else. Please choose another.");
      navigate(`/mentor/${id}`);
      return;
    }
    const booking = saveBooking({
      mentorId: mentor.id,
      mentorName: mentor.name,
      mentorRole: mentor.role,
      slot,
      price: mentor.price,
      paid: false,
    });
    setCurrentBooking(booking);
    setStep("booked");
  };

  // ── After payment success ──
  const handlePaymentSuccess = () => {
    if (currentBooking) {
      markBookingPaid(currentBooking.id);
    }
    setShowPayment(false);
    setStep("done");
  };

  const pageStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0F0A1E 0%, #0F172A 50%, #0A0A1A 100%)",
    color: "#F9FAFB",
    fontFamily: "'Inter', -apple-system, sans-serif",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "24px",
  };

  const cardStyle = {
    background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "24px",
    padding: "40px",
    maxWidth: "520px",
    width: "100%",
    boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
  };

  // ── STEP: Confirm ──
  if (step === "confirm") {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <button onClick={() => navigate(`/mentor/${id}`)} style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", fontSize: "13px", marginBottom: "24px", padding: 0 }}>
            ← Back to Profile
          </button>

          <h2 style={{ margin: "0 0 8px", fontSize: "22px", fontWeight: "800" }}>Confirm Your Session</h2>
          <p style={{ margin: "0 0 28px", color: "#9CA3AF", fontSize: "14px" }}>Review the details below before confirming</p>

          {alreadyBooked ? (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px", marginBottom: "24px" }}>
              <p style={{ margin: 0, color: "#FCA5A5", fontSize: "14px" }}>
                ❌ This slot ({slot}) is already booked. Please go back and select another.
              </p>
            </div>
          ) : null}

          {/* Mentor summary */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "20px", marginBottom: "24px" }}>
            <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "12px", background: `linear-gradient(135deg, ${mentor.avatarColor}, #1E1B4B)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "700", color: "#fff" }}>
                {mentor.avatar}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: "700", color: "#F9FAFB" }}>{mentor.name}</p>
                <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#9CA3AF" }}>{mentor.role} · {mentor.company}</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { label: "Time Slot", value: slot },
                { label: "Session Duration", value: "1 Hour" },
                { label: "Session Price", value: `₹${mentor.price}`, highlight: true },
              ].map(({ label, value, highlight }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "13px", color: "#9CA3AF" }}>{label}</span>
                  <span style={{ fontSize: "13px", color: highlight ? "#F97316" : "#E5E7EB", fontWeight: highlight ? "700" : "600" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleConfirmBooking}
            disabled={alreadyBooked}
            style={{
              width: "100%", padding: "14px",
              background: alreadyBooked ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #7C3AED, #4F46E5)",
              border: "none", borderRadius: "12px",
              color: alreadyBooked ? "#6B7280" : "#fff",
              fontSize: "15px", fontWeight: "700",
              cursor: alreadyBooked ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            Confirm Booking →
          </button>
        </div>
      </div>
    );
  }

  // ── STEP: Booked (show payment CTA) ──
  if (step === "booked") {
    return (
      <div style={pageStyle}>
        {showPayment && (
          <PaymentModal
            mentor={mentor}
            slot={slot}
            bookingId={currentBooking?.id}
            onSuccess={handlePaymentSuccess}
            onClose={() => setShowPayment(false)}
          />
        )}
        <div style={cardStyle}>
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "50%",
              background: "rgba(124,58,237,0.15)", border: "2px solid rgba(124,58,237,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "28px", margin: "0 auto 16px",
            }}>🎉</div>
            <h2 style={{ margin: "0 0 8px", fontSize: "22px", fontWeight: "800" }}>Booking Confirmed!</h2>
            <p style={{ margin: 0, color: "#9CA3AF", fontSize: "14px" }}>
              Your session with {mentor.name} is reserved for {slot}.
            </p>
          </div>

          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "14px", padding: "16px", marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "13px", color: "#9CA3AF" }}>Booking ID</span>
              <span style={{ fontSize: "12px", color: "#6B7280", fontFamily: "monospace" }}>{currentBooking?.id?.slice(-12)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "13px", color: "#9CA3AF" }}>Status</span>
              <span style={{ fontSize: "13px", color: "#FBBF24", fontWeight: "600" }}>⏳ Awaiting Payment</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "13px", color: "#9CA3AF" }}>Amount Due</span>
              <span style={{ fontSize: "15px", color: "#F97316", fontWeight: "700" }}>₹{mentor.price}</span>
            </div>
          </div>

          {/* Contact locked */}
          <div style={{
            display: "flex", alignItems: "center", gap: "12px", padding: "14px",
            background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)",
            borderRadius: "10px", marginBottom: "20px",
          }}>
            <span style={{ fontSize: "22px" }}>🔒</span>
            <div>
              <p style={{ margin: 0, fontSize: "13px", color: "#FCA5A5", fontWeight: "600" }}>Contact locked</p>
              <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#9CA3AF" }}>Complete payment to unlock WhatsApp & Zoom</p>
            </div>
          </div>

          <button
            onClick={() => setShowPayment(true)}
            style={{
              width: "100%", padding: "14px",
              background: "linear-gradient(135deg, #EA580C, #DC2626)",
              border: "none", borderRadius: "12px",
              color: "#fff", fontSize: "15px", fontWeight: "700",
              cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 25px rgba(234,88,12,0.4)"; e.currentTarget.style.transform = "scale(1.01)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "scale(1)"; }}
          >
            🔒 Proceed to Pay ₹{mentor.price}
          </button>
          <button
            onClick={() => setStep("history")}
            style={{ marginTop: "12px", width: "100%", padding: "12px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#9CA3AF", fontSize: "14px", cursor: "pointer" }}
          >
            View Session History
          </button>
        </div>
      </div>
    );
  }

  // ── STEP: Done (payment complete) ──
  if (step === "done") {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: "72px", height: "72px", borderRadius: "50%",
              background: "rgba(16,185,129,0.15)", border: "2px solid rgba(16,185,129,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "32px", margin: "0 auto 20px",
            }}>✅</div>
            <h2 style={{ margin: "0 0 8px", fontSize: "24px", fontWeight: "800" }}>All Set!</h2>
            <p style={{ margin: "0 0 28px", color: "#9CA3AF" }}>
              Payment done · Contact unlocked · Session booked!
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
              <a href={`https://wa.me/${mentor.contact.whatsapp}`} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "13px", background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.3)", borderRadius: "12px", color: "#4ADE80", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>
                📱 Open WhatsApp
              </a>
              <a href={mentor.contact.zoom} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "13px", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: "12px", color: "#60A5FA", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>
                🎥 Join Zoom Meeting
              </a>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => navigate("/mentors")} style={{ flex: 1, padding: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#D1D5DB", fontSize: "14px", cursor: "pointer" }}>
                Browse Mentors
              </button>
              <button onClick={() => setStep("history")} style={{ flex: 1, padding: "12px", background: "linear-gradient(135deg, #7C3AED, #4F46E5)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                My Sessions →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── STEP: Session History ──
  if (step === "history") {
    const allBookings = getUserBookings();
    return (
      <div style={{ ...pageStyle, alignItems: "flex-start", paddingTop: "40px" }}>
        <div style={{ ...cardStyle, maxWidth: "640px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "800" }}>📚 Session History</h2>
            <button onClick={() => navigate("/mentors")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "6px 14px", color: "#9CA3AF", cursor: "pointer", fontSize: "13px" }}>
              + Book More
            </button>
          </div>

          {allBookings.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#6B7280" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>📭</div>
              <p style={{ margin: 0, fontSize: "14px" }}>No sessions booked yet</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {allBookings.map((b) => {
                const m = mentorsData.find((x) => x.id === b.mentorId);
                return (
                  <div key={b.id} style={{
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "14px", padding: "16px",
                    display: "flex", alignItems: "center", gap: "14px",
                  }}>
                    {m && (
                      <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: `linear-gradient(135deg, ${m.avatarColor}, #1E1B4B)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "700", color: "#fff", flexShrink: 0 }}>
                        {m.avatar}
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 3px", fontWeight: "600", fontSize: "14px", color: "#F9FAFB" }}>{b.mentorName}</p>
                      <p style={{ margin: 0, fontSize: "12px", color: "#9CA3AF" }}>{b.slot} · {formatBookingDate(b.bookedAt)}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{
                        fontSize: "11px", fontWeight: "600", padding: "4px 10px", borderRadius: "20px",
                        background: b.paid ? "rgba(16,185,129,0.12)" : "rgba(251,191,36,0.12)",
                        color: b.paid ? "#10B981" : "#FBBF24",
                        border: `1px solid ${b.paid ? "rgba(16,185,129,0.25)" : "rgba(251,191,36,0.25)"}`,
                      }}>
                        {b.paid ? "✅ Paid" : "⏳ Unpaid"}
                      </span>
                      <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#F97316", fontWeight: "700" }}>₹{b.price}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default BookingPage;
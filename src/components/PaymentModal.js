// ─────────────────────────────────────────────────────────────
// PaymentModal.js — Simulated payment UI with loading animation
// ─────────────────────────────────────────────────────────────

import React, { useState } from "react";

const PaymentModal = ({ mentor, slot, bookingId, onSuccess, onClose }) => {
  // 'idle' | 'processing' | 'success'
  const [paymentState, setPaymentState] = useState("idle");

  const handlePay = () => {
    setPaymentState("processing");
    // Simulate payment processing (2.5 seconds)
    setTimeout(() => {
      setPaymentState("success");
    }, 2500);
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}
      onClick={(e) => { if (e.target === e.currentTarget && paymentState === "idle") onClose(); }}
    >
      <div style={{
        background: "linear-gradient(135deg, #1A1035 0%, #0F172A 100%)",
        border: "1px solid rgba(124, 58, 237, 0.3)",
        borderRadius: "20px",
        padding: "36px",
        width: "100%",
        maxWidth: "420px",
        position: "relative",
        boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.1)",
      }}>
        {/* Close button */}
        {paymentState === "idle" && (
          <button onClick={onClose} style={{
            position: "absolute", top: "16px", right: "16px",
            background: "rgba(255,255,255,0.08)", border: "none",
            borderRadius: "8px", color: "#9CA3AF", cursor: "pointer",
            width: "32px", height: "32px", fontSize: "16px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        )}

        {/* ── IDLE: Payment Form ── */}
        {paymentState === "idle" && (
          <>
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <div style={{
                width: "56px", height: "56px", borderRadius: "16px",
                background: "linear-gradient(135deg, #7C3AED, #EA580C)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "24px", margin: "0 auto 16px",
              }}>💳</div>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "#F9FAFB" }}>
                Complete Payment
              </h2>
              <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#9CA3AF" }}>
                Secure simulated checkout
              </p>
            </div>

            {/* Order summary */}
            <div style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px", padding: "16px", marginBottom: "24px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ fontSize: "13px", color: "#9CA3AF" }}>Mentor</span>
                <span style={{ fontSize: "13px", color: "#E5E7EB", fontWeight: "600" }}>{mentor.name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ fontSize: "13px", color: "#9CA3AF" }}>Time Slot</span>
                <span style={{ fontSize: "13px", color: "#E5E7EB", fontWeight: "600" }}>{slot}</span>
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "10px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "14px", color: "#D1D5DB", fontWeight: "600" }}>Total</span>
                <span style={{ fontSize: "18px", color: "#F97316", fontWeight: "700" }}>₹{mentor.price}</span>
              </div>
            </div>

            {/* Fake card input */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "12px", color: "#6B7280", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Card Number
              </label>
              <input
                type="text"
                defaultValue="4242 4242 4242 4242"
                readOnly
                style={{
                  width: "100%", padding: "11px 14px", boxSizing: "border-box",
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "10px", color: "#D1D5DB", fontSize: "14px",
                  fontFamily: "monospace", cursor: "default",
                }}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
              <div>
                <label style={{ fontSize: "12px", color: "#6B7280", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Expiry</label>
                <input type="text" defaultValue="12/27" readOnly style={{ width: "100%", padding: "11px 14px", boxSizing: "border-box", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", color: "#D1D5DB", fontSize: "14px", cursor: "default" }} />
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "#6B7280", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>CVV</label>
                <input type="text" defaultValue="•••" readOnly style={{ width: "100%", padding: "11px 14px", boxSizing: "border-box", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", color: "#D1D5DB", fontSize: "14px", cursor: "default" }} />
              </div>
            </div>

            <button
              onClick={handlePay}
              style={{
                width: "100%", padding: "14px",
                background: "linear-gradient(135deg, #EA580C, #DC2626)",
                border: "none", borderRadius: "12px",
                color: "#fff", fontSize: "15px", fontWeight: "700",
                cursor: "pointer", transition: "all 0.2s ease",
                letterSpacing: "0.3px",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 8px 25px rgba(234, 88, 12, 0.4)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              🔒 Pay ₹{mentor.price}
            </button>
            <p style={{ textAlign: "center", fontSize: "11px", color: "#4B5563", marginTop: "12px" }}>
              This is a simulated payment. No real money is charged.
            </p>
          </>
        )}

        {/* ── PROCESSING: Loading animation ── */}
        {paymentState === "processing" && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "50%",
              border: "3px solid rgba(124, 58, 237, 0.2)",
              borderTop: "3px solid #7C3AED",
              margin: "0 auto 24px",
              animation: "spin 0.8s linear infinite",
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <h3 style={{ margin: "0 0 8px", color: "#F9FAFB", fontSize: "18px" }}>Processing Payment...</h3>
            <p style={{ margin: 0, color: "#9CA3AF", fontSize: "13px" }}>Please wait, do not close this window.</p>
            <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {["Verifying card details...", "Contacting payment gateway...", "Confirming booking..."].map((step, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "10px 16px",
                  background: "rgba(124, 58, 237, 0.08)",
                  borderRadius: "8px",
                  opacity: 1,
                  animation: `fadeIn 0.4s ease ${i * 0.6}s both`,
                }}>
                  <div style={{
                    width: "16px", height: "16px", borderRadius: "50%",
                    border: "2px solid #7C3AED",
                    borderTop: "2px solid transparent",
                    animation: "spin 0.8s linear infinite",
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: "13px", color: "#C4B5FD" }}>{step}</span>
                </div>
              ))}
            </div>
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
          </div>
        )}

        {/* ── SUCCESS ── */}
        {paymentState === "success" && (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div style={{
              width: "72px", height: "72px", borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))",
              border: "2px solid rgba(16,185,129,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "32px", margin: "0 auto 20px",
            }}>
              ✅
            </div>
            <h2 style={{ margin: "0 0 8px", color: "#F9FAFB", fontSize: "22px", fontWeight: "700" }}>
              Payment Successful!
            </h2>
            <p style={{ margin: "0 0 24px", color: "#9CA3AF", fontSize: "14px" }}>
              ₹{mentor.price} paid · Session booked with {mentor.name}
            </p>
            <div style={{
              background: "rgba(16, 185, 129, 0.08)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              borderRadius: "12px", padding: "16px", marginBottom: "24px", textAlign: "left",
            }}>
              <p style={{ margin: "0 0 8px", fontSize: "13px", color: "#6EE7B7", fontWeight: "600" }}>
                🎉 Contact Details Unlocked
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
                <a
                  href={`https://wa.me/${mentor.contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    background: "rgba(37, 211, 102, 0.1)", border: "1px solid rgba(37, 211, 102, 0.3)",
                    borderRadius: "8px", padding: "10px 14px", color: "#4ADE80",
                    textDecoration: "none", fontSize: "13px", fontWeight: "600",
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontSize: "20px" }}>📱</span> Chat on WhatsApp
                </a>
                <a
                  href={mentor.contact.zoom}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.3)",
                    borderRadius: "8px", padding: "10px 14px", color: "#60A5FA",
                    textDecoration: "none", fontSize: "13px", fontWeight: "600",
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontSize: "20px" }}>🎥</span> Join Zoom Meeting
                </a>
              </div>
            </div>
            <button
              onClick={onSuccess}
              style={{
                width: "100%", padding: "13px",
                background: "linear-gradient(135deg, #7C3AED, #4F46E5)",
                border: "none", borderRadius: "12px",
                color: "#fff", fontSize: "14px", fontWeight: "600",
                cursor: "pointer",
              }}
            >
              View My Booking →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
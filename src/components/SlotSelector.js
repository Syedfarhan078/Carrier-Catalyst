// ─────────────────────────────────────────────────────────────
// SlotSelector.js — Selectable time slot buttons
// ─────────────────────────────────────────────────────────────

import React from "react";

const SlotSelector = ({ slots, bookedSlots, selectedSlot, onSelectSlot }) => {
  return (
    <div>
      <h4 style={{ margin: "0 0 12px", fontSize: "14px", color: "#9CA3AF", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        Select a Time Slot
      </h4>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {slots.map((slot) => {
          const isBooked = bookedSlots.includes(slot);
          const isSelected = selectedSlot === slot;

          return (
            <button
              key={slot}
              disabled={isBooked}
              onClick={() => !isBooked && onSelectSlot(slot)}
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: isBooked ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                border: isBooked
                  ? "1px solid rgba(239, 68, 68, 0.3)"
                  : isSelected
                  ? "1px solid #7C3AED"
                  : "1px solid rgba(255,255,255,0.15)",
                background: isBooked
                  ? "rgba(239, 68, 68, 0.1)"
                  : isSelected
                  ? "linear-gradient(135deg, #7C3AED, #4F46E5)"
                  : "rgba(255,255,255,0.05)",
                color: isBooked ? "#EF4444" : isSelected ? "#fff" : "#D1D5DB",
                opacity: isBooked ? 0.7 : 1,
              }}
            >
              {isBooked ? `${slot} ❌` : isSelected ? `✓ ${slot}` : `${slot} ✅`}
            </button>
          );
        })}
      </div>
      {selectedSlot && (
        <p style={{ marginTop: "12px", fontSize: "13px", color: "#A78BFA" }}>
          ✓ Selected: <strong style={{ color: "#C4B5FD" }}>{selectedSlot}</strong>
        </p>
      )}
    </div>
  );
};

export default SlotSelector;
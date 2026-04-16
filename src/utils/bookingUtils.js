// ─────────────────────────────────────────────────────────────
// bookingUtils.js — All localStorage logic for booking system
// ─────────────────────────────────────────────────────────────

const BOOKINGS_KEY = "mentor_marketplace_bookings";

// ── Get all bookings from localStorage ──
export const getAllBookings = () => {
  try {
    const data = localStorage.getItem(BOOKINGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// ── Save a new booking to localStorage ──
export const saveBooking = (booking) => {
  const bookings = getAllBookings();
  const newBooking = {
    ...booking,
    id: `booking_${Date.now()}`,
    bookedAt: new Date().toISOString(),
    status: "confirmed",
  };
  bookings.push(newBooking);
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  return newBooking;
};

// ── Check if a specific slot is already booked for a mentor ──
export const isSlotBooked = (mentorId, slot) => {
  const bookings = getAllBookings();
  return bookings.some(
    (b) => b.mentorId === mentorId && b.slot === slot && b.status === "confirmed"
  );
};

// ── Get all bookings for a specific mentor ──
export const getBookingsForMentor = (mentorId) => {
  const bookings = getAllBookings();
  return bookings.filter((b) => b.mentorId === mentorId);
};

// ── Get all bookings for the current user ──
export const getUserBookings = () => {
  return getAllBookings();
};

// ── Check if user has an active (paid + confirmed) booking for a mentor ──
export const hasActiveBooking = (mentorId) => {
  const bookings = getAllBookings();
  return bookings.some(
    (b) => b.mentorId === mentorId && b.status === "confirmed" && b.paid === true
  );
};

// ── Get the specific booking for a mentor (for contact unlock) ──
export const getBookingForMentor = (mentorId) => {
  const bookings = getAllBookings();
  return bookings.find(
    (b) => b.mentorId === mentorId && b.status === "confirmed" && b.paid === true
  ) || null;
};

// ── Mark a booking as paid ──
export const markBookingPaid = (bookingId) => {
  const bookings = getAllBookings();
  const updated = bookings.map((b) =>
    b.id === bookingId ? { ...b, paid: true } : b
  );
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
};

// ── Cancel a booking ──
export const cancelBooking = (bookingId) => {
  const bookings = getAllBookings();
  const updated = bookings.map((b) =>
    b.id === bookingId ? { ...b, status: "cancelled" } : b
  );
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
};

// ── Get booked slots for a mentor ──
export const getBookedSlots = (mentorId) => {
  const bookings = getAllBookings();
  return bookings
    .filter((b) => b.mentorId === mentorId && b.status === "confirmed")
    .map((b) => b.slot);
};

// ── Format date for display ──
export const formatBookingDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
/**
 * ═══════════════════════════════════════════════════════════════
 * IN-MEMORY USER DATA
 * Seed data for registered users. In production, this would
 * live in PostgreSQL or MongoDB.
 *
 * Each user has:
 *   - id          → unique identifier
 *   - name        → display name
 *   - email       → login email (must be unique)
 *   - password    → plain-text for demo (NEVER do this in prod!)
 *   - career      → selected career track (null if not chosen)
 *   - joinedAt    → ISO date string of registration
 * ═══════════════════════════════════════════════════════════════
 */

const users = [
  {
    id: 1,
    name: "Farhan Ahmed",
    email: "farhan@example.com",
    password: "password123",
    career: "datascience",
    joinedAt: "2026-01-15T09:30:00Z",
  },
  {
    id: 2,
    name: "Ayesha Khan",
    email: "ayesha@example.com",
    password: "password456",
    career: "webdev",
    joinedAt: "2026-02-20T14:00:00Z",
  },
  {
    id: 3,
    name: "Rahul Sharma",
    email: "rahul@example.com",
    password: "password789",
    career: null,
    joinedAt: "2026-03-10T11:15:00Z",
  },
];

module.exports = users;

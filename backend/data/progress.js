/**
 * ═══════════════════════════════════════════════════════════════
 * IN-MEMORY PROGRESS DATA
 * Tracks each user's learning progress across their career path.
 *
 * Each progress entry has:
 *   - userId           → links to a user in users.js
 *   - career           → which career track they are on
 *   - completedTopics  → array of topic names they've finished
 *   - currentPhase     → which learning phase they are in
 *   - lastActive       → ISO date of last activity
 *   - streakDays       → consecutive days of activity
 *   - totalHours       → estimated total hours spent learning
 * ═══════════════════════════════════════════════════════════════
 */

const progress = [
  {
    userId: 1,
    career: "datascience",
    completedTopics: [
      "Python Basics",
      "Statistics & Probability",
      "SQL & Databases",
      "Data Wrangling (Pandas, NumPy)",
      "Exploratory Data Analysis (EDA)",
    ],
    currentPhase: "Core Skills",
    lastActive: "2026-04-30T18:45:00Z",
    streakDays: 14,
    totalHours: 87,
  },
  {
    userId: 2,
    career: "webdev",
    completedTopics: [
      "HTML5 Semantics & Structure",
      "CSS3, Flexbox & Grid",
      "JavaScript ES6+",
      "Responsive Design",
      "React.js",
      "State Management (Redux / Zustand)",
    ],
    currentPhase: "Frontend Advanced",
    lastActive: "2026-04-29T21:30:00Z",
    streakDays: 7,
    totalHours: 124,
  },
];

module.exports = progress;

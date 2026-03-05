/**
 * db.js — SQL-style In-Memory Database (localStorage-backed)
 *
 * SQL Schema:
 *   CREATE TABLE users        (id, name, email, password, created_at)
 *   CREATE TABLE sessions     (id, user_id, career, created_at)
 *   CREATE TABLE progress     (id, user_id, career, topic, completed, updated_at)
 *   CREATE TABLE planner      (id, user_id, career, day, task, done)
 */

const DB = {
  users:    JSON.parse(localStorage.getItem("db_users")    || "[]"),
  sessions: JSON.parse(localStorage.getItem("db_sessions") || "[]"),
  progress: JSON.parse(localStorage.getItem("db_progress") || "[]"),
  planner:  JSON.parse(localStorage.getItem("db_planner")  || "[]"),

  save() {
    localStorage.setItem("db_users",    JSON.stringify(this.users));
    localStorage.setItem("db_sessions", JSON.stringify(this.sessions));
    localStorage.setItem("db_progress", JSON.stringify(this.progress));
    localStorage.setItem("db_planner",  JSON.stringify(this.planner));
  },

  // ── USERS ────────────────────────────────────────────
  // INSERT INTO users VALUES (name, email, password)
  insertUser(name, email, password) {
    const user = {
      id: Date.now(),
      name,
      email,
      password,
      created_at: new Date().toISOString(),
    };
    this.users.push(user);
    this.save();
    return user;
  },

  // SELECT * FROM users WHERE email=? AND password=?
  loginUser(email, password) {
    return this.users.find(u => u.email === email && u.password === password) || null;
  },

  // SELECT COUNT(*) FROM users WHERE email=?
  userExists(email) {
    return this.users.some(u => u.email === email);
  },

  // ── SESSIONS ─────────────────────────────────────────
  // INSERT INTO sessions VALUES (user_id, career)
  logSession(userId, career) {
    const s = { id: Date.now(), user_id: userId, career, created_at: new Date().toISOString() };
    this.sessions.push(s);
    this.save();
  },

  // SELECT COUNT(*) FROM sessions WHERE user_id=? AND career=?
  getSessionCount(userId, career) {
    return this.sessions.filter(s => s.user_id === userId && s.career === career).length;
  },

  // ── PROGRESS ─────────────────────────────────────────
  // SELECT * FROM progress WHERE user_id=? AND career=?
  getProgress(userId, career) {
    return this.progress.filter(p => p.user_id === userId && p.career === career);
  },

  // INSERT OR UPDATE progress SET completed=? WHERE user_id=? AND career=? AND topic=?
  setProgress(userId, career, topic, completed) {
    const idx = this.progress.findIndex(
      p => p.user_id === userId && p.career === career && p.topic === topic
    );
    if (idx >= 0) {
      this.progress[idx].completed = completed;
      this.progress[idx].updated_at = new Date().toISOString();
    } else {
      this.progress.push({
        id: Date.now(),
        user_id: userId,
        career,
        topic,
        completed,
        updated_at: new Date().toISOString(),
      });
    }
    this.save();
  },

  // ── PLANNER ──────────────────────────────────────────
  // SELECT * FROM planner WHERE user_id=? AND career=?
  getPlanner(userId, career) {
    return this.planner.filter(p => p.user_id === userId && p.career === career);
  },

  // INSERT INTO planner VALUES (user_id, career, day, task)
  addPlannerTask(userId, career, day, task) {
    const t = { id: Date.now(), user_id: userId, career, day, task, done: false };
    this.planner.push(t);
    this.save();
    return t;
  },

  // UPDATE planner SET done = NOT done WHERE id=?
  togglePlannerTask(id) {
    const t = this.planner.find(p => p.id === id);
    if (t) { t.done = !t.done; this.save(); }
  },

  // DELETE FROM planner WHERE id=?
  deletePlannerTask(id) {
    this.planner = this.planner.filter(p => p.id !== id);
    this.save();
  },
};

export default DB;

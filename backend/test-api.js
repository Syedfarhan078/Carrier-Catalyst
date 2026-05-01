/**
 * Quick API test script — run with: node test-api.js
 * Tests all endpoints and prints results
 */

const BASE = "http://localhost:5000/api";

async function test(label, url, options = {}) {
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    const data = await res.json();
    const status = res.status;
    const icon = data.success ? "✅" : "❌";
    console.log(`${icon} [${status}] ${label}`);
    console.log(`   ${JSON.stringify(data).slice(0, 200)}...`);
    console.log("");
  } catch (err) {
    console.log(`❌ ${label}: ${err.message}`);
    console.log("");
  }
}

(async () => {
  console.log("═══════════════════════════════════════════");
  console.log("  Career Catalyst API — Integration Tests");
  console.log("═══════════════════════════════════════════\n");

  // 1. Health check
  await test("GET /api (health check)", `${BASE}`);

  // 2. Signup
  await test("POST /api/auth/signup (new user)", `${BASE}/auth/signup`, {
    method: "POST",
    body: JSON.stringify({ name: "Test User", email: "test@example.com", password: "test1234" }),
  });

  // 3. Signup — duplicate email
  await test("POST /api/auth/signup (duplicate)", `${BASE}/auth/signup`, {
    method: "POST",
    body: JSON.stringify({ name: "Test User", email: "test@example.com", password: "test1234" }),
  });

  // 4. Signup — missing fields
  await test("POST /api/auth/signup (missing fields)", `${BASE}/auth/signup`, {
    method: "POST",
    body: JSON.stringify({ email: "bad@example.com" }),
  });

  // 5. Login — valid
  await test("POST /api/auth/login (valid)", `${BASE}/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email: "farhan@example.com", password: "password123" }),
  });

  // 6. Login — wrong password
  await test("POST /api/auth/login (wrong pw)", `${BASE}/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email: "farhan@example.com", password: "wrongpassword" }),
  });

  // 7. Users
  await test("GET /api/users", `${BASE}/users`);
  await test("GET /api/users/1", `${BASE}/users/1`);
  await test("GET /api/users/999 (not found)", `${BASE}/users/999`);

  // 8. Mentors
  await test("GET /api/mentors", `${BASE}/mentors`);
  await test("GET /api/mentors/3", `${BASE}/mentors/3`);
  await test("GET /api/mentors?skill=React", `${BASE}/mentors?skill=React`);
  await test("GET /api/mentors?sort=price", `${BASE}/mentors?sort=price`);

  // 9. Progress
  await test("GET /api/progress/1", `${BASE}/progress/1`);
  await test("GET /api/progress/3 (no progress yet)", `${BASE}/progress/3`);

  // 10. Update progress
  await test("POST /api/progress (new)", `${BASE}/progress`, {
    method: "POST",
    body: JSON.stringify({ userId: 3, career: "webdev", completedTopics: ["HTML5 Semantics & Structure"], currentPhase: "Frontend Basics" }),
  });

  // 11. 404
  await test("GET /api/nonexistent (404)", `${BASE}/nonexistent`);

  console.log("═══════════════════════════════════════════");
  console.log("  All tests completed!");
  console.log("═══════════════════════════════════════════");
})();

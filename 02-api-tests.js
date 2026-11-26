const JSONPLACEHOLDER = "https://jsonplaceholder.typicode.com";
const DUMMYJSON = "https://dummyjson.com";

const MAX_RESPONSE_TIME_MS = 3000; // fail a request slower than this

// Public demo credentials published by DummyJSON for practice.
const VALID_USER = { username: "emilys", password: "emilyspass" };

let passed = 0;
let failed = 0;
const failures = [];

function assertEqual(actual, expected, message = "values differ") {
  if (actual !== expected) {
    throw new Error(
      `${message}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    );
  }
}

function assertTrue(condition, message = "expected condition to be true") {
  if (!condition) throw new Error(message);
}

function assertShape(obj, shape) {
  for (const [field, type] of Object.entries(shape)) {
    assertTrue(field in obj, `missing field "${field}"`);
    assertEqual(typeof obj[field], type, `field "${field}" has wrong type`);
  }
}

async function test(name, checkFn) {
  try {
    await checkFn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    failures.push(name);
    console.log(`  ✗ ${name}`);
    console.log(`      → ${err.message}`);
  }
}

async function request(method, url, { body, token } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const start = Date.now();
  const response = await fetch(url, {
    method: method,
    headers: headers,
    // JSON.stringify turns a JS object into JSON text for the body.
    body: body ? JSON.stringify(body) : undefined,
  });
  const timeMs = Date.now() - start;

  let data = null;
  const text = await response.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text; // not JSON, keep the raw text
  }

  return {
    status: response.status,
    headers: response.headers,
    body: data,
    timeMs: timeMs,
  };
}

async function main() {
  console.log("\n=== GET requests (JSONPlaceholder) ===");

  await test("GET /posts/1 returns 200 and the right post", async () => {
    const res = await request("GET", `${JSONPLACEHOLDER}/posts/1`);

    assertEqual(res.status, 200, "status code");
    assertEqual(res.body.id, 1, "post id");
    assertEqual(res.body.userId, 1, "author id");
  });

  await test("GET /posts/1 has the expected fields and types", async () => {
    const res = await request("GET", `${JSONPLACEHOLDER}/posts/1`);

    assertShape(res.body, {
      id: "number",
      userId: "number",
      title: "string",
      body: "string",
    });
    assertTrue(res.body.title.length > 0, "title should not be empty");
  });

  await test("GET /posts/1 responds with JSON content type", async () => {
    const res = await request("GET", `${JSONPLACEHOLDER}/posts/1`);
    const contentType = res.headers.get("content-type");

    assertTrue(
      contentType.includes("application/json"),
      `content-type was "${contentType}"`,
    );
  });

  await test(`GET /posts/1 responds in under ${MAX_RESPONSE_TIME_MS} ms`, async () => {
    const res = await request("GET", `${JSONPLACEHOLDER}/posts/1`);
    console.log(`      (took ${res.timeMs} ms)`);

    assertTrue(res.timeMs < MAX_RESPONSE_TIME_MS, `took ${res.timeMs} ms`);
  });

  await test("GET /posts?userId=1 returns only posts by user 1", async () => {
    const res = await request("GET", `${JSONPLACEHOLDER}/posts?userId=1`);

    assertEqual(res.status, 200, "status code");
    assertTrue(Array.isArray(res.body), "body should be an array");
    assertEqual(res.body.length, 10, "number of posts");

    for (const post of res.body) {
      assertEqual(post.userId, 1, `post ${post.id} has wrong userId`);
    }
  });

  console.log("\n=== Negative tests ===");

  await test("GET /posts/99999 (does not exist) returns 404", async () => {
    const res = await request("GET", `${JSONPLACEHOLDER}/posts/99999`);
    assertEqual(res.status, 404, "status code");
  });

  await test("login with a wrong password returns 400 and an error message", async () => {
    const res = await request("POST", `${DUMMYJSON}/auth/login`, {
      body: { username: VALID_USER.username, password: "wrong-password" },
    });

    assertEqual(res.status, 400, "status code");
    assertTrue(
      typeof res.body.message === "string",
      "should explain the error",
    );
    assertTrue(!("accessToken" in res.body), "must NOT return a token");
  });

  // ----------------------------------------------------------
  console.log("\n=== POST / PUT / DELETE (JSONPlaceholder) ===");
  // JSONPlaceholder pretends to save data and echoes it back.
  // ----------------------------------------------------------

  await test("POST /posts creates a post and returns 201", async () => {
    const newPost = {
      title: "Automation is fun",
      body: "Written by a test script",
      userId: 1,
    };

    const res = await request("POST", `${JSONPLACEHOLDER}/posts`, {
      body: newPost,
    });

    assertEqual(res.status, 201, "status code (201 = Created)");
    assertEqual(typeof res.body.id, "number", "server should assign an id");
    // What we sent should come back unchanged.
    assertEqual(res.body.title, newPost.title, "title");
    assertEqual(res.body.body, newPost.body, "body");
  });

  await test("PUT /posts/1 updates the title", async () => {
    const res = await request("PUT", `${JSONPLACEHOLDER}/posts/1`, {
      body: { id: 1, userId: 1, title: "Updated title", body: "Updated body" },
    });

    assertEqual(res.status, 200, "status code");
    assertEqual(res.body.title, "Updated title", "title");
  });

  await test("DELETE /posts/1 returns 200", async () => {
    const res = await request("DELETE", `${JSONPLACEHOLDER}/posts/1`);
    assertEqual(res.status, 200, "status code");
  });

  console.log("\n=== Login flow: chaining requests (DummyJSON) ===");

  let token = null;

  await test("POST /auth/login with valid credentials returns a token", async () => {
    const res = await request("POST", `${DUMMYJSON}/auth/login`, {
      body: VALID_USER,
    });

    assertEqual(res.status, 200, "status code");
    assertEqual(typeof res.body.accessToken, "string", "accessToken type");
    assertEqual(res.body.username, VALID_USER.username, "username");

    token = res.body.accessToken;
  });

  await test("GET /auth/me with the token returns the logged-in user", async () => {
    assertTrue(token !== null, "no token: the login test must pass first");

    const res = await request("GET", `${DUMMYJSON}/auth/me`, { token: token });

    assertEqual(res.status, 200, "status code");
    assertEqual(res.body.username, VALID_USER.username, "username");
  });

  await test("GET /auth/me WITHOUT a token is rejected", async () => {
    const res = await request("GET", `${DUMMYJSON}/auth/me`);
    assertTrue(
      res.status === 401 || res.status === 403,
      `expected 401/403, got ${res.status}`,
    );
  });

  console.log("\n=== Data-driven: check several users ===");

  const userIds = [1, 2, 3, 4, 5];

  for (const id of userIds) {
    await test(`GET /users/${id} has a valid email`, async () => {
      const res = await request("GET", `${JSONPLACEHOLDER}/users/${id}`);

      assertEqual(res.status, 200, "status code");
      assertEqual(res.body.id, id, "user id");
      assertTrue(
        res.body.email.includes("@"),
        `email "${res.body.email}" has no @`,
      );
    });
  }

  console.log("\n=== Summary ===");

  console.log(`  ${passed} passed, ${failed} failed`);
  if (failures.length > 0) {
    console.log("  Failed tests:");
    failures.forEach((name) => console.log(`   - ${name}`));
    process.exitCode = 1; // tells CI the run failed
  }
}

main();

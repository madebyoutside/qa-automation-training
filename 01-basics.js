function calculateDiscount(total) {
  if (total >= 100) {
    return total * 0.1;
  }
  return 0;
}

function validateSignup(email, password) {
  if (email === "") return "Email is required";
  if (!email.includes("@") || !email.includes("."))
    return "Enter a valid email";
  if (password.length < 8) return "Password too short";
  return "OK";
}

function createUser(name, email) {
  return {
    name: name,
    email: email.toLowerCase(), // emails are stored in lowercase
    role: "customer",
    active: true,
  };
}

console.log("\n=== Part 1: a check is just an if ===");

const actual = calculateDiscount(100);
const expected = 10;

if (actual === expected) {
  console.log("PASS: a $100 order gets $10 off");
} else {
  console.log(`FAIL: a $100 order. Expected ${expected}, got ${actual}`);
}

let passed = 0;
let failed = 0;
const failures = []; // names of failed tests, printed at the end

function assertEqual(actualValue, expectedValue, message = "values differ") {
  if (actualValue !== expectedValue) {
    throw new Error(
      `${message}: expected ${JSON.stringify(expectedValue)}, got ${JSON.stringify(actualValue)}`,
    );
  }
}

function assertTrue(condition, message = "expected condition to be true") {
  if (!condition) {
    throw new Error(message);
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

async function main() {
  console.log("\n=== Part 2: our own test() and assertEqual() ===");

  // Boundary value analysis: test just below, on, and above the limit.
  await test("no discount at $99.99 (just below the limit)", () => {
    assertEqual(calculateDiscount(99.99), 0);
  });

  await test("10% off at exactly $100 (on the limit)", () => {
    assertEqual(calculateDiscount(100), 10);
  });

  await test("10% off at $250 (above the limit)", () => {
    assertEqual(calculateDiscount(250), 25);
  });

  await test("no discount for an empty cart", () => {
    assertEqual(calculateDiscount(0), 0);
  });

  console.log("\n=== Part 3: data-driven tests ===");

  const signupCases = [
    { email: "priya@shop.test", password: "S3cure!pass", expected: "OK" },
    { email: "", password: "S3cure!pass", expected: "Email is required" },
    {
      email: "priya@shop",
      password: "S3cure!pass",
      expected: "Enter a valid email",
    },
    {
      email: "priya.shop.test",
      password: "S3cure!pass",
      expected: "Enter a valid email",
    },
    {
      email: "priya@shop.test",
      password: "short",
      expected: "Password too short",
    },
    {
      email: "priya@shop.test",
      password: "1234567",
      expected: "Password too short",
    }, // 7 chars: boundary
    { email: "priya@shop.test", password: "12345678", expected: "OK" }, // 8 chars: boundary
  ];

  for (const c of signupCases) {
    // Template literal builds a readable test name from the data.
    const name = `signup with "${c.email}" / "${c.password}" → ${c.expected}`;
    await test(name, () => {
      assertEqual(validateSignup(c.email, c.password), c.expected);
    });
  }

  console.log("\n=== Part 4: generated test data ===");

  // Random whole number between min and max (inclusive).
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Random string of letters, e.g. "kqzra".
  function randomString(length) {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += letters[randomInt(0, letters.length - 1)];
    }
    return result;
  }

  // Unique email using the current time, e.g. "qa_kqzra_1732612345678@test.com".
  function randomEmail() {
    return `qa_${randomString(5)}_${Date.now()}@test.com`;
  }

  const email = randomEmail();
  console.log("  Generated email:", email);

  await test("a generated email passes validation", () => {
    assertEqual(validateSignup(email, "Password123"), "OK");
  });

  // Run the same check 20 times with random totals of $100 to $1000.
  await test("20 random totals of $100 or more all get exactly 10% off", () => {
    for (let i = 0; i < 20; i++) {
      const total = randomInt(100, 1000);
      assertEqual(calculateDiscount(total), total * 0.1, `total $${total}`);
    }
  });

  // ==========================================================
  // PART 5: COMPARING OBJECTS
  // === on two objects compares "are they the same object",
  // not "do they have the same contents". So we compare fields.
  // ==========================================================

  console.log("\n=== Part 5: comparing objects ===");

  const a = { name: "Priya" };
  const b = { name: "Priya" };
  console.log(
    '  { name: "Priya" } === { name: "Priya" } →',
    a === b,
    "(different objects!)",
  );

  // Compares each field of "expected" with the same field of "actual",
  // and lists every difference instead of stopping at the first one.
  function assertObjectMatches(actualObj, expectedObj) {
    const differences = [];
    for (const key of Object.keys(expectedObj)) {
      if (actualObj[key] !== expectedObj[key]) {
        differences.push(
          `${key}: expected ${JSON.stringify(expectedObj[key])}, got ${JSON.stringify(actualObj[key])}`,
        );
      }
    }
    if (differences.length > 0) {
      throw new Error(differences.join(" | "));
    }
  }

  await test("createUser builds the expected user", () => {
    const user = createUser("Priya", "Priya@Shop.TEST");
    assertObjectMatches(user, {
      name: "Priya",
      email: "priya@shop.test", // should be lowercased
      role: "customer",
      active: true,
    });
  });

  console.log("\n=== Part 6: waiting and retrying ===");

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function retry(action, attempts = 5, delayMs = 200) {
    let lastError;
    for (let i = 1; i <= attempts; i++) {
      try {
        return await action(); // success: stop retrying
      } catch (err) {
        lastError = err;
        console.log(`    attempt ${i} failed, retrying in ${delayMs} ms...`);
        await sleep(delayMs);
      }
    }
    throw new Error(`gave up after ${attempts} attempts: ${lastError.message}`);
  }

  let calls = 0;
  function checkServiceReady() {
    calls++;
    if (calls < 3) throw new Error("service not ready");
    return "ready";
  }

  await test("service becomes ready within 5 attempts", async () => {
    const status = await retry(checkServiceReady);
    assertEqual(status, "ready");
  });

  await test("sleep(300) waits at least 300 ms", async () => {
    const start = Date.now();
    await sleep(300);
    const elapsed = Date.now() - start;
    assertTrue(elapsed >= 295, `only waited ${elapsed} ms`); // small timer tolerance
  });

  console.log("\n=== Summary ===");
  console.log(`  ${passed} passed, ${failed} failed`);
  if (failures.length > 0) {
    console.log("  Failed tests:");
    failures.forEach((name) => console.log(`   - ${name}`));
    process.exitCode = 1;
  }
}

// Start the script.
main();

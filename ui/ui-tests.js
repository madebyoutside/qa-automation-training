(async function runUiTests() {
  const SLOW_MO_MS = 300;

  const VALID_EMAIL = "qa@shop.test";
  const VALID_PASSWORD = "Password123";

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function find(selector) {
    const element = document.querySelector(selector);
    if (element === null) {
      throw new Error(`Element not found: ${selector}`);
    }
    return element;
  }

  function isVisible(selector) {
    const element = document.querySelector(selector);
    return element !== null && !element.hidden && element.offsetParent !== null;
  }

  async function type(selector, text) {
    const field = find(selector);
    field.focus();
    field.value = text;
    field.dispatchEvent(new Event("input", { bubbles: true }));
    await sleep(SLOW_MO_MS);
  }

  async function click(selector) {
    const element = find(selector);
    if (element.disabled) {
      throw new Error(`Cannot click ${selector}: it is disabled`);
    }
    element.click();
    await sleep(SLOW_MO_MS);
  }

  function getText(selector) {
    return find(selector).textContent.trim();
  }

  async function waitFor(conditionFn, description, timeoutMs = 3000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      try {
        if (conditionFn()) return;
      } catch {}
      await sleep(50);
    }
    throw new Error(
      `Timed out after ${timeoutMs} ms waiting for: ${description}`,
    );
  }

  // ASSERTIONS AND TEST RUNNER

  function assertEqual(actual, expected, message = "values differ") {
    if (actual !== expected) {
      throw new Error(
        `${message}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
      );
    }
  }

  function assertTrue(condition, message) {
    if (!condition) throw new Error(message);
  }

  const results = [];

  async function test(name, steps) {
    const start = Date.now();
    try {
      await resetToLoginScreen();
      await steps();
      results.push({ name, ok: true, ms: Date.now() - start });
      console.log(`%c✓ ${name}`, "color: green");
    } catch (err) {
      results.push({
        name,
        ok: false,
        error: err.message,
        ms: Date.now() - start,
      });
      console.log(`%c✗ ${name}\n   → ${err.message}`, "color: red");
    }
    renderPanel();
  }

  async function resetToLoginScreen() {
    if (isVisible("#logout")) {
      find("#logout").click();
    }

    for (const selector of ["#email", "#password"]) {
      const field = find(selector);
      field.value = "";
      field.dispatchEvent(new Event("input", { bubbles: true }));
    }
    await waitFor(() => isVisible("#login-screen"), "login screen");
  }

  async function login(email, password) {
    await type("#email", email);
    await type("#password", password);
    await click("#sign-in");
  }

  // A small box in the corner showing results as they come in.

  const panel = document.createElement("div");
  panel.style.cssText = `
    position: fixed; right: 16px; bottom: 16px; width: 360px; max-height: 70vh;
    overflow: auto; background: #111728; color: #d7ddeb; border-radius: 10px;
    font: 13px/1.5 ui-monospace, Menlo, Consolas, monospace; padding: 12px 14px;
    box-shadow: 0 8px 30px rgba(0,0,0,.3); z-index: 9999;`;
  document.body.appendChild(panel);

  function renderPanel(finished = false) {
    const passed = results.filter((r) => r.ok).length;
    const failed = results.length - passed;
    panel.innerHTML =
      `<strong>UI tests ${finished ? "finished" : "running..."}</strong>` +
      `<div style="margin:4px 0 8px;color:#99a3b8">${passed} passed, ${failed} failed</div>` +
      results
        .map(
          (r) => `
        <div style="color:${r.ok ? "#4fc57c" : "#ff6e7b"}">
          ${r.ok ? "✓" : "✗"} ${r.name} <span style="color:#6e7a96">${r.ms} ms</span>
          ${r.ok ? "" : `<div style="margin-left:16px;color:#ffb3ba">${r.error}</div>`}
        </div>`,
        )
        .join("");
  }

  console.log("%cQA Shop UI tests", "font-weight: bold; font-size: 14px");

  // ---------- Login screen ----------

  await test("login page shows the QA Shop heading", async () => {
    assertEqual(getText("header h1"), "QA Shop", "heading text");
    assertTrue(isVisible("#login-screen"), "login form should be visible");
    assertTrue(
      !isVisible("#dashboard"),
      "dashboard should be hidden before login",
    );
  });

  await test("Sign in button is disabled until both fields are filled", async () => {
    assertTrue(find("#sign-in").disabled, "should be disabled when empty");

    await type("#email", VALID_EMAIL);
    assertTrue(
      find("#sign-in").disabled,
      "should still be disabled with only email",
    );

    await type("#password", VALID_PASSWORD);
    assertTrue(
      !find("#sign-in").disabled,
      "should be enabled when both are filled",
    );
  });

  await test("password field hides what you type", async () => {
    assertEqual(find("#password").type, "password", "input type");
  });

  // ---------- Data-driven negative login tests ----------

  const badLogins = [
    {
      email: "qa-shop.test",
      password: VALID_PASSWORD,
      error: "Enter a valid email",
    },
    {
      email: "qa@shop",
      password: VALID_PASSWORD,
      error: "Enter a valid email",
    },
    {
      email: VALID_EMAIL,
      password: "wrongpass",
      error: "Invalid email or password",
    },
    {
      email: "someone@else.test",
      password: VALID_PASSWORD,
      error: "Invalid email or password",
    },
    {
      email: VALID_EMAIL,
      password: "password123",
      error: "Invalid email or password",
    }, // wrong case
  ];

  for (const c of badLogins) {
    await test(`login "${c.email}" / "${c.password}" shows "${c.error}"`, async () => {
      await login(c.email, c.password);

      // The server takes ~500 ms, so WAIT for the message, don't guess.
      await waitFor(() => isVisible("#login-error"), "error message");
      assertEqual(getText("#login-error"), c.error, "error text");
      assertTrue(!isVisible("#dashboard"), "must not log in");
    });
  }

  // ---------- Successful login ----------

  await test("valid login opens the dashboard", async () => {
    await login(VALID_EMAIL, VALID_PASSWORD);

    await waitFor(() => isVisible("#dashboard"), "dashboard");
    assertEqual(getText("#welcome"), "Welcome, QA Tester", "welcome text");
    assertTrue(isVisible("#logout"), "logout button should be visible");
  });

  await test("email is accepted in any letter case", async () => {
    await login("QA@Shop.Test", VALID_PASSWORD);
    await waitFor(() => isVisible("#dashboard"), "dashboard");
  });

  // ---------- Cart ----------

  await test("adding products updates the cart count and total", async () => {
    await login(VALID_EMAIL, VALID_PASSWORD);
    await waitFor(() => isVisible("#dashboard"), "dashboard");

    assertEqual(getText("#cart-count"), "0", "count before");

    await click('[data-id="lamp"]'); // $38.00
    await click('[data-id="cable"]'); // $12.50

    // Text on the screen is always a string. Convert before comparing numbers.
    const count = Number(getText("#cart-count"));
    const total = parseFloat(getText("#cart-total").replace("$", ""));

    assertEqual(count, 2, "cart count");
    assertEqual(total, 50.5, "cart total");
  });

  await test("Clear cart empties the cart", async () => {
    await login(VALID_EMAIL, VALID_PASSWORD);
    await waitFor(() => isVisible("#dashboard"), "dashboard");

    await click('[data-id="notebook"]');
    await click("#clear-cart");

    assertEqual(getText("#cart-count"), "0", "count");
    assertEqual(getText("#cart-total"), "$0.00", "total");
  });

  // ---------- Slow content ----------

  await test("orders load (random 0.3 to 1.5 s delay)", async () => {
    await login(VALID_EMAIL, VALID_PASSWORD);
    await waitFor(() => isVisible("#dashboard"), "dashboard");

    await click("#load-orders");

    // A fixed sleep(500) here would fail randomly ("flaky test").
    // waitFor keeps checking until the orders actually appear.
    await waitFor(
      () => document.querySelectorAll("#orders .order").length === 3,
      "3 orders",
      3000,
    );

    const first = getText("#orders .order");
    assertTrue(first.includes("#1042"), `first order was "${first}"`);
  });

  // ---------- Logout ----------

  await test("logout returns to login and clears the password", async () => {
    await login(VALID_EMAIL, VALID_PASSWORD);
    await waitFor(() => isVisible("#dashboard"), "dashboard");

    await click("#logout");

    assertTrue(isVisible("#login-screen"), "login screen should be visible");
    assertEqual(find("#password").value, "", "password field");
  });

  // ============================================================
  // SUMMARY
  // ============================================================

  renderPanel(true);
  const failedCount = results.filter((r) => !r.ok).length;
  console.log(
    `%c${results.length - failedCount} passed, ${failedCount} failed`,
    `font-weight: bold; color: ${failedCount ? "red" : "green"}`,
  );

  // Return to a clean login screen when done.
  await resetToLoginScreen();
})();

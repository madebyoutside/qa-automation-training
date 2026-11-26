const fs = require("fs");
const path = require("path");

const CHECKS = [
  {
    name: "Posts API",
    url: "https://jsonplaceholder.typicode.com/posts",
    expectStatus: 200,
  },
  {
    name: "Single user",
    url: "https://jsonplaceholder.typicode.com/users/1",
    expectStatus: 200,
  },
  {
    name: "Products API",
    url: "https://dummyjson.com/products?limit=5",
    expectStatus: 200,
  },
  {
    name: "Quotes API",
    url: "https://dummyjson.com/quotes/random",
    expectStatus: 200,
  },
  {
    name: "Missing page",
    url: "https://jsonplaceholder.typicode.com/nope",
    expectStatus: 404,
  }, // we EXPECT a 404 here
];

const TIMEOUT_MS = 5000;
const SLOW_MS = 1000;

async function checkUrl(check) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const start = Date.now();
  try {
    const response = await fetch(check.url, { signal: controller.signal });
    const timeMs = Date.now() - start;

    const ok = response.status === check.expectStatus;
    return {
      name: check.name,
      url: check.url,
      status: response.status,
      expected: check.expectStatus,
      timeMs: timeMs,
      result: ok ? (timeMs > SLOW_MS ? "SLOW" : "PASS") : "FAIL",
    };
  } catch (err) {
    return {
      name: check.name,
      url: check.url,
      status: null,
      expected: check.expectStatus,
      timeMs: Date.now() - start,
      result: "FAIL",
      error:
        err.name === "AbortError"
          ? `timed out after ${TIMEOUT_MS} ms`
          : err.message,
    };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  console.log(`\nSmoke check started at ${new Date().toLocaleString()}`);
  console.log(`Checking ${CHECKS.length} URLs in parallel...\n`);

  const startAll = Date.now();

  const results = await Promise.all(CHECKS.map(checkUrl));

  const totalMs = Date.now() - startAll;

  console.table(
    results.map((r) => ({
      check: r.name,
      status: r.status ?? "-",
      expected: r.expected,
      "time (ms)": r.timeMs,
      result: r.result,
    })),
  );

  const failedChecks = results.filter((r) => r.result === "FAIL");
  for (const r of failedChecks) {
    const reason = r.error ?? `expected status ${r.expected}, got ${r.status}`;
    console.log(`  ✗ ${r.name}: ${reason}`);
  }

  const slowest = [...results].sort((a, b) => b.timeMs - a.timeMs)[0];
  console.log(`\n  Slowest: ${slowest.name} (${slowest.timeMs} ms)`);
  console.log(`  Total time: ${totalMs} ms`);

  const reportsDir = path.join(__dirname, "reports");
  fs.mkdirSync(reportsDir, { recursive: true });

  const stamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
  const reportPath = path.join(reportsDir, `smoke-report-${stamp}.json`);

  const report = {
    ranAt: new Date().toISOString(),
    totalMs: totalMs,
    passed: results.length - failedChecks.length,
    failed: failedChecks.length,
    results: results,
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`  Report saved: ${reportPath}\n`);

  if (failedChecks.length > 0) {
    console.log(
      `SMOKE CHECK FAILED: ${failedChecks.length} of ${results.length} checks failed`,
    );
    process.exitCode = 1;
  } else {
    console.log(`SMOKE CHECK PASSED: all ${results.length} checks OK`);
  }
}

main();

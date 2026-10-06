
// Activity
// const results = [
// "passed",
// "failed",
// "passed",
// "passed",
// "failed",
// "skipped"
// ];

// and we should be able to produce the following output.
// Total: 6
// Passed: 3
// Failed: 2
// Skipped: 1
// Pass rate: 50%

const results = [
  "passed",
  "failed",
  "passed",
  "passed",
  "failed",
  "skipped"
];

const total = results.length;
let passed = 0;
let failed = 0;
let skipped = 0;

for (let i = 0; i < total; i++) {
  if (results[i] === "passed") {
    passed = passed + 1;
  } else if (results[i] === "failed") {
    failed = failed + 1;
  } else {
    skipped = skipped + 1;
  }
}

const passrate = (passed / total) * 100;

console.log("Total:", total);
console.log("Passed:", passed);
console.log("Failed:", failed);
console.log("Skipped:", skipped);
console.log("Pass Rate:", passrate + "%");
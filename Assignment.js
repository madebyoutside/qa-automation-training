// Problem 1: Test result counter
// Write a function countResults(results) that takes an array of test statuses and returns an object
// with the count of each status.
// countResults(["pass", "fail", "pass", "skip", "fail"]);
// Expected: { pass: 2, fail: 2, skip: 1 }

let countResults = (["pass", "fail", "pass", "skip", "fail"]);

let pass = 0;
let fail = 0;
let skip = 0;

for (let i = 0; i < countResults.length; i++) {
    if (countResults[i] === "pass") {
        pass++;
    } else if (countResults[i] === "fail") {
        fail++;
    } else {
        skip++;
    }
}
  console.log("pass: ", pass);
  console.log("fail:", fail);
  console.log("skip:", skip);

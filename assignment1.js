const results = ['passed', 'failed', 'passed', 'passed', 'failed', 'skipped'];

let passed = 0;
let failed = 0;
let skipped = 0;

for (const result of results) {
  if (result === 'passed') {
    passed++;
  } else if (result === 'failed') {
    failed++;
  } else if (result === 'skipped') {
    skipped++;
  }
}

const total = results.length;
const passRate = (passed / total) * 100;

console.log('Total:', total);
console.log('Passed:', passed);
console.log('Failed:', failed);
console.log('Skipped:', skipped);
console.log('Pass rate:', passRate + '%');

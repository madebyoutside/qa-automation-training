// const fullName = ['Nischal', 'Bohara'];

// for (let i=0;i<fullName.length;i++){
//   console.log(fullName[i]);
// }


// const name = "Nischal";
// for (let i=0;i<name.length;i++){
//   console.log(name[i]);
// }



// let passed =0;
// let skipped =0;
// let failed = 0;
// let total = results.length;


// for (result of results ){
  
//   if (result === "passed"){
//     passed = passed +1
//   }
//   else if (result === "skipped")
//     {
//       skipped = skipped +1
//     }
//    else if (result === "failed")
//     {
//       failed = failed +1
//     }
// }
// const percentTagepassed = passed/total* 100;
// console.log(`Total:${total}`)
// console.log(`Passed:${passed}`)
// console.log(`Skipped:${skipped}`)
// console.log(`Failed:${failed}`)
// console.log(`Passed Percentage:${Math.floor(percentTagepassed)} %`)

console.log("Functions results here --------------------------");

const results1= ["passed","passed","passed","skipped","failed","passed","absent"];
const results2 = ["passed","passed","skipped","failed","passed","absent"];

function resultCalculator(results){
  let passed =0;
let skipped =0;
let failed = 0;
let total = results.length;


for (result of results ){
  
  if (result === "passed"){
    passed = passed +1
  }
  else if (result === "skipped")
    {
      skipped = skipped +1
    }
   else if (result === "failed")
    {
      failed = failed +1
    }
}
const percentTagepassed = passed/total* 100;
console.log(`Total:${total}`)
console.log(`Passed:${passed}`)
console.log(`Skipped:${skipped}`)
console.log(`Failed:${failed}`)
console.log(`Passed Percentage:${Math.floor(percentTagepassed)} %`)
  
}

console.log("Results 1:")

resultCalculator(results1)

console.log("Results 2:")

resultCalculator(results2)

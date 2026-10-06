// Write a function to find the longest common prefix string amongst an array of strings.If there is no common prefix, return an empty string "".


const word = ["fly", "flow", "flight", "four"];

function longestPrefix(word) {
    for (let i=0; i<word[0].length; i++)
    {
      for (let j=1; j<word.length; j++)
      {
        if(word[j][i] !== word[0][i])
          return word[0].slice(0,i);
      }
    }
    return word[0];
}
console.log(longestPrefix(word));

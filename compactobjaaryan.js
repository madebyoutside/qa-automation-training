var compactObject = function (obj) {
  // If obj is an array
  if (Array.isArray(obj)) {
    let result = [];

    for (let i = 0; i < obj.length; i++) {
      // If value is truthy
      if (obj[i]) {
        // Clean the value and add it
        result.push(compactObject(obj[i]));
      }
    }

    return result;
  }

  // If obj is an object
  if (typeof obj === "object" && obj !== null) {
    let result = {};

    for (let key in obj) {
      // If value is truthy
      if (obj[key]) {
        // Clean the value and store it
        result[key] = compactObject(obj[key]);
      }
    }

    return result;
  }

  // If it is a normal value like 1, "hello", true
  return obj;
};

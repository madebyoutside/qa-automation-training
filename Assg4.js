// Given an object or array obj, return a compact object.
// A compact object is the same as the original object, except with keys containing falsy values removed. This operation applies to the object and any nested objects. Arrays are considered objects where the indices are keys. A value is considered falsy when Boolean(value) returns false.
// You may assume the obj is the output of JSON.parse. In other words, it is valid JSON.

// Example: 
// Input: obj = {"a": null, "b": [false, 1]}
// Output: {"b": [1]}
// Explanation: obj["a"] and obj["b"][0] had falsy values and were removed.

const data = {
    a: null,
    b: [false, 1],
    c: 0,
    d: 7
};

function clean(data) {
    if (Array.isArray(data)) {
        return data.filter(Boolean).map(clean);
    }
    if (typeof data === "object" && data !== null) {
        const result = {};

        for (let key in data) {
            if (Boolean(data[key])) {
                result[key] = clean(data[key]);
            }
        }
        return result;
    }
    return data;
}

console.log(clean(data));
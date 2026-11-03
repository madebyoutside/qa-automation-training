function isPalindrome(str) {
    str = str.toLowerCase();

    let reversed = "";

    for (let i = str.length - 1; i >= 0; i--) {
        if (str[i] !== " ") {
            reversed += str[i];
        }
    }

    let original = "";

    for (let i = 0; i < str.length; i++) {
        if (str[i] !== " ") {
            original += str[i];
        }
    }

    return original === reversed;
}

console.log(isPalindrome("racecar"));           // true
console.log(isPalindrome("Never odd or even")); // true
console.log(isPalindrome("hello"));             // false
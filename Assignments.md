## Loops

// Activity
const results = [
"passed",
"failed",
"passed",
"passed",
"failed",
"skipped"
];

// and we should be able to produce the following output.
// Total: 6
// Passed: 3
// Failed: 2
// Skipped: 1
// Pass rate: 50%

## Array

Write a function to find the longest common prefix string amongst an array of strings.If there is no common prefix, return an empty string "".

Example :
Input: strs = ["flower","flow","flight"]
Output: "fl"[5:37 PM]2. Login form validator:

given the html snippet:

<form id="loginForm">
  <label for="email">Email</label>
  <input type="text" id="email" />
  <p class="error" id="emailError"></p>

<label for="password">Password</label>
<input type="password" id="password" />

  <p id="charCount">0 characters</p>
  <p class="error" id="passwordError"></p>

<button type="submit">Log in</button>

</form>

<p id="message"></p>

 Stop the page from reloading after form submission.
 Validate on submit:
 Email: it can't be empty, and it must contain @. Otherwise show "Please enter a valid email".
Password: it can't be empty, and it must be at least 6 characters long. Otherwise show "Password must be at least 6 characters"

 Validate when the user leaves a field.
Clear the error when the user returns to a field.

## Objects

Given an object or array obj, return a compact object.
A compact object is the same as the original object, except with keys containing falsy values removed. This operation applies to the object and any nested objects. Arrays are considered objects where the indices are keys. A value is considered falsy when Boolean(value) returns false.
You may assume the obj is the output of JSON.parse. In other words, it is valid JSON.

Example:
Input: obj = {"a": null, "b": [false, 1]}
Output: {"b": [1]}
Explanation: obj["a"] and obj["b"][0] had falsy values and were removed.

## Async Javascript

Assignment for the asynchronous javascript chapter:

PART 1 : Get random activity:

GET https://bored-api.appbrewery.com/random
Display :

Activity: Learn Express.js
Type: education
Participants: 1
Price: 0.1

Use fetch()
Use async/await
Handle errors with try/catch
Don't use .then()

PART 2: validate the response

function validateActivity(activity) { // your code }It should verify that:

activity exists
activity.activity exists
activity.type exists
activity.participants is a number
activity.price is a number
activity.key exists

PART 3: filter activity

GET : https://bored-api.appbrewery.com/filter?type=education
The API supports filtering by type and participants.
Also write a simple test script to verify all the activities fetched are for eg: education.

Part 4:  Sequential API calls

Get a random activity.
Take its key.
Use that key to fetch the activity again.
Compare the two responses.

Basically, GET /random -> get key -> GET /activity/:key -> compare (hint: use await)

PART 5: Do part 4 for 5 different activities using Promise.all() (edited)

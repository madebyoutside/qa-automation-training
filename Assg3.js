// 2. Login form validator:

// given the html snippet:
// <form id="loginForm">
//   <label for="email">Email</label>
//   <input type="text" id="email" />
//   <p class="error" id="emailError"></p>

//   <label for="password">Password</label>
//   <input type="password" id="password" />
//   <p id="charCount">0 characters</p>
//   <p class="error" id="passwordError"></p>

//   <button type="submit">Log in</button>
// </form>

// <p id="message"></p>


//  Stop the page from reloading after form submission. 
//  Validate on submit:
//  Email: it can't be empty, and it must contain @. Otherwise show "Please enter a valid email".
// Password: it can't be empty, and it must be at least 6 characters long. Otherwise show "Password must be at least 6 characters"

//  Validate when the user leaves a field.
// Clear the error when the user returns to a field.



const form = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");


//validate Email
function validateEmail() {
    if (email.value === "" || !email.value.includes("@")) {
        emailError.textContent = "Please enter a valid email";
        return false;
    }

    emailError.textContent = "";
    return true;
}


//validate Password
function validatePassword() {
    if (password.value === "" || password.value.length < 6) {
        passwordError.textContent = "Password must be at least 6 characters";
        return false;
    }

    passwordError.textContent = "";
    return true;
}


//form submission
form.addEventListener("submit", function(event) {

    event.preventDefault();
    const emailValid = validateEmail();
    const passwordValid = validatePassword();

    if (emailValid && passwordValid) {
        document.getElementById("message").textContent = "Login successful!";
    }
});


//user leaves the field
email.addEventListener("blur", validateEmail);
password.addEventListener("blur", validatePassword);

// error clear when user comes back to the field
email.addEventListener("focus", function() {
    emailError.textContent = "";
});

password.addEventListener("focus", function() {
    passwordError.textContent = "";
});
// Wait for the HTML to fully load before running scripts
document.addEventListener("DOMContentLoaded", () => {
    
    // Grab the register form from the HTML by its ID
    const registerForm = document.getElementById("registerForm");

    // If the register form exists on the current page, add an event listener
    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            
            // Get the values the user typed into the password fields
            const password = document.getElementById("reg-password").value;
            const confirmPassword = document.getElementById("confirm-password").value;
            const errorMessage = document.getElementById("error-message");

            // Logic Check: Do they match?
            if (password !== confirmPassword) {
                // Prevent the form from submitting and reloading the page
                event.preventDefault(); 
                
                // Show an error to the user
                errorMessage.textContent = "Passwords do not match. Please try again.";
            } else {
                // Clear any previous errors
                errorMessage.textContent = "";
                
                // In a real app, this is where you would send data to a backend. 
                // For this frontend task, we just let it submit.
                alert("Registration successful! Redirecting to login...");
            }
        });
    }

    // Optional: Add simple console logs to verify JS is running
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault(); // Stop page reload for demo
            alert("Login attempted. In a full-stack app, this connects to a database.");
            window.location.href = "dashboard.html"; // Redirect to dashboard
        });
    }
});
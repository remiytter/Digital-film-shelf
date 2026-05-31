const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { error } = await supabaseClient.auth.signUp ({
        email,
        password,
    });

    if (error) {
        message.textContent = error.message;
        return;
    }

    message.textContent = "Account created! Check your email to confirm your account.";

});
const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        message.textContent = error.message;
        return;
    }

    window.location.href = "/collection.html";

});
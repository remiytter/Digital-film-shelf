const movieForm = document.getElementById("movieForm");
const message = document.getElementById("message");
const logoutButton = document.getElementById("logoutButton");

let currentUser = null;

async function loadAddMoviePage() {
    const session = await checkAuth();

    if (!session) {
        return;
    }

    currentUser = session.user;
}

movieForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!currentUser) {
        message.textContent = "You must be logged in to add a movie.";
        return;
    }

    const title = document.getElementById("title").value;
    const director = document.getElementById("director").value;
    const genre = document.getElementById("genre").value;
    const format = document.getElementById("format").value;
    const specialEdition = document.getElementById("specialEdition").value;
    const releaseYear = document.getElementById("releaseYear").value;
    const coverUrl = document.getElementById("coverUrl").value;
    const isPublic = document.getElementById("isPublic").checked;

    const { error } = await supabaseClient
        .from("movies")
        .insert({
            user_id: currentUser.id,
            title: title,
            director: director,
            genre: genre,
            format: format,
            special_edition: specialEdition,
            release_year: releaseYear || null,
            cover_url: coverUrl,
            is_public: isPublic,
        });

        if (error) {
            message.textContent = error.message;
            return;
        }

        message.textContent = "Movie added successfully!";
        movieForm.reset();
});

logoutButton.addEventListener("click", async () => {
    await supabaseClient.auth.signedOut();
    window.location.href = "/login.html";
});

loadAddMoviePage();
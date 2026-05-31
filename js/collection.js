const userEmail = document.getElementById("userEmail");
const moviesContainer = document.getElementById("moviesContainer");
const logoutButton = document.getElementById("logoutButton");

async function loadCollectionPage() {
    const session = await checkAuth();

    if (!session) {
        return;
    }

    userEmail.textContent = `Logged in as: ${session.user.email}`;

    await displayMovies(session.user.id);
}

async function displayMovies(userId) {

    const { data, error } = await supabaseClient
        .from("movies")
        .select("*")
        .eq("user_id", userId)
        .order("title");

    if (error) {
        moviesContainer.innerHTML = `
            <p>${error.message}</p>
        `;
        return;
    }

    if (data.length === 0) {
        moviesContainer.innerHTML = `
            <p>No movies added yet.</p>
        `;
        return;
    }

    moviesContainer.innerHTML = "";

    data.forEach((movie) => {

        const movieCard = document.createElement("article");

        movieCard.innerHTML = `
            ${
                movie.cover_url
                    ? `<img src="${movie.cover_url}" alt="${movie.title} cover">`
                    : ""
            }

            <h3>${movie.title}</h3>

            <p><strong>Director:</strong> ${movie.director || "Unknown"}</p>
            <p><strong>Genre:</strong> ${movie.genre || "-"}</p>
            <p><strong>Format:</strong> ${movie.format || "-"}</p>
            <p><strong>Year:</strong> ${movie.release_year || "-"}</p>
            <p><strong>Edition:</strong> ${movie.special_edition || "-"}</p>

            <div class="movie-actions">
                <button
                    class="editButton"
                    data-id="${movie.id}"
                >
                    Edit
                </button>

                <button
                    class="deleteButton"
                    data-id="${movie.id}"
                >
                    Delete
                </button>
            </div>
        `;

        moviesContainer.append(movieCard);

        const deleteButton =
            movieCard.querySelector(".deleteButton");

        deleteButton.addEventListener("click", () => {
            deleteMovie(movie.id);
        });
    });
}

async function deleteMovie(movieId) {

    const confirmed = confirm(
        "Are you sure you want to delete this movie?"
    );

    if (!confirmed) {
        return;
    }

    const { error } = await supabaseClient
        .from("movies")
        .delete()
        .eq("id", movieId);

    if (error) {
        console.error(error);
        return;
    }

    loadCollectionPage();
}

logoutButton.addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    window.location.href = "/login.html";
});

loadCollectionPage();
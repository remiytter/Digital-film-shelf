const userEmail = document.getElementById("userEmail");
const moviesContainer = document.getElementById("moviesContainer");
const logoutButton = document.getElementById("logoutButton");
const sortSelect = document.getElementById("sortSelect");
const searchInput = document.getElementById("searchInput");
const formatFilter = document.getElementById("formatFilter");

let movies = [];
let filteredMovies = [];

async function loadCollectionPage() {
    const session = await checkAuth();

    if (!session) {
        return;
    }

    userEmail.textContent = `Logged in as: ${session.user.email}`;

    await displayMovies(session.user.id);
}

async function displayMovies(userId) {
    moviesContainer.innerHTML = "";

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

    movies = data;
    filteredMovies = [...movies];

    renderMovies();
}

function renderMovies() {
    moviesContainer.innerHTML = "";

    filteredMovies.forEach((movie) => {
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

        const editButton = movieCard.querySelector(".editButton");

        editButton.addEventListener("click", () => {
            window.location.href = `/edit-movie.html?id=${movie.id}`;
        });

        const deleteButton = movieCard.querySelector(".deleteButton");

        deleteButton.addEventListener("click", () => {
            deleteMovie(movie.id);
        });
    });
}

function sortMovies(sortValue) {
    switch (sortValue) {
        case "title-asc":
            movies.sort((a, b) => a.title.localeCompare(b.title));
            break;

        case "title-desc":
            movies.sort((a, b) => b.title.localeCompare(a.title));
            break;

        case "year-desc":
            movies.sort((a, b) => {
                return (b.release_year || 0) - (a.release_year || 0);
            });
            break;

        case "year-asc":
            movies.sort((a, b) => {
                return (a.release_year || 0) - (b.release_year || 0);
            });
            break;
    }

    renderMovies();
}

function filterMovies() {
    const searchValue = searchInput.value.toLowerCase().trim();
    const selectedFormat = formatFilter.value;

    filteredMovies = movies.filter((movie) => {
        const title = (movie.title || "").toLowerCase();
        const director = (movie.director || "").toLowerCase();
        const genre = (movie.genre || "").toLowerCase();

        const matchesSearch =
            title.includes(searchValue) ||
            director.includes(searchValue) ||
            genre.includes(searchValue);

        const matchesFormat =
            selectedFormat === "all" ||
            movie.format === selectedFormat;

        return matchesSearch && matchesFormat;
    });

    renderMovies();
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

sortSelect.addEventListener("change", () => {
    sortMovies(sortSelect.value);
});

logoutButton.addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    window.location.href = "/login.html";
});

searchInput.addEventListener("input", filterMovies);

formatFilter.addEventListener("change", filterMovies);

loadCollectionPage();
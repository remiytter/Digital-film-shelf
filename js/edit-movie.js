const editMovieForm = document.getElementById("editMovieForm");
const message = document.getElementById("message");

const titleInput = document.getElementById("title");
const directorInput = document.getElementById("director");
const genreInput = document.getElementById("genre");
const formatInput = document.getElementById("format");
const specialEditionInput = document.getElementById("specialEdition");
const releaseYearInput = document.getElementById("releaseYear");
const coverUrlInput = document.getElementById("coverUrl");
const isPublicInput = document.getElementById("isPublic");

const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");

let currentUser = null;

async function loadEditPage() {
    const session = await checkAuth();

    if (!session) {
        return;
    }

    currentUser = session.user;

    if (!movieId) {
        message.textContent = "No movie ID found.";
        return;
    }

    const { data, error } = await supabaseClient
        .from("movies")
        .select("*")
        .eq("id", movieId)
        .eq("user_id", currentUser.id)
        .single();

    if (error) {
        message.textContent = error.message;
        return;
    }

    titleInput.value = data.title || "";
    directorInput.value = data.director || "";
    genreInput.value = data.genre || "";
    formatInput.value = data.format || "";
    specialEditionInput.value = data.special_edition || "";
    releaseYearInput.value = data.release_year || "";
    coverUrlInput.value = data.cover_url || "";
    isPublicInput.checked = data.is_public;
}

editMovieForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!currentUser) {
        message.textContent = "You must be logged in.";
        return;
    }

    const updatedMovie = {
        title: titleInput.value,
        director: directorInput.value,
        genre: genreInput.value,
        format: formatInput.value,
        special_edition: specialEditionInput.value,
        release_year: releaseYearInput.value || null,
        cover_url: coverUrlInput.value,
        is_public: isPublicInput.checked,
    };

    const { error } = await supabaseClient
        .from("movies")
        .update(updatedMovie)
        .eq("id", movieId)
        .eq("user_id", currentUser.id);

    if (error) {
        message.textContent = error.message;
        return;
    }

    message.textContent = "Movie updated successfully!";

    setTimeout(() => {
        window.location.href = "/collection.html";
    }, 800);
});

loadEditPage();
const publicMoviesContainer =
    document.getElementById("publicMoviesContainer");

async function loadPublicMovies() {

    const { data, error } = await supabaseClient
        .from("movies")
        .select("*")
        .eq("is_public", true)
        .order("title");

    if (error) {
        publicMoviesContainer.innerHTML =
            `<p>${error.message}</p>`;
        return;
    }

    if (data.length === 0) {
        publicMoviesContainer.innerHTML =
            `<p>No public movies found.</p>`;
        return;
    }

    publicMoviesContainer.innerHTML = "";

    data.forEach((movie) => {

        const movieCard =
            document.createElement("article");

        movieCard.innerHTML = `
            ${
                movie.cover_url
                    ? `<img src="${movie.cover_url}" alt="${movie.title} cover">`
                    : ""
            }

            <h3>${movie.title}</h3>

            <p><strong>Director:</strong> ${movie.director || "-"}</p>

            <p><strong>Genre:</strong> ${movie.genre || "-"}</p>

            <p><strong>Format:</strong> ${movie.format || "-"}</p>

            <p><strong>Year:</strong> ${movie.release_year || "-"}</p>
        `;

        publicMoviesContainer.append(movieCard);
    });
}

loadPublicMovies();
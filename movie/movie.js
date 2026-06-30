const socket = io("https://for-pri.onrender.com");

const addMovieBtn = document.getElementById("addMovieBtn");
const pickMovieBtn = document.getElementById("pickMovieBtn");

const movieList = document.getElementById("movieList");
const pickedMovie = document.getElementById("pickedMovie");
const movieModal = document.getElementById("movieModal");

const movieInput = document.getElementById("movieInput");
const searchResults = document.getElementById("searchResults");
let searchTimeout;

const searchMovieBtn = document.getElementById("searchMovieBtn");

const cancelMovieBtn = document.getElementById("cancelMovieBtn");

let movies = [];

async function loadMovies(){

    const response = await fetch(
        "https://for-pri.onrender.com/movies"
    );

    movies = await response.json();

    renderMovies();

}

addMovieBtn.onclick = () => {

    movieModal.style.display = "flex";

    movieInput.value = "";

    movieInput.focus();

};
cancelMovieBtn.onclick = () => {

    movieModal.style.display = "none";

};
searchMovieBtn.onclick = async () => {

    const title = movieInput.value.trim();

    if(!title) return;

    const response = await fetch(

        `https://for-pri.onrender.com/search-movie?q=${encodeURIComponent(title)}`

    );

    const results = await response.json();

    if(results.length === 0){

        alert("Movie not found 😢");

        return;

    }

    const movie = results[0];

    socket.emit("add-movie",{

        tmdbId: movie.id,

        title: movie.title,

        poster: movie.poster_path,

        backdrop: movie.backdrop_path,

        overview: movie.overview,

        genres: movie.genre_ids.join(","),

        rating: movie.vote_average,

        year: movie.release_date

    });

    movieModal.style.display = "none";

};
function renderMovies(){

    movieList.innerHTML = "";

    movies.forEach(movie => {

        const div = document.createElement("div");

        div.className = "movie";

        div.innerHTML = `

            <img
                class="poster"
                src="https://image.tmdb.org/t/p/w300${movie.poster}"
            >

            <h3>${movie.title}</h3>

            <p>⭐ ${(movie.rating ?? 0).toFixed(1)}</p>

<p>${movie.year ? movie.year.substring(0,4) : ""}</p>
${
    movie.watched
    ?
    `
        <p class="watched">
            ✅ Last watched<br>
            ${new Date(movie.lastWatched).toLocaleDateString()}
        </p>
    `
    :
    `
        <button
            class="watchMovie"
            data-id="${movie.id}"
        >
            ✅ Mark Watched
        </button>
    `
}

<button
    class="deleteMovie"
    data-id="${movie.id}"
>
    🗑 Remove
</button>

        

        `;

        movieList.appendChild(div);
        const watchBtn = div.querySelector(".watchMovie");

if(watchBtn){

    watchBtn.onclick = () => {

        socket.emit("mark-watched", movie.id);

    };

}
        div.querySelector(".deleteMovie").onclick = () => {

    if(confirm(`Remove "${movie.title}"?`)){

        socket.emit("delete-movie", movie.id);

    }

};

    });

}

socket.on("movie-list", list => {

    movies = list;

    renderMovies();

});

movieInput.addEventListener("input", () => {

    console.log("Typing:", movieInput.value);

    clearTimeout(searchTimeout);

    const query = movieInput.value.trim();

    if(query.length < 2){

        searchResults.innerHTML = "";

        return;

    }

    searchTimeout = setTimeout(async () => {

        const response = await fetch(

            `https://for-pri.onrender.com/search-movie?q=${encodeURIComponent(query)}`

        );

        const results = await response.json();

        searchResults.innerHTML = "";

        results.slice(0,5).forEach(movie => {

            const div = document.createElement("div");

            div.className = "searchResult";

            div.innerHTML = `

                <img
                    src="https://image.tmdb.org/t/p/w92${movie.poster_path}"
                >

                <div>

                    <strong>${movie.title}</strong><br>

                    ${movie.release_date?.substring(0,4) || ""}

                </div>

            `;

            div.onclick = () => {

    socket.emit("add-movie",{

        tmdbId: movie.id,

        title: movie.title,

        poster: movie.poster_path,

        backdrop: movie.backdrop_path,

        overview: movie.overview,

        genres: movie.genre_ids.join(","),

        rating: movie.vote_average,

        year: movie.release_date

    });

    movieModal.style.display = "none";

    searchResults.innerHTML = "";

    movieInput.value = "";

};

            searchResults.appendChild(div);

        });

    },300);

});


pickMovieBtn.onclick = () => {

    const unwatched = movies.filter(movie => movie.watched === 0);

    if(unwatched.length === 0){

        alert("🎉 You've watched everything!");

        return;

    }

    const movie = unwatched[

        Math.floor(Math.random() * unwatched.length)

    ];

    pickedMovie.innerHTML = `

        <h2>🍿 Tonight's Movie</h2>

        <img
            class="poster"
            src="https://image.tmdb.org/t/p/w300${movie.poster}"
        >

        <h2>${movie.title}</h2>

        <p>⭐ ${(movie.rating ?? 0).toFixed(1)}</p>

        <button id="watchedBtn">
            ✅ Mark as Watched
        </button>

        <button id="rerollBtn">
            🎲 Pick Again
        </button>

    `;

    document.getElementById("watchedBtn").onclick = () => {

    socket.emit("mark-watched", movie.id);

    pickedMovie.innerHTML = "";

};

document.getElementById("rerollBtn").onclick = () => {

    pickMovieBtn.click();

};

};



loadMovies();
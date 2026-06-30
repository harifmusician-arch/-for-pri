const socket = io("https://for-pri.onrender.com");

const addMovieBtn = document.getElementById("addMovieBtn");
const pickMovieBtn = document.getElementById("pickMovieBtn");

const movieList = document.getElementById("movieList");
const pickedMovie = document.getElementById("pickedMovie");
const movieModal = document.getElementById("movieModal");

const movieInput = document.getElementById("movieInput");

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
searchMovieBtn.onclick = () => {

    const title = movieInput.value.trim();

    if(!title) return;

    socket.emit("add-movie", {

        title

    });

    movieModal.style.display = "none";

};
function renderMovies(){

    movieList.innerHTML = "";

    movies.forEach(movie => {

        const div = document.createElement("div");

        div.className = "movie";

        div.innerHTML = `🎬 ${movie.title}`;

        movieList.appendChild(div);

    });

}

socket.on("movie-list", list => {

    movies = list;

    renderMovies();

});

loadMovies();
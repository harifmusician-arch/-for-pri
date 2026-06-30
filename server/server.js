
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const http = require("http");
const { Server } = require("socket.io");
const db = require("./database");
const session = require("express-session");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const path = require("path");

app.use(express.static(path.join(__dirname, "..")));

const io = new Server(server, {


cors: {

    origin: "*"

}


});

app.use(cors());
app.use(express.json());

app.use(session({

    secret: process.env.SESSION_SECRET || "super-secret",

    resave: false,

    saveUninitialized: false,

    cookie: {

        maxAge: 1000 * 60 * 60 * 24 * 30

    }

}));





app.use(

    "/uploads",

    express.static("uploads")

);

app.post("/login", (req, res) => {

    const { password } = req.body;

    if(password === process.env.SITE_PASSWORD){

        req.session.loggedIn = true;

        return res.json({

            success: true

        });

    }

    res.status(401).json({

        success: false,

        message: "Wrong password"

    });

});

function requireLogin(req, res, next){

    if(req.session.loggedIn){

        return next();

    }

    res.redirect("/");

}

/* ===========================
HOME
=========================== */

app.get("/", (req, res) => {


res.send("🎬 Pri Cinema Backend Running ❤️");


});

app.get("/intro.html", requireLogin, (req, res) => {

    res.sendFile(path.join(__dirname, "..", "intro.html"));

});

app.get("/home.html", requireLogin, (req, res) => {

    res.sendFile(path.join(__dirname, "..", "home.html"));

});

app.get("/cinema.html", requireLogin, (req, res) => {

    res.sendFile(path.join(__dirname, "..", "cinema.html"));

});

app.get("/chat.html", requireLogin, (req, res) => {

    res.sendFile(path.join(__dirname, "..", "chat.html"));

});

app.get("/pet.html", requireLogin, (req, res) => {

    res.sendFile(path.join(__dirname, "..", "pet.html"));

});

/* ===========================
LOAD MOVIES
=========================== */

app.get("/movies", (req, res) => {

    db.all(

        "SELECT * FROM movies ORDER BY id DESC",

        [],

        (err, rows) => {

            if(err){

                return res.status(500).json(err);

            }

            res.json(rows);

        }

    );

});

/* ===========================
SEARCH TMDB
=========================== */

app.get("/search-movie", async (req, res) => {

    try{

        const response = await axios.get(

            "https://api.themoviedb.org/3/search/movie",

            {

                headers: {

                    Authorization: `Bearer ${process.env.TMDB_BEARER}`

                },

                params: {

                    query: req.query.q

                }

            }

        );

        res.json(response.data.results);

    }

    catch(err){

        console.error(err.response?.data || err.message);

        res.status(500).json({

            error:"TMDB Error"

        });

    }

});

/* ===========================
LOAD ALL MESSAGES
=========================== */

app.get("/messages", (req, res) => {


db.all(

    "SELECT * FROM messages ORDER BY id ASC",

    [],

    (err, rows) => {

        if(err){

            return res.status(500).json(err);

        }

        res.json(rows);

    }

);


});

/* ===========================
CREATE HYPERBEAM ROOM
=========================== */

app.post("/create-room", async (req, res) => {


try{

    const response = await axios.post(

        "https://engine.hyperbeam.com/v0/vm",

        {

            start_url: "https://www.netflix.com",

            kiosk: false,

            offline_timeout: 1800

        },

        {

            headers: {

                Authorization:
                `Bearer ${process.env.HYPERBEAM_API_KEY}`

            }

        }

    );

    res.json({

        success: true,

        roomId: response.data.session_id,

        roomUrl: response.data.embed_url

    });

}

catch(error){

    console.error(

        error.response?.data ||

        error.message

    );

    res.status(500).json({

        success:false,

        error:"Couldn't create room"

    });

}


});


/* ===========================
SOCKET.IO
=========================== */

const users = {};


io.on("connection", socket => {



socket.on("add-movie", movie => {

   db.run(

    `INSERT INTO movies(

        tmdbId,

        title,

        poster,

        backdrop,

        overview,

        genres,

        rating,

        year,

        addedAt

    )

    VALUES(?,?,?,?,?,?,?,?,?)`,

    [

        movie.tmdbId,

        movie.title,

        movie.poster,

        movie.backdrop,

        movie.overview,

        movie.genres,

        movie.rating,

        movie.year,

        new Date().toISOString()

    ],

        function(err){

            if(err){

                console.error(err);

                return;

            }

            db.all(

                "SELECT * FROM movies ORDER BY id DESC",

                [],

                (err, rows) => {

                    if(err){

                        console.error(err);

                        return;

                    }

                    io.emit("movie-list", rows);

                }

            );

        }

    );

});
socket.on("delete-movie", id => {

    db.run(

        "DELETE FROM movies WHERE id = ?",

        [id],

        err => {

            if(err){

                console.error(err);

                return;

            }

            db.all(

                "SELECT * FROM movies ORDER BY id DESC",

                [],

                (err, rows) => {

                    if(err){

                        console.error(err);

                        return;

                    }

                    io.emit("movie-list", rows);

                }

            );

        }

    );

});
socket.on("mark-watched", id => {

    console.log("Mark watched:", id);

    db.run(

        `UPDATE movies

        SET watched = 1,

            lastWatched = ?

        WHERE id = ?`,

        [

            new Date().toISOString(),

            id

        ],

        err => {

            if(err){

                console.error(err);

                return;

            }

            db.all(

                "SELECT * FROM movies ORDER BY id DESC",

                [],

                (err, rows) => {

                    if(err){

                        console.error(err);

                        return;

                    }

                    io.emit("movie-list", rows);

                }

            );

        }

    );

});

console.log("❤️ User Connected");
socket.on("register-user", username => {

    users[username] = socket.id;

    console.log(username, "registered:", socket.id);

});

io.emit(

    "online-count",

    io.engine.clientsCount

);

socket.on("chat-message", data => {

    db.run(

        `INSERT INTO messages
        (username,message,timestamp)
        VALUES (?,?,?)`,

        [

           [
    data.username,

    data.text || data.image,

    new Date().toISOString()
]

        ]

    );

    io.emit(

        "chat-message",

        data

    );

});

socket.on("typing", username => {

    socket.broadcast.emit(

        "typing",

        username

    );

});

socket.on("call-user", data => {

    socket.broadcast.emit("incoming-call", data);

});

socket.on("call-user", data => {

    socket.broadcast.emit("incoming-call", data);

});

socket.on("disconnect", () => {

    console.log("💔 User Disconnected");

    io.emit(

        "online-count",

        io.engine.clientsCount

    );

});


});

/* ===========================
START SERVER
=========================== */

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {


console.log(

    `🚀 Server running on port ${PORT}`

);


});

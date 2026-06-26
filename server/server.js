const multer = require("multer");
const path = require("path");
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const http = require("http");
const { Server } = require("socket.io");
const db = require("./database");

require("dotenv").config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {


cors: {

    origin: "*"

}


});

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, "uploads/");

    },

    filename: (req, file, cb) => {

        cb(

            null,

            Date.now() +

            path.extname(file.originalname)

        );

    }

});

const upload = multer({

    storage

});

app.use(

    "/uploads",

    express.static("uploads")

);

/* ===========================
HOME
=========================== */

app.get("/", (req, res) => {


res.send("🎬 Pri Cinema Backend Running ❤️");


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

app.post(

    "/upload",

    upload.single("image"),

    (req, res) => {

        if (!req.file) {

            return res.status(400).json({

                success: false

            });

        }

        res.json({

            success: true,

            imageUrl:

            `https://for-pri.onrender.com/uploads/${req.file.filename}`

        });

    }

);

/* ===========================
SOCKET.IO
=========================== */

io.on("connection", socket => {


console.log("❤️ User Connected");

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

            data.username,

            data.text,

            new Date().toISOString()

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

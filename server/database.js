const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./chat.db");

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS messages (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            username TEXT,

            message TEXT,

            timestamp TEXT

        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS movies (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            tmdbId INTEGER,

            title TEXT,

            poster TEXT,

            backdrop TEXT,

            overview TEXT,

            genres TEXT,

            rating REAL,

            runtime INTEGER,

            year TEXT,

            watched INTEGER DEFAULT 0,

            favorite INTEGER DEFAULT 0,

            addedAt TEXT

        )
    `);

});

module.exports = db;
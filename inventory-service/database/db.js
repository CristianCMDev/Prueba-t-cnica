
const Database = require("better-sqlite3");
const path = require("node:path");

const db = new Database(
    path.join(__dirname, "inventory.db")
);

db.pragma("foreign_keys = ON");

db.exec(`
    CREATE TABLE IF NOT EXISTS stock (
        sku TEXT PRIMARY KEY,
        available INTEGER
    );

    CREATE TABLE IF NOT EXISTS ProcessedEvents (
        eventId TEXT PRIMARY KEY,
        processedAt TEXT NOT NULL
    );

`);

module.exports = db;

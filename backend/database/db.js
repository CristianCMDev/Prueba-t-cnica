const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "app.db"));

db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nameClient TEXT,
    sku TEXT,
    amount INTEGER,
    state INTEGER,
    createdAt TEXT
  );

`);

module.exports = db;
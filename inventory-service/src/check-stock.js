const db = require("../database/db");

const stock = db.prepare("SELECT * FROM stock").all();

console.table(stock);

db.close();
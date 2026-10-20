require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("../database/db");

const app = express();

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
];

app.use(cors({
    origin: allowedOrigins
}));

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({ message: "Back funcionando" });
});

//Stock
app.get("/api/stock", (req, res) => {
    const stock = db.prepare("SELECT * FROM stock").all();

    res.json(stock);
});


//products
app.get("/api/products", (req, res) => {
    const products = db.prepare("SELECT substr(sku, 1, instr(sku, '#') - 1) AS name, sku FROM stock").all();
    res.json(products);
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Inventory Service en http://localhost:${PORT}`);
});
require("dotenv").config();
require("../database/seed");

const express = require("express");
const cors = require("cors");
const db = require("../database/db");

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173"
}));

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({ message: "Back funcionando" });
});

//Orders
app.get("/api/orders", (req, res) => {
    const orders = db.prepare("SELECT * FROM orders").all();

    res.json(orders);
});


//Stock
app.get("/api/stock", (req, res) => {
    const stock = db.prepare("SELECT * FROM stock").all();

    res.json(stock);
});




const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
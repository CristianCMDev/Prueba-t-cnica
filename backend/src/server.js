require("dotenv").config();
const { connectRabbitMQ } = require("./rabbitmq");
const { publishOrderCreated } = require("./rabbitmq");
const createdAt = new Date().toISOString();

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

//Orders
app.get("/api/orders", (req, res) => {
    const orders = db.prepare("SELECT * FROM orders").all();

    res.json(orders);
});

app.post("/api/orders", async (req, res) => {
    const { nameClient, sku, amount } = req.body;

    if (
        typeof nameClient !== "string" ||
        !nameClient.trim() ||
        typeof sku !== "string" ||
        !sku.trim() ||
        !Number.isInteger(amount) ||
        amount <= 0 || amount > 100
    ) {
        return res.status(400).json({
            message: "Los datos del pedido son inválidos"
        });
    }

    const result = db.prepare(`
    INSERT INTO orders (nameClient, sku, amount, state, createdAt)
    VALUES (?, ?, ?, ?, ?)
  `).run(nameClient, sku, amount, 0, createdAt);

    const order = {
        id: result.lastInsertRowid,
        sku: sku.trim(),
        amount
    };


    const event = await publishOrderCreated(order);


    res.status(201).json({
        message: "Orden creada correctamente",
        id: result.lastInsertRowid,
        eventId: event.eventId
    });

});


const PORT = process.env.PORT || 3001;

async function startServer() {
    try {
        await connectRabbitMQ();

        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("No se pudo iniciar el servidor:", error.message);
        process.exit(1);
    }
}

startServer();
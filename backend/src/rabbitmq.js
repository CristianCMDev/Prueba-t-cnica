
const amqp = require("amqplib");
const crypto = require("node:crypto");

let connection;
let channel;

async function connectRabbitMQ() {
    if (channel) {
        return channel;
    }

    const url = process.env.RABBITMQ_URL;

    if (!url) {
        throw new Error("Falta configurar RABBITMQ_URL en .env");
    }

    connection = await amqp.connect(url);
    channel = await connection.createChannel();

    await channel.assertQueue("orders.created", {
        durable: true
    });

    console.log("Conectado a RabbitMQ");
    console.log("Cola orders.created preparada");

    connection.on("error", (error) => {
        console.error("Error en RabbitMQ:", error.message);
    });

    connection.on("close", () => {
        connection = null;
        channel = null;
        console.log("Conexión RabbitMQ cerrada");
    });

    return channel;
}


function publishOrderCreated(order) {
    if (!channel) {
        throw new Error("RabbitMQ no está conectado");
    }

    const event = {
        eventId: crypto.randomUUID(),
        orderId: order.id,
        sku: order.sku,
        cantidad: order.amount,
        ocurridoEn: new Date().toISOString()
    };

    channel.sendToQueue(
        "orders.created",
        Buffer.from(JSON.stringify(event)),
        {
            persistent: true,
            contentType: "application/json"
        }
    );

    return event;
}


module.exports = {
    connectRabbitMQ,
    publishOrderCreated
};


require("dotenv").config();
require("../database/seed");
const amqp = require("amqplib");
const db = require("../database/db");


async function startConsumer() {
    const connection = await amqp.connect(
        process.env.RABBITMQ_URL ||
        "amqp://admin:local_dev_password@localhost:5672"
    );

    const channel = await connection.createChannel();

    await channel.assertQueue("orders.created", {
        durable: true
    });

    await channel.assertQueue("stock.reserved", {
        durable: true
    });

    await channel.assertQueue("stock.rejected", {
        durable: true
    });

    await channel.prefetch(1);

    console.log("Inventory Worker conectado a RabbitMQ");
    console.log("Esperando órdenes...");

    channel.consume("orders.created", (message) => {
        if (!message) return;

        try {
            const event = JSON.parse(message.content.toString());

            if (
                !event.eventId ||
                !event.orderId ||
                typeof event.sku !== "string" ||
                !Number.isInteger(event.cantidad) ||
                event.cantidad <= 0
            ) {
                channel.nack(message, false, false);
                return;
            }

            const result = db.transaction(() => {
                const processed = db.prepare(`
                    SELECT eventId
                    FROM ProcessedEvents
                    WHERE eventId = ?
                `).get(event.eventId);

                if (processed) {
                    return { duplicate: true };
                }

                const stock = db.prepare(`
                    SELECT available
                    FROM stock
                    WHERE sku = ?
                `).get(event.sku);

                let status;

                if (stock && stock.available >= event.cantidad) {
                    db.prepare(`
                        UPDATE stock
                        SET available = available - ?
                        WHERE sku = ?
                    `).run(event.cantidad, event.sku);

                    console.log(event.cantidad + " " + event.sku)
                    

                    status = "reserved";
                } else {
                    status = "rejected";
                }

                db.prepare(`
                    INSERT INTO ProcessedEvents (eventId, processedAt)
                    VALUES (?, ?)
                `).run(event.eventId, new Date().toISOString());

                return { duplicate: false, status };
            })();

            if (result.duplicate) {
                console.log("Evento duplicado ignorado:", event.eventId);
                channel.ack(message);
                return;
            }

            const resultEvent = {
                eventId: event.eventId,
                orderId: event.orderId,
                sku: event.sku,
                cantidad: event.cantidad,
                ocurridoEn: new Date().toISOString()
            };

            const queue = result.status === "reserved"
                ? "stock.reserved"
                : "stock.rejected";

            channel.sendToQueue(
                queue,
                Buffer.from(JSON.stringify(resultEvent)),
                {
                    persistent: true,
                    contentType: "application/json"
                }
            );

            console.log(
                result.status === "reserved"
                    ? "Stock reservado:"
                    : "Stock rechazado:",
                event.orderId
            );

            channel.ack(message);
        } catch (error) {
            console.error("Error procesando la orden:", error);
            channel.nack(message, false, true);
        }
    });
}

startConsumer().catch((error) => {
    console.error("Error iniciando el consumidor:", error);
    process.exit(1);
});

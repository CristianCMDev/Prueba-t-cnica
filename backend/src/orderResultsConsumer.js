
require("dotenv").config();

const amqp = require("amqplib");
const db = require("../database/db");

async function startOrderResultsConsumer() {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL ||
    "amqp://admin:local_dev_password@localhost:5672"
  );

  const channel = await connection.createChannel();

  await channel.assertQueue("stock.reserved", {
    durable: true,
  });

  await channel.assertQueue("stock.rejected", {
    durable: true,
  });

  await channel.prefetch(1);

  async function consumeResult(queue, state) {
    await channel.consume(queue, (message) => {
      if (!message) return;

      try {
        const event = JSON.parse(message.content.toString());
        const orderId = Number(event.orderId);

        if (!Number.isInteger(orderId) || orderId <= 0) {
          channel.nack(message, false, false);
          return;
        }

        const result = db.prepare(`
          UPDATE orders
          SET state = ?
          WHERE id = ?
        `).run(state, orderId);

        if (result.changes === 0) {
          console.error("No se encontró el pedido:", orderId);
        } else {
          console.log(
            `Pedido ${orderId} actualizado a ${
              state === 1 ? "Confirmado" : "Denegado"
            }`
          );
        }

        channel.ack(message);
      } catch (error) {
        console.error("Error procesando resultado:", error);
        channel.nack(message, false, true);
      }
    });
  }

  await consumeResult("stock.reserved", 1);
  await consumeResult("stock.rejected", 2);

  console.log("Esperando resultados del inventario...");
}

startOrderResultsConsumer().catch((error) => {
  console.error("Error iniciando consumidor de resultados:", error);
  process.exit(1);
});

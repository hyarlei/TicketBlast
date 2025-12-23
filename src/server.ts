import express from "express"
import amqp from "amqplib"
import dotenv from "dotenv"
import cors from "cors"
import redisClient from "./redis"
import { startWorker } from "./worker"
import prisma from "./lib/prisma.config"
import { ticketSchema } from "./schemas/ticketSchema"
import { rateLimiterMiddleware } from "./middlewares/rateLimiter"

dotenv.config();

const app = express();
app.set("trust proxy", 1);
app.use(cors());
app.use(express.json());

const QUEUE_NAME = "fila_ingressos";

startWorker().catch((err) =>
  console.error("Erro fatal ao iniciar worker embutido:", err)
);

async function startServer() {
  try {
    const rabbitUrl =
      process.env.RABBITMQ_URL || "";
    const connection = await amqp.connect(rabbitUrl);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });

    app.post("/buy-ticket", rateLimiterMiddleware, async (req, res) => {
      const validation = ticketSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          message: "Dados inválidos",
          details: validation.error.format()
        });
      }

      const { name, email, ticketType } = validation.data;

      try {
        await redisClient.decr("ingressos_disponíveis");

        const orderId = Math.floor(Math.random() * 10000);

        try {
          await prisma.ticket.create({
            data: {
              orderId: orderId,
              name: name,
              email: email,
              type: ticketType,
              status: "PENDING",
            },
          });
          console.log(`[DB] Pedido ${orderId} salvo no banco.`);
        } catch (dbErr) {
          console.error(
            "Erro ao salvar pedido no banco (mas seguindo com a fila):",
            dbErr
          );
        }

        const order = {
          orderId,
          name,
          email,
          ticketType,
          date: new Date().toISOString(),
        };

        channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(order)));

        console.log(`[API] Pedido ${order.orderId} enviado para a fila!`);

        return res.status(202).json({
          message: "Pedido em processamento!",
          orderId: order.orderId,
        });
      } catch (err) {
        console.error("Erro na rota:", err);
        return res.status(500).json({ message: "Erro interno no servidor" });
      }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API conectada na fila: ${QUEUE_NAME}`);
    });
  } catch (error) {
    console.error("Erro fatal ao iniciar servidor:", error);
  }
}

startServer();

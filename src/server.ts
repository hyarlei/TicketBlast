import express from 'express';
import amqp from 'amqplib';
import dotenv from 'dotenv';
import redisClient from './redis';

dotenv.config();

const app = express();
app.use(express.json());

const QUEUE_NAME = 'fila_ingressos';

async function startServer() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672');
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    app.post('/buy-ticket', async (req, res) => {
      const { name, email, ticketType } = req.body;

      // 1. CHECAGEM DE ESTOQUE NO REDIS
      // O comando 'decr' diminui o valor em 1 e retorna o novo valor.
      // É uma operação "atômica" (segura contra concorrência).
      const estoqueRestante = await redisClient.decr('ingressos_disponiveis');

      // Se o estoque ficou negativo, significa que acabou
      if (estoqueRestante < 0) {
        console.log(`[API] Compra negada para ${name}. Estoque esgotado!`);
        return res.status(400).json({ message: 'Ingressos esgotados! 😢' });
      }

      const order = {
        name,
        email,
        ticketType,
        orderId: Math.floor(Math.random() * 1000),
        date: new Date().toISOString()
      };

      channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(order)));

      console.log(`[API] Pedido ${order.orderId} enviado! Estoque restante no cache: ${estoqueRestante}`);

      return res.status(202).json({ 
        message: 'Pedido em processamento!',
        orderId: order.orderId
      });
    });

    app.listen(3000, () => console.log('🚀 Server running on port 3000'));

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

startServer();
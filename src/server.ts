import express from 'express';
import amqp from 'amqplib';
import dotenv from 'dotenv';
import cors from 'cors';
import redisClient from './redis';
import { startWorker } from './worker';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const QUEUE_NAME = 'fila_ingressos';

startWorker().catch(err => console.error('❌ Erro fatal ao iniciar worker embutido:', err));

async function startServer() {
  try {
    const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672';
    const connection = await amqp.connect(rabbitUrl);
    const channel = await connection.createChannel();
    
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    app.post('/buy-ticket', async (req, res) => {
      const { name, email, ticketType } = req.body;

      try {
        const estoqueRestante = await redisClient.decr('ingressos_disponíveis');
        
        // if (estoqueRestante < -100) {
        //    console.log(`[API] Compra negada para ${name}. Estoque: ${estoqueRestante}`);
        // }

        const order = {
          orderId: Math.floor(Math.random() * 10000),
          name,
          email,
          ticketType,
          date: new Date().toISOString()
        };

        channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(order)));

        console.log(`[API] Pedido ${order.orderId} enviado para a fila!`);

        return res.status(202).json({ 
          message: 'Pedido em processamento!',
          orderId: order.orderId
        });

      } catch (err) {
        console.error('Erro na rota:', err);
        return res.status(500).json({ message: 'Erro interno no servidor' });
      }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🐰 API conectada na fila: ${QUEUE_NAME}`);
    });

  } catch (error) {
    console.error('❌ Erro fatal ao iniciar servidor:', error);
  }
}

startServer();
import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const QUEUE_NAME = 'fila_ingressos';

async function startWorker() {
  try {
    console.log('👷 Worker iniciado! Aguardando mensagens...');

    // 1. Conecta no mesmo RabbitMQ
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672');
    const channel = await connection.createChannel();

    // 2. Garante que a fila existe (caso o worker inicie antes da API)
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    
    // 3. Define quantos pedidos esse worker pega por vez (Prefetch)
    // Isso é CRUCIAL: diz "só me mande 1 por vez, não me sobrecarregue"
    channel.prefetch(1);

    // 4. Começa a consumir a fila
    console.log('👀 Ouvindo a fila...');
    
    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg !== null) {
        // Transforma o Buffer de volta para JSON
        const order = JSON.parse(msg.content.toString());

        console.log(`\n[PROCESSANDO] Pedido ${order.orderId} de ${order.name}...`);

        // SIMULAÇÃO DE PROCESSAMENTO PESADO (Banco de Dados, Pagamento, Email)
        // Vamos fingir que isso demora 5 segundos
        await new Promise(resolve => setTimeout(resolve, 5000));

        console.log(`✅ [SUCESSO] Pedido ${order.orderId} confirmado!`);

        // 5. O PULO DO GATO: O "Ack" (Acknowledge)
        // Avisa o RabbitMQ: "Já terminei esse, pode apagar da fila e me mandar o próximo"
        channel.ack(msg);
      }
    });

  } catch (error) {
    console.error('❌ Erro no Worker:', error);
  }
}

startWorker();
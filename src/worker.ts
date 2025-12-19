import amqp from 'amqplib';
import dotenv from 'dotenv';
import PDFDocument from 'pdfkit';
import { uploadPdf } from './storage';

dotenv.config();

const QUEUE_NAME = 'fila_ingressos';

async function startWorker() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672');
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    
    // Define quantas mensagens o worker processa por vez (1 para evitar sobrecarga)
    channel.prefetch(1);

    console.log('👷 Worker iniciado! Aguardando mensagens...');

    channel.consume(QUEUE_NAME, async (msg) => {
      if (!msg) return;

      const order = JSON.parse(msg.content.toString());
      console.log(`[PROCESSANDO] Pedido ${order.orderId} de ${order.name}...`);

      try {
        // 1. GERAR O PDF EM MEMÓRIA (BUFFER)
        const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
          const doc = new PDFDocument();
          const buffers: any[] = [];

          // Coleta os dados do PDF
          doc.on('data', (chunk) => buffers.push(chunk));
          doc.on('end', () => resolve(Buffer.concat(buffers)));
          doc.on('error', reject);

          // Desenha o Ingresso
          doc.fontSize(25).text('TICKET BLAST 🎫', 100, 50);
          doc.fontSize(14).text(`Ingresso Confirmado!`, 100, 100);
          doc.text(`Nome: ${order.name}`);
          doc.text(`Tipo: ${order.ticketType}`);
          doc.text(`ID do Pedido: ${order.orderId}`);
          doc.text(`Data: ${new Date().toLocaleString()}`);
          
          doc.end(); // Finaliza o PDF
        });

        // 2. UPLOAD PARA O S3 (LOCALSTACK)
        const fileName = `ingresso-${order.orderId}.pdf`;
        const s3Url = await uploadPdf(fileName, pdfBuffer);

        console.log(`✅ [SUCESSO] PDF Salvo: ${s3Url}`);

        // Aqui você atualizaria o Banco de Dados com a URL...

        channel.ack(msg); // Confirma que terminou
      } catch (error) {
        console.error('❌ Erro ao processar:', error);
        // channel.nack(msg); // Opcional: Devolve para a fila se der erro
      }
    });

  } catch (error) {
    console.error('Erro no Worker:', error);
  }
}

startWorker();
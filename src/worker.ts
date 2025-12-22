import amqp from "amqplib";
import dotenv from "dotenv";
import PDFDocument from "pdfkit";
import { uploadPdf } from "./storage";
import prisma from "./lib/prisma.config";
import { Resend } from "resend";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const QUEUE_NAME = "fila_ingressos";

export const startWorker = async () => {
  console.log("👷 Iniciando Worker...");
  try {
    const connection = await amqp.connect(
      process.env.RABBITMQ_URL || "amqp://admin:admin@localhost:5672"
    );
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    channel.prefetch(1);

    console.log("👷 Worker iniciado! Aguardando mensagens...");

    channel.consume(QUEUE_NAME, async (msg) => {
      if (!msg) return;

      const order = JSON.parse(msg.content.toString());
      console.log(`[PROCESSANDO] Pedido ${order.orderId} de ${order.name}...`);

      try {
        const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
          const doc = new PDFDocument();
          const buffers: any[] = [];

          doc.on("data", (chunk) => buffers.push(chunk));
          doc.on("end", () => resolve(Buffer.concat(buffers)));
          doc.on("error", reject);

          doc.fontSize(25).text("TICKET BLAST 🎫", 100, 50);
          doc.fontSize(14).text(`Ingresso Confirmado!`, 100, 100);
          doc.text(`Nome: ${order.name}`);
          doc.text(`Tipo: ${order.ticketType}`);
          doc.text(`ID do Pedido: ${order.orderId}`);
          doc.text(`Data: ${new Date().toLocaleString()}`);

          doc.end();
        });

        const fileName = `ingresso-${order.orderId}.pdf`;
        const s3Url = await uploadPdf(fileName, pdfBuffer);

        console.log(`✅ [SUCESSO] PDF Salvo: ${s3Url}`);

        await prisma.ticket.updateMany({
          where: { orderId: order.orderId },
          data: { status: "COMPLETED" },
        });

        console.log(`📧 Enviando e-mail para ${order.email}...`);

        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: "hyarlei@alu.ufc.br",
          subject: `Seu ingresso para o TicketBlast chegou! 🎟️`,
          html: `
            <h1>Olá, ${order.name}!</h1>
            <p>Seu pedido <strong>#${order.orderId}</strong> foi processado com sucesso.</p>
            <p>Seu ingresso está em anexo e também pode ser baixado clicando <a href="${s3Url}">aqui</a>.</p>
            <br>
            <p><em>Equipe TicketBlast 🚀</em></p>
          `,
          attachments: [
            {
              filename: fileName,
              content: pdfBuffer,
            },
          ],
        });

        console.log(`✅ [E-MAIL] Enviado com sucesso!`);
        channel.ack(msg);
      } catch (error) {
        console.error("❌ Erro ao processar:", error);
      }
    });
  } catch (error) {
    console.error("Erro no Worker:", error);
  }
};

if (require.main === module) {
  startWorker();
}

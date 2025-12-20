import { S3Client, PutObjectCommand, CreateBucketCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

// 1. Configuração Inteligente: Lê do Render OU usa padrão local
const awsEndpoint = process.env.AWS_ENDPOINT || 'http://localhost:4566';
const awsRegion = process.env.AWS_REGION || 'us-east-2';
const awsAccessKey = process.env.AWS_ACCESS_KEY_ID || 'test';
const awsSecretKey = process.env.AWS_SECRET_ACCESS_KEY || 'test';
const awsBucket = process.env.AWS_BUCKET || 'ingressos-bucket';

const s3Client = new S3Client({
  region: awsRegion, 
  endpoint: awsEndpoint,
  forcePathStyle: true,
  credentials: {
    accessKeyId: awsAccessKey,     // 👈 AGORA SIM vai ler a chave do Render!
    secretAccessKey: awsSecretKey  // 👈 AGORA SIM vai ler a senha do Render!
  }
});

export const uploadPdf = async (filename: string, fileBuffer: Buffer) => {
  try {
    // Tenta criar o bucket (se não existir)
    // Nota: No Supabase, o bucket já deve estar criado pelo painel, mas mal não faz.
    try {
      await s3Client.send(new CreateBucketCommand({ Bucket: awsBucket }));
    } catch (error: any) {
      // Ignora erro se bucket já existe
    }

    const command = new PutObjectCommand({
      Bucket: awsBucket,
      Key: filename,
      Body: fileBuffer,
      ContentType: 'application/pdf'
    });

    await s3Client.send(command);

    // Retorna a URL pública (ajustada para Supabase ou LocalStack)
    return `${awsEndpoint}/${awsBucket}/${filename}`;
    
  } catch (error) {
    console.error('❌ Erro no upload S3:', error);
    throw error;
  }
};
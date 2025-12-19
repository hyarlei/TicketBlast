import { S3Client, PutObjectCommand, CreateBucketCommand } from '@aws-sdk/client-s3'; // <--- Adicione CreateBucketCommand
import dotenv from 'dotenv';

dotenv.config();

const s3Client = new S3Client({
  region: 'us-east-1',
  endpoint: 'http://localhost:4566',
  forcePathStyle: true,
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test'
  }
});

export const uploadPdf = async (filename: string, fileBuffer: Buffer) => {
  const bucketName = 'ingressos-bucket';

  try {
    // 1. Tenta criar o bucket antes de subir (Se já existir, o S3 ignora ou dá erro que tratamos)
    try {
        await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
    } catch (error: any) {
        // Se o erro for "BucketAlreadyOwnedByYou", seguimos o baile.
        if (error.name !== 'BucketAlreadyOwnedByYou' && error.name !== 'BucketAlreadyExists') {
             console.log('⚠️ Aviso: Bucket já existe ou erro ignorável.');
        }
    }

    // 2. Faz o Upload
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: filename,
      Body: fileBuffer,
      ContentType: 'application/pdf'
    });

    await s3Client.send(command);
    console.log(`✅ Upload feito no S3: ${filename}`);
    
    return `http://localhost:4566/${bucketName}/${filename}`;
  } catch (error) {
    console.error('❌ Erro no upload S3:', error);
    throw error;
  }
};
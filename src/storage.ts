import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
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
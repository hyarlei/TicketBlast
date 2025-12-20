import { S3Client, PutObjectCommand, CreateBucketCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const awsEndpoint = process.env.AWS_ENDPOINT || 'http://localhost:4566';

const s3Client = new S3Client({
  region: 'us-east-1',
  endpoint: awsEndpoint,
  forcePathStyle: true,
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test'
  }
});

export const uploadPdf = async (filename: string, fileBuffer: Buffer) => {
  const bucketName = 'ingressos-bucket';

  try {
    try {
        await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
    } catch (error: any) {
        if (error.name !== 'BucketAlreadyOwnedByYou' && error.name !== 'BucketAlreadyExists') {
             console.log('⚠️ Aviso: Bucket já existe ou erro ignorável.');
        }
    }

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
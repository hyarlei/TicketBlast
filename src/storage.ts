import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const awsEndpoint = process.env.AWS_ENDPOINT || "http://localhost:4566";
const awsRegion = process.env.AWS_REGION || "us-east-2";
const awsAccessKey = process.env.AWS_ACCESS_KEY_ID || "test";
const awsSecretKey = process.env.AWS_SECRET_ACCESS_KEY || "test";
const awsBucket = process.env.AWS_BUCKET || "ingressos-bucket";

const s3Client = new S3Client({
  region: awsRegion,
  endpoint: awsEndpoint,
  forcePathStyle: true,
  credentials: {
    accessKeyId: awsAccessKey,
    secretAccessKey: awsSecretKey,
  },
});

export const uploadPdf = async (filename: string, fileBuffer: Buffer) => {
  try {
    try {
      await s3Client.send(new CreateBucketCommand({ Bucket: awsBucket }));
    } catch (error: any) {}

    const command = new PutObjectCommand({
      Bucket: awsBucket,
      Key: filename,
      Body: fileBuffer,
      ContentType: "application/pdf",
    });

    await s3Client.send(command);

    if (awsEndpoint.includes("supabase.co")) {
      const publicEndpoint = awsEndpoint.replace("/s3", "/object/public");
      return `${publicEndpoint}/${awsBucket}/${filename}`;
    }

    return `${awsEndpoint}/${awsBucket}/${filename}`;
  } catch (error) {
    console.error("❌ Erro no upload S3:", error);
    throw error;
  }
};

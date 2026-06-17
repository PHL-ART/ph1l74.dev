// src/shared/lib/s3.ts
import { S3Client } from '@aws-sdk/client-s3';

export const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT!,
  region: process.env.S3_REGION ?? 'default',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  forcePathStyle: false,
});

export const S3_BUCKET = process.env.S3_BUCKET!;
export const S3_PUBLIC_URL = process.env.S3_PUBLIC_URL!;

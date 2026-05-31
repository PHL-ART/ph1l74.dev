// app/api/admin/upload/presign/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { adminAuth } from '@/shared/lib/admin-auth';
import { s3, S3_BUCKET, S3_PUBLIC_URL } from '@/shared/lib/s3';

export async function POST(request: NextRequest) {
  const auth = adminAuth.require(request);
  if (!auth.ok) return auth.response;

  const { filename, contentType, projectId } = await request.json();

  if (!filename || !contentType || !projectId) {
    return NextResponse.json(
      { error: 'filename, contentType and projectId are required' },
      { status: 400 },
    );
  }

  const ext = String(filename).split('.').pop() ?? 'bin';
  const key = `projects/${projectId}/${randomUUID()}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
  const publicUrl = `${S3_PUBLIC_URL}/${key}`;

  return NextResponse.json({ uploadUrl, publicUrl, key });
}

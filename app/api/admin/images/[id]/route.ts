import { NextRequest, NextResponse } from 'next/server';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import prisma from '@/shared/api/database/prisma';
import { adminAuth } from '@/shared/lib/admin-auth';
import { s3, S3_BUCKET, S3_PUBLIC_URL } from '@/shared/lib/s3';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = adminAuth.require(request);
  if (!auth.ok) return auth.response;

  const imageId = Number(params.id);
  if (Number.isNaN(imageId)) {
    return NextResponse.json({ error: 'Invalid image id' }, { status: 400 });
  }

  const { url, alt, order } = await request.json();
  if (!url) {
    return NextResponse.json({ error: 'url is required' }, { status: 400 });
  }

  try {
    const image = await prisma.image.update({
      where: { id: imageId },
      data: {
        url,
        alt,
        order: order !== undefined ? Number(order) || 0 : undefined,
      },
      include: { project: true },
    });
    return NextResponse.json(image);
  } catch (error) {
    console.error('Failed to update image', error);
    return NextResponse.json({ error: 'Failed to update image' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = adminAuth.require(request);
  if (!auth.ok) return auth.response;

  const imageId = Number(params.id);
  if (Number.isNaN(imageId)) {
    return NextResponse.json({ error: 'Invalid image id' }, { status: 400 });
  }

  try {
    const image = await prisma.image.findUnique({ where: { id: imageId } });
    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Remove from S3 if the URL belongs to our bucket
    if (image.url.startsWith(S3_PUBLIC_URL)) {
      const key = new URL(image.url).pathname.slice(1);
      await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: key }));
    }

    await prisma.image.delete({ where: { id: imageId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete image', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}


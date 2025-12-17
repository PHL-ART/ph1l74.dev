import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/shared/api/database/prisma';
import { adminAuth } from '@/shared/lib/admin-auth';

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
    await prisma.image.delete({ where: { id: imageId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete image', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}


import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/shared/api/database/prisma';
import { adminAuth } from '@/shared/lib/admin-auth';

export async function GET(request: NextRequest) {
  const auth = adminAuth.require(request);
  if (!auth.ok) return auth.response;

  const images = await prisma.image.findMany({
    include: { project: true },
    orderBy: [{ projectId: 'asc' }, { order: 'asc' }],
  });

  return NextResponse.json(images);
}

export async function POST(request: NextRequest) {
  const auth = adminAuth.require(request);
  if (!auth.ok) return auth.response;

  const { url, alt, order = 0, projectId } = await request.json();

  if (!url || !projectId) {
    return NextResponse.json(
      { error: 'projectId and url are required' },
      { status: 400 },
    );
  }

  try {
    const image = await prisma.image.create({
      data: {
        url,
        alt,
        order: Number(order) || 0,
        project: { connect: { id: Number(projectId) } },
      },
      include: { project: true },
    });
    return NextResponse.json(image);
  } catch (error) {
    console.error('Failed to create image', error);
    return NextResponse.json({ error: 'Failed to create image' }, { status: 500 });
  }
}


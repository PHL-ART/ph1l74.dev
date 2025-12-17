import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/shared/api/database/prisma';
import { adminAuth } from '@/shared/lib/admin-auth';

export async function GET(request: NextRequest) {
  const auth = adminAuth.require(request);
  if (!auth.ok) return auth.response;

  const links = await prisma.projectLink.findMany({
    include: { project: true },
    orderBy: [{ projectId: 'asc' }, { id: 'asc' }],
  });

  return NextResponse.json(links);
}

export async function POST(request: NextRequest) {
  const auth = adminAuth.require(request);
  if (!auth.ok) return auth.response;

  const { projectId, name, href } = await request.json();

  if (!projectId || !name || !href) {
    return NextResponse.json(
      { error: 'projectId, name и href обязательны' },
      { status: 400 },
    );
  }

  try {
    const link = await prisma.projectLink.create({
      data: {
        project: { connect: { id: Number(projectId) } },
        name,
        href,
      },
      include: { project: true },
    });
    return NextResponse.json(link);
  } catch (error) {
    console.error('Failed to create link', error);
    return NextResponse.json({ error: 'Не удалось создать ссылку' }, { status: 500 });
  }
}


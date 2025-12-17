import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/shared/api/database/prisma';
import { adminAuth } from '@/shared/lib/admin-auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = adminAuth.require(request);
  if (!auth.ok) return auth.response;

  const linkId = Number(params.id);
  if (Number.isNaN(linkId)) {
    return NextResponse.json({ error: 'Invalid link id' }, { status: 400 });
  }

  const { projectId, name, href } = await request.json();
  if (!projectId || !name || !href) {
    return NextResponse.json(
      { error: 'projectId, name и href обязательны' },
      { status: 400 },
    );
  }

  try {
    const link = await prisma.projectLink.update({
      where: { id: linkId },
      data: {
        project: { connect: { id: Number(projectId) } },
        name,
        href,
      },
      include: { project: true },
    });
    return NextResponse.json(link);
  } catch (error) {
    console.error('Failed to update link', error);
    return NextResponse.json({ error: 'Не удалось обновить ссылку' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = adminAuth.require(request);
  if (!auth.ok) return auth.response;

  const linkId = Number(params.id);
  if (Number.isNaN(linkId)) {
    return NextResponse.json({ error: 'Invalid link id' }, { status: 400 });
  }

  try {
    await prisma.projectLink.delete({ where: { id: linkId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete link', error);
    return NextResponse.json({ error: 'Не удалось удалить ссылку' }, { status: 500 });
  }
}


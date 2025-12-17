import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/shared/api/database/prisma';
import { adminAuth } from '@/shared/lib/admin-auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = adminAuth.require(request);
  if (!auth.ok) return auth.response;

  const tagId = Number(params.id);
  if (Number.isNaN(tagId)) {
    return NextResponse.json({ error: 'Invalid tag id' }, { status: 400 });
  }

  const { name, description } = await request.json();
  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  try {
    const tag = await prisma.tag.update({
      where: { id: tagId },
      data: { name, description },
    });
    return NextResponse.json(tag);
  } catch (error) {
    console.error('Failed to update tag', error);
    return NextResponse.json({ error: 'Failed to update tag' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = adminAuth.require(request);
  if (!auth.ok) return auth.response;

  const tagId = Number(params.id);
  if (Number.isNaN(tagId)) {
    return NextResponse.json({ error: 'Invalid tag id' }, { status: 400 });
  }

  try {
    await prisma.tag.delete({ where: { id: tagId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete tag', error);
    return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 });
  }
}

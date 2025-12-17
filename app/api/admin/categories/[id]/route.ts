import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/shared/api/database/prisma';
import { adminAuth } from '@/shared/lib/admin-auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = adminAuth.require(request);
  if (!auth.ok) return auth.response;

  const categoryId = Number(params.id);
  if (Number.isNaN(categoryId)) {
    return NextResponse.json({ error: 'Invalid category id' }, { status: 400 });
  }

  const { name, description } = await request.json();

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  try {
    const category = await prisma.category.update({
      where: { id: categoryId },
      data: { name, description },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.error('Failed to update category', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = adminAuth.require(request);
  if (!auth.ok) return auth.response;

  const categoryId = Number(params.id);
  if (Number.isNaN(categoryId)) {
    return NextResponse.json({ error: 'Invalid category id' }, { status: 400 });
  }

  try {
    await prisma.category.delete({ where: { id: categoryId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete category', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 },
    );
  }
}


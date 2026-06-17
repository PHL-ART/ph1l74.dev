import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/shared/api/database/prisma';
import { adminAuth } from '@/shared/lib/admin-auth';

export async function GET(request: NextRequest) {
  const auth = adminAuth.require(request);
  if (!auth.ok) return auth.response;

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const auth = adminAuth.require(request);
  if (!auth.ok) return auth.response;

  const { name, description } = await request.json();

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  try {
    const category = await prisma.category.create({
      data: { name, description },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.error('Failed to create category', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 },
    );
  }
}


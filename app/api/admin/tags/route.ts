import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/shared/api/database/prisma';
import { adminAuth } from '@/shared/lib/admin-auth';

export async function GET(request: NextRequest) {
  const auth = adminAuth.require(request);
  if (!auth.ok) return auth.response;

  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(tags);
}

export async function POST(request: NextRequest) {
  const auth = adminAuth.require(request);
  if (!auth.ok) return auth.response;

  const { name, description } = await request.json();

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  try {
    const tag = await prisma.tag.create({
      data: { name, description },
    });
    return NextResponse.json(tag);
  } catch (error) {
    console.error('Failed to create tag', error);
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
  }
}


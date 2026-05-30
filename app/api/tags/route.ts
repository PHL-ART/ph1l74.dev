import { NextResponse } from 'next/server';
import prisma from '@/shared/api/database/prisma';

export async function GET() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  });
  return NextResponse.json(tags);
}

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/shared/api/database/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    const project = await prisma.project.findUnique({
      where: { shortname: params.slug },
      include: {
        categories: true,
        tags: { include: { tag: true } },
        images: { orderBy: { order: 'asc' } },
        links: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Ошибка при получении проекта:', error);
    return NextResponse.json(
      { error: 'Не удалось получить проект' },
      { status: 500 },
    );
  }
}


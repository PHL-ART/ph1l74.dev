import { NextResponse } from 'next/server';
import prisma from '@/shared/api/database/prisma';

/**
 * GET /api/projects
 * Получение списка всех проектов
 */
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ year: 'desc' }, { id: 'desc' }],
      include: {
        categories: true,
        tags: {
          include: { tag: true },
        },
        links: true,
      },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Ошибка при получении проектов:', error);
    return NextResponse.json(
      { error: 'Не удалось получить проекты' },
      { status: 500 }
    );
  }
}
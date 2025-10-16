import { NextResponse } from 'next/server';
import { projectService } from '@/entities/project/api/projectService';

/**
 * GET /api/projects
 * Получение списка всех проектов
 */
export async function GET() {
  try {
    const projects = await projectService.getAllProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Ошибка при получении проектов:', error);
    return NextResponse.json(
      { error: 'Не удалось получить проекты' },
      { status: 500 }
    );
  }
}
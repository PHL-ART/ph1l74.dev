import prisma from '@/shared/api/database/prisma';
import { Project } from '@prisma/client';

export const projectService = {
  /**
   * Получить все проекты
   */
  async getAllProjects(): Promise<Project[]> {
    return prisma.project.findMany({
      orderBy: {
        year: 'desc',
      },
    });
  },

  /**
   * Получить проект по URL
   */
  async getProjectByUrl(url: string): Promise<Project | null> {
    return prisma.project.findFirst({
      where: { url },
    });
  },

  /**
   * Получить проект по ID
   */
  async getProjectByShortname(shortname: string): Promise<Project | null> {
    return prisma.project.findUnique({
      where: { shortname },
    });
  },

  // Получить проект с изображениями
  async getProjectWithImages(shortname: string): Promise<Project | null> {
    return prisma.project.findUnique({
      where: { shortname },
      include: {
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
  },

  // Получить проект с рубриками и тегами
  async getProjectWithDetails(shortname: string): Promise<Project | null> {
    return prisma.project.findUnique({
      where: { shortname },
      include: {
        images: {
          orderBy: {
            order: 'asc',
          },
        },
        categories: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }


};


import { ImageResponse } from 'next/og';
import prisma from '@/shared/api/database/prisma';
import {
  OG_SIZE,
  OG_CONTENT_TYPE,
  getOgFont,
  getOgLogoDataUri,
  ogBranded,
  ogProject,
} from '@/shared/lib/og-template';

export const runtime = 'nodejs';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: { slug: string } }) {
  const font = getOgFont();
  const logo = getOgLogoDataUri();

  const project = await prisma.project.findUnique({
    where: { shortname: params.slug },
    include: {
      images: { orderBy: { order: 'asc' }, take: 1 },
      categories: true,
    },
  });

  if (!project) {
    return new ImageResponse(ogBranded('Проект', logo), { ...OG_SIZE, fonts: [font] });
  }

  const firstImage = project.images[0];
  const category = project.categories[0]?.name ?? null;

  if (firstImage) {
    return new ImageResponse(
      ogProject(project.title, project.year, category, firstImage.url, logo),
      { ...OG_SIZE, fonts: [font] },
    );
  }

  return new ImageResponse(ogBranded(project.title, logo), { ...OG_SIZE, fonts: [font] });
}

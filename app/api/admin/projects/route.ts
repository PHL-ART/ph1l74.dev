import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/shared/api/database/prisma';
import { adminAuth } from '@/shared/lib/admin-auth';

const projectInclude = {
  categories: true,
  tags: { include: { tag: true } },
  images: { orderBy: { order: 'asc' } },
  links: true,
};

export async function GET(request: NextRequest) {
  const auth = adminAuth.require(request);
  if (!auth.ok) return auth.response;

  const projects = await prisma.project.findMany({
    orderBy: [{ year: 'desc' }, { id: 'desc' }],
    include: projectInclude,
  });

  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  const auth = adminAuth.require(request);
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const {
    shortname,
    title,
    year,
    description,
    url,
    categoryIds = [],
    tagIds = [],
    images = [],
    links = [],
  } = body;

  if (!shortname || !title || !description || !year) {
    return NextResponse.json(
      { error: 'shortname, title, year, description are required' },
      { status: 400 },
    );
  }

  try {
    const project = await prisma.project.create({
      data: {
        shortname,
        title,
        year: Number(year),
        description,
        url,
        categories:
          categoryIds && Array.isArray(categoryIds)
            ? { connect: categoryIds.map((id: number) => ({ id: Number(id) })) }
            : undefined,
        tags:
          tagIds && Array.isArray(tagIds)
            ? {
                create: tagIds.map((id: number) => ({
                  tag: { connect: { id: Number(id) } },
                })),
              }
            : undefined,
        images:
          images && Array.isArray(images)
            ? {
                create: images.map(
                  (img: { url: string; alt?: string; order?: number }) => ({
                    url: img.url,
                    alt: img.alt,
                    order: Number(img.order) || 0,
                  }),
                ),
              }
            : undefined,
        links:
          links && Array.isArray(links)
            ? {
                create: links.map((link: { name: string; href: string }) => ({
                  name: link.name,
                  href: link.href,
                })),
              }
            : undefined,
      },
      include: projectInclude,
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Failed to create project', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}


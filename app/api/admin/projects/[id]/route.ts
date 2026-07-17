import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/shared/api/database/prisma';
import { adminAuth } from '@/shared/lib/admin-auth';

const projectInclude = {
  categories: true,
  tags: { include: { tag: true } },
  images: { orderBy: { order: 'asc' } },
  links: true,
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = adminAuth.require(request);
  if (!auth.ok) return auth.response;

  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid project id' }, { status: 400 });
  }

  const project = await prisma.project.findUnique({
    where: { id },
    include: projectInclude,
  });

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  return NextResponse.json(project);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = adminAuth.require(request);
  if (!auth.ok) return auth.response;

  const projectId = Number(params.id);
  if (Number.isNaN(projectId)) {
    return NextResponse.json({ error: 'Invalid project id' }, { status: 400 });
  }

  const body = await request.json();
  const {
    shortname,
    title,
    year,
    description,
    url,
    categoryIds = [],
    tagIds = [],
    isActive = true,
  } = body;

  if (!shortname || !title || !description || !year) {
    return NextResponse.json(
      { error: 'shortname, title, year, description are required' },
      { status: 400 },
    );
  }

  try {
    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        shortname,
        title,
        year: Number(year),
        description,
        isActive: Boolean(isActive),
        url,
        categories:
          categoryIds && Array.isArray(categoryIds)
            ? { set: categoryIds.map((id: number) => ({ id: Number(id) })) }
            : undefined,
        tags:
          tagIds && Array.isArray(tagIds)
            ? {
                deleteMany: {},
                create: tagIds.map((id: number) => ({
                  tag: { connect: { id: Number(id) } },
                })),
              }
            : undefined,
      },
      include: projectInclude,
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Failed to update project', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = adminAuth.require(request);
  if (!auth.ok) return auth.response;

  const projectId = Number(params.id);
  if (Number.isNaN(projectId)) {
    return NextResponse.json({ error: 'Invalid project id' }, { status: 400 });
  }

  try {
    await prisma.image.deleteMany({ where: { projectId } });
    await prisma.projectTag.deleteMany({ where: { projectId } });
    await prisma.projectLink.deleteMany({ where: { projectId } });
    await prisma.project.delete({ where: { id: projectId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete project', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}


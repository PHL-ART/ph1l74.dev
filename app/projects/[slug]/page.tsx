import { notFound } from 'next/navigation';
import prisma from '@/shared/api/database/prisma';
import { ProjectDetailContent } from '@/app-pages/projects/ui/ProjectDetailContent';

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
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
    notFound();
  }

  return (
    <ProjectDetailContent
      title={project.title}
      description={project.description}
      year={project.year}
      categories={project.categories.map((c) => c.name)}
      tags={project.tags.map((t) => t.tag.name)}
      images={project.images}
      links={project.links}
    />
  );
}

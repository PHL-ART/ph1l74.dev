import { notFound } from 'next/navigation';
import prisma from '@/shared/api/database/prisma';
import { IconExternalLink } from '@tabler/icons-react';

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

  const category = project.categories?.[0]?.name;
  const tags = project.tags?.map((t) => t.tag.name) ?? [];
  const links = project.links ?? [];

  return (
    <div className="flex w-full flex-col gap-8">
      {/* Краткое описание */}
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 shadow-lg">
        <div className="flex items-start justify-between gap-3 text-sm text-neutral-400">
          <span>{project.year}</span>
          {category && (
            <span className="rounded-lg border border-neutral-700 px-3 py-1 text-xs text-neutral-200">
              {category}
            </span>
          )}
        </div>

        <h1 className="mt-4 text-4xl font-bold text-white">{project.title}</h1>

        <p className="mt-4 text-base text-neutral-200">{project.description}</p>

        {tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[rgb(153,27,27)]/50 bg-[rgb(153,27,27)]/20 px-3 py-1 text-xs uppercase text-neutral-50"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {links.length > 0 ? (
          <div className="mt-6 space-y-2">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-[rgb(153,27,27)] transition hover:text-red-400"
              >
                <span className="relative overflow-hidden pb-px">
                  <span className="absolute bottom-0 left-0 h-[2px] w-full scale-x-0 transform bg-[rgb(153,27,27)] transition duration-300 ease-out group-hover:scale-x-100" />
                  <span className="relative">{link.name}</span>
                </span>
                <IconExternalLink
                  size={16}
                  className="transition duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100 group-hover:rotate-12 opacity-70"
                />
              </a>
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-neutral-500">Ссылок пока нет</p>
        )}
      </section>

      {/* Развернутое описание */}
      <section className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-white">Подробнее</h2>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-neutral-200">
          <p>{project.description}</p>
        </div>
      </section>
    </div>
  );
}


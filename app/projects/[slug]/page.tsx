import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/shared/api/database/prisma';
import { ProjectGallery } from '@/features/project-gallery';

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
  const ghostChar = project.title?.[0]?.toUpperCase() ?? 'P';

  return (
    <article className="ds-project-detail">

      {/* Back navigation strip */}
      <div className="ds-project-nav">
        <Link href="/projects" className="ds-project-back">
          <span aria-hidden="true">←</span>
          Проекты
        </Link>
        <span className="ds-project-nav-meta">
          {project.year}
        </span>
      </div>

      {/* Hero */}
      <header className="ds-project-hero">
        <div className="ds-project-hero-inner">
          {category && (
            <div className="ds-eyebrow ds-project-hero-eyebrow">{category}</div>
          )}
          <h1 className="ds-project-hero-title">{project.title}</h1>
          <p className="ds-project-hero-desc">{project.description}</p>
          {links.length > 0 && (
            <nav className="ds-project-hero-links" aria-label="Project links">
              {links.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="ds-project-hero-link"
                >
                  {link.name}
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </nav>
          )}
        </div>
        <span className="ds-project-hero-ghost" aria-hidden="true">{ghostChar}</span>
      </header>

      <ProjectGallery images={project.images} />

      {/* Body */}
      <div className="ds-project-body">
        <section className="ds-project-desc-col">
          <div className="ds-project-body-label">Обзор</div>
          <div className="ds-project-full-desc">
            <p>{project.description}</p>
          </div>
        </section>

        <aside className="ds-project-sidebar">
          {tags.length > 0 && (
            <div className="ds-project-sidebar-block">
              <div className="ds-project-sidebar-label">Теги</div>
              <div className="ds-project-tags-wrap">
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/projects?tag=${encodeURIComponent(tag)}`}
                    className="ds-tag"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {links.length > 0 && (
            <div className="ds-project-sidebar-block">
              <div className="ds-project-sidebar-label">Ссылки</div>
              <nav className="ds-project-sidebar-links">
                {links.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="ds-project-sidebar-link"
                  >
                    <span>{link.name}</span>
                    <span className="ds-project-sidebar-arrow" aria-hidden="true">↗</span>
                  </a>
                ))}
              </nav>
            </div>
          )}

          <div className="ds-project-sidebar-block">
            <div className="ds-project-sidebar-label">Год</div>
            <div className="ds-project-sidebar-value">{project.year}</div>
          </div>

          {category && (
            <div className="ds-project-sidebar-block">
              <div className="ds-project-sidebar-label">Категория</div>
              <Link
                href={`/projects?category=${encodeURIComponent(category)}`}
                className="ds-project-sidebar-value ds-sidebar-cat-link"
              >
                {category}
              </Link>
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}

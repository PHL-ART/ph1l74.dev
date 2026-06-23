'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ProjectGallery } from '@/features/project-gallery';
import type { GalleryImage } from '@/features/project-gallery/ui/ImageLightbox';

interface ProjectLink {
  id: number;
  href: string;
  name: string;
}

interface ProjectDetailContentProps {
  title: string;
  description: string;
  year: number;
  categories: string[];
  tags: string[];
  images: GalleryImage[];
  links: ProjectLink[];
}

const EASE = [0.16, 1, 0.3, 1] as const;

export function ProjectDetailContent({
  title,
  description,
  year,
  categories,
  tags,
  images,
  links,
}: ProjectDetailContentProps) {
  const reduced = useReducedMotion();
  const ghostChar = title?.[0]?.toUpperCase() ?? 'P';

  const fadeUp = (delay: number, y = 14) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease: EASE },
        };

  return (
    <article className="ds-project-detail">
      {/* Back navigation strip */}
      <motion.div
        className="ds-project-nav"
        {...(reduced ? {} : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.35, delay: 0, ease: EASE },
        })}
      >
        <Link href="/projects" className="ds-project-back">
          <span aria-hidden="true">←</span>
          Проекты
        </Link>
        <span className="ds-project-nav-meta">{year}</span>
      </motion.div>

      {/* Hero */}
      <header className="ds-project-hero">
        <div className="ds-project-hero-inner">
          {categories.length > 0 && (
            <motion.div
              className="ds-eyebrow ds-project-hero-eyebrow"
              {...fadeUp(0)}
            >
              {categories.join(' · ')}
            </motion.div>
          )}
          <motion.h1 className="ds-project-hero-title" {...fadeUp(0.08)}>
            {title}
          </motion.h1>
          <motion.p className="ds-project-hero-desc" {...fadeUp(0.18)}>
            {description}
          </motion.p>
          {links.length > 0 && (
            <motion.nav
              className="ds-project-hero-links"
              aria-label="Project links"
              {...fadeUp(0.26)}
            >
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
            </motion.nav>
          )}
        </div>
        <span className="ds-project-hero-ghost" aria-hidden="true">{ghostChar}</span>
      </header>

      <motion.div {...fadeUp(0.32, 8)}>
        <ProjectGallery images={images} />
      </motion.div>

      {/* Body */}
      <div className="ds-project-body">
        <motion.section className="ds-project-desc-col" {...fadeUp(0.40, 10)}>
          <div className="ds-project-body-label">Обзор</div>
          <div className="ds-project-full-desc">
            <p>{description}</p>
          </div>
        </motion.section>

        <motion.aside className="ds-project-sidebar" {...fadeUp(0.48, 10)}>
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
            <div className="ds-project-sidebar-value">{year}</div>
          </div>

          {categories.length > 0 && (
            <div className="ds-project-sidebar-block">
              <div className="ds-project-sidebar-label">
                {categories.length === 1 ? 'Категория' : 'Категории'}
              </div>
              <div className="ds-project-tags-wrap">
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/projects?category=${encodeURIComponent(cat)}`}
                    className="ds-tag"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.aside>
      </div>
    </article>
  );
}

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
  isActive: boolean;
  url?: string | null;
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
  isActive,
  url,
}: ProjectDetailContentProps) {
  const reduced = useReducedMotion();
  const ghostChar = title?.[0]?.toUpperCase() ?? 'P';

  const titleModifier =
    title.length > 45 ? 'ds-project-hero-title--lg' :
    title.length > 20 ? 'ds-project-hero-title--md' : '';

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
          <motion.h1
            className={`ds-project-hero-title${titleModifier ? ` ${titleModifier}` : ''}`}
            {...fadeUp(0.08)}
          >
            {title}
          </motion.h1>
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
                  <span aria-hidden="true">↗︎</span>
                </a>
              ))}
            </motion.nav>
          )}
        </div>
        <span className="ds-project-hero-ghost" aria-hidden="true">{ghostChar}</span>
      </header>

      {/* Body */}
      <div className="ds-project-body">
        <div className="ds-project-left-col">
          {images.length > 0 && (
            <motion.div {...fadeUp(0.32, 8)}>
              <ProjectGallery images={images} />
            </motion.div>
          )}

          <motion.section className="ds-project-desc-col" {...fadeUp(images.length > 0 ? 0.48 : 0.32, 10)}>
            <div className="ds-project-body-label">Обзор</div>
            <div className="ds-project-full-desc">
              <p>{description}</p>
            </div>
          </motion.section>
        </div>

        <motion.aside className="ds-project-sidebar" {...fadeUp(images.length > 0 ? 0.56 : 0.40, 10)}>

          <div className="ds-project-sidebar-section">
            <div className="ds-project-body-label">Статус</div>
            <span className={`ds-project-status ds-project-status--${isActive ? 'active' : 'inactive'}`}>
              {isActive ? 'Активный' : 'Неактивный'}
            </span>
          </div>

          <div className="ds-project-sidebar-section">
            <div className="ds-project-body-label">Год</div>
            <div className="ds-project-sidebar-value">{year}</div>
          </div>

          {tags.length > 0 && (
            <div className="ds-project-sidebar-section">
              <div className="ds-project-body-label">Теги</div>
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

          {categories.length > 0 && (
            <div className="ds-project-sidebar-section">
              <div className="ds-project-body-label">
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

          {(url || links.length > 0) && (
            <div className="ds-project-sidebar-section">
              <div className="ds-project-body-label">Ссылки</div>
              <div className="ds-project-visit-links">
                {url && (
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="ds-project-visit-link"
                  >
                    <span>Посмотреть</span>
                    <span className="ds-project-visit-arrow" aria-hidden="true">↗︎</span>
                  </a>
                )}
                {links.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="ds-project-visit-link"
                  >
                    <span>{link.name}</span>
                    <span className="ds-project-visit-arrow" aria-hidden="true">↗︎</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </motion.aside>
      </div>
    </article>
  );
}

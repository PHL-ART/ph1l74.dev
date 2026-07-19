'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { ProjectsFilterNav } from '@/widgets/projects-filter-nav';
import { buildFilterUrl } from '@/shared/lib/filter-url';

type ProjectItem = {
  id: number;
  shortname: string;
  title: string;
  year: number;
  description: string;
  isActive?: boolean;
  url?: string;
  categories?: { id: number; name: string }[];
  tags?: { id: number; tagId: number; tag: { id: number; name: string } }[];
};

const EASE = [0.16, 1, 0.3, 1] as const;

export const ProjectsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category');
  const activeTag = searchParams.get('tag');

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reduced = useReducedMotion();

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/projects', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load projects');
      const data: ProjectItem[] = await res.json();
      setProjects([...data].sort((a, b) => b.year - a.year || b.id - a.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Load error');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProjects(); }, []);

  const allCategories = useMemo(() => {
    const seen = new Set<string>();
    for (const p of projects) {
      for (const c of p.categories ?? []) seen.add(c.name);
    }
    return Array.from(seen).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const categoryMatch =
        activeCategory === null ||
        p.categories?.some((c) => c.name === activeCategory) === true;
      const tagMatch =
        activeTag === null ||
        p.tags?.some((t) => t.tag.name === activeTag) === true;
      return categoryMatch && tagMatch;
    });
  }, [projects, activeCategory, activeTag]);

  const showFilterNav = !loading && !error && projects.length > 0;

  const fadeUp = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease: EASE },
        };

  return (
    <main className="ds-projects-wrap">
      <div className="ds-page-header">
        <div className="ds-page-header-left">
          <motion.div className="ds-eyebrow" {...fadeUp(0)}>
            01 / Работа
          </motion.div>
          <motion.h1 className="ds-page-title" {...fadeUp(0.08)}>
            Проекты
          </motion.h1>
        </div>
        <motion.div className="ds-page-header-meta" {...fadeUp(0.08)}>
          <div>ОТБОРНЫЕ ПРОЕКТЫ</div>
          <div>2014 – {new Date().getFullYear()}</div>
        </motion.div>
      </div>

      {showFilterNav && (
        <motion.div {...fadeUp(0.16)}>
          <ProjectsFilterNav
            categories={allCategories}
            activeCategory={activeCategory}
            activeTag={activeTag}
          />
        </motion.div>
      )}

      {loading && (
        <div className="flex min-h-[200px] items-center justify-center gap-3"
          style={{ color: 'var(--ds-text-2)' }}>
          <span className="h-4 w-4 animate-spin rounded-full border border-t-transparent"
            style={{ borderColor: 'var(--ds-accent)', borderTopColor: 'transparent' }} />
          Загружаю...
        </div>
      )}

      {error && (
        <ErrorMessage title="Error" message={error} onRetry={loadProjects} />
      )}

      {!loading && !error && projects.length === 0 && (
        <p className="py-16" style={{ color: 'var(--ds-text-2)', fontFamily: 'var(--font-jetbrains-mono)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
          No projects yet.
        </p>
      )}

      {!loading && !error && projects.length > 0 && filteredProjects.length === 0 && (
        <p className="py-16" style={{ color: 'var(--ds-text-2)', fontFamily: 'var(--font-jetbrains-mono)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
          No projects match the selected filters.
        </p>
      )}

      {!loading && !error && filteredProjects.length > 0 && (
        <ul className="ds-projects-list" role="list">
          {filteredProjects.map((p, i) => (
            <motion.li
              key={p.id}
              {...(reduced ? {} : {
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                transition: {
                  duration: 0.45,
                  delay: 0.22 + Math.min(i, 5) * 0.07,
                  ease: EASE,
                },
              })}
            >
              <Link
                href={`/projects/${p.shortname}`}
                className="ds-project-item-link"
                aria-label={p.title}
              />
              <div className="ds-project-item">
                <div className="ds-project-num">
                  {String(i + 1).padStart(2, '0')}
                </div>

                <div className="ds-project-main">
                  <h2 className="ds-project-title">
                    {p.title}
                    {p.categories && p.categories.length > 0 && (
                      <span className="ds-project-categories">
                        {p.categories.map((c) => (
                          <span key={c.id} className="ds-project-category">
                            {c.name}
                          </span>
                        ))}
                      </span>
                    )}
                  </h2>
                </div>

                <div className="ds-project-year">
                  {p.isActive && <span className="ds-project-active-dot" aria-label="Активный" />}
                  {p.year}
                </div>

                <div className="ds-project-desc-cell">
                  <p className="ds-project-desc">{p.description}</p>
                </div>

                {p.tags && p.tags.length > 0 && (
                  <div className="ds-project-tags-cell">
                    <div className="ds-project-tags">
                      {p.tags.map((t) => (
                        <button
                          key={t.tagId}
                          className="ds-tag"
                          onClick={() => {
                            router.replace(buildFilterUrl(activeCategory, t.tag.name));
                          }}
                        >
                          {t.tag.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="ds-project-arrow" aria-hidden="true">↗︎</div>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </main>
  );
};

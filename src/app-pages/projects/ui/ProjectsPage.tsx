'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
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
  url?: string;
  categories?: { id: number; name: string }[];
  tags?: { id: number; tagId: number; tag: { id: number; name: string } }[];
};

export const ProjectsPage = () => {
  const router = useRouter();

  // URL is the single source of truth for active filters
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category');
  const activeTag = searchParams.get('tag');

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // AND-logic: project must satisfy both active category AND active tag (if set)
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

  return (
    <main className="ds-projects-wrap">
      <div className="ds-page-header">
        <h1 className="ds-page-title" data-num="01 / Work">Projects</h1>
        <div className="ds-page-header-meta">
          <div>Selected work</div>
          <div>2020 – {new Date().getFullYear()}</div>
        </div>
      </div>

      {showFilterNav && (
        <ProjectsFilterNav
          categories={allCategories}
          activeCategory={activeCategory}
          activeTag={activeTag}
        />
      )}

      {loading && (
        <div className="flex min-h-[200px] items-center justify-center gap-3"
          style={{ color: 'var(--ds-text-2)' }}>
          <span className="h-4 w-4 animate-spin rounded-full border border-t-transparent"
            style={{ borderColor: 'var(--ds-accent)', borderTopColor: 'transparent' }} />
          Loading...
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
            <li key={p.id}>
              <Link
                href={`/projects/${p.shortname}`}
                className="ds-project-item"
              >
                <div className="ds-project-num">
                  {String(i + 1).padStart(2, '0')}
                </div>

                <div className="ds-project-main">
                  <h2 className="ds-project-title">
                    {p.title}
                    {p.categories?.[0] && (
                      <span className="ds-project-category">
                        {p.categories[0].name}
                      </span>
                    )}
                  </h2>
                </div>

                <div className="ds-project-year">{p.year}</div>

                <div className="ds-project-desc-cell">
                  <p className="ds-project-desc">{p.description}</p>
                </div>

                {p.tags && p.tags.length > 0 && (
                  <div className="ds-project-tags-cell">
                    <div className="ds-project-tags">
                      {p.tags.map((t) => (
                        // button + stopPropagation prevents the outer <Link> from firing
                        <button
                          key={t.tagId}
                          className="ds-tag"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            router.push(buildFilterUrl(activeCategory, t.tag.name));
                          }}
                        >
                          {t.tag.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="ds-project-arrow" aria-hidden="true">↗</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

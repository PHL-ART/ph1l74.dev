'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';

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

  return (
    <main className="ds-projects-wrap">
      <div className="ds-page-header">
        <h1 className="ds-page-title" data-num="01 / Work">Projects</h1>
        <div className="ds-page-header-meta">
          <div>Selected work</div>
          <div>2020 – {new Date().getFullYear()}</div>
        </div>
      </div>

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

      {!loading && !error && projects.length > 0 && (
        <ul className="ds-projects-list" role="list">
          {projects.map((p, i) => (
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
                        <span key={t.tagId} className="ds-tag">{t.tag.name}</span>
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

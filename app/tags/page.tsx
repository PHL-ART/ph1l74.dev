'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Tag = { id: number; name: string };

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/tags')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: Tag[]) => setTags(data))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Load error'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="ds-projects-wrap">
      <div className="ds-page-header">
        <h1 className="ds-page-title" data-num="02 / Tags">Tags</h1>
        <div className="ds-page-header-meta">
          <div>All tags</div>
          <div>{loading ? '—' : `${tags.length} total`}</div>
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

      {!loading && error && (
        <p className="py-16" style={{ color: 'var(--ds-text-2)', fontFamily: 'var(--font-jetbrains-mono)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
          {error}
        </p>
      )}

      {!loading && !error && tags.length === 0 && (
        <p className="py-16" style={{ color: 'var(--ds-text-2)', fontFamily: 'var(--font-jetbrains-mono)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
          No tags yet.
        </p>
      )}

      {!loading && !error && tags.length > 0 && (
        <div className="ds-tags-cloud">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/projects?tag=${encodeURIComponent(tag.name)}`}
              className="ds-tag"
            >
              {tag.name}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

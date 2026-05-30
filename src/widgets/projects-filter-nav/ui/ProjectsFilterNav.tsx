'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { buildFilterUrl } from '@/shared/lib/filter-url';

interface ProjectsFilterNavProps {
  categories: string[];
  activeCategory: string | null;
  // When a tag filter is active via ?tag=, the nav shows a dismissible badge
  activeTag: string | null;
}

export const ProjectsFilterNav = ({
  categories,
  activeCategory,
  activeTag,
}: ProjectsFilterNavProps) => {
  const router = useRouter();

  return (
    <div className="ds-projects-filter-nav" role="navigation" aria-label="Project filters">
      <div className="ds-pfn-center" role="group" aria-label="Categories">
        {/* "All" clears category filter; preserves active tag */}
        <button
          className={`ds-pfn-btn${activeCategory === null ? ' ds-pfn-btn--active' : ''}`}
          onClick={() => router.push(buildFilterUrl(null, activeTag))}
          aria-pressed={activeCategory === null}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`ds-pfn-btn${activeCategory === cat ? ' ds-pfn-btn--active' : ''}`}
            // Toggle: clicking the active category deselects it; preserves active tag
            onClick={() =>
              router.push(buildFilterUrl(activeCategory === cat ? null : cat, activeTag))
            }
            aria-pressed={activeCategory === cat}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="ds-pfn-right">
        {/* Tag badge: appears when ?tag= is set; × clears only the tag param */}
        {activeTag && (
          <button
            className="ds-pfn-btn ds-pfn-btn--tag-badge"
            onClick={() => router.push(buildFilterUrl(activeCategory, null))}
            title="Clear tag filter"
          >
            {activeTag} ×
          </button>
        )}
        <Link href="/tags" className="ds-pfn-btn ds-pfn-btn--tags-link">
          Tags
        </Link>
      </div>
    </div>
  );
};

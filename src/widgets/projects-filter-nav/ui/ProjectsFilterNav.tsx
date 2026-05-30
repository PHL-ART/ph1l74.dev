'use client';

import Link from 'next/link';

interface ProjectsFilterNavProps {
  categories: string[];
  activeCategory: string | null;
  onCategoryChange: (cat: string | null) => void;
}

export const ProjectsFilterNav = ({
  categories,
  activeCategory,
  onCategoryChange,
}: ProjectsFilterNavProps) => (
  <div className="ds-projects-filter-nav" role="navigation" aria-label="Project filters">
    <div className="ds-pfn-center" role="group" aria-label="Categories">
      <button
        className={`ds-pfn-btn${activeCategory === null ? ' ds-pfn-btn--active' : ''}`}
        onClick={() => onCategoryChange(null)}
        aria-pressed={activeCategory === null}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          className={`ds-pfn-btn${activeCategory === cat ? ' ds-pfn-btn--active' : ''}`}
          onClick={() => onCategoryChange(activeCategory === cat ? null : cat)}
          aria-pressed={activeCategory === cat}
        >
          {cat}
        </button>
      ))}
    </div>

    <div className="ds-pfn-right">
      <Link href="/tags" className="ds-pfn-btn ds-pfn-btn--tags-link">
        Tags
      </Link>
    </div>
  </div>
);

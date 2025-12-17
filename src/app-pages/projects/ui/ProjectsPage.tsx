'use client';

import { useEffect, useMemo, useState } from 'react';
import { CardHoverEffect } from '@/shared/ui/CardHoverEffect';
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
      if (!res.ok) throw new Error('Не удалось загрузить проекты');
      const data: ProjectItem[] = await res.json();
      const sorted = [...data].sort((a, b) => b.year - a.year || b.id - a.id);
      setProjects(sorted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex min-h-[200px] items-center justify-center gap-3 text-neutral-300">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-[rgb(153,27,27)] border-t-transparent" />
          Загрузка проектов...
        </div>
      );
    }

    if (error) {
      return (
        <ErrorMessage
          title="Ошибка"
          message={error}
          onRetry={loadProjects}
        />
      );
    }

    if (!projects.length) {
      return (
        <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-6 text-center text-neutral-300">
          Пока нет проектов
        </div>
      );
    }

    const items = projects.map((p) => ({
      title: p.title,
      description: p.description,
      href: `/projects/${p.shortname}`,
      year: p.year.toString(),
      category: p.categories?.[0]?.name,
      tags: p.tags?.map((t) => t.tag.name) ?? [],
    }));

    return <CardHoverEffect items={items} />;
  };

  return (
    <div className="flex w-full flex-col gap-7">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-white">Projects</h1>
        <div className="h-px w-full bg-neutral-800" />
      </div>
      {renderContent()}
    </div>
  );
};

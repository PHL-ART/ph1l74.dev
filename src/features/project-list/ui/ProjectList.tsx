'use client';

import { useEffect, useState } from "react";
import Link from 'next/link';
import { useErrorHandler } from '@/shared/lib/error-context';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';

interface Category {
  id: number;
  name: string;
}

interface Project {
  id: number;
  shortname: string;
  title: string;
  year: number;
  description: string;
  url?: string;
  categories?: Category[];
}

export const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleDatabaseError, error, isError, clearError } = useErrorHandler();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/projects', {
          signal: controller.signal
        });
        
        if (!response.ok) {
          throw new Error('Ошибка при получении проектов');
        }
        
        const data = await response.json();
        
        if (isMounted) {
          setProjects(data);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError' && isMounted) {
          handleDatabaseError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProjects();
    
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [handleDatabaseError]);

  if (loading) {
    return <div className="flex justify-center items-center h-full">Загрузка проектов...</div>;
  }

  if (isError) {
    return (
      <ErrorMessage 
        title={error?.title || "Ошибка базы данных"} 
        message={error?.message || "Не удалось загрузить проекты. Пожалуйста, попробуйте позже."} 
        onRetry={() => {
          clearError();
          window.location.reload();
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {projects.map((project) => (
        <div key={project.id} className="border-b border-gray-700 pb-4">
          <Link
            href={`/projects/${project.shortname}`}
            className="hover:underline text-xl font-medium"
          >
            {project.title} ({project.year})
          </Link>
          {project.categories && project.categories.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {project.categories.map((cat) => (
                <span key={cat.id} className="text-xs text-red-700 uppercase tracking-wider">
                  {cat.name}
                </span>
              ))}
            </div>
          )}
          <p className="text-gray-400 mt-2">{project.description}</p>
        </div>
      ))}
    </div>
  );
};

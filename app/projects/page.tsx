'use client';

import Link from 'next/link';
import { useEffect, useState } from "react";
import { useErrorHandler } from "@/contexts/error-context";
import { ErrorMessage } from "@/components/ui/error-message";

/**
 * Страница проектов
 */

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { handleDatabaseError } = useErrorHandler();
  const { error, isError, clearError } = useErrorHandler();

  useEffect(() => {
    let isMounted = true;
    let controller = new AbortController();
    
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
      } catch (err) {
        if (err.name !== 'AbortError' && isMounted) {
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
  }, []);

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
    <div className="flex flex-col gap-40">
      <div className="flex flex-row basis-full items-center gap-10">
        <div className="grow shrink basis-0 flex justify-center font-bold text-6xl ">
          Projects
        </div>
        <div className="grow shrink basis-0 text-4xl font-light ">
          {projects.map((project) => (
            <div key={project.id}>
              <Link href={`/projects/${project.url}`} className="hover:underline">
                {project.title} ({project.year})
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

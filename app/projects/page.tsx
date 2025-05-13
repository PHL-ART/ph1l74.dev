import Link from 'next/link';
import { projectService } from '@/shared/api/database/projectService';

export default async function Projects() {
  // Получаем все проекты из сервиса
  const projects = await projectService.getAllProjects();

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

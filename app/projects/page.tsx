import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProjectsPage } from "@/app-pages/projects/ui/ProjectsPage";

export const metadata: Metadata = {
  title: 'Проекты',
  openGraph: {
    title: 'Проекты | Филат Астахов',
    description: 'Портфолио проектов фронтенд разработчика Филата Астахова.',
  },
};

export default function Projects() {
  // Suspense boundary is required because ProjectsPage uses useSearchParams()
  return (
    <Suspense fallback={null}>
      <ProjectsPage />
    </Suspense>
  );
}

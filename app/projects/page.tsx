import { Suspense } from 'react';
import { ProjectsPage } from "@/app-pages/projects/ui/ProjectsPage";

export default function Projects() {
  // Suspense boundary is required because ProjectsPage uses useSearchParams()
  return (
    <Suspense>
      <ProjectsPage />
    </Suspense>
  );
}

import { FC } from "react";

interface ProjectsLayoutProps {
  children: React.ReactNode;
}

export const ProjectsLayout: FC<ProjectsLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col w-full h-full">
      {children}
    </div>
  );
};

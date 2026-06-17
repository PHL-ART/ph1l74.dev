import { FC } from "react";

interface ContentLayoutProps {
  children: React.ReactNode;
}

export const ContentLayout: FC<ContentLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col w-full h-full">
      {children}
    </div>
  );
};

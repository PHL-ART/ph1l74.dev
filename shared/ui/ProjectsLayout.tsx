import { FC } from "react";
import { ContentLayout } from "@/shared/ui/ContentLayout";
import { WavyBackground } from "@/components/ui/wavy-background";

export const ProjectsLayout: FC<ProjectsLayoutProps> = ({ children }) => {

    return (
        <ContentLayout>
            <div className="grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2 ">
                {children}
            </div>
        </ContentLayout>
    );
};

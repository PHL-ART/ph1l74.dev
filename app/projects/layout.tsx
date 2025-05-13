import type { Metadata } from "next";
import { ProjectsLayout } from "@/shared/ui/ProjectsLayout";


export const metadata: Metadata = {
    title: {
        template: '%s | Filat Astakhov',
        default: 'Filat Astakhov',
    },
    openGraph: {
        title: "Filat Astakhov",
        description: 'The official site of frontend developer Filat Astkahov'
    },
    description: 'The official site of frontend developer Filat Astkahov',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <ProjectsLayout>{children}</ProjectsLayout>
    );
}

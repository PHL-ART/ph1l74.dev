import { FC } from "react";
import { Footer } from "@/shared/ui/Footer";
import { ContentLayout } from "@/shared/ui/ContentLayout";
import { WavyBackground } from "@/components/ui/wavy-background";

export const MainLayout: FC<MainLayoutProps> = ({ children, header }) => {
  const className =
    "container mx-auto px-8 flex flex-col w-full grow h-full justify-center z-10";
  return (
    <>
      <div className="w-full h-full absolute top-0 -z-0">
        <WavyBackground
          colors={["#d73f1e", "#a70400", "#004e70"]}
          speed="fast"
          waveWidth={150}
          blur={15}
          waveOpacity={0.5}
          backgroundFill="black"
        />
      </div>
      <div className="flex flex-col h-full z-20">
        {header && <header>{header}</header>}
        <main className={className}>
          <ContentLayout>{children}</ContentLayout>
        </main>
        <Footer />
      </div>
    </>
  );
};

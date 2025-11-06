import { FC } from "react";
import { Footer } from "./Footer";
import { ContentLayout } from "./ContentLayout";
import { WavyBackground } from "./WavyBackground";
import { Header } from "./Header";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const className =
    "container mx-auto px-8 flex flex-col w-full grow h-full justify-center z-10";

  return (
    <>
      <div className="w-full h-full absolute top-0 -z-0">
        <WavyBackground
          colors={["#d73f1e", "#a70400", "#f3f3f3"]}
          speed={"slow"}
          waveWidth={200}
          blur={10}
          waveOpacity={1}
          backgroundFill="black"
          className="h-full w-full"
        />
      </div>
      <div className="flex flex-col w-full h-full absolute top-0 z-20">
        <Header />
        <main className={className}>
          <ContentLayout>{children}</ContentLayout>
        </main>
        <Footer />
      </div>
    </>
  );
};

import { FC } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { LiquidEther } from "./LiquidEther";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: -1 }}>
        <LiquidEther
          colors={["#150002", "#8c0018", "#e8192a"]}
          mouseForce={24}
          cursorSize={88}
          isViscous
          viscous={82}
          iterationsViscous={20}
          iterationsPoisson={28}
          resolution={0.45}
          isBounce={false}
          autoDemo
          autoSpeed={0.42}
          autoIntensity={1.8}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>
      <Header />
      <div className="ds-page">
        {children}
        <Footer />
      </div>
    </>
  );
};

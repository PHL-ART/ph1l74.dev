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
          colors={["#ff2727", "#ff0000", "#320000"]}
          mouseForce={10}
          cursorSize={55}
          isViscous
          viscous={92}
          iterationsViscous={20}
          iterationsPoisson={28}
          resolution={0.45}
          isBounce={false}
          autoDemo
          autoSpeed={0.3}
          autoIntensity={0.3}
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

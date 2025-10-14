import type { Metadata } from "next";
import "./globals.css";
import { MainLayout } from "@/src/shared/ui/MainLayout";
// import { ErrorProvider } from "@/src/shared/lib/error-context";

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
    <html lang="en" className="dark">
      <body
        className="antialiased h-screen max-h-screen w-screen overflow-hidden"
      >
        {/* <ErrorProvider> */}
          <MainLayout>{children}</MainLayout>
        {/* </ErrorProvider> */}
      </body>
    </html>
  );
}

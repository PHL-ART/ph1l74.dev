import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { MainLayout } from "@/shared/ui/MainLayout";
import { PageNavigation } from "@/shared/ui/PageNavigation";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen max-h-screen w-screen overflow-hidden`}
      >
        <MainLayout header={<PageNavigation />}>{children}</MainLayout>
      </body>
    </html>
  );
}

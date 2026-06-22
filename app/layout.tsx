import type { Metadata } from "next";
import "./globals.css";
import { MainLayout } from "@/shared/ui/MainLayout";
import { ErrorProvider } from "@/shared/lib/error-context";
import localFont from 'next/font/local';
import { Unbounded, JetBrains_Mono } from 'next/font/google';

const widock = localFont({
  src: '../public/assets/fonts/widock-bold.otf',
  weight: '700',
  variable: '--font-widock',
  display: 'swap',
});

const unbounded = Unbounded({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-unbounded',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: "%s | Filat Astakhov",
    default: "Filat Astakhov",
  },
  openGraph: {
    title: "Filat Astakhov",
    description: "The official site of frontend developer Filat Astakhov",
  },
  description: "The official site of frontend developer Filat Astakhov",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${widock.variable} ${unbounded.variable} ${jetbrainsMono.variable}`}
      style={{ colorScheme: 'dark' }}
    >
      <body
        className="antialiased"
        style={{ fontFamily: "var(--font-unbounded, 'Helvetica Neue', sans-serif)" }}
      >
        <ErrorProvider>
          <MainLayout>{children}</MainLayout>
        </ErrorProvider>
      </body>
    </html>
  );
}

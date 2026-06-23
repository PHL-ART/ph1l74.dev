import type { Metadata } from "next";
import "./globals.css";
import { MainLayout } from "@/shared/ui/MainLayout";
import { ErrorProvider } from "@/shared/lib/error-context";
import { Analytics } from "@/shared/ui/Analytics";
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
  metadataBase: new URL('https://dev.ph1l74.com'),
  title: {
    template: '%s | Филат Астахов',
    default: 'Филат Астахов',
  },
  description: 'Официальный сайт фронтенд разработчика Филата Астахова',
  icons: {
    icon: '/assets/icons/fa-logo.svg',
    shortcut: '/assets/icons/fa-logo.svg',
  },
  openGraph: {
    title: 'Филат Астахов',
    description: 'Официальный сайт фронтенд разработчика Филата Астахова',
    url: 'https://dev.ph1l74.com',
    siteName: 'dev.ph1l74.com',
    type: 'website',
    locale: 'ru_RU',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Филат Астахов — фронтенд разработчик',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Филат Астахов',
    description: 'Официальный сайт фронтенд разработчика Филата Астахова',
    images: ['/opengraph-image'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`dark ${widock.variable} ${unbounded.variable} ${jetbrainsMono.variable}`}
      style={{ colorScheme: 'dark' }}
      suppressHydrationWarning
    >
      <body
        className="antialiased"
        style={{ fontFamily: "var(--font-unbounded, 'Helvetica Neue', sans-serif)" }}
        suppressHydrationWarning
      >
        <ErrorProvider>
          <MainLayout>{children}</MainLayout>
        </ErrorProvider>
        <Analytics />
      </body>
    </html>
  );
}

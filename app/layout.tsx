import type { Metadata } from "next";
import "./globals.css";
import { MainLayout } from "@/shared/ui/MainLayout";
import { ErrorProvider } from "@/shared/lib/error-context";
import { Syne, Bricolage_Grotesque, JetBrains_Mono, Unbounded } from "next/font/google";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["900"],
  variable: "--font-unbounded",
  display: "swap",
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
      className={`dark ${syne.variable} ${bricolage.variable} ${jetbrainsMono.variable} ${unbounded.variable}`}
      style={{ colorScheme: "dark" }}
    >
<body
        className="antialiased"
        style={{ fontFamily: "var(--font-bricolage, 'Helvetica Neue', sans-serif)" }}
      >
        <ErrorProvider>
          <MainLayout>{children}</MainLayout>
        </ErrorProvider>
      </body>
    </html>
  );
}

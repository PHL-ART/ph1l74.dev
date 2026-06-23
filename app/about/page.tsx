import type { Metadata } from 'next';
import { AboutPage } from "@/app-pages/about/ui/AboutPage";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Обо мне',
  openGraph: {
    title: 'Обо мне | Филат Астахов',
    description: 'О фронтенд разработчике Филате Астахове — стек, опыт и подход к работе.',
  },
};

export default function About() {
  return <AboutPage />;
}

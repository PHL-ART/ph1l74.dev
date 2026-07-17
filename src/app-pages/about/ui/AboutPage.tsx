import prisma from '@/shared/api/database/prisma';
import { AboutPageContent } from './AboutPageContent';

export const AboutPage = async () => {
  const [projectCount, yearAgg, tagCount, tags] = await Promise.all([
    prisma.project.count(),
    prisma.project.aggregate({ _min: { year: true } }),
    prisma.tag.count(),
    prisma.tag.findMany({ orderBy: { projects: { _count: 'desc' } } }),
  ]);

  const startYear = yearAgg._min.year ?? new Date().getFullYear();
  const yearsActive = new Date().getFullYear() - startYear;

  const stats = [
    { value: yearsActive,  suffix: '+', label: 'Лет в разработке' },
    { value: projectCount, suffix: '+', label: 'Проектов реализовано' },
    { value: tagCount,     suffix: '',  label: 'Технологий' },
  ];

  return <AboutPageContent tags={tags} stats={stats} />;
};

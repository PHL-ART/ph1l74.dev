import Link from 'next/link';
import prisma from '@/shared/api/database/prisma';
import { CounterNumber } from '@/shared/ui/CounterNumber';

export const AboutPage = async () => {
  const [projectCount, yearAgg, tagCount, tags] = await Promise.all([
    prisma.project.count(),
    prisma.project.aggregate({ _min: { year: true } }),
    prisma.tag.count(),
    prisma.tag.findMany({ orderBy: { name: 'asc' } }),
  ]);

  const startYear = yearAgg._min.year ?? new Date().getFullYear();
  const yearsActive = new Date().getFullYear() - startYear;

  const stats = [
    { value: yearsActive,  suffix: '+', label: 'Лет в разработке' },
    { value: projectCount, suffix: '+', label: 'Проектов реализовано' },
    { value: tagCount,     suffix: '',  label: 'Технологий' },
  ];

  return (
    <main className="ds-about-layout">
      {/* ── Left: text content ── */}
      <section className="ds-about-left">
        <div className="ds-about-eyebrow ds-eyebrow">02 / История</div>

        <h1 className="ds-about-heading">
          <span>Обо</span> <span className="ds-about-heading-ghost">мне</span>
        </h1>

        <div className="ds-about-body">
          <p>
            Привет, я <strong>Филат Астахов</strong> — фронтенд разработчик, создающий красивые
            и производительные интерфейсы. С 2014 года разрабатываю веб-проекты в сфере
            фриланса и продуктовых команд.
          </p>
          <p>
            Мой подход сочетает <strong>техническую точность с чувством дизайна</strong>.
            Мне важно не только то, как всё работает, но и то, как это выглядит и ощущается —
            от плавных переходов до продуманной вёрстки.
          </p>
          <p>
            Помимо клиентских проектов увлекаюсь creative coding: генеративное искусство,
            WebGL-шейдеры и интерактивные инсталляции на стыке дизайна и инженерии.
          </p>
        </div>

        <div className="ds-about-section-label">Ключевые навыки</div>
        <div className="ds-about-skills">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/projects?tag=${encodeURIComponent(tag.name)}`}
              className="ds-tag"
            >
              {tag.name}
            </Link>
          ))}
        </div>

        <div className="ds-about-stats">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="ds-stat-num">
                <CounterNumber value={s.value} suffix={s.suffix} />
              </div>
              <div className="ds-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Right: photo placeholder ── */}
      <aside className="ds-about-right" aria-label="Фото">
        <div className="ds-about-photo-wrapper">
          <div className="ds-about-photo-frame">
            <div className="ds-about-photo">
              <div className="ds-about-photo-geo" aria-hidden="true" />
              <span className="ds-about-photo-initials" aria-label="Инициалы Филата Астахова">
                FA
              </span>
              <div className="ds-about-photo-caption">Фото</div>
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
};

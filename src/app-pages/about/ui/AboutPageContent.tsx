'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { CounterNumber } from '@/shared/ui/CounterNumber';

interface Tag {
  id: number;
  name: string;
}

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

interface Props {
  tags: Tag[];
  stats: Stat[];
}

const EASE = [0.16, 1, 0.3, 1] as const;

export function AboutPageContent({ tags, stats }: Props) {
  const reduced = useReducedMotion();

  const fadeUp = (delay: number, y = 14) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease: EASE },
        };

  return (
    <main className="ds-about-layout">
      {/* ── Left: text content ── */}
      <section className="ds-about-left">
        <motion.div className="ds-about-eyebrow ds-eyebrow" {...fadeUp(0)}>
          02 / История
        </motion.div>

        <motion.h1 className="ds-about-heading" {...fadeUp(0.08)}>
          <span>Обо</span>{' '}
          <span className="ds-about-heading-ghost">мне</span>
        </motion.h1>

        <motion.div className="ds-about-body" {...fadeUp(0.18)}>
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
        </motion.div>

        <motion.div className="ds-about-section-label" {...fadeUp(0.28)}>
          Ключевые навыки
        </motion.div>

        <motion.div className="ds-about-skills" {...fadeUp(0.32)}>
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/projects?tag=${encodeURIComponent(tag.name)}`}
              className="ds-tag"
            >
              {tag.name}
            </Link>
          ))}
        </motion.div>

        <motion.div className="ds-about-stats" {...fadeUp(0.42)}>
          {stats.map((s) => (
            <div key={s.label}>
              <div className="ds-stat-num">
                <CounterNumber value={s.value} suffix={s.suffix} />
              </div>
              <div className="ds-stat-label">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Right: photo ── */}
      <motion.aside
        className="ds-about-right"
        aria-label="Фото"
        {...(reduced ? {} : {
          initial: { opacity: 0, x: 20 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.6, delay: 0.2, ease: EASE },
        })}
      >
        <div className="ds-about-photo-wrapper">
          <div className="ds-about-photo-frame">
            <div className="ds-about-photo">
              <Image
                src="/assets/images/myphoto.jpg"
                alt="Филат Астахов"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ objectFit: 'cover', objectPosition: 'center 12%' }}
                priority
              />
            </div>
          </div>
        </div>
      </motion.aside>
    </main>
  );
}

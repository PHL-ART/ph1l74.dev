'use client';

import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

export const HomePageTitle = () => {
  const reduced = useReducedMotion();

  const fadeUp = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease: EASE },
        };

  return (
    <>
      <motion.div className="ds-hero-eyebrow" {...fadeUp(0)}>
        <div className="ds-status">
          <span className="ds-status-dot" aria-hidden="true" />
          Открыт к фрилансу и сотрудничеству
        </div>
        <div className="ds-eyebrow">Фронтенд разработчик и UI инженер</div>
      </motion.div>

      <h1 className="ds-hero-name">
        <motion.span className="ds-hero-name-first" {...fadeUp(0.08)}>Филат</motion.span>
        <motion.span className="ds-hero-name-last" {...fadeUp(0.16)}>Астахов</motion.span>
      </h1>

      <motion.div className="ds-hero-meta" {...fadeUp(0.26)}>
        <div className="ds-hero-meta-item">
          <div className="ds-hero-meta-label">Специализация</div>
          <div className="ds-hero-meta-value">
            Веб-разработка &amp; <br /> интерактивные интерфейсы
          </div>
        </div>
        <div className="ds-hero-meta-item">
          <div className="ds-hero-meta-label">Текущий стек</div>
          <div className="ds-hero-meta-value">
            React · TypeScript<br />Next.js · Tailwind
          </div>
        </div>
        <div className="ds-hero-meta-item">
          <div className="ds-hero-meta-label">В коммерческой разработке</div>
          <div className="ds-hero-meta-value">с 2014 года</div>
        </div>
      </motion.div>

      <motion.div
        className="ds-hero-bg-char"
        aria-hidden="true"
        {...(reduced ? {} : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.8, delay: 0.1, ease: EASE },
        })}
      >
        А
      </motion.div>
    </>
  );
};

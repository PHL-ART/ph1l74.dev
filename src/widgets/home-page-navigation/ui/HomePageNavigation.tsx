'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from "next/link";

const EASE = [0.16, 1, 0.3, 1] as const;
const MotionLink = motion.create(Link);

const cards = [
  {
    num: "01 / Работы",
    title: "Проекты",
    desc: "Избранные проекты и разносторонние эксперименты, созданные за эти годы",
    href: "/projects",
  },
  {
    num: "02 / История",
    title: "Обо мне",
    desc: "Опыт, навыки и то, что мной движет",
    href: "/about",
  },
  {
    num: "03 / Связь",
    title: "Контакты",
    desc: "Способы со мной связаться",
    href: "/contacts",
  },
];

export const HomePageNavigation = () => {
  const reduced = useReducedMotion();

  return (
    <nav className="ds-home-nav" aria-label="Site sections">
      <div className="ds-home-nav-grid">
        {cards.map((card, i) => (
          <MotionLink
            key={card.href}
            href={card.href}
            className="ds-home-nav-card"
            {...(reduced ? {} : {
              initial: { opacity: 0, y: 12 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.45, delay: 0.32 + i * 0.08, ease: EASE },
            })}
          >
            <div className="ds-home-nav-num">{card.num}</div>
            <div className="ds-home-nav-title">{card.title}</div>
            <div className="ds-home-nav-desc">{card.desc}</div>
            <span className="ds-home-nav-arrow" aria-hidden="true">↗︎</span>
          </MotionLink>
        ))}
      </div>
    </nav>
  );
};

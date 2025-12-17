'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { IconExternalLink } from '@tabler/icons-react';

type CardHoverItem = {
  title: string;
  description: string;
  href?: string;
  year?: string;
  category?: string;
  tags?: string[];
};

type CardHoverEffectProps = {
  items: CardHoverItem[];
  accent?: string;
};

/**
 * Hoverable cards inspired by Aceternity UI card-hover-effect.
 * Renders a subtle gradient spotlight on hover with accent color.
 */
export function CardHoverEffect({ items, accent = '#991b1b' }: CardHoverEffectProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, idx) => {
        const content = (
          <div
            className="group relative h-full overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 shadow-lg transition duration-200 hover:border-[rgb(153,27,27)]"
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: hovered === idx ? 1 : 0 }}
              className="pointer-events-none absolute inset-[-30%]"
              style={{
                background: `radial-gradient(circle at center, ${accent}33, transparent 55%)`,
              }}
            />
            <div className="relative z-10 flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-medium text-neutral-500">{item.year}</span>
                {item.category && (
                  <span className="rounded-lg border border-neutral-700 px-3 py-1 text-xs text-neutral-200">
                    {item.category}
                  </span>
                )}
              </div>
              <h3 className="mt-2 text-xl font-bold text-white">{item.title}</h3>
              <p
                className="mt-4 text-sm text-neutral-300"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 5,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {item.description}
              </p>
              {item.tags && item.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[rgb(153,27,27)]/50 bg-[rgb(153,27,27)]/20 px-2 py-1 text-xs uppercase text-neutral-50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {item.href && (
                <div className="mt-4 pt-1">
                  <span className="relative inline-flex items-center gap-1 text-sm font-semibold text-[rgb(153,27,27)]">
                    <span className="relative overflow-hidden pb-px">
                      <span className="absolute bottom-0 left-0 h-[2px] w-full scale-x-0 transform bg-[rgb(153,27,27)] transition duration-300 ease-out group-hover:scale-x-100" />
                      <span className="relative">Подробнее</span>
                    </span>
                    <IconExternalLink
                      size={16}
                      className="transition duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100 group-hover:rotate-12 opacity-0"
                    />
                  </span>
                </div>
              )}
            </div>
          </div>
        );

        return item.href ? (
          <Link key={item.title} href={item.href} className="h-full">
            {content}
          </Link>
        ) : (
          <div key={item.title} className="h-full">
            {content}
          </div>
        );
      })}
    </div>
  );
}


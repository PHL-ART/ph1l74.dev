# About Page Enhancements — Design Spec

**Date:** 2026-07-12  
**Status:** Approved

---

## Overview

Three enhancements to `src/app-pages/about/ui/AboutPageContent.tsx`:

1. **Career Timeline** — vertical animated timeline in the left column
2. **CV Download Link** — button in the right column (photo section)
3. **Placeholder CV PDF** — static file in `public/assets/`

---

## 1. Career Timeline Component

### Placement

Inserted into the **left column** (`ds-about-left`), between the body text block and the "Ключевые навыки" section label. A new section label **"Карьера"** (styled as `.ds-about-section-label`) precedes the timeline.

### Data

Hardcoded array of milestone objects — no database, no Prisma. Defined as a constant in the component file or a co-located `career.ts` file under `src/app-pages/about/`.

```ts
interface CareerEvent {
  year: string;       // e.g. "2014" or "2022 — сейчас"
  title: string;      // role or degree name
  subtitle: string;   // institution / company + context
  current?: boolean;  // marks last entry (pulsing dot)
}

const CAREER: CareerEvent[] = [
  { year: "2014", title: "Бакалавриат", subtitle: "УрФУ · ИРИТ-РТФ · Телекоммуникации" },
  { year: "2014", title: "Инженер-программист", subtitle: "ООО «ТЕЛЕСЕН» · Автоматизированные системы" },
  { year: "2016", title: "Магистратура", subtitle: "УрФУ · ИРИТ-РТФ · Инфокоммуникационные технологии" },
  { year: "2017", title: "Разработчик ПО", subtitle: "Банк России · Уральское отделение" },
  { year: "2020", title: "Разработчик ПО", subtitle: "Deloitte" },
  { year: "2022 — сейчас", title: "Разработчик ПО", subtitle: "ДРТ Тех", current: true },
];
```

### Visual Design

- Vertical red line (`background: linear-gradient(to bottom, #991b1b, transparent)`) on the left edge
- Each item has a red filled dot (`background: #991b1b`, `box-shadow` glow)
- Current item dot is larger and has a CSS `@keyframes pulse` glow animation
- Year: monospace, `0.53rem`, `letter-spacing: 0.15em`, color `var(--ds-accent)`
- Title: `0.85rem`, `font-weight: 600`, color `var(--ds-text)`
- Subtitle: `0.72rem`, color `var(--ds-text-3)`
- Section label "Карьера" uses existing `.ds-about-section-label` class
- Styles added to `app/globals.css` under the `/* ─── About Page ───` section

### Animation

Triggered by scroll (`useInView` from `framer-motion`, `once: true`, `margin: "-60px"`).

Each item animates from:
```
opacity: 0  →  opacity: 1
filter: blur(8px)  →  filter: blur(0)
y: 10px  →  y: 0
```

- Duration: `0.5s`
- Easing: `[0.16, 1, 0.3, 1]` (matches existing page animations)
- Stagger: `delay = index × 0.12s`
- `useReducedMotion` respected — if true, no animation

Implementation: individual `motion.div` per item with computed `delay = index × 0.12s`, matching the existing `fadeUp` helper pattern in `AboutPageContent.tsx`. No `staggerChildren` variants needed.

---

## 2. CV Download Link

### Placement

Inside `ds-about-photo-wrapper` in the **right column** (`ds-about-right`), below the photo frame. The wrapper's flex layout (`align-items: center; justify-content: center`) must gain `flex-direction: column` and a small `gap` so the photo frame and link stack vertically. On mobile (≤900px) the wrapper is `position: static` and this stacking works naturally.

### Element

An `<a>` tag with `href="/assets/cv/filat-astakhov-cv.pdf"` and `download` attribute. Styled as a small outlined button consistent with the site's design language:

- Monospace label, `0.55rem`, uppercase, `letter-spacing: 0.18em`
- Border `1px solid var(--ds-border)`, hover `border-color: var(--ds-accent)`
- Arrow icon (→) or download icon before the text
- Text: **"Скачать резюме"**
- Subtle fade-in animation matching the photo panel's entrance (`delay: 0.35s`)

### CSS class

New class `.ds-about-cv-link` added to `globals.css`.

---

## 3. Placeholder CV PDF

A placeholder PDF placed at `public/assets/cv/filat-astakhov-cv.pdf`.

- Single-page placeholder PDF with text "Filat Astakhov — CV (placeholder)"
- Generated as a minimal valid PDF binary and committed directly to the repo
- Served as static asset by Next.js at `/assets/cv/filat-astakhov-cv.pdf` — no API route needed
- The `download` attribute on the `<a>` tag triggers browser download dialog

---

## Files Changed

| File | Change |
|------|--------|
| `src/app-pages/about/ui/AboutPageContent.tsx` | Add `CareerTimeline` section + CV link |
| `src/app-pages/about/ui/career.ts` *(new)* | `CAREER` constant array |
| `app/globals.css` | New classes: `.ds-timeline-*`, `.ds-about-cv-link` |
| `public/assets/cv/filat-astakhov-cv.pdf` *(new)* | Placeholder CV PDF |

---

## Out of Scope

- No database model for career events — hardcoded data only
- No admin panel CRUD for timeline entries
- No i18n / language switching

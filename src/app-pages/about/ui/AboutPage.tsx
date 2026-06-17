'use client';

const skills = [
  'React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion',
  'Redux Toolkit', 'Three.js', 'WebGL', 'Prisma', 'PostgreSQL',
  'Figma', 'Docker', 'Git',
];

const stats = [
  { num: '5+',  label: 'Years active' },
  { num: '20+', label: 'Projects built' },
  { num: '2',   label: 'Disciplines' },
];

export const AboutPage = () => {
  return (
    <main className="ds-about-layout">
      {/* ── Left: text content ── */}
      <section className="ds-about-left">
        <div className="ds-about-eyebrow ds-eyebrow">02 / About</div>

        <h1 className="ds-about-heading">
          About
          <span className="ds-about-heading-ghost">Me</span>
        </h1>

        <div className="ds-about-body">
          <p>
            Hi, I&apos;m <strong>Filat Astakhov</strong> — a frontend developer focused on building
            beautiful, performant interfaces. I&apos;ve been crafting web experiences since 2020,
            working across freelance projects and product teams.
          </p>
          <p>
            My approach combines <strong>technical rigor with design sensibility</strong>.
            I care deeply about how things look and feel, not just what&apos;s running underneath.
            From fluid transitions to accessible markup: every detail matters.
          </p>
          <p>
            Outside of client work I experiment with creative coding: generative art,
            WebGL shaders, and interactive installations that exist somewhere between
            design and engineering.
          </p>
        </div>

        <div className="ds-about-section-label">Core Skills</div>
        <div className="ds-about-skills">
          {skills.map((s) => (
            <span key={s} className="ds-tag">{s}</span>
          ))}
        </div>

        <div className="ds-about-stats">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="ds-stat-num">{s.num}</div>
              <div className="ds-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Right: photo placeholder ── */}
      <aside className="ds-about-right" aria-label="Portrait placeholder">
        <div className="ds-about-photo-wrapper">
          <div className="ds-about-photo-frame">
            <div className="ds-about-photo">
              <div className="ds-about-photo-geo" aria-hidden="true" />
              <span className="ds-about-photo-initials" aria-label="Filat Astakhov initials">
                FA
              </span>
              <div className="ds-about-photo-caption">Photo placeholder</div>
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
};

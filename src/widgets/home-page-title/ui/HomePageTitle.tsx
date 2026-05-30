export const HomePageTitle = () => {
  return (
    <>
      <div className="ds-hero-eyebrow">
        <div className="ds-status">
          <span className="ds-status-dot" aria-hidden="true" />
          Available for freelance &amp; collaboration
        </div>
        <div className="ds-eyebrow">Frontend Developer &amp; UI Engineer</div>
      </div>

      <h1 className="ds-hero-name">
        <span className="ds-hero-name-first">Filat</span>
        <span className="ds-hero-name-last">Astakhov</span>
      </h1>

      <div className="ds-hero-meta">
        <div className="ds-hero-meta-item">
          <div className="ds-hero-meta-label">Specialization</div>
          <div className="ds-hero-meta-value">
            Interactive Interfaces<br />&amp; Web Experiences
          </div>
        </div>
        <div className="ds-hero-meta-item">
          <div className="ds-hero-meta-label">Current Stack</div>
          <div className="ds-hero-meta-value">
            React · TypeScript<br />Next.js · Tailwind
          </div>
        </div>
        <div className="ds-hero-meta-item">
          <div className="ds-hero-meta-label">Active Since</div>
          <div className="ds-hero-meta-value">2020</div>
        </div>
      </div>

      <div className="ds-hero-bg-char" aria-hidden="true">A</div>
    </>
  );
};

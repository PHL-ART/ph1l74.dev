export const HomePageTitle = () => {
  return (
    <>
      <div className="ds-hero-eyebrow">
        <div className="ds-status">
          <span className="ds-status-dot" aria-hidden="true" />
          Открыт к фрилансу и сотрудничеству
        </div>
        <div className="ds-eyebrow">Фронтенд разработчик и UI инженер</div>
      </div>

      <h1 className="ds-hero-name">
        <span className="ds-hero-name-first">Филат</span>
        <span className="ds-hero-name-last">Астахов</span>
      </h1>

      <div className="ds-hero-meta">
        <div className="ds-hero-meta-item">
          <div className="ds-hero-meta-label">Специализация</div>
          <div className="ds-hero-meta-value">
            Интерактивные интерфейсы<br />&amp; веб-опыт
          </div>
        </div>
        <div className="ds-hero-meta-item">
          <div className="ds-hero-meta-label">Текущий стек</div>
          <div className="ds-hero-meta-value">
            React · TypeScript<br />Next.js · Tailwind
          </div>
        </div>
        <div className="ds-hero-meta-item">
          <div className="ds-hero-meta-label">В разработке с</div>
          <div className="ds-hero-meta-value">2020</div>
        </div>
      </div>

      <div className="ds-hero-bg-char" aria-hidden="true">А</div>
    </>
  );
};

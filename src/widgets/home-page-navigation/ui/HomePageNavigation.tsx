import Link from "next/link";

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
  return (
    <nav className="ds-home-nav" aria-label="Site sections">
      <div className="ds-home-nav-grid">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="ds-home-nav-card">
            <div className="ds-home-nav-num">{card.num}</div>
            <div className="ds-home-nav-title">{card.title}</div>
            <div className="ds-home-nav-desc">{card.desc}</div>
            <span className="ds-home-nav-arrow" aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

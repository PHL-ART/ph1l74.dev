import Link from "next/link";

const cards = [
  {
    num: "01 / Work",
    title: "Projects",
    desc: "Selected projects and experiments built over the years",
    href: "/projects",
  },
  {
    num: "02 / Story",
    title: "About",
    desc: "Background, skills, and what drives my work",
    href: "/about",
  },
  {
    num: "03 / Connect",
    title: "Contacts",
    desc: "Every channel where you can reach or follow me",
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

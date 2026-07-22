'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useState } from "react";

const navLinks = [
  { title: 'В начало',  href: '/' },
  { title: 'Проекты',   href: '/projects' },
  { title: 'Обо мне',   href: '/about' },
  { title: 'Контакты',  href: '/contacts' },
];

export const Header: FC = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="ds-site-header">
      <Link href="/" className="ds-site-logo">
        <img src="/assets/icons/fa-logo.svg" alt="" aria-hidden="true" width={20} height={20} />
        ph1l74<span className="dot">.</span>dev
      </Link>

      <button
        className="ds-nav-hamburger"
        onClick={() => setMobileOpen((o) => !o)}
        aria-label="Toggle navigation"
        aria-expanded={mobileOpen}
      >
        <span
          style={{
            transform: mobileOpen ? 'translateY(6.5px) rotate(45deg)' : undefined,
            background: mobileOpen ? 'var(--ds-text)' : undefined,
          }}
        />
        <span style={{ opacity: mobileOpen ? 0 : undefined }} />
        <span
          style={{
            transform: mobileOpen ? 'translateY(-6.5px) rotate(-45deg)' : undefined,
            background: mobileOpen ? 'var(--ds-text)' : undefined,
          }}
        />
      </button>

      <nav className="ds-site-header-nav">
        <ul className={`ds-site-nav${mobileOpen ? ' ds-mobile-open' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={isActive(link.href) ? 'ds-active' : undefined}
                onClick={() => setMobileOpen(false)}
              >
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

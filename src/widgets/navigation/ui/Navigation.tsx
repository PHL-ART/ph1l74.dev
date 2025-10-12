'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/projects', label: 'Projects' },
    { href: '/contacts', label: 'Contacts' },
  ];

  return (
    <nav className="flex justify-center items-center py-4">
      <ul className="flex space-x-8">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`text-lg font-medium transition-colors hover:text-blue-400 ${
                pathname === item.href ? 'text-blue-400' : 'text-white'
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

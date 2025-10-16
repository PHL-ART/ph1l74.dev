'use client';

import { IconHome } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

interface NavigationLinkProps {
  title: React.ReactNode | React.ReactNode[] | string | null;
  href: string;
  description?: string;
  isActive?: boolean;
}

const NavigationLink: FC<NavigationLinkProps> = ({ href, title, isActive }) => {
  const className = "text-lg font-medium transition-colors px-4 py-2 hover:text-red-800";
  const activeClass = isActive ? 'text-red-800' : 'text-white';


  return (
    <li>
      <Link
        href={href}
        className={`${className} ${activeClass}`}
      >
        {title}
      </Link>
    </li>
  );
};

export const Navigation: FC<{}> = () => {
  const pathname = usePathname();

  const navItems: NavigationLinkProps[] = [
    {
      title: "Projects",
      href: "/projects",
    },
    {
      title: "About",
      href: "/about",
    },
    {
      title: "Contacts",
      href: "/contacts",
    },
  ];

  if (pathname === '/') {
    return null;
  }

  return (

    <nav className="w-full flex justify-center items-center">
      <ul className="flex gap-2 border-2 border-slate-200 rounded-2xl p-1 flex-row gap-1self-center text-white">
        <li>

          <Link
            href={'/'}
            className="text-lg px-2 font-medium transition-colors"
          >
            <IconHome />
          </Link>
        </li>
        {navItems.map((link, index) => {
          const isActive = pathname === link.href;
          return (
            <NavigationLink
              key={`main_nav_${link.href.replace("/", "")}_${index}`}
              href={link.href}
              title={link.title}
              description={link.description}
              isActive={isActive}
            />
          );
        })}

      </ul>
    </nav>
  );
};

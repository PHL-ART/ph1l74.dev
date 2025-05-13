'use client';

import { IconHome } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

const PageNavigationLink: FC<MainNavigationLinkProps> = ({ href, title, isActive }) => {

  const className = "flex flex-col rounded-xl py-1 grow shrink basis-0 w-0 hover:bg-white/15 gap-4";
  const activeClass = 'bg-white/25';

  return (
    <Link
      href={href}
      className={!isActive ? className : `${className}  ${activeClass}`}
    >
      <div className="flex flex-row w-full justify-center text-xl font-semibold text-center">
        {title}
      </div>
    </Link>
  );
};

export const PageNavigation: FC<{}> = () => {

  const pathname = usePathname();

  const isRoot = pathname === '/';

  const links: MainNavigationLinkProps[] = [
    {
      title: "Projects",
      href: "/projects",
      description:
        "All sort of my projects: work projects, open source contirbution, pet projects.",
    },
    {
      title: "About",
      href: "/about",
      description: "Few information about me: education, career, etc.",
    },
    {
      title: "Contacts",
      href: "/contacts",
      description: "Different ways to connect with me.",
    },
  ];

  return isRoot ? null : (
    <header className="z-20 pt-8 flex flex-col justify-center">
      <div className="border-2 border-slate-200 rounded-2xl p-1 flex flex-row gap-1 w-8/12 self-center xl:w-6/12 2xl:w-4/12 relative">
        {links.map((link, index) => {
          const isActive = pathname === link.href;
          return (
            <PageNavigationLink
              key={`main_nav_${link.href.replace("/", "")}_${index}`}
              href={link.href}
              title={link.title}
              description={link.description}
              isActive={isActive}
            />
          );
        })}
        <Link
          href={'/'}
          className="absolute -left-12 top-2"
        >
          <IconHome />
        </Link>
      </div>
    </header>
  );
};

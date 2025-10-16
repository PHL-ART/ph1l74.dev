'use client';

import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { FC } from "react";

interface HomePageNavigationLinkProps {
  title: React.ReactNode | React.ReactNode[] | string | null;
  href: string;
  description?: string;
  isActive?: boolean;
}

const HomePageNavigationLink: FC<HomePageNavigationLinkProps> = ({
  href,
  title,
  description,
}) => {
  return (
    <Link
      href={href}
      className="flex flex-col p-2 rounded-lg grow shrink scale-95 transition-all duration-200 ease-in-out basis-0 w-0 gap-4 before:opacity-0 before:scale-90 before:translate-y-8 before:transition-all before:duration-500 before:delay-100 before:block before:absolute hover:before:translate-y-0 before:inset-0 before:bg-white/15 relative before:rounded-md hover:before:opacity-100 hover:before:scale-100 hover:animate-nav-card-on hover:scale-100  "
    >
      <div className="flex flex-row justify-between">
        <div className="text-2xl font-bold">{title}</div>
        <IconArrowRight size={32} />
      </div>
      <div className="">{description}</div>
    </Link>
  );
};

export const HomePageNavigation: FC<{}> = () => {
  const links: HomePageNavigationLinkProps[] = [
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

  return (
    <div className="border-2 border-slate-200 rounded-lg p-2 flex flex-row w-full self-center">
      {links.map((link, index) => {
        return (
          <HomePageNavigationLink
            key={`main_nav_${link.href.replace("/", "")}_${index}`}
            href={link.href}
            title={link.title}
            description={link.description}
          />
        );
      })}
    </div>
  );
};
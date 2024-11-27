import Link from "next/link";
import { FC } from "react";

const PageNavigationLink: FC<MainNavigationLinkProps> = ({ href, title }) => {
  return (
    <Link
      href={href}
      className="flex flex-col p-1 rounded-xl grow shrink basis-0 w-0 hover:bg-white/15 gap-4"
    >
      <div className="flex flex-row w-full justify-center text-xl font-semibold text-center">
        {title}
      </div>
    </Link>
  );
};

export const PageNavigation: FC<{}> = () => {
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

  return (
    <div className="border-2 border-slate-200 rounded-2xl p-1 flex flex-row w-8/12 self-center xl:w-6/12 2xl:w-4/12">
      {links.map((link, index) => {
        return (
          <PageNavigationLink
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

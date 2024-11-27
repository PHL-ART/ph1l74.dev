import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { FC } from "react";

const MainNavigationLink: FC<MainNavigationLinkProps> = ({
  href,
  title,
  description,
}) => {
  return (
    <Link
      href={href}
      className="flex flex-col p-2 rounded-lg grow shrink basis-0 w-0 hover:bg-white/15 gap-4"
    >
      <div className="flex flex-row justify-between">
        <div className="text-2xl font-bold">{title}</div>
        <IconArrowRight size={32} />
      </div>
      <div className="">{description}</div>
    </Link>
  );
};

export const Navigation: FC<{}> = () => {
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
    <div className="border-2 border-slate-200 rounded-lg p-2 flex flex-row w-full self-center">
      {links.map((link, index) => {
        return (
          <MainNavigationLink
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

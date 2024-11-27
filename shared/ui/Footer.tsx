import { FC } from "react";
import { IconBrandGithub, IconBrandLinkedin, IconBrandTelegram, IconCopyright } from "@tabler/icons-react";

export const Footer: FC<{}> = () => {
  return (
    <footer className="container p-4 flex flex-row justify-between w-full z-10">
      <div className="flex flex-row items-center justify-center gap-2 text-lg">
        <span>Filat Astakhov</span>
        <IconCopyright size={16} />
        <span>2024</span>
      </div>
      <div className="flex flex-row items-center justify-center gap-8 text-lg">
        <a href="#"><IconBrandTelegram size={32} /></a>
        <a href="#"><IconBrandGithub size={32} /></a>
        <a href="#"><IconBrandLinkedin size={32} /></a>
      </div>
    </footer>
  );
};

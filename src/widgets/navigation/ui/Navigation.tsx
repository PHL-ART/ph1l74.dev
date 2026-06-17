'use client';

import { IconHome } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FC, useCallback, useLayoutEffect, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

interface NavigationLinkProps {
  title: React.ReactNode | React.ReactNode[] | string | null;
  href: string;
  description?: string;
  isActive?: boolean;
}

const HOME_HREF = "/";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    y: "-100%",
    transition: {
      duration: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -14 },
  visible: { opacity: 1, y: 0 },
};

const NavigationLink: FC<NavigationLinkProps> = ({ href, title, isActive }) => {
  return (
    <motion.li variants={itemVariants}>
      <Link
        href={href}
        className={`relative z-10 block text-lg font-medium px-4 py-2.5 rounded-xl transition-colors duration-200
          ${isActive ? "text-white" : "text-white/80 hover:text-white hover:bg-white/[0.06]"}`}
      >
        {title}
      </Link>
    </motion.li>
  );
};

export const Navigation: FC<{}> = () => {
  const pathname = usePathname();
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hasNavigatedRef = useRef(false);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });
  const [isExiting, setIsExiting] = useState(false);

  const navItems: NavigationLinkProps[] = [
    { title: "Projects", href: "/projects" },
    { title: "About", href: "/about" },
    { title: "Contacts", href: "/contacts" },
  ];

  const allHrefs = [HOME_HREF, ...navItems.map((n) => n.href)];
  const activeIndex = allHrefs.indexOf(pathname);

  // Сбрасываем isExiting на любой странице кроме главной — иначе меню остаётся «уехавшим»
  useEffect(() => {
    if (pathname !== HOME_HREF) {
      setIsExiting(false);
      hasNavigatedRef.current = false;
    }
  }, [pathname]);

  useLayoutEffect(() => {
    if (activeIndex < 0) {
      setPillStyle((prev) => ({ ...prev, width: 0 }));
      return;
    }
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const items = wrapper.querySelectorAll<HTMLElement>("ul > li");
    const activeItem = items[activeIndex];
    if (!activeItem) return;
    const wrapperRect = wrapper.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();
    const borderPadding = 6;
    setPillStyle({
      left: itemRect.left - wrapperRect.left - borderPadding,
      width: itemRect.width,
    });
  }, [activeIndex, pathname]);

  const handleHomeClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (isExiting) return;
      setIsExiting(true);
    },
    [isExiting]
  );

  const handleExitComplete = useCallback(() => {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;
    router.push(HOME_HREF);
    requestAnimationFrame(() => setIsExiting(false));
  }, [router]);

  const showNav = pathname !== HOME_HREF || isExiting;
  if (!showNav) return null;

  return (
    <nav className="w-full flex justify-center items-center overflow-hidden">
        <motion.div
          key="nav-bar"
          ref={wrapperRef}
          className="relative flex flex-row gap-1 rounded-2xl p-1.5 self-center items-center
            bg-white/[0.05] border border-white/[0.1] backdrop-blur-2xl
            shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_8px_32px_-8px_rgba(0,0,0,0.4)]"
          variants={containerVariants}
          initial="hidden"
          animate={isExiting ? "exit" : "visible"}
          onAnimationComplete={() => {
            if (isExiting) handleExitComplete();
          }}
        >
            <div
              aria-hidden
              className="absolute top-1.5 bottom-1.5 z-0 rounded-xl transition-[left,width] duration-300 ease-out
                bg-white/[0.12] border border-white/[0.08] backdrop-blur-md
                shadow-[0_0_0_1px_rgba(255,255,255,0.1)_inset]"
              style={{
                left: pillStyle.left,
                width: pillStyle.width,
                opacity: pillStyle.width > 0 ? 1 : 0,
              }}
            />
            <ul className="relative z-10 flex flex-row gap-1 items-center list-none m-0 p-0">
              <motion.li variants={itemVariants}>
                <Link
                  href={HOME_HREF}
                  onClick={handleHomeClick}
                  className="inline-flex items-center justify-center text-lg px-4 py-2.5 font-medium rounded-xl
                    text-white/90 transition-colors duration-200 hover:text-white hover:bg-white/[0.06]"
                >
                  <IconHome className="size-5 shrink-0" stroke={1.5} />
                </Link>
              </motion.li>
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
          </motion.div>
    </nav>
  );
};

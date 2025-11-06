'use client';

import { ReactTyped } from 'react-typed';

export const HomePageTitle = () => {
  const strings = [
    "Javascript",
    "",
    "Typescript",
    "",
    "React",
    "React + Redux",
    "",
    "NextJS",
    "",
    "NodeJS",
    "",
    "ExpressJS",
    "",
  ];

  return (
    <div className="flex flex-row basis-full items-center gap-10">
      <div className="grow shrink basis-0 flex justify-center font-bold text-6xl">
        Filat Astakhov
      </div>
      <div className="grow shrink basis-0 text-4xl font-light">
        <ReactTyped
          strings={strings}
          typeSpeed={40}
          backSpeed={50} loop>
        </ReactTyped>
        <div>Developer</div>
      </div>
    </div>
  );
};

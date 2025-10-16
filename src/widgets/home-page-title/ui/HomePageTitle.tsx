'use client';

import { useEffect, useState } from 'react';

export const HomePageTitle = () => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const texts = ['Frontend', 'React', 'Next.js', 'TypeScript'];

    const interval = setInterval(() => {
      if (currentIndex < texts.length) {
        const currentTextToShow = texts[currentIndex];
        if (currentText.length < currentTextToShow.length) {
          setCurrentText(currentTextToShow.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => {
            setCurrentText('');
            setCurrentIndex((prev) => (prev + 1) % texts.length);
          }, 2000);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [currentText, currentIndex]);

  return (
    <div className="flex flex-row basis-full items-center gap-10">
      <div className="grow shrink basis-0 flex justify-center font-bold text-6xl">
        Filat Astakhov
      </div>
      <div className="grow shrink basis-0 text-4xl font-light">
        <div className="text-4xl font-light">
          {currentText}
          <span className="animate-pulse">|</span>
        </div>
        <div>Developer</div>
      </div>
    </div>
  );
};

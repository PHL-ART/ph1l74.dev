'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface WavyBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: 'slow' | 'fast';
  waveOpacity?: number;
}

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur,
  speed,
  waveOpacity,
}: WavyBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    const drawWave = (time: number) => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = window.innerWidth;
      const height = window.innerHeight;

      // Draw background
      if (backgroundFill) {
        ctx.fillStyle = backgroundFill;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw waves
      colors?.forEach((color, index) => {
        ctx.beginPath();
        ctx.moveTo(0, height / 2);

        for (let x = 0; x <= width; x += 1) {
          const y =
            height / 2 +
            Math.sin((x / (waveWidth || 50)) + time * (speed === 'fast' ? 0.02 : 0.01)) *
              (20 + index * 5) *
              (waveOpacity || 0.5);

          ctx.lineTo(x, y);
        }

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      timeRef.current = time;
      animationId = requestAnimationFrame(drawWave);
    };

    const startAnimation = () => {
      resizeCanvas();
      drawWave(0);
    };

    startAnimation();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [colors, waveWidth, backgroundFill, speed, waveOpacity]);

  return (
    <div className={cn('relative h-full w-full', containerClassName)}>
      <canvas
        ref={canvasRef}
        className={cn('absolute inset-0', className)}
        style={{ filter: blur ? `blur(${blur}px)` : undefined }}
      />
      {children}
    </div>
  );
};

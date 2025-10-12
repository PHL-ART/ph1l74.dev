'use client';

import { cn } from '@/src/shared/lib/utils';

interface GlowingCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlowingCard = ({ children, className }: GlowingCardProps) => {
  return (
    <div className={cn(
      "group relative overflow-hidden rounded-xl bg-white dark:bg-gray-900 shadow-lg transition-all duration-300",
      "hover:shadow-2xl hover:shadow-blue-500/25 dark:hover:shadow-blue-400/25",
      "border border-gray-200 dark:border-gray-700",
      "hover:border-blue-300 dark:hover:border-blue-600",
      className
    )}>
      {/* Glowing effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>
      
      {/* Animated border */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" 
           style={{
             background: 'linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.1), transparent)',
             animation: 'shimmer 2s infinite'
           }} />
    </div>
  );
};

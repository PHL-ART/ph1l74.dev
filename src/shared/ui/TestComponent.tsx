'use client';

import { cn } from '@/src/shared/lib/utils';
import { GlowingCard } from './GlowingCard';

export const TestComponent = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Aceternity UI Test
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GlowingCard>
            <h3 className="text-xl font-semibold mb-2">Card Hover Effect</h3>
            <p className="text-gray-600 dark:text-gray-300">
              This card demonstrates the hover effects from Aceternity UI.
            </p>
          </GlowingCard>
          
          <GlowingCard>
            <h3 className="text-xl font-semibold mb-2">Gradient Background</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Beautiful gradient backgrounds with smooth transitions.
            </p>
          </GlowingCard>
          
          <GlowingCard>
            <h3 className="text-xl font-semibold mb-2">Smooth Animations</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Smooth animations and transitions for better UX.
            </p>
          </GlowingCard>
        </div>
        
        <div className="mt-8 text-center">
          <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Gradient Button
          </button>
        </div>
      </div>
    </div>
  );
};

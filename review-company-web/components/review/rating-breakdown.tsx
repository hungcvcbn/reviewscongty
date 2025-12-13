'use client';

import { useEffect, useState } from 'react';
import { CategoryRating } from '@/lib/types';
import { getCategoryNameVi } from '@/lib/data';
import { cn } from '@/lib/utils';

interface RatingBreakdownProps {
  categoryRatings: CategoryRating[];
}

export function RatingBreakdown({ categoryRatings }: RatingBreakdownProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'from-green-500 to-emerald-500';
    if (rating >= 3) return 'from-yellow-500 to-amber-500';
    if (rating >= 2) return 'from-orange-500 to-orange-400';
    return 'from-red-500 to-red-400';
  };

  const getRatingBgColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-100';
    if (rating >= 3) return 'bg-yellow-100';
    if (rating >= 2) return 'bg-orange-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        {categoryRatings.map((item, index) => (
          <div 
            key={item.category.id} 
            className={cn(
              'group',
              'transition-all duration-300 ease-out',
              'hover:scale-[1.02]'
            )}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-10px)',
              transitionDelay: `${index * 80}ms`,
            }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-gray-700">
                {getCategoryNameVi(item.category.name)}
              </span>
              {item.count > 0 ? (
                <div className="flex items-center gap-2">
                  <span 
                    className={cn(
                      'text-sm font-semibold tabular-nums',
                      item.averageRating >= 4 ? 'text-green-600' :
                      item.averageRating >= 3 ? 'text-yellow-600' :
                      item.averageRating >= 2 ? 'text-orange-500' : 'text-red-500'
                    )}
                  >
                    {item.averageRating.toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-400">({item.count})</span>
                </div>
              ) : (
                <span className="text-xs text-gray-400 italic">Chưa có</span>
              )}
            </div>
            
            {/* Progress Bar */}
            <div className={cn(
              'h-2 rounded-full overflow-hidden',
              getRatingBgColor(item.averageRating)
            )}>
              <div
                className={cn(
                  'h-full rounded-full',
                  'bg-gradient-to-r',
                  getRatingColor(item.averageRating),
                  'transition-all duration-700 ease-out'
                )}
                style={{
                  width: isVisible && item.count > 0 
                    ? `${(item.averageRating / 5) * 100}%` 
                    : '0%',
                  transitionDelay: `${index * 80 + 200}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {categoryRatings.every(item => item.count === 0) && (
        <p className="text-sm text-gray-400 text-center italic py-4">
          Chưa có đánh giá chi tiết cho công ty này
        </p>
      )}
    </div>
  );
}

'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingDisplayProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
  animated?: boolean;
}

export function RatingDisplay({
  rating,
  size = 'md',
  showValue = true,
  className,
  animated = false,
}: RatingDisplayProps) {
  const sizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    const baseDelay = animated ? i * 100 : 0;
    
    if (i < fullStars) {
      stars.push(
        <Star
          key={i}
          className={cn(
            sizeClasses[size], 
            'fill-yellow-400 text-yellow-400',
            'transition-all duration-200',
            animated && 'hover:scale-125 hover:fill-yellow-300'
          )}
          style={{
            animationDelay: animated ? `${baseDelay}ms` : undefined,
          }}
        />
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <div 
          key={i} 
          className={cn(
            'relative',
            'transition-transform duration-200',
            animated && 'hover:scale-125'
          )}
          style={{
            animationDelay: animated ? `${baseDelay}ms` : undefined,
          }}
        >
          <Star className={cn(sizeClasses[size], 'text-gray-200')} />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star
              className={cn(sizeClasses[size], 'fill-yellow-400 text-yellow-400')}
            />
          </div>
        </div>
      );
    } else {
      stars.push(
        <Star 
          key={i} 
          className={cn(
            sizeClasses[size], 
            'text-gray-200',
            'transition-all duration-200',
            animated && 'hover:scale-110 hover:text-gray-300'
          )}
          style={{
            animationDelay: animated ? `${baseDelay}ms` : undefined,
          }}
        />
      );
    }
  }

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className={cn('flex gap-0.5', animated && 'group')}>
        {stars}
      </div>
      {showValue && (
        <span 
          className={cn(
            'font-semibold tabular-nums',
            textSizeClasses[size],
            rating >= 4 ? 'text-green-600' : 
            rating >= 3 ? 'text-yellow-600' : 
            rating >= 2 ? 'text-orange-500' : 'text-red-500'
          )}
        >
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingDisplayProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

export function RatingDisplay({
  rating,
  size = 'md',
  showValue = true,
  className,
}: RatingDisplayProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
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
    if (i < fullStars) {
      stars.push(
        <Star
          key={i}
          className={cn(sizeClasses[size], 'fill-yellow-400 text-yellow-400')}
        />
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <div key={i} className="relative">
          <Star className={cn(sizeClasses[size], 'text-gray-300')} />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star
              className={cn(sizeClasses[size], 'fill-yellow-400 text-yellow-400')}
            />
          </div>
        </div>
      );
    } else {
      stars.push(
        <Star key={i} className={cn(sizeClasses[size], 'text-gray-300')} />
      );
    }
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex">{stars}</div>
      {showValue && (
        <span className={cn('font-medium text-gray-700', textSizeClasses[size])}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

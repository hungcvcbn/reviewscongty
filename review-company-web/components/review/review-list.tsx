import { ReviewCard } from './review-card';
import { ReviewWithDetails } from '@/lib/types';
import { MessageSquare, PenLine } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ReviewListProps {
  reviews: ReviewWithDetails[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div 
        className={cn(
          'text-center py-16',
          'bg-gradient-to-br from-gray-50 to-gray-100/50',
          'rounded-2xl border border-dashed border-gray-200',
          'animate-fade-in'
        )}
      >
        <MessageSquare className="h-14 w-14 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg mb-2">Chưa có review nào</p>
        <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">
          Hãy là người đầu tiên chia sẻ trải nghiệm của bạn về công ty này!
        </p>
        <Button 
          className={cn(
            'bg-blue-600 hover:bg-blue-700',
            'shadow-lg shadow-blue-200',
            'transition-all duration-200',
            'hover:shadow-xl hover:shadow-blue-300',
            'hover:-translate-y-0.5'
          )}
        >
          <PenLine className="h-4 w-4 mr-2" />
          Viết review đầu tiên
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review, index) => (
        <ReviewCard key={review.id} review={review} index={index} />
      ))}
    </div>
  );
}

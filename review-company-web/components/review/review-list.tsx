import { ReviewCard } from './review-card';
import { ReviewWithDetails } from '@/lib/types';

interface ReviewListProps {
  reviews: ReviewWithDetails[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Chưa có review nào cho công ty này.</p>
        <p className="text-sm text-gray-400 mt-1">
          Hãy là người đầu tiên chia sẻ trải nghiệm của bạn!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}

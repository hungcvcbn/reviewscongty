import { RatingDisplay } from './rating-display';
import { CategoryRating } from '@/lib/types';
import { getCategoryNameVi } from '@/lib/data';

interface RatingBreakdownProps {
  categoryRatings: CategoryRating[];
}

export function RatingBreakdown({ categoryRatings }: RatingBreakdownProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Đánh giá theo hạng mục</h3>
      <div className="space-y-3">
        {categoryRatings.map((item) => (
          <div key={item.category.id} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {getCategoryNameVi(item.category.name)}
            </span>
            <div className="flex items-center gap-2">
              {item.count > 0 ? (
                <>
                  <RatingDisplay rating={item.averageRating} size="sm" />
                  <span className="text-xs text-gray-400">({item.count})</span>
                </>
              ) : (
                <span className="text-sm text-gray-400">Chưa có đánh giá</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

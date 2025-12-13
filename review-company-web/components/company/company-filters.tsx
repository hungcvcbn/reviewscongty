'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SortOption } from '@/lib/data';

interface CompanyFiltersProps {
  ratingFilter: string;
  sortBy: SortOption;
  onRatingFilterChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
}

export function CompanyFilters({
  ratingFilter,
  sortBy,
  onRatingFilterChange,
  onSortChange,
}: CompanyFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 whitespace-nowrap">Lọc theo rating:</span>
        <Select value={ratingFilter} onValueChange={onRatingFilterChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Tất cả" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="4">4+ sao</SelectItem>
            <SelectItem value="3">3+ sao</SelectItem>
            <SelectItem value="2">2+ sao</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 whitespace-nowrap">Sắp xếp:</span>
        <Select value={sortBy} onValueChange={(v) => onSortChange(v as SortOption)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Rating cao nhất" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Rating cao nhất</SelectItem>
            <SelectItem value="newest">Mới nhất</SelectItem>
            <SelectItem value="reviews">Nhiều reviews nhất</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

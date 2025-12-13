'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SortOption } from '@/lib/data';
import { Star, SortDesc } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Rating Filter */}
      <div className="flex items-center gap-2">
        <div className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg',
          'bg-gray-50 border border-gray-200'
        )}>
          <Star className="h-4 w-4 text-yellow-500" />
          <span className="text-sm text-gray-600 font-medium whitespace-nowrap">Rating:</span>
        </div>
        <Select value={ratingFilter} onValueChange={onRatingFilterChange}>
          <SelectTrigger 
            className={cn(
              'w-[130px] rounded-lg border-2',
              'transition-all duration-200',
              'hover:border-blue-300',
              'focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
            )}
          >
            <SelectValue placeholder="Tất cả" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all" className="rounded-lg">Tất cả</SelectItem>
            <SelectItem value="4" className="rounded-lg">
              <span className="flex items-center gap-1">
                4+ <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              </span>
            </SelectItem>
            <SelectItem value="3" className="rounded-lg">
              <span className="flex items-center gap-1">
                3+ <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              </span>
            </SelectItem>
            <SelectItem value="2" className="rounded-lg">
              <span className="flex items-center gap-1">
                2+ <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <div className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg',
          'bg-gray-50 border border-gray-200'
        )}>
          <SortDesc className="h-4 w-4 text-blue-500" />
          <span className="text-sm text-gray-600 font-medium whitespace-nowrap">Sắp xếp:</span>
        </div>
        <Select value={sortBy} onValueChange={(v) => onSortChange(v as SortOption)}>
          <SelectTrigger 
            className={cn(
              'w-[170px] rounded-lg border-2',
              'transition-all duration-200',
              'hover:border-blue-300',
              'focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
            )}
          >
            <SelectValue placeholder="Rating cao nhất" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="rating" className="rounded-lg">Rating cao nhất</SelectItem>
            <SelectItem value="newest" className="rounded-lg">Mới nhất</SelectItem>
            <SelectItem value="reviews" className="rounded-lg">Nhiều reviews nhất</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

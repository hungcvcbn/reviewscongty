'use client';

import { useState, useEffect, useCallback } from 'react';
import { CompanyCard } from './company-card';
import { CompanyFilters } from './company-filters';
import { CompanySearch } from './company-search';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { StaggeredList } from '@/components/animations';
import { fetchCompanies, CompanyFromApi, FetchCompaniesParams } from '@/lib/api';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Search, Loader2 } from 'lucide-react';

interface CompanyListProps {
  initialSearch?: string;
}

// Map sort options to API format
type SortOption = 'rating' | 'newest' | 'reviews';
const sortOptionMap: Record<SortOption, FetchCompaniesParams['sort']> = {
  rating: 'rating_desc',
  newest: 'newest',
  reviews: 'reviews_desc',
};

const ITEMS_PER_PAGE = 9;

export function CompanyList({ initialSearch = '' }: CompanyListProps) {
  const [companies, setCompanies] = useState<CompanyFromApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch companies from API
  const loadCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: FetchCompaniesParams = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        sort: sortOptionMap[sortBy],
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      if (ratingFilter !== 'all') {
        params.minRating = parseInt(ratingFilter, 10);
      }

      const response = await fetchCompanies(params);
      setCompanies(response.data);
      setTotalItems(response.pagination.total);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError('Không thể tải danh sách công ty. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, ratingFilter, sortBy]);

  // Load companies on mount and when filters change
  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleRatingFilterChange = (value: string) => {
    setRatingFilter(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  // Pagination logic
  const getPaginationRange = () => {
    const delta = 2;
    const range: (number | string)[] = [];
    
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      } else if (range[range.length - 1] !== '...') {
        range.push('...');
      }
    }
    
    return range;
  };

  // Loading skeleton
  if (loading && companies.length === 0) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-4 animate-fade-in-up">
          <Skeleton className="h-12 w-full rounded-xl" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex gap-3">
              <Skeleton className="h-10 w-32 rounded-lg" />
              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
            <Skeleton className="h-5 w-40 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4 p-6 border rounded-xl bg-white">
              <div className="flex items-start gap-4">
                <Skeleton className="h-16 w-16 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-12 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 animate-fade-in-up">
        <CompanySearch
          defaultValue={searchQuery}
          onSearch={handleSearch}
          placeholder="Tìm kiếm công ty..."
        />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CompanyFilters
            ratingFilter={ratingFilter}
            sortBy={sortBy}
            onRatingFilterChange={handleRatingFilterChange}
            onSortChange={handleSortChange}
          />
          <div className="flex items-center gap-2">
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            )}
            <p className="text-sm text-gray-500 tabular-nums">
              Hiển thị <span className="font-medium text-gray-700">{companies.length}</span> / {totalItems} công ty
            </p>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div 
          className={cn(
            'text-center py-16 animate-fade-in',
            'bg-red-50 rounded-2xl border border-red-200'
          )}
        >
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <Button onClick={loadCompanies} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
            Thử lại
          </Button>
        </div>
      )}

      {/* Company Grid */}
      {!error && companies.length > 0 && (
        <StaggeredList 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          staggerDelay={80}
          key={`${currentPage}-${searchQuery}-${ratingFilter}-${sortBy}`}
        >
          {companies.map((company, index) => (
            <CompanyCard key={company.id} company={company} index={index} />
          ))}
        </StaggeredList>
      )}

      {/* Empty state */}
      {!error && !loading && companies.length === 0 && (
        <div 
          className={cn(
            'text-center py-16 animate-fade-in',
            'bg-gray-50 rounded-2xl border border-dashed border-gray-200'
          )}
        >
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">Không tìm thấy công ty nào</p>
          <p className="text-gray-400 text-sm">
            Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 animate-fade-in-up">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1 || loading}
            className={cn(
              'transition-all duration-200',
              'hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600',
              'disabled:opacity-50'
            )}
            aria-label="Trang trước"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-1">
            {getPaginationRange().map((page, idx) => (
              page === '...' ? (
                <span 
                  key={`ellipsis-${idx}`} 
                  className="px-2 text-gray-400"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(page as number)}
                  disabled={loading}
                  className={cn(
                    'min-w-[36px] transition-all duration-200',
                    currentPage === page
                      ? 'bg-blue-600 hover:bg-blue-700 shadow-md'
                      : 'hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600'
                  )}
                >
                  {page}
                </Button>
              )
            ))}
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || loading}
            className={cn(
              'transition-all duration-200',
              'hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600',
              'disabled:opacity-50'
            )}
            aria-label="Trang sau"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

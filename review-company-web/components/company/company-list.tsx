'use client';

import { useState, useMemo } from 'react';
import { CompanyCard } from './company-card';
import { CompanyFilters } from './company-filters';
import { CompanySearch } from './company-search';
import { Button } from '@/components/ui/button';
import { StaggeredList } from '@/components/animations';
import {
  getActiveCompanies,
  searchCompanies,
  sortCompanies,
  SortOption,
} from '@/lib/data';
import { Company } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

interface CompanyListProps {
  initialSearch?: string;
}

const ITEMS_PER_PAGE = 9;

export function CompanyList({ initialSearch = '' }: CompanyListProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCompanies = useMemo(() => {
    let companies: Company[];

    // Search
    if (searchQuery) {
      companies = searchCompanies(searchQuery);
    } else {
      companies = getActiveCompanies();
    }

    // Filter by rating
    if (ratingFilter !== 'all') {
      const minRating = parseInt(ratingFilter, 10);
      companies = companies.filter(
        (c) => c.avg_rating !== null && c.avg_rating >= minRating
      );
    }

    // Sort
    companies = sortCompanies(companies, sortBy);

    return companies;
  }, [searchQuery, ratingFilter, sortBy]);

  const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE);
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
          <p className="text-sm text-gray-500 tabular-nums">
            Hiển thị <span className="font-medium text-gray-700">{paginatedCompanies.length}</span> / {filteredCompanies.length} công ty
          </p>
        </div>
      </div>

      {/* Company Grid */}
      {paginatedCompanies.length > 0 ? (
        <StaggeredList 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          staggerDelay={80}
          key={`${currentPage}-${searchQuery}-${ratingFilter}-${sortBy}`}
        >
          {paginatedCompanies.map((company, index) => (
            <CompanyCard key={company.id} company={company} index={index} />
          ))}
        </StaggeredList>
      ) : (
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
            disabled={currentPage === 1}
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
            disabled={currentPage === totalPages}
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

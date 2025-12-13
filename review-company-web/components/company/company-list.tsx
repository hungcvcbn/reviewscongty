'use client';

import { useState, useMemo } from 'react';
import { CompanyCard } from './company-card';
import { CompanyFilters } from './company-filters';
import { CompanySearch } from './company-search';
import { Button } from '@/components/ui/button';
import {
  getActiveCompanies,
  searchCompanies,
  filterCompaniesByRating,
  sortCompanies,
  SortOption,
} from '@/lib/data';
import { Company } from '@/lib/types';

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

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
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
          <p className="text-sm text-gray-500">
            Hiển thị {paginatedCompanies.length} / {filteredCompanies.length} công ty
          </p>
        </div>
      </div>

      {/* Company Grid */}
      {paginatedCompanies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">Không tìm thấy công ty nào phù hợp.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Trước
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  );
}

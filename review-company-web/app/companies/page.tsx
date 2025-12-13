import { Suspense } from 'react';
import { CompanyList } from '@/components/company/company-list';
import { Skeleton } from '@/components/ui/skeleton';

interface CompaniesPageProps {
  searchParams: Promise<{ search?: string }>;
}

function CompanyListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default async function CompaniesPage({ searchParams }: CompaniesPageProps) {
  const params = await searchParams;
  const initialSearch = params.search || '';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Danh sách công ty</h1>
        <p className="text-gray-500 mt-2">
          Tìm kiếm và khám phá các công ty được đánh giá trên nền tảng
        </p>
      </div>

      <Suspense fallback={<CompanyListSkeleton />}>
        <CompanyList initialSearch={initialSearch} />
      </Suspense>
    </div>
  );
}

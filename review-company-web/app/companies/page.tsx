import { Suspense } from 'react';
import { CompanyList } from '@/components/company/company-list';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollToTop } from '@/components/animations';
import { Building2 } from 'lucide-react';

interface CompaniesPageProps {
  searchParams: Promise<{ search?: string }>;
}

function CompanyListSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex gap-3">
        <Skeleton className="h-12 flex-1 rounded-xl" />
        <Skeleton className="h-12 w-28 rounded-xl" />
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
        <Skeleton className="h-5 w-40 rounded" />
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

export default async function CompaniesPage({ searchParams }: CompaniesPageProps) {
  const params = await searchParams;
  const initialSearch = params.search || '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-10">
        {/* Page Header */}
        <div className="mb-10 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Danh sách công ty
            </h1>
          </div>
          <p className="text-gray-500 text-lg max-w-2xl">
            Tìm kiếm và khám phá các công ty được đánh giá trên nền tảng. 
            Đọc review thực tế từ nhân viên để đưa ra quyết định tốt nhất.
          </p>
        </div>

        <Suspense fallback={<CompanyListSkeleton />}>
          <CompanyList initialSearch={initialSearch} />
        </Suspense>
      </div>

      <ScrollToTop />
    </div>
  );
}

import Link from 'next/link';
import { Building2, Star, MessageSquare, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CompanyCard } from '@/components/company/company-card';
import { CompanySearch } from '@/components/company/company-search';
import { getTopRatedCompanies, getStatistics } from '@/lib/data';

export default function HomePage() {
  const topCompanies = getTopRatedCompanies(6);
  const stats = getStatistics();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Tìm hiểu công ty trước khi quyết định
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Nền tảng đánh giá công ty hàng đầu Việt Nam. Đọc review từ nhân viên thực tế 
            về môi trường làm việc, văn hóa công ty và cơ hội phát triển.
          </p>
          <div className="max-w-xl mx-auto">
            <CompanySearch size="lg" placeholder="Nhập tên công ty bạn muốn tìm..." />
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 px-4 border-b">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalCompanies}
                  </p>
                  <p className="text-sm text-gray-500">Công ty</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 bg-green-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalReviews}
                  </p>
                  <p className="text-sm text-gray-500">Reviews</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.averageRating}
                  </p>
                  <p className="text-sm text-gray-500">Rating trung bình</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Top Companies Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Công ty được đánh giá cao
              </h2>
              <p className="text-gray-500 mt-1">
                Top công ty có rating cao nhất trên nền tảng
              </p>
            </div>
            <Link href="/companies">
              <Button variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Xem tất cả
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Bạn đã từng làm việc tại một công ty?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Chia sẻ trải nghiệm của bạn để giúp những người khác đưa ra quyết định tốt hơn.
          </p>
          <Button size="lg" variant="secondary">
            Viết review ngay
          </Button>
        </div>
      </section>
    </div>
  );
}

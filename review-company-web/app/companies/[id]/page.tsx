import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RatingDisplay } from '@/components/review/rating-display';
import { RatingBreakdown } from '@/components/review/rating-breakdown';
import { ReviewList } from '@/components/review/review-list';
import {
  getCompanyById,
  getReviewsWithDetailsForCompany,
  getCategoryRatingsForCompany,
} from '@/lib/data';
import {
  MapPin,
  Globe,
  Mail,
  Phone,
  ArrowLeft,
  MessageSquare,
  PenLine,
} from 'lucide-react';

interface CompanyDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const { id } = await params;
  const company = getCompanyById(id);

  if (!company || company.status !== 'ACTIVE') {
    notFound();
  }

  const reviews = getReviewsWithDetailsForCompany(company.id);
  const categoryRatings = getCategoryRatingsForCompany(company.id);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Link
        href="/companies"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Quay lại danh sách
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Company Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Company Header Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative h-24 w-24 rounded-xl overflow-hidden bg-gray-100 mb-4">
                  {company.logo_url ? (
                    <Image
                      src={company.logo_url}
                      alt={company.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-4xl font-bold text-gray-400">
                      {company.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
                <div className="flex items-center gap-1 text-gray-500 mt-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{company.address}</span>
                </div>

                {/* Rating Summary */}
                <div className="mt-4 flex flex-col items-center">
                  {company.avg_rating ? (
                    <>
                      <div className="text-4xl font-bold text-gray-900">
                        {company.avg_rating.toFixed(1)}
                      </div>
                      <RatingDisplay
                        rating={company.avg_rating}
                        size="lg"
                        showValue={false}
                        className="mt-1"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        {company.total_reviews} đánh giá
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-400">Chưa có đánh giá</p>
                  )}
                </div>

                <Link href={`/companies/${company.id}/reviews/new`} className="w-full">
                  <Button className="mt-6 w-full">
                    <PenLine className="h-4 w-4 mr-2" />
                    Viết review
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin liên hệ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {company.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline truncate"
                  >
                    {company.website}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <a
                  href={`mailto:${company.email}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {company.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <a
                  href={`tel:${company.phone}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {company.phone}
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Rating Breakdown */}
          <Card>
            <CardContent className="pt-6">
              <RatingBreakdown categoryRatings={categoryRatings} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Description & Reviews */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Giới thiệu công ty</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-line">
                {company.description || 'Chưa có thông tin giới thiệu.'}
              </p>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Reviews ({reviews.length})
              </h2>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList>
                <TabsTrigger value="all">Tất cả</TabsTrigger>
                <TabsTrigger value="positive">Tích cực (4-5)</TabsTrigger>
                <TabsTrigger value="neutral">Trung lập (3)</TabsTrigger>
                <TabsTrigger value="negative">Tiêu cực (1-2)</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <ReviewList reviews={reviews} />
              </TabsContent>

              <TabsContent value="positive" className="mt-6">
                <ReviewList
                  reviews={reviews.filter((r) => r.overall_rating >= 4)}
                />
              </TabsContent>

              <TabsContent value="neutral" className="mt-6">
                <ReviewList
                  reviews={reviews.filter((r) => r.overall_rating === 3)}
                />
              </TabsContent>

              <TabsContent value="negative" className="mt-6">
                <ReviewList
                  reviews={reviews.filter((r) => r.overall_rating <= 2)}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

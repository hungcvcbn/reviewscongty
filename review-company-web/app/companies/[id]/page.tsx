import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RatingDisplay } from '@/components/review/rating-display';
import { RatingBreakdown } from '@/components/review/rating-breakdown';
import { ReviewList } from '@/components/review/review-list';
import { FadeIn, ScrollToTop } from '@/components/animations';
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
  Star,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <FadeIn direction="right" delay={0}>
          <Link
            href="/companies"
            className={cn(
              'inline-flex items-center gap-2 text-sm text-gray-500',
              'hover:text-blue-600 transition-colors duration-200',
              'mb-6 group'
            )}
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            Quay lại danh sách
          </Link>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Company Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Company Header Card */}
            <FadeIn direction="left" delay={100}>
              <Card className={cn(
                'overflow-hidden',
                'transition-all duration-300',
                'hover:shadow-xl hover:shadow-blue-100/50'
              )}>
                <CardContent className="pt-8 pb-8">
                  <div className="flex flex-col items-center text-center">
                    {/* Company Logo */}
                    <div 
                      className={cn(
                        'relative h-28 w-28 rounded-2xl overflow-hidden',
                        'bg-gradient-to-br from-gray-50 to-gray-100',
                        'ring-4 ring-white shadow-lg mb-5',
                        'transition-transform duration-300 hover:scale-105'
                      )}
                    >
                      {company.logo_url ? (
                        <Image
                          src={company.logo_url}
                          alt={company.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-4xl font-bold bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                          {company.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{company.name}</h1>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">{company.address}</span>
                    </div>

                    {/* Rating Summary */}
                    <div className="mt-6 flex flex-col items-center">
                      {company.avg_rating ? (
                        <>
                          <div className="flex items-center gap-2">
                            <span 
                              className={cn(
                                'text-5xl font-bold',
                                company.avg_rating >= 4 ? 'text-green-600' :
                                company.avg_rating >= 3 ? 'text-yellow-600' :
                                'text-orange-500'
                              )}
                            >
                              {company.avg_rating.toFixed(1)}
                            </span>
                            <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
                          </div>
                          <RatingDisplay
                            rating={company.avg_rating}
                            size="lg"
                            showValue={false}
                            className="mt-2"
                            animated
                          />
                          <p className="text-sm text-gray-500 mt-2">
                            Dựa trên <span className="font-medium text-gray-700">{company.total_reviews}</span> đánh giá
                          </p>
                        </>
                      ) : (
                        <div className="text-center py-4">
                          <Star className="h-10 w-10 text-gray-200 mx-auto mb-2" />
                          <p className="text-gray-400">Chưa có đánh giá</p>
                        </div>
                      )}
                    </div>

                    <Link href={`/companies/${company.id}/reviews/new`} className="w-full mt-6">
                      <Button 
                        className={cn(
                          'w-full h-12 text-base',
                          'bg-blue-600 hover:bg-blue-700',
                          'shadow-lg shadow-blue-200',
                          'transition-all duration-200',
                          'hover:shadow-xl hover:shadow-blue-300',
                          'hover:-translate-y-0.5'
                        )}
                      >
                        <PenLine className="h-5 w-5 mr-2" />
                        Viết review
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Contact Info */}
            <FadeIn direction="left" delay={200}>
              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Phone className="h-5 w-5 text-blue-600" />
                    Thông tin liên hệ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg',
                        'bg-gray-50 hover:bg-blue-50',
                        'transition-all duration-200 group'
                      )}
                    >
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Globe className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-700 group-hover:text-blue-600 truncate flex-1">
                        {company.website}
                      </span>
                      <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </a>
                  )}
                  <a
                    href={`mailto:${company.email}`}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg',
                      'bg-gray-50 hover:bg-blue-50',
                      'transition-all duration-200 group'
                    )}
                  >
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Mail className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700 group-hover:text-blue-600">
                      {company.email}
                    </span>
                  </a>
                  <a
                    href={`tel:${company.phone}`}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg',
                      'bg-gray-50 hover:bg-blue-50',
                      'transition-all duration-200 group'
                    )}
                  >
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Phone className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-sm text-gray-700 group-hover:text-blue-600">
                      {company.phone}
                    </span>
                  </a>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Rating Breakdown */}
            <FadeIn direction="left" delay={300}>
              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Đánh giá chi tiết
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RatingBreakdown categoryRatings={categoryRatings} />
                </CardContent>
              </Card>
            </FadeIn>
          </div>

          {/* Right Column - Description & Reviews */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <FadeIn direction="up" delay={100}>
              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Giới thiệu công ty</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {company.description || 'Chưa có thông tin giới thiệu về công ty này.'}
                  </p>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Reviews Section */}
            <FadeIn direction="up" delay={200}>
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                    </div>
                    Reviews ({reviews.length})
                  </h2>
                </div>

                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="bg-gray-100/80 p-1 rounded-xl">
                    <TabsTrigger 
                      value="all"
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
                    >
                      Tất cả
                    </TabsTrigger>
                    <TabsTrigger 
                      value="positive"
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
                    >
                      Tích cực (4-5)
                    </TabsTrigger>
                    <TabsTrigger 
                      value="neutral"
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
                    >
                      Trung lập (3)
                    </TabsTrigger>
                    <TabsTrigger 
                      value="negative"
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
                    >
                      Tiêu cực (1-2)
                    </TabsTrigger>
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
            </FadeIn>
          </div>
        </div>
      </div>

      <ScrollToTop />
    </div>
  );
}

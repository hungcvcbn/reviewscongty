'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, MessageSquare, Send } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { getCompanyById, getReviewsWithDetailsForCompany } from '@/lib/data';
import { ReviewWithDetails } from '@/lib/types';
import { ReviewCard } from '@/components/review/review-card';

export default function CompanyDetailManagementPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const companyId = params.id as string;

  const [company, setCompany] = useState<any>(null);
  const [reviews, setReviews] = useState<ReviewWithDetails[]>([]);
  const [responseTexts, setResponseTexts] = useState<Record<string, string>>({});

  useEffect(() => {
    const companyData = getCompanyById(companyId);
    if (!companyData) {
      router.push('/company');
      return;
    }
    setCompany(companyData);

    const companyReviews = getReviewsWithDetailsForCompany(companyId);
    setReviews(companyReviews);
  }, [companyId, router]);

  const handleResponseSubmit = async (reviewId: string) => {
    const responseText = responseTexts[reviewId]?.trim();
    if (!responseText) {
      alert('Vui lòng nhập nội dung phản hồi');
      return;
    }

    // In production, this would call an API
    alert('Phản hồi đã được gửi thành công (Demo mode)');
    setResponseTexts({ ...responseTexts, [reviewId]: '' });
  };

  if (!company) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/company">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý {company.name}</h1>
          <p className="text-gray-600 mt-2">Phản hồi review và quản lý thông tin công ty</p>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Reviews cần phản hồi ({reviews.filter((r) => !r.companyResponse).length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reviews.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Chưa có review nào
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b last:border-b-0 pb-6 last:pb-0">
                    <ReviewCard review={review} />
                    
                    {review.companyResponse ? (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold text-blue-900">
                            Phản hồi từ công ty:
                          </span>
                        </div>
                        <p className="text-sm text-blue-800">
                          {review.companyResponse.content}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-4 space-y-2">
                        <label className="text-sm font-medium text-gray-700 block">
                          Phản hồi review này:
                        </label>
                        <textarea
                          value={responseTexts[review.id] || ''}
                          onChange={(e) =>
                            setResponseTexts({
                              ...responseTexts,
                              [review.id]: e.target.value,
                            })
                          }
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nhập phản hồi của công ty..."
                        />
                        <Button
                          size="sm"
                          onClick={() => handleResponseSubmit(review.id)}
                          className="w-full sm:w-auto"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Gửi phản hồi
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

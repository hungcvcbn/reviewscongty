'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RatingDisplay } from '@/components/review/rating-display';
import { ArrowLeft, Star } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { getCompanyById } from '@/lib/data';
import { getRatingCategories, getCategoryNameVi } from '@/lib/data';
import { RatingCategory } from '@/lib/types';

export default function NewReviewPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated } = useAuth();
  const companyId = params.id as string;

  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [ratingCategories, setRatingCategories] = useState<RatingCategory[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    overall_rating: 0,
    category_ratings: {} as Record<string, number>,
    is_anonymous: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/companies/${companyId}/reviews/new`);
      return;
    }

    const companyData = getCompanyById(companyId);
    if (!companyData) {
      router.push('/companies');
      return;
    }
    setCompany(companyData);

    const categories = getRatingCategories();
    setRatingCategories(categories);
  }, [companyId, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.overall_rating) {
      alert('Vui lòng chọn rating tổng thể');
      return;
    }

    if (!formData.content.trim()) {
      alert('Vui lòng nhập nội dung review');
      return;
    }

    setLoading(true);
    try {
      // In production, this would call an API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('Đăng review thành công!');
      router.push(`/companies/${companyId}`);
    } catch (error) {
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData({ ...formData, overall_rating: rating });
  };

  const handleCategoryRatingChange = (categoryId: string, rating: number) => {
    setFormData({
      ...formData,
      category_ratings: {
        ...formData.category_ratings,
        [categoryId]: rating,
      },
    });
  };

  if (!company) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/companies/${companyId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Viết review</h1>
          <p className="text-gray-600 mt-2">Đánh giá về {company.name}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin review</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Overall Rating */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 block">
                Đánh giá tổng thể <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleRatingChange(rating)}
                    className={`p-2 rounded-md transition-colors ${
                      formData.overall_rating >= rating
                        ? 'text-yellow-400'
                        : 'text-gray-300 hover:text-yellow-300'
                    }`}
                  >
                    <Star
                      className={`h-8 w-8 ${
                        formData.overall_rating >= rating ? 'fill-current' : ''
                      }`}
                    />
                  </button>
                ))}
                {formData.overall_rating > 0 && (
                  <span className="ml-2 text-sm text-gray-600">
                    {formData.overall_rating}/5
                  </span>
                )}
              </div>
            </div>

            {/* Category Ratings */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-700 block">
                Đánh giá theo hạng mục (tùy chọn)
              </label>
              {ratingCategories.map((category) => (
                <div key={category.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      {getCategoryNameVi(category.name)}
                    </span>
                    {formData.category_ratings[category.id] && (
                      <span className="text-sm text-gray-500">
                        {formData.category_ratings[category.id]}/5
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => handleCategoryRatingChange(category.id, rating)}
                        className={`p-1 rounded transition-colors ${
                          (formData.category_ratings[category.id] || 0) >= rating
                            ? 'text-yellow-400'
                            : 'text-gray-300 hover:text-yellow-300'
                        }`}
                      >
                        <Star
                          className={`h-5 w-5 ${
                            (formData.category_ratings[category.id] || 0) >= rating
                              ? 'fill-current'
                              : ''
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-gray-700">
                Tiêu đề (tùy chọn)
              </label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Nhập tiêu đề review"
                maxLength={200}
                disabled={loading}
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium text-gray-700">
                Nội dung review <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Chia sẻ trải nghiệm của bạn về công ty này..."
                maxLength={2000}
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500">
                {formData.content.length}/2000 ký tự
              </p>
            </div>

            {/* Anonymous */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_anonymous"
                checked={formData.is_anonymous}
                onChange={(e) =>
                  setFormData({ ...formData, is_anonymous: e.target.checked })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={loading}
              />
              <label htmlFor="is_anonymous" className="text-sm text-gray-700">
                Đăng ẩn danh
              </label>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Đang đăng...' : 'Đăng review'}
              </Button>
              <Link href={`/companies/${companyId}`}>
                <Button type="button" variant="outline" disabled={loading}>
                  Hủy
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

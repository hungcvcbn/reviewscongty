'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RatingDisplay } from './rating-display';
import { CommentList } from './comment-list';
import { ReviewWithDetails } from '@/lib/types';
import { formatDistanceToNow } from '@/lib/utils';
import { MessageCircle, ChevronDown, ChevronUp, Building2 } from 'lucide-react';

interface ReviewCardProps {
  review: ReviewWithDetails;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [showComments, setShowComments] = useState(false);

  const userName = review.is_anonymous
    ? 'Ẩn danh'
    : review.user?.name || 'Người dùng';

  const userAvatar = review.is_anonymous ? null : review.user?.avatar_url;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={userAvatar || undefined} />
              <AvatarFallback>
                {review.is_anonymous ? '?' : userName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{userName}</span>
                {review.status === 'EDITED' && (
                  <Badge variant="outline" className="text-xs">
                    Đã chỉnh sửa
                  </Badge>
                )}
              </div>
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(review.created_at)}
              </span>
            </div>
          </div>
          <RatingDisplay rating={review.overall_rating} size="md" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {review.title && (
          <h4 className="font-semibold text-gray-900">{review.title}</h4>
        )}
        <p className="text-gray-700 whitespace-pre-line">{review.content}</p>

        {/* Company Response */}
        {review.companyResponse && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">Phản hồi từ công ty</span>
              <span className="text-xs text-blue-600">
                {formatDistanceToNow(review.companyResponse.created_at)}
              </span>
            </div>
            <p className="text-sm text-blue-800">{review.companyResponse.content}</p>
          </div>
        )}

        <Separator />

        {/* Comments Toggle */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="text-gray-600"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {review.comments.length} bình luận
            {showComments ? (
              <ChevronUp className="h-4 w-4 ml-1" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-1" />
            )}
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="pt-2">
            <CommentList comments={review.comments} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

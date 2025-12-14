'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RatingDisplay } from './rating-display';
import { CommentList } from './comment-list';
import { ReviewWithDetails, ReviewFromApi } from '@/lib/types';
import { formatDistanceToNow } from '@/lib/utils';
import { MessageCircle, ChevronDown, Building2, ThumbsUp, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewCardProps {
  review: ReviewWithDetails | ReviewFromApi;
  index?: number;
}

export function ReviewCard({ review, index = 0 }: ReviewCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentsHeight, setCommentsHeight] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const commentsRef = useRef<HTMLDivElement>(null);

  const userName = review.is_anonymous
    ? 'Ẩn danh'
    : review.user?.name || 'Người dùng';

  const userAvatar = review.is_anonymous ? null : review.user?.avatar_url;

  // Get comments with fallback to empty array
  const comments = review.comments || [];

  // Calculate comments section height for smooth animation
  useEffect(() => {
    if (commentsRef.current) {
      setCommentsHeight(commentsRef.current.scrollHeight);
    }
  }, [showComments, comments]);

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: review.title || 'Review công ty',
          text: review.content.slice(0, 100) + '...',
          url: window.location.href,
        });
      } catch {
        // User cancelled or error
      }
    }
  };

  return (
    <Card 
      className={cn(
        'overflow-hidden',
        'transition-all duration-300 ease-out',
        'hover:shadow-lg hover:shadow-gray-100/50',
        'animate-fade-in-up'
      )}
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'backwards',
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar 
              className={cn(
                'ring-2 ring-white shadow-sm',
                'transition-transform duration-200 hover:scale-105'
              )}
            >
              <AvatarImage src={userAvatar || undefined} />
              <AvatarFallback 
                className={cn(
                  review.is_anonymous 
                    ? 'bg-gray-100 text-gray-500' 
                    : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                )}
              >
                {review.is_anonymous ? '?' : userName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-gray-900">{userName}</span>
                {review.status === 'EDITED' && (
                  <Badge 
                    variant="outline" 
                    className="text-xs border-amber-200 bg-amber-50 text-amber-700"
                  >
                    Đã chỉnh sửa
                  </Badge>
                )}
              </div>
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(review.created_at)}
              </span>
            </div>
          </div>
          <RatingDisplay rating={review.overall_rating} size="md" animated />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {review.title && (
          <h4 className="font-semibold text-gray-900 text-lg">{review.title}</h4>
        )}
        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
          {review.content}
        </p>

        {/* Company Response */}
        {review.companyResponse && (
          <div 
            className={cn(
              'bg-gradient-to-br from-blue-50 to-blue-100/50',
              'border border-blue-100 rounded-xl p-4 mt-4',
              'transition-all duration-300',
              'hover:shadow-md hover:shadow-blue-100/50'
            )}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Building2 className="h-4 w-4 text-blue-600" />
              </div>
              <span className="font-medium text-blue-900">Phản hồi từ công ty</span>
              <span className="text-xs text-blue-500 ml-auto">
                {formatDistanceToNow(review.companyResponse.created_at)}
              </span>
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">
              {review.companyResponse.content}
            </p>
          </div>
        )}

        <Separator className="my-4" />

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {/* Like Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={cn(
                'transition-all duration-200',
                isLiked 
                  ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              )}
              aria-pressed={isLiked}
              aria-label={isLiked ? 'Bỏ thích' : 'Thích'}
            >
              <ThumbsUp 
                className={cn(
                  'h-4 w-4 mr-1.5 transition-transform duration-200',
                  isLiked && 'scale-110 fill-blue-600'
                )} 
              />
              Hữu ích
            </Button>

            {/* Share Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
              aria-label="Chia sẻ"
            >
              <Share2 className="h-4 w-4 mr-1.5" />
              Chia sẻ
            </Button>
          </div>

          {/* Comments Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleComments}
            className={cn(
              'transition-all duration-200',
              showComments 
                ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            )}
            aria-expanded={showComments}
            aria-controls={`comments-${review.id}`}
          >
            <MessageCircle 
              className={cn(
                'h-4 w-4 mr-1.5',
                showComments && 'fill-blue-100'
              )} 
            />
            {comments.length} bình luận
            <ChevronDown 
              className={cn(
                'h-4 w-4 ml-1 transition-transform duration-300',
                showComments && 'rotate-180'
              )} 
            />
          </Button>
        </div>

        {/* Comments Section with Smooth Animation */}
        <div
          id={`comments-${review.id}`}
          className={cn(
            'overflow-hidden transition-all duration-300 ease-out'
          )}
          style={{
            maxHeight: showComments ? `${commentsHeight + 100}px` : '0px',
            opacity: showComments ? 1 : 0,
          }}
        >
          <div ref={commentsRef} className="pt-4">
            <CommentList comments={comments} reviewId={review.id} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

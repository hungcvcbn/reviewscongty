'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThumbsUp, MessageCircle, Send } from 'lucide-react';
import { CommentWithUser } from '@/lib/types';
import { formatDistanceToNow } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';

interface CommentListProps {
  comments: CommentWithUser[];
  reviewId: string;
  level?: number;
}

function CommentItem({
  comment,
  reviewId,
  level = 0,
}: {
  comment: CommentWithUser;
  reviewId: string;
  level?: number;
}) {
  const { isAuthenticated } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);
  const maxNestingLevel = 2;
  const marginLeft = Math.min(level, maxNestingLevel) * 40;

  const handleReply = async () => {
    if (!replyText.trim()) {
      alert('Vui lòng nhập nội dung bình luận');
      return;
    }

    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để bình luận');
      return;
    }

    setLoading(true);
    try {
      // In production, this would call an API
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert('Bình luận đã được đăng thành công (Demo mode)');
      setReplyText('');
      setShowReplyForm(false);
    } catch (error) {
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginLeft: `${marginLeft}px` }}>
      <div className="flex gap-3 py-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={comment.user?.avatar_url || undefined} />
          <AvatarFallback>
            {comment.user?.name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm text-gray-900">
              {comment.user?.name || 'Người dùng'}
            </span>
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(comment.created_at)}
            </span>
          </div>
          <p className="text-sm text-gray-700">{comment.content}</p>
          <div className="flex items-center gap-4 mt-2">
            <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
              <ThumbsUp className="h-3 w-3" />
              {comment.likes_count > 0 && <span>{comment.likes_count}</span>}
            </button>
            {isAuthenticated && level < maxNestingLevel && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
              >
                <MessageCircle className="h-3 w-3" />
                <span>Trả lời</span>
              </button>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-3 space-y-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập bình luận của bạn..."
                maxLength={500}
              />
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleReply}
                  disabled={loading}
                  className="h-7"
                >
                  <Send className="h-3 w-3 mr-1" />
                  Gửi
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyText('');
                  }}
                  className="h-7"
                >
                  Hủy
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="border-l-2 border-gray-100">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              reviewId={reviewId}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CommentList({ comments, reviewId }: CommentListProps) {
  const { isAuthenticated } = useAuth();
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleComment = async () => {
    if (!commentText.trim()) {
      alert('Vui lòng nhập nội dung bình luận');
      return;
    }

    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để bình luận');
      return;
    }

    setLoading(true);
    try {
      // In production, this would call an API
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert('Bình luận đã được đăng thành công (Demo mode)');
      setCommentText('');
      setShowCommentForm(false);
    } catch (error) {
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Comment Form */}
      {isAuthenticated && (
        <div className="space-y-2 pb-4 border-b">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập bình luận của bạn..."
            maxLength={500}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">{commentText.length}/500</p>
            <Button size="sm" onClick={handleComment} disabled={loading}>
              <Send className="h-3 w-3 mr-1" />
              {loading ? 'Đang gửi...' : 'Gửi bình luận'}
            </Button>
          </div>
        </div>
      )}

      {comments.length === 0 ? (
        <p className="text-sm text-gray-500 py-4">
          {isAuthenticated
            ? 'Chưa có bình luận nào. Hãy là người đầu tiên bình luận!'
            : 'Chưa có bình luận nào. Đăng nhập để bình luận.'}
        </p>
      ) : (
        <div className="divide-y divide-gray-100">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              reviewId={reviewId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

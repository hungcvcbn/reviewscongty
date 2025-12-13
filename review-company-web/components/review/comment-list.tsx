import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThumbsUp, MessageCircle } from 'lucide-react';
import { CommentWithUser } from '@/lib/types';
import { formatDistanceToNow } from '@/lib/utils';

interface CommentListProps {
  comments: CommentWithUser[];
  level?: number;
}

function CommentItem({
  comment,
  level = 0,
}: {
  comment: CommentWithUser;
  level?: number;
}) {
  const maxNestingLevel = 2;
  const marginLeft = Math.min(level, maxNestingLevel) * 40;

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
            <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
              <MessageCircle className="h-3 w-3" />
              <span>Trả lời</span>
            </button>
          </div>
        </div>
      </div>

      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="border-l-2 border-gray-100">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="text-sm text-gray-500 py-4">Chưa có bình luận nào.</p>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}

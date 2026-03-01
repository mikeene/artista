import { useState } from 'react';
import { X, Heart, MessageCircle, Bookmark, Share2, ExternalLink, Calendar, Maximize2 } from 'lucide-react';
import { cn, formatCount, timeAgo } from '@/lib/utils';
import type { Post } from '@/types';
import Avatar from '@/components/ui/Avatar';
import { usePostStore } from '@/store';
import { MOCK_COMMENTS } from '@/lib/mockData';
import toast from 'react-hot-toast';

interface ArtworkDetailProps {
  post: Post;
  onClose: () => void;
}

export default function ArtworkDetail({ post, onClose }: ArtworkDetailProps) {
  const { toggleLike, toggleSave } = usePostStore();
  const comments = MOCK_COMMENTS.filter(c => c.postId === post.id);
  const [newComment, setNewComment] = useState('');
  const [fullscreen, setFullscreen] = useState(false);

  const handleLike = () => toggleLike(post.id);
  const handleSave = () => toggleSave(post.id);
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    toast.success('Link copied to clipboard!');
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    toast.success('Comment posted!');
    setNewComment('');
  };

  // Find the current post from store (for real-time like/save state)
  const { posts } = usePostStore();
  const livePost = posts.find(p => p.id === post.id) ?? post;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-deep/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal container */}
      <div className={cn(
        'relative w-full bg-cream rounded-xl shadow-elevated overflow-hidden animate-rise-up flex flex-col md:flex-row',
        fullscreen ? 'max-w-full h-full' : 'max-w-5xl max-h-[90vh]'
      )}>

        {/* ── Left: Artwork ── */}
        <div className="relative flex-1 bg-deep min-h-64 md:min-h-0 flex-shrink-0 md:max-w-[55%]">
          <div className={cn('w-full h-full min-h-64', livePost.imageUrl)} />

          {/* Controls overlay */}
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={() => setFullscreen(!fullscreen)}
              className="w-8 h-8 bg-deep/60 backdrop-blur-sm rounded-lg flex items-center justify-center text-white/80 hover:text-white transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-deep/60 backdrop-blur-sm rounded-lg flex items-center justify-center text-white/80 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Medium badge */}
          <div className="absolute bottom-3 left-3">
            <span className="text-xs font-medium tracking-wide uppercase text-white/80 bg-deep/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
              {livePost.medium}
            </span>
          </div>
        </div>

        {/* ── Right: Details ── */}
        <div className="flex flex-col w-full md:w-80 lg:w-96 min-w-0 overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3 cursor-pointer min-w-0">
              <Avatar user={livePost.author} size="md" />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-ink truncate">{livePost.author.displayName}</p>
                  {livePost.author.verified && (
                    <span className="w-4 h-4 bg-terracotta rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-[8px]">✓</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-ink/50">{livePost.author.location}</p>
              </div>
            </div>
            <a href={`/profile/${livePost.author.id}`} className="text-terracotta hover:text-ink transition-colors">
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Post info */}
          <div className="px-5 py-4 border-b border-[var(--border)] flex-shrink-0">
            <h2 className="font-serif font-bold text-xl text-ink mb-2">{livePost.title}</h2>
            {livePost.description && (
              <p className="text-sm text-ink/70 leading-relaxed mb-3">{livePost.description}</p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-ink/50">
              {livePost.dimensions && (
                <span className="flex items-center gap-1">📐 {livePost.dimensions}</span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {livePost.createdAt.toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>

            {/* Tags */}
            {livePost.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {livePost.tags.map(tag => (
                  <span key={tag} className="text-xs text-terracotta/80 hover:text-terracotta cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action bar */}
          <div className="px-5 py-3 border-b border-[var(--border)] flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleLike}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
                livePost.isLiked ? 'bg-terracotta/10 text-terracotta' : 'text-ink/60 hover:bg-black/5'
              )}
            >
              <Heart className="w-4 h-4" fill={livePost.isLiked ? 'currentColor' : 'none'} />
              {formatCount(livePost.likesCount)}
            </button>
            <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ink/60">
              <MessageCircle className="w-4 h-4" />
              {formatCount(livePost.commentsCount)}
            </span>
            <div className="ml-auto flex items-center gap-1">
              <button
                onClick={handleSave}
                className={cn(
                  'p-2 rounded-full transition-colors duration-200',
                  livePost.isSaved ? 'text-violet' : 'text-ink/60 hover:bg-black/5'
                )}
              >
                <Bookmark className="w-4 h-4" fill={livePost.isSaved ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-full text-ink/60 hover:bg-black/5 transition-colors duration-200"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Comments */}
          <div className="flex-1 overflow-y-auto px-5 py-3 space-y-4">
            {comments.length === 0 ? (
              <p className="text-sm text-ink/40 text-center py-6">Be the first to comment ✨</p>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar user={comment.author} size="xs" className="mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-semibold text-ink">{comment.author.displayName}</span>
                      <span className="text-[10px] text-ink/40">{timeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm text-ink/80 leading-relaxed mt-0.5">{comment.content}</p>
                    <button className="text-xs text-ink/40 hover:text-terracotta mt-1 transition-colors">
                      ♡ {comment.likesCount}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Comment input */}
          <form onSubmit={handleComment} className="px-5 py-3 border-t border-[var(--border)] flex gap-2 flex-shrink-0">
            <input
              className="input flex-1 py-2 text-sm"
              placeholder="Add a comment…"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-3 py-2 bg-terracotta text-white text-xs font-medium rounded transition-all hover:bg-ink disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

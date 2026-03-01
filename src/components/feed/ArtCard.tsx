import { Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react';
import { cn, formatCount, timeAgo } from '@/lib/utils';
import type { Post } from '@/types';
import Avatar from '@/components/ui/Avatar';
import { usePostStore } from '@/store';

interface ArtCardProps {
  post: Post;
  onClick?: () => void;
  variant?: 'feed' | 'grid' | 'explore';
}

export default function ArtCard({ post, onClick, variant = 'feed' }: ArtCardProps) {
  const { toggleLike, toggleSave } = usePostStore();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(post.id);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSave(post.id);
  };

  if (variant === 'grid' || variant === 'explore') {
    return (
      <div
        onClick={onClick}
        className="group relative overflow-hidden rounded cursor-pointer aspect-square"
      >
        <div className={cn('w-full h-full transition-transform duration-700 group-hover:scale-105', post.imageUrl)} />
        <div className="post-overlay" />
        <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-white font-serif font-bold text-sm line-clamp-1 mb-1">{post.title}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Avatar user={post.author} size="xs" />
              <span className="text-white/80 text-xs">{post.author.displayName}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-xs">
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" fill={post.isLiked ? 'currentColor' : 'none'} />
                {formatCount(post.likesCount)}
              </span>
            </div>
          </div>
        </div>
        {/* Medium badge */}
        <span className="absolute top-2.5 left-2.5 text-[10px] font-medium tracking-wide uppercase
          text-white/80 bg-deep/50 backdrop-blur-sm px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {post.medium}
        </span>
      </div>
    );
  }

  // Feed variant
  return (
    <article className="bg-warm border border-[var(--border)] rounded overflow-hidden group">
      {/* Author header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-3 cursor-pointer">
          <Avatar user={post.author} size="sm" />
          <div>
            <p className="text-sm font-medium text-ink leading-none">{post.author.displayName}</p>
            <p className="text-xs text-ink/50 mt-0.5">{post.author.location} · {timeAgo(post.createdAt)}</p>
          </div>
        </div>
        <span className="text-xs text-ink/40 bg-black/5 px-2 py-0.5 rounded-full">{post.medium}</span>
      </div>

      {/* Artwork */}
      <div
        onClick={onClick}
        className="relative overflow-hidden cursor-pointer aspect-[4/3]"
      >
        <div className={cn('w-full h-full transition-transform duration-700 group-hover:scale-104', post.imageUrl)} />
      </div>

      {/* Actions */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <button
              onClick={handleLike}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
                post.isLiked
                  ? 'bg-terracotta/10 text-terracotta'
                  : 'text-ink/60 hover:bg-black/5 hover:text-ink'
              )}
            >
              <Heart
                className="w-4 h-4 transition-transform duration-150 active:scale-125"
                fill={post.isLiked ? 'currentColor' : 'none'}
              />
              {formatCount(post.likesCount)}
            </button>
            <button
              onClick={onClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-ink/60 hover:bg-black/5 hover:text-ink transition-all duration-200"
            >
              <MessageCircle className="w-4 h-4" />
              {formatCount(post.commentsCount)}
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleSave}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
                post.isSaved
                  ? 'text-violet'
                  : 'text-ink/60 hover:bg-black/5 hover:text-ink'
              )}
            >
              <Bookmark className="w-4 h-4" fill={post.isSaved ? 'currentColor' : 'none'} />
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-ink/60 hover:bg-black/5 hover:text-ink transition-all duration-200">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title & description */}
        <p className="font-serif font-bold text-base text-ink mb-1">{post.title}</p>
        {post.description && (
          <p className="text-sm text-ink/60 line-clamp-2 leading-relaxed">{post.description}</p>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {post.tags.slice(0, 4).map(tag => (
              <span key={tag} className="text-xs text-terracotta/80 hover:text-terracotta cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

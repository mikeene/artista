import { useState } from 'react';
import { usePostStore, useAuthStore } from '@/store';
import ArtCard from '@/components/feed/ArtCard';
import ArtworkDetail from '@/components/feed/ArtworkDetail';
import type { Post, FeedTab } from '@/types';
import Avatar from '@/components/ui/Avatar';
import { MOCK_USERS } from '@/lib/mockData';
import { Link } from 'react-router-dom';
import { cn, formatCount } from '@/lib/utils';

const TABS: { key: FeedTab; label: string }[] = [
  { key: 'discover', label: 'Discover' },
  { key: 'following', label: 'Following' },
];

export default function Feed() {
  const { posts } = usePostStore();
  const { user } = useAuthStore();
  const [tab, setTab] = useState<FeedTab>('discover');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [page, setPage] = useState(1);

  const displayPosts = tab === 'following'
    ? posts.filter(p => ['u1', 'u2', 'u5'].includes(p.authorId))
    : posts;

  const visiblePosts = displayPosts.slice(0, page * 8);
  const hasMore = visiblePosts.length < displayPosts.length;

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-24">
        <div className="grid lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-8">

          {/* ── Main Feed ── */}
          <main>
            {/* Tabs */}
            <div className="flex gap-1 border-b border-[var(--border)] mb-6">
              {TABS.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    'px-4 py-3 text-sm font-medium transition-all duration-200 relative',
                    tab === t.key
                      ? 'text-terracotta'
                      : 'text-ink/50 hover:text-ink'
                  )}
                >
                  {t.label}
                  {tab === t.key && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-terracotta rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Story-style horizontal scroll for following */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 mb-6">
              {MOCK_USERS.slice(0, 6).map(u => (
                <div key={u.id} className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer">
                  <div className="w-14 h-14 rounded-full ring-2 ring-terracotta ring-offset-2 ring-offset-cream overflow-hidden">
                    <Avatar user={u} size="lg" />
                  </div>
                  <span className="text-[10px] text-ink/60 max-w-[56px] text-center truncate">{u.displayName.split(' ')[0]}</span>
                </div>
              ))}
            </div>

            {/* Post grid — 2 col on md+, single on mobile */}
            <div className="grid sm:grid-cols-2 gap-4">
              {visiblePosts.map(post => (
                <ArtCard
                  key={post.id}
                  post={post}
                  onClick={() => setSelectedPost(post)}
                />
              ))}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="btn-secondary px-8 py-3"
                >
                  Load more
                </button>
              </div>
            )}

            {displayPosts.length === 0 && (
              <div className="text-center py-20">
                <p className="font-serif text-2xl text-ink/30 mb-2">Nothing here yet</p>
                <p className="text-sm text-ink/40">Follow some artists to see their work</p>
              </div>
            )}
          </main>

          {/* ── Sidebar ── */}
          <aside className="hidden lg:block space-y-6 sticky top-24 self-start">
            {/* My profile card */}
            {user && (
              <div className="card p-4">
                <Link to={`/profile/${user.id}`} className="flex items-center gap-3 mb-4">
                  <Avatar user={user} size="md" />
                  <div>
                    <p className="text-sm font-semibold text-ink">{user.displayName}</p>
                    <p className="text-xs text-ink/50">@{user.username}</p>
                  </div>
                </Link>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { n: user.worksCount,       label: 'Works' },
                    { n: user.followersCount,   label: 'Followers' },
                    { n: user.followingCount,   label: 'Following' },
                  ].map(({ n, label }) => (
                    <div key={label}>
                      <p className="text-sm font-bold text-ink">{formatCount(n)}</p>
                      <p className="text-[10px] text-ink/50">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested artists */}
            <div className="card p-4">
              <h3 className="font-serif font-bold text-base text-ink mb-4">Suggested Artists</h3>
              <div className="space-y-3">
                {MOCK_USERS.slice(0, 4).map(artist => (
                  <div key={artist.id} className="flex items-center justify-between">
                    <Link to={`/profile/${artist.id}`} className="flex items-center gap-2.5 min-w-0">
                      <Avatar user={artist} size="sm" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-ink truncate">{artist.displayName}</p>
                        <p className="text-[10px] text-ink/50">{formatCount(artist.followersCount)} followers</p>
                      </div>
                    </Link>
                    <button className="text-xs font-medium text-terracotta hover:text-ink transition-colors ml-2 flex-shrink-0">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending tags */}
            <div className="card p-4">
              <h3 className="font-serif font-bold text-base text-ink mb-4">Trending Tags</h3>
              <div className="flex flex-wrap gap-2">
                {['Lagos', 'afrofuturism', 'oil', 'digital', 'Nigeria', 'Yoruba', 'portrait', 'adire', 'bronze'].map(tag => (
                  <Link
                    key={tag}
                    to={`/explore?q=${tag}`}
                    className="text-xs text-terracotta/80 hover:text-terracotta hover:bg-terracotta/5 px-2.5 py-1 rounded-full border border-terracotta/20 hover:border-terracotta/40 transition-all duration-200"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            <p className="text-[10px] text-ink/30 text-center px-4">
              © 2025 Artista · Where African Art Lives
            </p>
          </aside>
        </div>
      </div>

      {/* Artwork detail modal */}
      {selectedPost && (
        <ArtworkDetail post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </div>
  );
}

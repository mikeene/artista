import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { usePostStore } from '@/store';
import { MOCK_USERS, ART_CATEGORIES } from '@/lib/mockData';
import ArtCard from '@/components/feed/ArtCard';
import ArtworkDetail from '@/components/feed/ArtworkDetail';
import Avatar from '@/components/ui/Avatar';
import type { Post, ExploreTab } from '@/types';
import { cn, formatCount } from '@/lib/utils';
import { Link } from 'react-router-dom';

const TABS: { key: ExploreTab; label: string }[] = [
  { key: 'trending', label: 'Trending' },
  { key: 'recent', label: 'Recent' },
  { key: 'artists', label: 'Artists' },
];

export default function Explore() {
  const { posts } = usePostStore();
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<ExploreTab>('trending');
  const [category, setCategory] = useState('All');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const filtered = useMemo(() => {
    let result = [...posts];
    if (category !== 'All') result = result.filter(p => p.medium === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.author.displayName.toLowerCase().includes(q) ||
        p.medium.toLowerCase().includes(q)
      );
    }
    if (tab === 'trending') result = [...result].sort((a, b) => b.likesCount - a.likesCount);
    if (tab === 'recent')   result = [...result].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return result;
  }, [posts, query, tab, category]);

  const filteredArtists = useMemo(() => {
    if (!query.trim()) return MOCK_USERS.filter(u => u.role === 'artist');
    const q = query.toLowerCase();
    return MOCK_USERS.filter(u =>
      u.displayName.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.location?.toLowerCase().includes(q) ||
      u.artInterests?.some(i => i.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-24">

        {/* ── Search header ── */}
        <div className="mb-8">
          <div className="section-label">Explore</div>
          <h1 className="font-serif font-bold text-3xl lg:text-4xl text-ink mt-1 mb-6 tracking-tight">
            Discover African Art
          </h1>

          {/* Search input */}
          <div className="relative max-w-2xl mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
            <input
              className="input pl-12 pr-10 py-4 text-base rounded-xl"
              placeholder="Search artworks, artists, tags…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {ART_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  'flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium border transition-all duration-200',
                  category === cat
                    ? 'bg-terracotta text-white border-terracotta'
                    : 'border-[var(--border)] text-ink/70 hover:border-terracotta/50 hover:text-terracotta'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 border-b border-[var(--border)] mb-6">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                'px-4 py-3 text-sm font-medium transition-all duration-200 relative',
                tab === t.key ? 'text-terracotta' : 'text-ink/50 hover:text-ink'
              )}
            >
              {t.label}
              {tab === t.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-terracotta rounded-full" />}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        {tab === 'artists' ? (
          // Artists grid
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredArtists.map(artist => (
              <Link
                key={artist.id}
                to={`/profile/${artist.id}`}
                className="card p-4 flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-elevated transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden mb-3 ring-2 ring-transparent group-hover:ring-terracotta transition-all duration-300">
                  <Avatar user={artist} size="lg" className="w-full h-full" />
                </div>
                <p className="text-sm font-semibold text-ink">{artist.displayName}</p>
                <p className="text-xs text-ink/50 mt-0.5">{artist.artInterests?.[0] ?? 'Artist'}</p>
                <p className="text-xs text-ink/40 mt-0.5">{artist.location}</p>
                <div className="flex gap-3 mt-3 text-xs text-ink/50">
                  <span>{artist.worksCount} works</span>
                  <span>{formatCount(artist.followersCount)} followers</span>
                </div>
                <button className="mt-3 px-4 py-1.5 text-xs border border-[var(--border)] rounded-full text-ink/60 hover:bg-terracotta hover:text-white hover:border-terracotta transition-all duration-200">
                  Follow
                </button>
              </Link>
            ))}
          </div>
        ) : (
          // Posts mosaic grid
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-serif text-2xl text-ink/30 mb-2">No results found</p>
                <p className="text-sm text-ink/40">Try a different search term or category</p>
              </div>
            ) : (
              <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-0">
                {filtered.map((post, i) => (
                  <div key={post.id} className="break-inside-avoid mb-3" style={{ animationDelay: `${i * 50}ms` }}>
                    <ArtCard
                      post={post}
                      variant="grid"
                      onClick={() => setSelectedPost(post)}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {selectedPost && (
        <ArtworkDetail post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </div>
  );
}

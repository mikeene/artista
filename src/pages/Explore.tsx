import { useState, useMemo, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { usePostStore, useAuthStore } from '@/store';
import { ART_CATEGORIES } from '@/lib/mockData';
import ArtCard from '@/components/feed/ArtCard';
import ArtworkDetail from '@/components/feed/ArtworkDetail';
import Avatar from '@/components/ui/Avatar';
import type { Post, ExploreTab, User } from '@/types';
import { cn, formatCount } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { followUser, unfollowUser, getFollowStatuses } from '@/lib/userService';
import toast from 'react-hot-toast';
import { db } from '@/lib/firebase';

const TABS: { key: ExploreTab; label: string }[] = [
  { key: 'trending', label: 'Trending' },
  { key: 'recent',   label: 'Recent' },
  { key: 'artists',  label: 'Artists' },
];

export default function Explore() {
  const { posts } = usePostStore();
  const { user } = useAuthStore();
  const [query2, setQuery] = useState('');
  const [tab, setTab] = useState<ExploreTab>('trending');
  const [category, setCategory] = useState('All');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
  const [followLoading, setFollowLoading] = useState<string | null>(null);

  // Load real users from Firestore
  useEffect(() => {
    async function loadUsers() {
      setLoadingUsers(true);
      try {
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(50));
        const snap = await getDocs(q);
        const users = snap.docs.map(d => ({ id: d.id, ...d.data() } as User));
        setAllUsers(users);
        if (user?.id && users.length > 0) {
          try {
            const statuses = await getFollowStatuses(user.id, users.map(u => u.id));
            const map: Record<string, boolean> = {};
            users.forEach(u => { map[u.id] = statuses.has(u.id); });
            setFollowingMap(map);
          } catch { /* ignore */ }
        }
      } catch {
        setAllUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    }
    loadUsers();
  }, []);

  const filteredPosts = useMemo(() => {
    let result = [...posts];
    if (category !== 'All') result = result.filter(p => p.medium === category);
    if (query2.trim()) {
      const q = query2.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.author?.displayName?.toLowerCase().includes(q) ||
        p.medium.toLowerCase().includes(q)
      );
    }
    if (tab === 'trending') result = [...result].sort((a, b) => b.likesCount - a.likesCount);
    if (tab === 'recent')   result = [...result].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return result;
  }, [posts, query2, tab, category]);

  const filteredUsers = useMemo(() => {
    if (!query2.trim()) return allUsers;
    const q = query2.toLowerCase();
    return allUsers.filter(u =>
      u.displayName?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q) ||
      u.location?.toLowerCase().includes(q) ||
      u.artInterests?.some(i => i.toLowerCase().includes(q))
    );
  }, [allUsers, query2]);

  async function handleFollow(e: React.MouseEvent, targetId: string) {
    e.preventDefault(); // prevent navigating to profile
    if (!user) return;
    setFollowLoading(targetId);
    const isFollowed = followingMap[targetId];
    setFollowingMap(prev => ({ ...prev, [targetId]: !isFollowed }));
    setAllUsers(prev => prev.map(u =>
      u.id === targetId
        ? { ...u, followersCount: (u.followersCount ?? 0) + (isFollowed ? -1 : 1) }
        : u
    ));
    try {
      if (isFollowed) {
        await unfollowUser(user.id, targetId);
        toast.success('Unfollowed');
      } else {
        await followUser(user.id, targetId);
        toast.success('Following! 🎨');
      }
    } catch {
      setFollowingMap(prev => ({ ...prev, [targetId]: isFollowed }));
      toast.error('Something went wrong');
    } finally {
      setFollowLoading(null);
    }
  }

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-24">

        {/* Header */}
        <div className="mb-8">
          <div className="section-label">Explore</div>
          <h1 className="font-serif font-bold text-3xl lg:text-4xl text-ink mt-1 mb-6 tracking-tight">
            Discover African Art
          </h1>

          {/* Search */}
          <div className="relative max-w-2xl mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
            <input
              className="input pl-12 pr-10 py-4 text-base rounded-xl"
              placeholder="Search artworks, artists, tags…"
              value={query2}
              onChange={e => setQuery(e.target.value)}
            />
            {query2 && (
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

        {/* Tabs */}
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
              {t.key === 'artists' && allUsers.length > 0 && (
                <span className="ml-1.5 text-xs text-ink/40">({allUsers.length})</span>
              )}
              {tab === t.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-terracotta rounded-full" />}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === 'artists' ? (
          loadingUsers ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="card p-4 flex flex-col items-center gap-3 animate-pulse">
                  <div className="w-16 h-16 rounded-full bg-black/10" />
                  <div className="w-24 h-3 bg-black/10 rounded" />
                  <div className="w-16 h-2 bg-black/10 rounded" />
                </div>
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-2xl text-ink/30 mb-2">No artists found</p>
              <p className="text-sm text-ink/40">
                {query2 ? `No results for "${query2}"` : 'No users have signed up yet'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredUsers.map(artist => (
                <Link
                  key={artist.id}
                  to={`/profile/${artist.id}`}
                  className="card p-4 flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-elevated transition-all duration-300 group"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden mb-3 ring-2 ring-transparent group-hover:ring-terracotta transition-all duration-300">
                    <Avatar user={artist} size="lg" className="w-full h-full" />
                  </div>
                  <p className="text-sm font-semibold text-ink">{artist.displayName}</p>
                  <p className="text-xs text-ink/50 mt-0.5 capitalize">{artist.role}</p>
                  {artist.location && (
                    <p className="text-xs text-ink/40 mt-0.5">{artist.location}</p>
                  )}
                  {artist.artInterests && artist.artInterests.length > 0 && (
                    <p className="text-xs text-terracotta/70 mt-1">{artist.artInterests[0]}</p>
                  )}
                  <div className="flex gap-3 mt-2 text-xs text-ink/40">
                    <span>{formatCount(artist.followersCount ?? 0)} followers</span>
                  </div>
                  {artist.id !== user?.id && (
                    <button
                      onClick={(e) => handleFollow(e, artist.id)}
                      disabled={followLoading === artist.id}
                      className={cn(
                        'mt-2 text-xs font-medium px-3 py-1 rounded-full border transition-all duration-200',
                        followingMap[artist.id]
                          ? 'border-ink/20 text-ink/50 hover:border-red-300 hover:text-red-400'
                          : 'border-terracotta text-terracotta hover:bg-terracotta hover:text-white',
                        followLoading === artist.id && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      {followLoading === artist.id ? '…' : followingMap[artist.id] ? 'Following' : 'Follow'}
                    </button>
                  )}
                </Link>
              ))}
            </div>
          )
        ) : (
          filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-2xl text-ink/30 mb-2">
                {query2 ? `No results for "${query2}"` : 'No artworks yet'}
              </p>
              <p className="text-sm text-ink/40">
                {query2 ? 'Try a different search term or category' : 'Be the first to post an artwork! 🎨'}
              </p>
            </div>
          ) : (
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-3">
              {filteredPosts.map((post, i) => (
                <div key={post.id} className="break-inside-avoid mb-3" style={{ animationDelay: `${i * 50}ms` }}>
                  <ArtCard post={post} variant="grid" onClick={() => setSelectedPost(post)} />
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {selectedPost && (
        <ArtworkDetail post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </div>
  );
}

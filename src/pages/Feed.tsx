import { useState, useEffect } from 'react';
import { usePostStore, useAuthStore } from '@/store';
import ArtCard from '@/components/feed/ArtCard';
import ArtworkDetail from '@/components/feed/ArtworkDetail';
import type { Post, FeedTab, User } from '@/types';
import Avatar from '@/components/ui/Avatar';
import { Link } from 'react-router-dom';
import { cn, formatCount } from '@/lib/utils';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getFeedPosts } from '@/lib/postService';
import { followUser, unfollowUser, getFollowStatuses } from '@/lib/userService';
import toast from 'react-hot-toast';

const TABS: { key: FeedTab; label: string }[] = [
  { key: 'discover', label: 'Discover' },
  { key: 'following', label: 'Following' },
];

const TRENDING_TAGS = ['Lagos', 'afrofuturism', 'oil', 'digital', 'Nigeria', 'Yoruba', 'portrait', 'adire', 'bronze'];

export default function Feed() {
  const { posts, setPosts } = usePostStore();
  const { user } = useAuthStore();
  const [tab, setTab] = useState<FeedTab>('discover');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [page, setPage] = useState(1);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
  const [followLoading, setFollowLoading] = useState<string | null>(null);

  // Load real posts from Firestore
  useEffect(() => {
    async function loadPosts() {
      setLoadingPosts(true);
      try {
        const firestorePosts = await getFeedPosts(24);
        if (firestorePosts.length > 0) {
          setPosts(firestorePosts);
        }
      } catch {
        // Keep existing posts (mock or previously loaded)
      } finally {
        setLoadingPosts(false);
      }
    }
    loadPosts();
  }, []);

  // Load real users for sidebar
  useEffect(() => {
    async function loadUsers() {
      try {
        const q = query(
          collection(db, 'users'),
          orderBy('createdAt', 'desc'),
          limit(6)
        );
        const snap = await getDocs(q);
        const users = snap.docs
          .map(d => ({ id: d.id, ...d.data() } as User))
          .filter(u => u.id !== user?.id); // exclude self
        setSuggestedUsers(users);
        // Load follow statuses
        if (user?.id && users.length > 0) {
          try {
            const statuses = await getFollowStatuses(user.id, users.map(u => u.id));
            const map: Record<string, boolean> = {};
            users.forEach(u => { map[u.id] = statuses.has(u.id); });
            setFollowingMap(map);
          } catch { /* ignore */ }
        }
      } catch {
        setSuggestedUsers([]);
      }
    }
    loadUsers();
  }, [user?.id]);

  async function handleFollow(targetId: string) {
    if (!user) return;
    setFollowLoading(targetId);
    const isFollowed = followingMap[targetId];
    // Optimistic update
    setFollowingMap(prev => ({ ...prev, [targetId]: !isFollowed }));
    setSuggestedUsers(prev => prev.map(u =>
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
      // Revert on error
      setFollowingMap(prev => ({ ...prev, [targetId]: isFollowed }));
      toast.error('Something went wrong');
    } finally {
      setFollowLoading(null);
    }
  }

  const displayPosts = tab === 'following'
    ? posts.filter(p => p.authorId !== user?.id)
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
                    tab === t.key ? 'text-terracotta' : 'text-ink/50 hover:text-ink'
                  )}
                >
                  {t.label}
                  {tab === t.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-terracotta rounded-full" />}
                </button>
              ))}
            </div>

            {/* Loading state */}
            {loadingPosts && posts.length === 0 && (
              <div className="grid sm:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="aspect-[4/3] bg-black/10" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-black/10 rounded w-3/4" />
                      <div className="h-3 bg-black/10 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty feed */}
            {!loadingPosts && displayPosts.length === 0 && (
              <div className="text-center py-20">
                <p className="font-serif text-2xl text-ink/30 mb-2">No posts yet</p>
                <p className="text-sm text-ink/40">
                  {tab === 'following'
                    ? 'Follow some artists to see their work here'
                    : 'Be the first to post an artwork! Click "Post Artwork" above 🎨'}
                </p>
              </div>
            )}

            {/* Post grid */}
            {visiblePosts.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-4">
                {visiblePosts.map(post => (
                  <ArtCard key={post.id} post={post} onClick={() => setSelectedPost(post)} />
                ))}
              </div>
            )}

            {hasMore && (
              <div className="flex justify-center mt-8">
                <button onClick={() => setPage(p => p + 1)} className="btn-secondary px-8 py-3">
                  Load more
                </button>
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
                    { n: user.worksCount,     label: 'Works' },
                    { n: user.followersCount, label: 'Followers' },
                    { n: user.followingCount, label: 'Following' },
                  ].map(({ n, label }) => (
                    <div key={label}>
                      <p className="text-sm font-bold text-ink">{formatCount(n ?? 0)}</p>
                      <p className="text-[10px] text-ink/50">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested users */}
            <div className="card p-4">
              <h3 className="font-serif font-bold text-base text-ink mb-4">
                {suggestedUsers.length > 0 ? 'People on Artista' : 'Suggested Artists'}
              </h3>
              {suggestedUsers.length === 0 ? (
                <p className="text-xs text-ink/40 text-center py-3">
                  Invite friends to join Artista!
                </p>
              ) : (
                <div className="space-y-3">
                  {suggestedUsers.slice(0, 5).map(u => (
                    <div key={u.id} className="flex items-center justify-between">
                      <Link to={`/profile/${u.id}`} className="flex items-center gap-2.5 min-w-0">
                        <Avatar user={u} size="sm" />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-ink truncate">{u.displayName}</p>
                          <p className="text-[10px] text-ink/50 capitalize">{u.role}</p>
                        </div>
                      </Link>
                      <button
                        onClick={() => handleFollow(u.id)}
                        disabled={followLoading === u.id}
                        className={cn(
                          'text-xs font-medium transition-colors ml-2 flex-shrink-0 px-2.5 py-1 rounded-full border',
                          followingMap[u.id]
                            ? 'border-ink/20 text-ink/50 hover:border-red-300 hover:text-red-400'
                            : 'border-terracotta text-terracotta hover:bg-terracotta hover:text-white',
                          followLoading === u.id && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        {followLoading === u.id ? '…' : followingMap[u.id] ? 'Following' : 'Follow'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Trending tags */}
            <div className="card p-4">
              <h3 className="font-serif font-bold text-base text-ink mb-4">Trending Tags</h3>
              <div className="flex flex-wrap gap-2">
                {TRENDING_TAGS.map(tag => (
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

      {selectedPost && (
        <ArtworkDetail post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </div>
  );
}

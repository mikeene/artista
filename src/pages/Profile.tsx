import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Globe, Instagram, Twitter, Check, MessageCircle, Share2 } from 'lucide-react';
import { usePostStore, useAuthStore } from '@/store';
import { cn, formatCount } from '@/lib/utils';
import ArtCard from '@/components/feed/ArtCard';
import ArtworkDetail from '@/components/feed/ArtworkDetail';
import Avatar from '@/components/ui/Avatar';
import type { Post, User } from '@/types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getUserPosts } from '@/lib/postService';
import { MOCK_USERS } from '@/lib/mockData';
import toast from 'react-hot-toast';

type ProfileTab = 'gallery' | 'about';

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuthStore();
  const { posts } = usePostStore();
  const [tab, setTab] = useState<ProfileTab>('gallery');
  const [following, setFollowing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [profilePosts, setProfilePosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = currentUser?.id === id;

  useEffect(() => {
    async function loadProfile() {
      if (!id) return;
      setLoading(true);
      try {
        // Try Firestore first
        const userSnap = await getDoc(doc(db, 'users', id));
        if (userSnap.exists()) {
          const userData = { id: userSnap.id, ...userSnap.data() } as User;
          setProfileUser(userData);
          // Load their posts from Firestore
          try {
            const firestorePosts = await getUserPosts(id);
            setProfilePosts(firestorePosts);
          } catch {
            // Fall back to local posts
            setProfilePosts(posts.filter(p => p.authorId === id));
          }
        } else {
          // Fall back to mock data
          const mockUser = MOCK_USERS.find(u => u.id === id) ?? MOCK_USERS[0];
          setProfileUser(mockUser);
          setProfilePosts(posts.filter(p => p.authorId === id));
        }
      } catch {
        // Fall back to mock data if Firebase fails
        const mockUser = MOCK_USERS.find(u => u.id === id) ?? MOCK_USERS[0];
        setProfileUser(mockUser);
        setProfilePosts(posts.filter(p => p.authorId === id));
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [id, posts]);

  // If viewing own profile, always use current user data
  const displayUser = isOwnProfile ? currentUser : profileUser;

  function handleFollow() {
    setFollowing(!following);
    toast.success(following ? 'Unfollowed' : `Following ${displayUser?.displayName}!`);
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    toast.success('Profile link copied!');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 bg-terracotta rounded-lg animate-pulse-soft flex items-center justify-center">
          <span className="text-white font-serif font-black">A</span>
        </div>
      </div>
    );
  }

  if (!displayUser) return null;

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      {/* ── Profile Header ── */}
      <div className="bg-deep relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className={cn('w-full h-full', profilePosts[0]?.imageUrl ?? 'art-terracotta')} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-deep/50 via-deep/70 to-deep" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
            <div className="relative">
              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden ring-4 ring-white/20">
                <Avatar user={displayUser} size="xl" className="w-full h-full" />
              </div>
              {displayUser.verified && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-terracotta rounded-full flex items-center justify-center ring-2 ring-deep">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-serif font-black text-3xl lg:text-4xl text-white tracking-tight">
                  {displayUser.displayName}
                </h1>
                {displayUser.verified && (
                  <span className="text-xs font-medium text-gold/80 bg-gold/10 px-2 py-0.5 rounded-full border border-gold/20">
                    Verified
                  </span>
                )}
              </div>
              <p className="text-white/60 text-sm mb-2">@{displayUser.username}</p>
              {displayUser.bio && (
                <p className="text-white/80 text-sm leading-relaxed max-w-xl">{displayUser.bio}</p>
              )}
              {displayUser.location && (
                <div className="flex items-center gap-1.5 text-white/50 text-xs mt-2">
                  <MapPin className="w-3.5 h-3.5" />
                  {displayUser.location}
                </div>
              )}
            </div>

            {/* Actions — hide follow button on own profile */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {!isOwnProfile && (
                <button
                  onClick={handleFollow}
                  className={cn(
                    'px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2',
                    following
                      ? 'bg-white/10 text-white/80 hover:bg-white/20'
                      : 'bg-terracotta text-white hover:bg-white hover:text-terracotta'
                  )}
                >
                  {following ? <><Check className="w-4 h-4" /> Following</> : 'Follow'}
                </button>
              )}
              {isOwnProfile && (
                <Link
                  to="/settings"
                  className="px-6 py-2.5 rounded-lg text-sm font-medium bg-white/10 text-white hover:bg-white/20 transition-all duration-200"
                >
                  Edit Profile
                </Link>
              )}
              {!isOwnProfile && (
                <button className="p-2.5 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </button>
              )}
              <button onClick={handleShare} className="p-2.5 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-8 pt-6 border-t border-white/10">
            {[
              { n: profilePosts.length,                                                    label: 'Works' },
              { n: displayUser.followersCount + (following ? 1 : 0),                      label: 'Followers' },
              { n: displayUser.followingCount,                                             label: 'Following' },
            ].map(({ n, label }) => (
              <div key={label}>
                <p className="font-serif font-bold text-2xl text-white">{formatCount(n)}</p>
                <p className="text-white/50 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-1 border-b border-[var(--border)]">
          {[
            { key: 'gallery' as const, label: `Gallery (${profilePosts.length})` },
            { key: 'about' as const,   label: 'About' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={cn('px-6 py-4 text-sm font-medium transition-all duration-200 relative',
                tab === t.key ? 'text-terracotta' : 'text-ink/50 hover:text-ink')}>
              {t.label}
              {tab === t.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-terracotta rounded-full" />}
            </button>
          ))}
        </div>

        {tab === 'gallery' ? (
          <div className="py-6">
            {profilePosts.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-serif text-2xl text-ink/30 mb-2">No artworks yet</p>
                {isOwnProfile
                  ? <p className="text-sm text-ink/40">Click "Post Artwork" to share your first piece 🎨</p>
                  : <p className="text-sm text-ink/40">This artist hasn't posted anything yet.</p>
                }
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {profilePosts.map(post => (
                  <ArtCard key={post.id} post={post} variant="grid" onClick={() => setSelectedPost(post)} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 max-w-2xl space-y-6">
            {displayUser.bio && (
              <div>
                <h3 className="font-serif font-bold text-lg text-ink mb-2">About</h3>
                <p className="text-ink/70 leading-relaxed">{displayUser.bio}</p>
              </div>
            )}
            {displayUser.artInterests && displayUser.artInterests.length > 0 && (
              <div>
                <h3 className="font-serif font-bold text-lg text-ink mb-3">Art Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {displayUser.artInterests.map(interest => (
                    <span key={interest} className="px-3 py-1.5 text-sm bg-terracotta/10 text-terracotta rounded-full border border-terracotta/20">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h3 className="font-serif font-bold text-lg text-ink mb-3">Connect</h3>
              <div className="space-y-2">
                {displayUser.location && (
                  <div className="flex items-center gap-3 text-sm text-ink/70">
                    <MapPin className="w-4 h-4 text-ink/40" /> {displayUser.location}
                  </div>
                )}
                {displayUser.website && (
                  <a href={displayUser.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-terracotta hover:underline">
                    <Globe className="w-4 h-4" /> {displayUser.website}
                  </a>
                )}
                {displayUser.instagram && (
                  <div className="flex items-center gap-3 text-sm text-ink/70">
                    <Instagram className="w-4 h-4 text-ink/40" /> {displayUser.instagram}
                  </div>
                )}
                {displayUser.twitter && (
                  <div className="flex items-center gap-3 text-sm text-ink/70">
                    <Twitter className="w-4 h-4 text-ink/40" /> {displayUser.twitter}
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-ink mb-2">Role</h3>
              <span className={cn('badge capitalize px-3 py-1.5 text-sm',
                displayUser.role === 'artist' ? 'bg-terracotta/10 text-terracotta' :
                displayUser.role === 'brand' ? 'bg-violet/10 text-violet' : 'bg-sage/20 text-sage')}>
                {displayUser.role}
              </span>
            </div>
          </div>
        )}
      </div>

      {selectedPost && <ArtworkDetail post={selectedPost} onClose={() => setSelectedPost(null)} />}
    </div>
  );
}

import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Globe, Instagram, Twitter, Check, MessageCircle, Share2 } from 'lucide-react';
import { MOCK_USERS } from '@/lib/mockData';
import { usePostStore } from '@/store';
import { cn, formatCount } from '@/lib/utils';
import ArtCard from '@/components/feed/ArtCard';
import ArtworkDetail from '@/components/feed/ArtworkDetail';
import Avatar from '@/components/ui/Avatar';
import type { Post } from '@/types';
import toast from 'react-hot-toast';

type ProfileTab = 'gallery' | 'about';

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const { posts } = usePostStore();
  const [tab, setTab] = useState<ProfileTab>('gallery');
  const [following, setFollowing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const artist = MOCK_USERS.find(u => u.id === id) ?? MOCK_USERS[0];
  const artistPosts = posts.filter(p => p.authorId === artist.id);

  function handleFollow() {
    setFollowing(!following);
    toast.success(following ? 'Unfollowed' : `Following ${artist.displayName}!`);
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    toast.success('Profile link copied!');
  }

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      {/* ── Profile Header ── */}
      <div className="bg-deep relative overflow-hidden">
        {/* Background art */}
        <div className="absolute inset-0 opacity-20">
          <div className={cn('w-full h-full', artistPosts[0]?.imageUrl ?? 'art-terracotta')} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-deep/50 via-deep/70 to-deep" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden ring-4 ring-white/20">
                <Avatar user={artist} size="xl" className="w-full h-full" />
              </div>
              {artist.verified && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-terracotta rounded-full flex items-center justify-center ring-2 ring-deep">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-serif font-black text-3xl lg:text-4xl text-white tracking-tight">
                  {artist.displayName}
                </h1>
                {artist.verified && (
                  <span className="text-xs font-medium text-gold/80 bg-gold/10 px-2 py-0.5 rounded-full border border-gold/20">
                    Verified
                  </span>
                )}
              </div>
              <p className="text-white/60 text-sm mb-2">@{artist.username}</p>
              {artist.bio && (
                <p className="text-white/80 text-sm leading-relaxed max-w-xl">{artist.bio}</p>
              )}
              {artist.location && (
                <div className="flex items-center gap-1.5 text-white/50 text-xs mt-2">
                  <MapPin className="w-3.5 h-3.5" />
                  {artist.location}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
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
              <button className="p-2.5 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </button>
              <button onClick={handleShare} className="p-2.5 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex gap-8 mt-8 pt-6 border-t border-white/10">
            {[
              { n: artist.worksCount,       label: 'Works' },
              { n: artist.followersCount + (following ? 1 : 0), label: 'Followers' },
              { n: artist.followingCount,   label: 'Following' },
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
        {/* Tabs */}
        <div className="flex gap-1 border-b border-[var(--border)] mt-0">
          {[
            { key: 'gallery' as const, label: `Gallery (${artistPosts.length})` },
            { key: 'about' as const, label: 'About' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                'px-6 py-4 text-sm font-medium transition-all duration-200 relative',
                tab === t.key ? 'text-terracotta' : 'text-ink/50 hover:text-ink'
              )}
            >
              {t.label}
              {tab === t.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-terracotta rounded-full" />}
            </button>
          ))}
        </div>

        {tab === 'gallery' ? (
          /* Gallery grid */
          <div className="py-6">
            {artistPosts.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-serif text-2xl text-ink/30 mb-2">No artworks yet</p>
                <p className="text-sm text-ink/40">This artist hasn't posted anything yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {artistPosts.map(post => (
                  <ArtCard
                    key={post.id}
                    post={post}
                    variant="grid"
                    onClick={() => setSelectedPost(post)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* About tab */
          <div className="py-8 max-w-2xl">
            <div className="space-y-6">
              {artist.bio && (
                <div>
                  <h3 className="font-serif font-bold text-lg text-ink mb-2">About</h3>
                  <p className="text-ink/70 leading-relaxed">{artist.bio}</p>
                </div>
              )}

              {artist.artInterests && artist.artInterests.length > 0 && (
                <div>
                  <h3 className="font-serif font-bold text-lg text-ink mb-3">Art Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {artist.artInterests.map(interest => (
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
                  {artist.location && (
                    <div className="flex items-center gap-3 text-sm text-ink/70">
                      <MapPin className="w-4 h-4 text-ink/40" />
                      {artist.location}
                    </div>
                  )}
                  {artist.website && (
                    <a href={artist.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-terracotta hover:underline">
                      <Globe className="w-4 h-4" />
                      {artist.website}
                    </a>
                  )}
                  {artist.instagram && (
                    <div className="flex items-center gap-3 text-sm text-ink/70">
                      <Instagram className="w-4 h-4 text-ink/40" />
                      {artist.instagram}
                    </div>
                  )}
                  {artist.twitter && (
                    <div className="flex items-center gap-3 text-sm text-ink/70">
                      <Twitter className="w-4 h-4 text-ink/40" />
                      {artist.twitter}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-serif font-bold text-lg text-ink mb-3">Member since</h3>
                <p className="text-ink/70 text-sm">
                  {artist.createdAt.toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedPost && (
        <ArtworkDetail post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </div>
  );
}

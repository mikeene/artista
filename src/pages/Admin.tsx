import { Users, Image, Flag, TrendingUp, ShieldAlert, Trash2, Eye } from 'lucide-react';
import { usePostStore } from '@/store';
import { MOCK_USERS } from '@/lib/mockData';
import { formatCount, timeAgo } from '@/lib/utils';
import Avatar from '@/components/ui/Avatar';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type AdminTab = 'overview' | 'users' | 'posts' | 'reports';

const STATS = [
  { label: 'Total Users',    value: '1,247',  delta: '+12%',  icon: <Users className="w-5 h-5" />,       color: 'bg-violet/10 text-violet' },
  { label: 'Total Artworks', value: '3,891',  delta: '+24%',  icon: <Image className="w-5 h-5" />,        color: 'bg-terracotta/10 text-terracotta' },
  { label: 'Active Artists', value: '487',    delta: '+8%',   icon: <TrendingUp className="w-5 h-5" />,   color: 'bg-sage/20 text-sage' },
  { label: 'Open Reports',   value: '14',     delta: '-3%',   icon: <Flag className="w-5 h-5" />,         color: 'bg-gold/10 text-gold' },
];

export default function Admin() {
  const { posts } = usePostStore();
  const [tab, setTab] = useState<AdminTab>('overview');

  function handleSuspend(name: string) { toast.success(`User ${name} suspended`); }
  function handleDelete(title: string) { toast.success(`Post "${title}" deleted`); }

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-24">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="w-5 h-5 text-terracotta" />
            <div className="section-label" style={{ margin: 0 }}>Admin</div>
          </div>
          <h1 className="font-serif font-bold text-3xl text-ink tracking-tight">Dashboard</h1>
          <p className="text-sm text-ink/50 mt-1">Artista platform moderation and analytics</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-[var(--border)] mb-6">
          {(['overview', 'users', 'posts', 'reports'] as AdminTab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={cn('px-4 py-3 text-sm font-medium capitalize transition-all duration-200 relative',
                tab === t ? 'text-terracotta' : 'text-ink/50 hover:text-ink')}>
              {t}
              {tab === t && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-terracotta rounded-full" />}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {STATS.map(s => (
                <div key={s.label} className="card p-5">
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-3', s.color)}>
                    {s.icon}
                  </div>
                  <p className="font-serif font-bold text-2xl text-ink">{s.value}</p>
                  <p className="text-xs text-ink/50 mt-0.5">{s.label}</p>
                  <p className={cn('text-xs font-medium mt-1', s.delta.startsWith('+') ? 'text-green-500' : 'text-red-400')}>
                    {s.delta} this month
                  </p>
                </div>
              ))}
            </div>

            {/* Recent activity */}
            <div className="card p-5">
              <h3 className="font-serif font-bold text-lg text-ink mb-4">Recent Artworks</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th className="text-left py-2 text-xs font-medium text-ink/50 uppercase tracking-wide pb-3">Artwork</th>
                      <th className="text-left py-2 text-xs font-medium text-ink/50 uppercase tracking-wide pb-3">Artist</th>
                      <th className="text-left py-2 text-xs font-medium text-ink/50 uppercase tracking-wide pb-3">Medium</th>
                      <th className="text-left py-2 text-xs font-medium text-ink/50 uppercase tracking-wide pb-3">Likes</th>
                      <th className="text-left py-2 text-xs font-medium text-ink/50 uppercase tracking-wide pb-3">Posted</th>
                      <th className="text-right py-2 text-xs font-medium text-ink/50 uppercase tracking-wide pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.slice(0, 8).map(post => (
                      <tr key={post.id} className="border-b border-[var(--border)] hover:bg-warm transition-colors">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-3">
                            <div className={cn('w-10 h-10 rounded-lg flex-shrink-0', post.imageUrl)} />
                            <span className="font-medium text-ink truncate max-w-[140px]">{post.title}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <Avatar user={post.author} size="xs" />
                            <span className="text-ink/70">{post.author.displayName}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-ink/60">{post.medium}</td>
                        <td className="py-3 pr-4 text-ink/60">{formatCount(post.likesCount)}</td>
                        <td className="py-3 pr-4 text-ink/60">{timeAgo(post.createdAt)}</td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button className="p-1.5 rounded hover:bg-black/5 text-ink/50 hover:text-ink transition-colors">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(post.title)}
                              className="p-1.5 rounded hover:bg-red-50 text-ink/50 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === 'users' && (
          <div className="card overflow-hidden">
            <div className="p-5 border-b border-[var(--border)]">
              <h3 className="font-serif font-bold text-lg text-ink">All Users ({MOCK_USERS.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-warm">
                  <tr>
                    {['User', 'Role', 'Location', 'Works', 'Followers', 'Joined', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-medium text-ink/50 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MOCK_USERS.map(u => (
                    <tr key={u.id} className="border-t border-[var(--border)] hover:bg-warm transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar user={u} size="sm" />
                          <div>
                            <p className="font-medium text-ink">{u.displayName}</p>
                            <p className="text-xs text-ink/50">@{u.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={cn('badge text-xs px-2 py-0.5 capitalize',
                          u.role === 'artist' ? 'bg-terracotta/10 text-terracotta' :
                          u.role === 'brand' ? 'bg-violet/10 text-violet' :
                          'bg-sage/20 text-sage')}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-ink/60">{u.location ?? '—'}</td>
                      <td className="py-3 px-4 text-ink/60">{u.worksCount}</td>
                      <td className="py-3 px-4 text-ink/60">{formatCount(u.followersCount)}</td>
                      <td className="py-3 px-4 text-ink/60">{u.createdAt.toLocaleDateString('en-NG', { month: 'short', year: 'numeric' })}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleSuspend(u.displayName)}
                          className="text-xs text-red-500 hover:underline font-medium"
                        >
                          Suspend
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'posts' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {posts.map(post => (
              <div key={post.id} className="group relative rounded overflow-hidden">
                <div className={cn('aspect-square', post.imageUrl)} />
                <div className="absolute inset-0 bg-deep/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
                  <p className="text-white text-xs font-bold truncate">{post.title}</p>
                  <p className="text-white/70 text-[10px] mt-0.5">{post.author.displayName}</p>
                  <div className="flex gap-2 mt-2">
                    <button className="text-white/80 hover:text-white p-1 rounded transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.title)}
                      className="text-red-300 hover:text-red-200 p-1 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'reports' && (
          <div className="card p-8 text-center">
            <Flag className="w-12 h-12 text-ink/20 mx-auto mb-4" />
            <p className="font-serif text-xl text-ink/40">No reports to review</p>
            <p className="text-sm text-ink/30 mt-1">The community is behaving well 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
}

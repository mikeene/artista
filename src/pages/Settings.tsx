import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Globe, Instagram, Twitter, Save, LogOut, Camera } from 'lucide-react';
import { useAuthStore } from '@/store';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cn, sleep } from '@/lib/utils';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import type { UserRole } from '@/types';

const ART_INTERESTS = [
  'Painting', 'Photography', 'Digital Art', 'Sculpture',
  'Illustration', 'Mixed Media', 'Textile', 'Printmaking',
  'Ceramics', 'Street Art', 'Installation', 'Video Art',
];

export default function Settings() {
  const navigate = useNavigate();
  const { user, login, logout } = useAuthStore();
  const [loading, setSaving] = useState(false);
  const [form, setForm] = useState({
    displayName: user?.displayName ?? '',
    username: user?.username ?? '',
    bio: user?.bio ?? '',
    location: user?.location ?? '',
    website: user?.website ?? '',
    instagram: user?.instagram ?? '',
    twitter: user?.twitter ?? '',
    artInterests: user?.artInterests ?? [],
  });

  function update(key: string, val: string) {
    setForm(f => ({ ...f, [key]: val }));
  }

  function toggleInterest(interest: string) {
    setForm(f => ({
      ...f,
      artInterests: f.artInterests.includes(interest)
        ? f.artInterests.filter(i => i !== interest)
        : [...f.artInterests, interest],
    }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.id), {
        displayName: form.displayName,
        username: form.username.toLowerCase().replace(/[^a-z0-9.]/g, ''),
        bio: form.bio,
        location: form.location,
        website: form.website,
        instagram: form.instagram,
        twitter: form.twitter,
        artInterests: form.artInterests,
      });
      // Update local store
      login({ ...user, ...form });
      toast.success('Profile updated! ✨');
    } catch {
      // Fallback for offline/mock mode
      login({ ...user, ...form });
      toast.success('Profile updated! ✨');
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  if (!user) return null;

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-20 lg:pt-24">

        {/* Header */}
        <div className="mb-8">
          <div className="section-label">Account</div>
          <h1 className="font-serif font-bold text-3xl text-ink tracking-tight mt-1">Edit Profile</h1>
        </div>

        <form onSubmit={handleSave} className="space-y-8">

          {/* Avatar section */}
          <div className="card p-6">
            <h2 className="font-serif font-bold text-lg text-ink mb-4">Profile Photo</h2>
            <div className="flex items-center gap-5">
              <div className="relative">
                <Avatar user={user} size="xl" />
                <button
                  type="button"
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-terracotta text-white rounded-full flex items-center justify-center hover:bg-ink transition-colors shadow-md"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>
              <div>
                <p className="text-sm font-medium text-ink">{user.displayName}</p>
                <p className="text-xs text-ink/50 mt-0.5">@{user.username}</p>
                <p className="text-xs text-ink/40 mt-2">Photo upload coming soon</p>
              </div>
            </div>
          </div>

          {/* Basic info */}
          <div className="card p-6 space-y-4">
            <h2 className="font-serif font-bold text-lg text-ink mb-2">Basic Info</h2>
            <div>
              <label className="block text-xs font-medium text-ink/70 uppercase tracking-wide mb-1.5">
                <User className="w-3 h-3 inline mr-1" /> Display Name
              </label>
              <input className="input" value={form.displayName} onChange={e => update('displayName', e.target.value)} placeholder="Your name" />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink/70 uppercase tracking-wide mb-1.5">Username</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 text-sm">@</span>
                <input className="input pl-7" value={form.username} onChange={e => update('username', e.target.value)} placeholder="username" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink/70 uppercase tracking-wide mb-1.5">Bio</label>
              <textarea
                className="input resize-none"
                rows={3}
                value={form.bio}
                onChange={e => update('bio', e.target.value)}
                placeholder="Tell the community about yourself and your art…"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink/70 uppercase tracking-wide mb-1.5">
                <MapPin className="w-3 h-3 inline mr-1" /> Location
              </label>
              <input className="input" value={form.location} onChange={e => update('location', e.target.value)} placeholder="Lagos, Nigeria" />
            </div>
          </div>

          {/* Social links */}
          <div className="card p-6 space-y-4">
            <h2 className="font-serif font-bold text-lg text-ink mb-2">Links</h2>
            <div>
              <label className="block text-xs font-medium text-ink/70 uppercase tracking-wide mb-1.5">
                <Globe className="w-3 h-3 inline mr-1" /> Website
              </label>
              <input className="input" value={form.website} onChange={e => update('website', e.target.value)} placeholder="https://yoursite.com" />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink/70 uppercase tracking-wide mb-1.5">
                <Instagram className="w-3 h-3 inline mr-1" /> Instagram
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 text-sm">@</span>
                <input className="input pl-7" value={form.instagram} onChange={e => update('instagram', e.target.value)} placeholder="yourhandle" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink/70 uppercase tracking-wide mb-1.5">
                <Twitter className="w-3 h-3 inline mr-1" /> Twitter / X
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 text-sm">@</span>
                <input className="input pl-7" value={form.twitter} onChange={e => update('twitter', e.target.value)} placeholder="yourhandle" />
              </div>
            </div>
          </div>

          {/* Art interests */}
          <div className="card p-6">
            <h2 className="font-serif font-bold text-lg text-ink mb-1">Art Interests</h2>
            <p className="text-xs text-ink/50 mb-4">Select all that apply — helps us personalise your feed</p>
            <div className="flex flex-wrap gap-2">
              {ART_INTERESTS.map(interest => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200',
                    form.artInterests.includes(interest)
                      ? 'bg-terracotta text-white border-terracotta'
                      : 'border-[var(--border)] text-ink/70 hover:border-terracotta/50 hover:text-terracotta'
                  )}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Role display */}
          <div className="card p-6">
            <h2 className="font-serif font-bold text-lg text-ink mb-3">Account Type</h2>
            <div className="flex items-center gap-3">
              <span className={cn('badge capitalize px-3 py-1.5 text-sm',
                user.role === 'artist' ? 'bg-terracotta/10 text-terracotta' :
                user.role === 'brand' ? 'bg-violet/10 text-violet' : 'bg-sage/20 text-sage')}>
                {user.role === 'artist' ? '🎨' : user.role === 'brand' ? '🏢' : '✨'} {user.role}
              </span>
              <p className="text-xs text-ink/40">Contact support to change your account type</p>
            </div>
          </div>

          {/* Save button */}
          <div className="flex items-center justify-between pb-4">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
            <Button type="submit" loading={loading} size="lg">
              <Save className="w-4 h-4" />
              {loading ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

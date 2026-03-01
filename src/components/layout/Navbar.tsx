import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Compass, Bell, MessageCircle, Upload,
  User, Menu, X, Search, LogOut, Settings, LayoutDashboard,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Avatar from '@/components/ui/Avatar';
import { useAuthStore, useNotificationStore, useUIStore } from '@/store';
import { useState, useRef, useEffect } from 'react';

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  onClick?: () => void;
}

function NavLink({ to, icon, label, badge, onClick }: NavLinkProps) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        'relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
        active
          ? 'text-terracotta bg-terracotta/8'
          : 'text-ink/60 hover:text-ink hover:bg-black/5'
      )}
    >
      {icon}
      <span className="hidden lg:block">{label}</span>
      {badge != null && badge > 0 && (
        <span className="absolute -top-0.5 -right-0.5 lg:static lg:ml-auto
          min-w-[18px] h-[18px] flex items-center justify-center
          bg-terracotta text-white text-[10px] font-bold rounded-full px-1">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const { uploadModalOpen, setUploadModal, mobileMenuOpen, setMobileMenu } = useUIStore();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!user) return null;

  const isAdmin = user.role === 'artist' || user.id === 'admin';

  return (
    <>
      {/* ── Top Desktop Nav ──────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/feed" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-terracotta rounded-lg flex items-center justify-center">
                <span className="text-white font-serif font-black text-lg leading-none">A</span>
              </div>
              <span className="font-serif font-black text-xl text-ink hidden sm:block">
                Artista<span className="text-terracotta">.</span>
              </span>
            </Link>

            {/* Search bar - desktop */}
            <div className="hidden md:flex flex-1 max-w-sm mx-8">
              <div
                onClick={() => navigate('/explore')}
                className="w-full flex items-center gap-3 px-4 py-2 bg-warm border border-[var(--border)]
                  rounded-full text-sm text-ink/40 cursor-pointer hover:border-terracotta/50 transition-colors duration-200"
              >
                <Search className="w-4 h-4 flex-shrink-0" />
                <span>Search artworks, artists, tags…</span>
              </div>
            </div>

            {/* Nav links - desktop */}
            <nav className="hidden md:flex items-center gap-1">
              <NavLink to="/feed"     icon={<Home className="w-5 h-5" />}          label="Home" />
              <NavLink to="/explore"  icon={<Compass className="w-5 h-5" />}       label="Explore" />
              <NavLink to="/messages" icon={<MessageCircle className="w-5 h-5" />} label="Messages" />
              <NavLink
                to="/notifications"
                icon={<Bell className="w-5 h-5" />}
                label="Alerts"
                badge={unreadCount}
              />
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2 ml-4">
              {/* Upload CTA - visible for artists */}
              {user.role === 'artist' && (
                <button
                  onClick={() => setUploadModal(true)}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-terracotta text-white
                    rounded-lg text-sm font-medium hover:bg-ink transition-all duration-200 active:scale-95"
                >
                  <Upload className="w-4 h-4" />
                  <span className="hidden lg:block">Post Artwork</span>
                </button>
              )}

              {/* Profile dropdown */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-black/5 transition-colors duration-200"
                >
                  <Avatar user={user} size="sm" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-warm border border-[var(--border)] rounded-xl
                    shadow-elevated overflow-hidden animate-fade-in">
                    <div className="px-4 py-3 border-b border-[var(--border)]">
                      <p className="text-sm font-semibold text-ink">{user.displayName}</p>
                      <p className="text-xs text-ink/50">@{user.username}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to={`/profile/${user.id}`}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink/70 hover:text-ink hover:bg-black/5 transition-colors"
                      >
                        <User className="w-4 h-4" /> My Profile
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink/70 hover:text-ink hover:bg-black/5 transition-colors"
                      >
                        <Settings className="w-4 h-4" /> Settings
                      </Link>
                      {user.id === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink/70 hover:text-ink hover:bg-black/5 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                        </Link>
                      )}
                    </div>
                    <div className="border-t border-[var(--border)] py-1">
                      <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenu(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-black/5 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu Overlay ──────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-deep/50 backdrop-blur-sm" onClick={() => setMobileMenu(false)} />
          <div className="absolute top-16 left-0 right-0 bg-cream border-b border-[var(--border)] py-4 px-4 animate-rise-up">
            <div className="flex flex-col gap-1">
              <NavLink to="/feed"     icon={<Home className="w-5 h-5" />}          label="Home"         onClick={() => setMobileMenu(false)} />
              <NavLink to="/explore"  icon={<Compass className="w-5 h-5" />}       label="Explore"      onClick={() => setMobileMenu(false)} />
              <NavLink to="/messages" icon={<MessageCircle className="w-5 h-5" />} label="Messages"     onClick={() => setMobileMenu(false)} />
              <NavLink to="/notifications" icon={<Bell className="w-5 h-5" />}     label="Notifications" badge={unreadCount} onClick={() => setMobileMenu(false)} />
              <NavLink to={`/profile/${user.id}`} icon={<User className="w-5 h-5" />} label="My Profile" onClick={() => setMobileMenu(false)} />
              {user.role === 'artist' && (
                <button
                  onClick={() => { setMobileMenu(false); setUploadModal(true); }}
                  className="flex items-center gap-2 px-3 py-2 bg-terracotta text-white rounded-lg text-sm font-medium mt-2"
                >
                  <Upload className="w-5 h-5" /> Post Artwork
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Bottom Nav ────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-cream/95 backdrop-blur-md border-t border-[var(--border)]">
        <div className="flex items-center justify-around px-2 py-2 pb-safe">
          {[
            { to: '/feed',          icon: <Home className="w-5 h-5" />,            label: 'Home' },
            { to: '/explore',       icon: <Compass className="w-5 h-5" />,         label: 'Explore' },
            { to: '/messages',      icon: <MessageCircle className="w-5 h-5" />,   label: 'Messages' },
            { to: '/notifications', icon: <Bell className="w-5 h-5" />,            label: 'Alerts', badge: unreadCount },
            { to: `/profile/${user.id}`, icon: <User className="w-5 h-5" />,      label: 'Profile' },
          ].map(({ to, icon, label, badge }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors duration-200',
                  active ? 'text-terracotta' : 'text-ink/50'
                )}
              >
                {icon}
                <span className="text-[10px] font-medium">{label}</span>
                {badge != null && badge > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-[14px] h-[14px] flex items-center justify-center
                    bg-terracotta text-white text-[8px] font-bold rounded-full px-0.5">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

import { Link } from 'react-router-dom';
import { ArrowRight, Star, Zap, Globe } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { MOCK_POSTS, MOCK_USERS } from '@/lib/mockData';
import { formatCount } from '@/lib/utils';
import { cn } from '@/lib/utils';
import Avatar from '@/components/ui/Avatar';

const MARQUEE_ITEMS = [
  'Digital Art', 'Oil Painting', 'Photography', 'Sculpture',
  'Textile & Weave', 'Illustration', 'Mixed Media', 'Printmaking',
  'Ceramics', 'Street Art', 'Digital Art', 'Oil Painting',
  'Photography', 'Sculpture', 'Textile & Weave', 'Illustration',
  'Mixed Media', 'Printmaking', 'Ceramics', 'Street Art',
];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function RevealSection({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        'transition-all duration-700',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        className
      )}
    >
      {children}
    </div>
  );
}

export default function Landing() {
  const heroArts = MOCK_POSTS.slice(0, 6);

  return (
    <div className="min-h-screen bg-cream overflow-x-hidden">
      {/* ── Top Nav ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-terracotta rounded-lg flex items-center justify-center">
              <span className="text-white font-serif font-black text-lg leading-none">A</span>
            </div>
            <span className="font-serif font-black text-xl text-ink">Artista<span className="text-terracotta">.</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {['Explore', 'Artists', 'Categories', 'About'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="text-sm text-ink/60 hover:text-ink transition-colors font-medium">{l}</a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-ink/70 hover:text-ink transition-colors">Sign in</Link>
            <Link to="/signup" className="btn-primary text-sm px-4 py-2">
              Join Artista <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="pt-16 min-h-screen grid lg:grid-cols-2 overflow-hidden">
        {/* Left */}
        <div className="flex flex-col justify-center px-6 lg:px-16 py-20">
          <div className="section-label animate-fade-in">Where African Art Lives</div>

          <h1 className="font-serif font-black text-5xl lg:text-[4.5rem] xl:text-[5.5rem] leading-[0.95] tracking-tight text-ink mt-4 mb-6 animate-rise-up">
            Your canvas,<br />
            your <em className="italic text-terracotta">story,</em><br />
            your stage.
          </h1>

          <p className="text-lg text-ink/60 max-w-md leading-relaxed mb-10 font-light animate-rise-up" style={{ animationDelay: '0.1s' }}>
            The discovery platform built for African creatives — where artists share work, build audiences, and connect with a world ready to see them.
          </p>

          <div className="flex flex-wrap items-center gap-4 animate-rise-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/signup" className="btn-primary text-base px-8 py-4">
              Start Sharing Your Art
            </Link>
            <Link to="/feed" className="flex items-center gap-2 text-sm font-medium text-ink/70 hover:text-ink transition-colors group">
              Explore the Feed
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-10 mt-16 pt-10 border-t border-[var(--border)] animate-rise-up" style={{ animationDelay: '0.3s' }}>
            {[
              { num: '500+', label: 'Artist goal M1' },
              { num: '2K+', label: 'Target artworks' },
              { num: '40%', label: 'Target DAU/MAU' },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="font-serif font-bold text-3xl text-ink">{num}</div>
                <div className="text-xs text-ink/50 mt-1 tracking-wide">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: mosaic */}
        <div className="relative bg-deep overflow-hidden min-h-80 lg:min-h-0">
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-4 gap-0.5">
            {heroArts.map((post, i) => (
              <div
                key={post.id}
                className={cn(
                  'relative overflow-hidden group animate-fade-in',
                  i === 0 && 'col-span-2 row-span-2',
                  i === 2 && 'row-span-2',
                  i === 3 && 'row-span-2',
                  i === 4 && 'col-span-2',
                )}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={cn('w-full h-full transition-transform duration-[8s] group-hover:scale-105', post.imageUrl)} />
                <div className="absolute inset-0 bg-gradient-to-t from-deep/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <span className="text-xs font-medium text-white/80 bg-white/10 px-2 py-0.5 rounded-full">{post.medium}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-5 left-5 font-serif text-sm text-white/30 italic">
            Featured works from Artista creators
          </div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <div className="border-y border-[var(--border)] py-3.5 bg-warm overflow-hidden">
        <div className="flex gap-0 animate-marquee whitespace-nowrap">
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-3 px-8 text-xs font-medium tracking-[0.12em] uppercase text-ink/40 border-r border-[var(--border)] flex-shrink-0">
              <span className="w-1 h-1 rounded-full bg-terracotta flex-shrink-0" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <section id="about" className="py-28 px-6 max-w-7xl mx-auto">
        <RevealSection>
          <div className="section-label">What Makes Artista Different</div>
          <h2 className="font-serif font-bold text-4xl lg:text-5xl text-ink mt-3 mb-16 max-w-xl leading-tight tracking-tight">
            Built for the <em className="italic text-terracotta">African creative,</em> not adapted for them.
          </h2>
        </RevealSection>

        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--border)] border border-[var(--border)]">
          {[
            {
              num: '01', icon: '🎨', title: 'Portfolio-first discovery',
              desc: 'Every post is part of your portfolio. Upload paintings, photography, digital art — all beautifully presented in a mosaic grid that puts the work first.',
            },
            {
              num: '02', icon: '✦', title: 'Three paths, one platform',
              desc: 'Whether you\'re an Artist sharing your craft, an Enthusiast collecting inspiration, or a Brand scouting talent — Artista shapes itself to your role.',
            },
            {
              num: '03', icon: '🔔', title: 'Real-time creative pulse',
              desc: 'Live notifications, real-time comments, and a feed algorithm that surfaces trending works and emerging voices — the community stays alive and responsive.',
            },
          ].map(({ num, icon, title, desc }, i) => (
            <RevealSection key={num} delay={i * 100} className="p-10 lg:p-14 relative group overflow-hidden hover:bg-warm transition-colors duration-300">
              <div className="absolute top-6 right-8 font-serif font-black text-6xl text-ink/5 group-hover:text-terracotta/8 transition-colors duration-500">
                {num}
              </div>
              <div className="w-11 h-11 rounded-lg bg-terracotta/10 flex items-center justify-center text-xl mb-5">
                {icon}
              </div>
              <h3 className="font-serif font-bold text-xl text-ink mb-3">{title}</h3>
              <p className="text-sm text-ink/60 leading-relaxed font-light">{desc}</p>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-terracotta scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ── Explore preview ── */}
      <section id="explore" className="pb-28 px-6 max-w-7xl mx-auto">
        <RevealSection className="flex items-end justify-between mb-12">
          <div>
            <div className="section-label">Explore Feed</div>
            <h2 className="font-serif font-bold text-4xl lg:text-5xl text-ink mt-3 leading-tight tracking-tight max-w-lg">
              Trending works from <em className="italic text-terracotta">Africa's finest</em>
            </h2>
          </div>
          <Link to="/feed" className="hidden md:flex items-center gap-2 text-sm text-terracotta font-medium hover:gap-3 transition-all">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </RevealSection>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {MOCK_POSTS.slice(0, 8).map((post, i) => (
            <RevealSection key={post.id} delay={i * 60}>
              <Link to="/feed" className="group relative block overflow-hidden rounded cursor-pointer aspect-square">
                <div className={cn('w-full h-full transition-transform duration-700 group-hover:scale-105', post.imageUrl)} />
                <div className="absolute inset-0 bg-gradient-to-t from-deep/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white font-serif font-bold text-sm line-clamp-1">{post.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-white/70 text-xs">{post.author.displayName}</span>
                    <span className="flex items-center gap-1 text-white/70 text-xs">
                      ♡ {formatCount(post.likesCount)}
                    </span>
                  </div>
                </div>
              </Link>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ── Artists ── */}
      <section id="artists" className="py-24 bg-deep px-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-violet/10 blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-7xl mx-auto relative">
          <RevealSection>
            <div className="section-label" style={{ color: 'var(--gold)' }}>
              <span className="block w-5 h-px bg-gold mr-2 flex-shrink-0" style={{ background: 'var(--gold)' }} />
              Featured Creators
            </div>
            <h2 className="font-serif font-bold text-4xl lg:text-5xl text-white mt-3 mb-12 leading-tight max-w-xl">
              Meet the artists <em className="italic text-gold">shaping</em> the conversation
            </h2>
          </RevealSection>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {MOCK_USERS.slice(0, 5).map((artist, i) => (
              <RevealSection key={artist.id} delay={i * 80}>
                <Link to="/feed" className="group flex flex-col items-center text-center cursor-pointer hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-gold transition-colors duration-300 mb-3">
                    <Avatar user={artist} size="xl" className="w-full h-full" />
                  </div>
                  <p className="text-white text-sm font-semibold">{artist.displayName}</p>
                  <p className="text-white/40 text-xs mt-0.5">{artist.role === 'artist' ? artist.artInterests?.[0] : 'Enthusiast'}</p>
                  <p className="text-gold text-xs mt-1.5">{artist.worksCount} works</p>
                  <button className="mt-3 px-4 py-1.5 border border-white/15 rounded-full text-xs text-white/60
                    group-hover:bg-gold group-hover:border-gold group-hover:text-deep transition-all duration-200">
                    Follow
                  </button>
                </Link>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-6">
        <RevealSection>
          <div className="max-w-7xl mx-auto bg-terracotta rounded-xl overflow-hidden relative">
            <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-white/5" />
            <div className="absolute -top-12 left-1/3 w-40 h-40 rounded-full bg-white/5" />
            <div className="grid md:grid-cols-2 gap-10 p-10 lg:p-16 relative">
              <div>
                <h2 className="font-serif font-black text-4xl lg:text-5xl text-white leading-tight mb-4">
                  Your art deserves<br />to be <em className="opacity-70">seen.</em>
                </h2>
                <p className="text-white/70 leading-relaxed">
                  Join the waitlist for early access. Be among the first 500 artists to claim your profile and shape what Artista becomes.
                </p>
                <div className="flex flex-wrap gap-4 mt-8 text-white/60 text-sm">
                  <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-gold" /> Free forever</span>
                  <span className="flex items-center gap-2"><Star className="w-4 h-4 text-gold" /> No credit card</span>
                  <span className="flex items-center gap-2"><Globe className="w-4 h-4 text-gold" /> Africa-first</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 justify-center">
                <input className="input-dark" type="text" placeholder="Your name" />
                <input className="input-dark" type="email" placeholder="Email address" />
                <select className="input-dark appearance-none">
                  <option value="" disabled>I am an — Artist / Enthusiast / Brand</option>
                  <option>Artist</option>
                  <option>Enthusiast</option>
                  <option>Brand</option>
                </select>
                <Link
                  to="/signup"
                  className="py-4 bg-deep text-cream text-sm font-semibold rounded text-center hover:bg-white hover:text-terracotta transition-all duration-200"
                >
                  Claim My Spot →
                </Link>
              </div>
            </div>
          </div>
        </RevealSection>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--border)] pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-terracotta rounded-lg flex items-center justify-center">
                  <span className="text-white font-serif font-black text-lg leading-none">A</span>
                </div>
                <span className="font-serif font-black text-xl text-ink">Artista<span className="text-terracotta">.</span></span>
              </div>
              <p className="text-sm text-ink/50 italic font-serif leading-relaxed max-w-48">
                "Where African Art Lives." — Building the home African creatives deserve.
              </p>
            </div>
            {[
              { title: 'Explore', links: ['Trending', 'Recent', 'Artists', 'Categories'] },
              { title: 'Platform', links: ['For Artists', 'For Enthusiasts', 'For Brands', 'Upload Art'] },
              { title: 'Company', links: ['About', 'Blog', 'Privacy', 'Terms'] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-ink/40 mb-5">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map(l => (
                    <li key={l}><a href="#" className="text-sm text-ink/60 hover:text-terracotta transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-[var(--border)] text-xs text-ink/40 gap-2">
            <span>© 2025 Artista. All rights reserved.</span>
            <span>Made with love for African creators · Lagos, Nigeria</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

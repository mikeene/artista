import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Chrome } from 'lucide-react';
import { useAuthStore } from '@/store';
import { CURRENT_USER, MOCK_USERS } from '@/lib/mockData';
import { isValidEmail, getPasswordStrength, sleep } from '@/lib/utils';
import type { UserRole } from '@/types';
import toast from 'react-hot-toast';

// ── LOGIN ────────────────────────────────────────────
export function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) { toast.error('Enter a valid email address'); return; }
    if (password.length < 6) { toast.error('Password too short'); return; }
    setLoading(true);
    await sleep(1200);
    login(CURRENT_USER);
    toast.success('Welcome back! 🎨');
    navigate('/feed');
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to Artista"
      artIndex={0}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-ink/70 uppercase tracking-wide mb-1.5">Email</label>
          <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-ink/70 uppercase tracking-wide">Password</label>
            <a href="#" className="text-xs text-terracotta hover:underline">Forgot password?</a>
          </div>
          <div className="relative">
            <input
              className="input pr-10"
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink transition-colors">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
          {loading ? <span className="animate-pulse">Signing in…</span> : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
        </button>

        <div className="relative flex items-center gap-3 py-2">
          <div className="flex-1 h-px bg-[var(--border)]" />
          <span className="text-xs text-ink/40">or continue with</span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => { login(CURRENT_USER); navigate('/feed'); }} className="btn-secondary py-2.5 text-sm">
            <Chrome className="w-4 h-4" /> Google
          </button>
          <button type="button" onClick={() => { login(CURRENT_USER); navigate('/feed'); }} className="btn-secondary py-2.5 text-sm">
            <span className="font-bold">🍎</span> Apple
          </button>
        </div>

        <p className="text-center text-sm text-ink/60 pt-2">
          Don't have an account?{' '}
          <Link to="/signup" className="text-terracotta font-medium hover:underline">Sign up free</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

// ── SIGNUP ───────────────────────────────────────────
export function Signup() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: '' as UserRole | '',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(form.password);

  function update(key: string, val: string) { setForm(f => ({ ...f, [key]: val })); }

  async function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Enter your name'); return; }
    if (!isValidEmail(form.email)) { toast.error('Enter a valid email'); return; }
    if (form.password.length < 8) { toast.error('Password must be 8+ characters'); return; }
    setStep(2);
  }

  async function handleStep2(e: React.FormEvent) {
    e.preventDefault();
    if (!form.role) { toast.error('Select your role'); return; }
    setLoading(true);
    await sleep(1500);
    login({ ...CURRENT_USER, displayName: form.name, email: form.email, role: form.role as UserRole });
    toast.success('Account created! Welcome to Artista 🎨');
    navigate('/feed');
  }

  const roles: { value: UserRole; label: string; desc: string; emoji: string }[] = [
    { value: 'artist',     label: 'Artist',     desc: 'Share and showcase my artwork',       emoji: '🎨' },
    { value: 'enthusiast', label: 'Enthusiast',  desc: 'Discover and collect African art',    emoji: '✨' },
    { value: 'brand',      label: 'Brand',       desc: 'Scout talent and commission artists', emoji: '🏢' },
  ];

  return (
    <AuthLayout
      title={step === 1 ? 'Create your account' : 'How will you use Artista?'}
      subtitle={step === 1 ? 'Join thousands of African creatives' : 'Choose your role to personalise your experience'}
      artIndex={1}
    >
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${step >= s ? 'bg-terracotta text-white' : 'bg-black/10 text-ink/40'}`}>{s}</div>
            {s < 2 && <div className={`w-10 h-px transition-colors duration-300 ${step > s ? 'bg-terracotta' : 'bg-black/10'}`} />}
          </div>
        ))}
      </div>

      {step === 1 ? (
        <form onSubmit={handleStep1} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-ink/70 uppercase tracking-wide mb-1.5">Full name</label>
            <input className="input" type="text" placeholder="Your name" value={form.name} onChange={e => update('name', e.target.value)} required />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink/70 uppercase tracking-wide mb-1.5">Email</label>
            <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e => update('email', e.target.value)} required />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink/70 uppercase tracking-wide mb-1.5">Password</label>
            <div className="relative">
              <input
                className="input pr-10"
                type={showPass ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={e => update('password', e.target.value)}
                required minLength={8}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink transition-colors">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {form.password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="flex-1 h-1 rounded-full transition-colors duration-300"
                      style={{ background: i <= strength.score ? strength.color : 'rgba(26,18,9,0.1)' }}
                    />
                  ))}
                </div>
                <p className="text-xs" style={{ color: strength.color }}>{strength.label}</p>
              </div>
            )}
          </div>
          <button type="submit" className="btn-primary w-full py-3 mt-2">
            Continue <ArrowRight className="w-4 h-4" />
          </button>
          <div className="relative flex items-center gap-3 py-2">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-xs text-ink/40">or</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => { login(CURRENT_USER); navigate('/feed'); }} className="btn-secondary py-2.5 text-sm">
              <Chrome className="w-4 h-4" /> Google
            </button>
            <button type="button" onClick={() => { login(CURRENT_USER); navigate('/feed'); }} className="btn-secondary py-2.5 text-sm">
              <span className="font-bold">🍎</span> Apple
            </button>
          </div>
          <p className="text-center text-sm text-ink/60">
            Already have an account?{' '}
            <Link to="/login" className="text-terracotta font-medium hover:underline">Sign in</Link>
          </p>
        </form>
      ) : (
        <form onSubmit={handleStep2} className="space-y-3">
          {roles.map(r => (
            <label key={r.value} className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all duration-200
              ${form.role === r.value
                ? 'border-terracotta bg-terracotta/5'
                : 'border-[var(--border)] hover:border-terracotta/40 hover:bg-warm'
              }`}>
              <input
                type="radio"
                name="role"
                value={r.value}
                checked={form.role === r.value}
                onChange={e => update('role', e.target.value)}
                className="sr-only"
              />
              <span className="text-2xl">{r.emoji}</span>
              <div className="flex-1">
                <p className="font-semibold text-ink text-sm">{r.label}</p>
                <p className="text-xs text-ink/55 mt-0.5">{r.desc}</p>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 transition-colors duration-200
                ${form.role === r.value ? 'border-terracotta bg-terracotta' : 'border-[var(--border)]'}`}>
                {form.role === r.value && <div className="w-full h-full rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>}
              </div>
            </label>
          ))}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">← Back</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 py-3">
              {loading ? <span className="animate-pulse">Creating…</span> : 'Create Account'}
            </button>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}

// ── Shared Auth Layout ───────────────────────────────
function AuthLayout({
  children,
  title,
  subtitle,
  artIndex,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  artIndex: number;
}) {
  const artClasses = ['art-terracotta', 'art-violet', 'art-ocean', 'art-sage'];
  const art = artClasses[artIndex % artClasses.length];

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Form */}
      <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-16">
        <Link to="/" className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 bg-terracotta rounded-lg flex items-center justify-center">
            <span className="text-white font-serif font-black text-lg leading-none">A</span>
          </div>
          <span className="font-serif font-black text-xl text-ink">Artista<span className="text-terracotta">.</span></span>
        </Link>

        <div className="max-w-sm w-full mx-auto lg:mx-0">
          <h1 className="font-serif font-bold text-3xl text-ink mb-2">{title}</h1>
          <p className="text-sm text-ink/60 mb-8">{subtitle}</p>
          {children}
        </div>
      </div>

      {/* Right: Art panel */}
      <div className={`hidden lg:flex items-center justify-center relative overflow-hidden ${art}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
        <div className="relative text-center px-12">
          <blockquote className="font-serif text-3xl font-bold text-white/90 leading-tight mb-6">
            "Art is the lie that enables us to realize the truth."
          </blockquote>
          <p className="text-white/60 text-sm">— Pablo Picasso</p>
        </div>

        {/* Floating post cards */}
        {MOCK_POSTS.slice(0, 3).map((post, i) => (
          <div
            key={post.id}
            className={`absolute w-32 h-40 rounded-lg overflow-hidden shadow-elevated opacity-60 ${post.imageUrl}`}
            style={{
              top: `${15 + i * 25}%`,
              right: i % 2 === 0 ? '5%' : '15%',
              transform: `rotate(${i % 2 === 0 ? -6 : 5}deg)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

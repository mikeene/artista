import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Format a date relative to now (e.g. "2 hours ago") */
export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
}

/** Format number with K/M suffix */
export function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toString();
}

/** Generate a deterministic gradient class from a string */
export function gradientFromId(id: string): string {
  const GRADIENTS = [
    'art-terracotta', 'art-ocean', 'art-violet', 'art-earth',
    'art-sage', 'art-rose', 'art-indigo', 'art-amber',
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

/** Clamp a value between min and max */
export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

/** Get initials from display name */
export function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

/** Validate email */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Validate password (min 8, 1 upper, 1 lower, 1 number) */
export function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z\d]/.test(password)) score++;
  const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'];
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a', '#15803d'];
  return { score, label: labels[score] ?? 'Too short', color: colors[score] ?? colors[0] };
}

/** Truncate string */
export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 3) + '…';
}

/** Sleep (for fake async) */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

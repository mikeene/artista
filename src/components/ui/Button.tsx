import { cn } from '@/lib/utils';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
}

const VARIANTS = {
  primary: 'bg-terracotta text-white hover:bg-ink shadow-sm hover:shadow-art',
  secondary: 'border border-[var(--border)] text-ink hover:border-terracotta hover:text-terracotta bg-transparent',
  ghost: 'text-ink/70 hover:text-ink hover:bg-black/5 bg-transparent',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  dark: 'bg-deep text-cream hover:bg-ink',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-sm',
  icon: 'p-2 aspect-square',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium rounded',
          'transition-all duration-200 active:scale-95 select-none',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
          VARIANTS[variant],
          SIZES[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;

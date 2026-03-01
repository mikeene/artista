/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1A1209',
        cream: '#F9F4EC',
        terracotta: {
          DEFAULT: '#C0532B',
          50: '#FDF0EA',
          100: '#F9D9CC',
          200: '#F0A98A',
          300: '#E07A4E',
          400: '#C0532B',
          500: '#9A3D1A',
          600: '#7A2C10',
        },
        gold: {
          DEFAULT: '#D4A853',
          light: '#E8C97A',
          dark: '#A07830',
        },
        violet: {
          DEFAULT: '#593EFF',
          light: '#7B6BFF',
          dark: '#3A22DD',
        },
        sage: '#7A8C72',
        deep: '#0E0B1F',
        warm: '#FDF8F2',
        border: 'rgba(26,18,9,0.12)',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease forwards',
        'rise-up': 'riseUp 0.7s ease forwards',
        'marquee': 'marquee 28s linear infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0', transform: 'scale(1.02)' }, to: { opacity: '1', transform: 'scale(1)' } },
        riseUp: { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        pulseSoft: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.6' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      },
      backdropBlur: { xs: '4px' },
      borderRadius: { DEFAULT: '4px' },
      boxShadow: {
        'art': '0 20px 60px rgba(192,83,43,0.15)',
        'card': '0 4px 20px rgba(26,18,9,0.08)',
        'elevated': '0 12px 40px rgba(26,18,9,0.15)',
      },
    },
  },
  plugins: [],
}

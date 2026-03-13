/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-deep': 'var(--bg-deep)',
        'bg-surface': 'var(--bg-surface)',
        'bg-elevated': 'var(--bg-elevated)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-dim': 'var(--text-dim)',
        'border-default': 'var(--border-default)',
        'accent-coral': 'var(--accent-coral)',
        'accent-sky': 'var(--accent-sky)',
        'accent-amber': 'var(--accent-amber)',
      },
      fontFamily: {
        pixel: ['VT323', 'monospace'],
      },
      maxWidth: {
        '350': '350px',
      },
    },
  },
  plugins: [],
}

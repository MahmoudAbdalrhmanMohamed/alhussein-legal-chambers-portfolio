import type { Config } from 'tailwindcss'

export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    './app.vue',
    './layouts/**/*.{vue,ts,tsx}',
    './pages/**/*.{vue,ts,tsx}',
    './components/**/*.{vue,ts,tsx}',
    './composables/**/*.{ts,tsx}',
    './resux.config.ts'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-ar-body)', 'var(--font-en-body)', 'sans-serif'],
        display: ['var(--font-ar-heading)', 'var(--font-en-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace']
      },
      colors: {
        chambers: {
          bg: 'var(--bg)',
          surface: 'var(--surface)',
          alt: 'var(--surface-alt)',
          ink: 'var(--ink)',
          muted: 'var(--ink-muted)',
          border: 'var(--border)',
          accent: 'var(--accent)',
          soft: 'var(--accent-soft)'
        }
      }
    }
  },
  plugins: []
} satisfies Config

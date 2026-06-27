/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--serif)'],
        sans: ['var(--sans)'],
        mono: ['var(--mono)'],
      },
      colors: {
        paper: 'var(--paper)',
        'paper-2': 'var(--paper-2)',
        card: 'var(--card)',
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        'ink-3': 'var(--ink-3)',
        line: 'var(--line)',
        'line-2': 'var(--line-2)',
        pine: 'var(--pine)',
        'pine-soft': 'var(--pine-soft)',
        clay: 'var(--clay)',
        'clay-soft': 'var(--clay-soft)',
        brass: 'var(--brass)',
        focus: 'var(--focus)',
      },
    },
  },
  plugins: [],
};

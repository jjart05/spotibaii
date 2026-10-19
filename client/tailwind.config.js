/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        shell: 'rgb(var(--shell) / <alpha-value>)',
        canvas: 'rgb(var(--canvas) / <alpha-value>)',
        panel: 'rgb(var(--panel) / <alpha-value>)',
        raised: 'rgb(var(--raised) / <alpha-value>)',
        hover: 'rgb(var(--hover) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        faint: 'rgb(var(--faint) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Bricolage Grotesque"', '"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 16px 40px rgb(0 0 0 / 0.35)',
        soft: '0 10px 30px rgb(28 22 18 / 0.08)',
        glow: '0 0 40px rgb(var(--track-glow, var(--accent)) / 0.25)',
      },
      spacing: {
        chrome: '9.5rem',
      },
    },
  },
  plugins: [],
};

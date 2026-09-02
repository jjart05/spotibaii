/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        shell: '#000000',
        canvas: '#121212',
        panel: '#181818',
        raised: '#1f1f1f',
        hover: '#2a2a2a',
        muted: '#b3b3b3',
        faint: '#7a7a7a',
        line: '#2a2a2a',
        accent: 'rgb(var(--accent) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 24px rgba(0,0,0,.45)',
      },
    },
  },
  plugins: [],
};

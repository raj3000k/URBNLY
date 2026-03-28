/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        emeraldDark: '#0F5C4A',
        emeraldAccent: '#10B981',
        emeraldSoft: '#D9F7EC',
        mintMist: '#F3FBF7',
        sandstone: '#F7F1E8',
        inkSlate: '#1F2937',
        fog: '#6B7280',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        float: '0 20px 50px rgba(15, 92, 74, 0.12)',
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at top, rgba(16, 185, 129, 0.14), transparent 34%), linear-gradient(rgba(15, 92, 74, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 92, 74, 0.05) 1px, transparent 1px)',
      },
      backgroundSize: {
        'hero-grid': 'auto, 24px 24px, 24px 24px',
      },
    },
  },
  plugins: [],
}

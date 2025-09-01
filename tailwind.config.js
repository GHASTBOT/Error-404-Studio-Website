/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 8s linear infinite',
      },
      colors: {
        minecraft: {
          dark: '#0a0a0a',
          light: '#F5F6FB',
          accent: '#404040',
          hover: '#606060'
        }
      },
      boxShadow: {
        'minecraft': '0 4px 12px rgba(0, 0, 0, 0.2)',
        'minecraft-hover': '0 8px 24px rgba(0, 0, 0, 0.3)'
      }
    },
  },
  plugins: [],
};
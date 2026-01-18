/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#1a1a1a',
          surface: '#2d2d2d',
          card: '#3a3a3a',
          text: '#ffffff',
          'text-secondary': '#b3b3b3',
          border: '#404040',
        }
      }
    },
  },
  plugins: [],
} 
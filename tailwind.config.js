/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        gold: {
          50: '#fbf9f1',
          100: '#f6f1df',
          200: '#ede0be',
          300: '#e2ca97',
          400: '#d5b06e',
          500: '#c5964b',
          600: '#aa783c',
          700: '#875a31',
          800: '#6f492d',
          900: '#5c3d28',
        }
      }
    },
  },
  plugins: [],
}

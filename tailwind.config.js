/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0F172A',
          accent: '#38BDF8',
          surface: '#F8FAFC',
          border: '#CBD5F5',
        },
        neutral: {
          900: '#0B1120',
          800: '#111827',
          700: '#1F2937',
          200: '#E2E8F0',
          50: '#F8FAFC',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


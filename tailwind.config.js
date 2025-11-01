const defaultTheme = require('tailwindcss/defaultTheme');

const brandTokens = {
  colors: {
    primary: '#2B59C3',
    secondary: '#9333EA',
    accent: '#F97316',
    neutral: '#111827',
    muted: '#6B7280',
    background: '#F9FAFB',
    surface: '#F3F4F6',
  },
  fonts: {
    base: '"Inter Variable"',
    display: '"Sora Variable"',
    mono: '"JetBrains Mono"',
  },
  spacing: {
    '3xs': '0.125rem',
    '2xs': '0.25rem',
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4.5rem',
  },
};

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          ...brandTokens.colors,
        },
      },
      fontFamily: {
        sans: [brandTokens.fonts.base, ...defaultTheme.fontFamily.sans],
        display: [brandTokens.fonts.display, ...defaultTheme.fontFamily.sans],
        mono: [brandTokens.fonts.mono, ...defaultTheme.fontFamily.mono],
      },
      spacing: {
        ...brandTokens.spacing,
      },
    },
  },
  plugins: [],
};

module.exports = config;
module.exports.brandTokens = brandTokens;

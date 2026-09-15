/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/lib/homePresentation.js",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        primary: 'var(--color-text)',
        muted: 'var(--color-muted)',
        subtle: 'var(--color-border)',
        focus: 'var(--color-focus)',
        acid: '#C8FF00',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
      },
      borderColor: {
        subtle: 'var(--color-border)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        pill: 'var(--radius-pill)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        soft: '0 12px 36px var(--color-shadow)',
        lift: 'var(--shadow-lift)',
        overlay: 'var(--shadow-overlay)',
      },
    },
  },
  plugins: [],
};

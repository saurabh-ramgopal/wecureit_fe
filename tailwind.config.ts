/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Theme-aware colors (change based on active theme)
        'theme-primary': 'rgb(var(--color-primary) / <alpha-value>)',
        'theme-secondary': 'rgb(var(--color-secondary) / <alpha-value>)',
        'theme-accent': 'rgb(var(--color-accent) / <alpha-value>)',
        'theme-dark': 'rgb(var(--color-dark) / <alpha-value>)',
        'theme-text': 'rgb(var(--color-text) / <alpha-value>)',
        'theme-bg': 'rgb(var(--color-background) / <alpha-value>)',
        'theme-border': 'rgb(var(--color-border) / <alpha-value>)',
        'theme-success': 'rgb(var(--color-success) / <alpha-value>)',
      },
    },
  },
}
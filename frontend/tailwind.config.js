/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2383E2',
          hover: '#1A6CC0',
        },
        danger: '#E03E3E',
        success: '#0F7B6C',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'md': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'lg': '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
      aspectRatio: {
        'a4': '210 / 297',
        'a4-half': '105 / 148.5',
      },
    },
  },
  plugins: [],
}

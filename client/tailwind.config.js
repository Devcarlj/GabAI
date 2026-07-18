/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-red)',
        secondary: 'var(--color-gray)',
        background: 'var(--color-white)',
        foreground: 'var(--color-black)',
        muted: 'var(--color-gray)',
        accent: 'var(--color-gray)',
        destructive: 'var(--color-red)',
        border: 'var(--color-gray)',
        input: 'var(--color-white)',
        ring: 'var(--color-gray)'
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}
/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#09090B',       // Base background canvas (Zinc 950)
          surface: '#18181B',    // Card/Input fields background (Zinc 900)
          border: '#27272A',     // High-contrast clean panel borders (Zinc 800)
          muted: '#A1A1AA',      // Secondary readable paragraphs (Zinc 400)
          teal: '#D0FD1B',       // Your custom signature electric neon teal highlight
        }
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}
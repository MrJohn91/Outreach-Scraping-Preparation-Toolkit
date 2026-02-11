/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sidebar: '#1a1f2e',
        background: '#0f1419',
        panel: '#1a1f2e',
        border: '#2d3748',
      }
    },
  },
  plugins: [],
}

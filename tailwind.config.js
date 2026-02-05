
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        trace: {
          black: '#06080f',
          deep: '#030407',
          blue: '#0f172a',
          orange: '#ff7a18',
          cyan: '#4aa3b8',
        }
      }
    },
  },
  plugins: [],
}

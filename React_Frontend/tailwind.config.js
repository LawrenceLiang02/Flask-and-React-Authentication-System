/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      'scp_sans': ['Source Code Pro', 'sans-serif'],
      'scp_serif': ['Source Code Pro', 'serif'],
      'scp_mono': ['Source Code Pro', 'monospace'],
    },
    extend: {},
  },
  plugins: [],
}
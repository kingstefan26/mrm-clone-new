/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        publicsans: ['Public Sans'],
        noto: ['Noto Sans'],
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'bebas': ['Bebas Neue', 'cursive'],
        'poppins': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

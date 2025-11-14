/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'limelight': ['Limelight', 'cursive'],
        'nova-round': ['Nova Round', 'cursive'],
      },
      colors: {
        'saffron': '#FF9933',
        'white': '#FFFFFF',
        'green': '#138808',
      }
    },
  },
  plugins: [],
}

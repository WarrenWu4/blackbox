/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'glass': "linear-gradient(135deg, #FFF 0%, rgba(255, 255, 255, 0.40) 0.01%, rgba(255, 255, 255, 0.25) 100%)",
      },
    },
  },
  plugins: [],
}


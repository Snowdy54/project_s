/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Product Sans"', 'sans-serif'],
      },
      colors: {
        background: "#071018",      // Основной тёмный фон
        lavender: {
          DEFAULT: "#DDD2FD",      // Лавандовый цвет кнопок и обводок из Figma
        },
        brand: {
          orange: "#FF7116",        // Из UX-kit
          yellow: "#FFF886",        // Из UX-kit
          blue: "#99C3FD",          // Из UX-kit
          lavender: "#DDD2FD",      // Из UX-kit
          cream: "#FBF9F4",         // Светлые карточки профессий
        }
      },
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#05131C", // Основной фон страницы
        primary: {
          DEFAULT: "#FF6D06",  // Акцентный оранжевый
          hover: "#E05A00",
        },
        card: "#1E2A32",       // Тёмные карточки направлений
        cyan: {
          DEFAULT: "#64DCEC",  // Голубой акцент и обводки
          card: "#64DCEC",     // Карточки «Интерактивная карта знаний»
        },
      },
    },
  },
  plugins: [],
}
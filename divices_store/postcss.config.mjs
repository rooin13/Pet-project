// postcss.config.mjs
export default {
  plugins: {
    // подключаем новый плагин для Tailwind v4
    "@tailwindcss/postcss": {},
    // если вы импортируете любые CSS из node_modules (например, swiper.css),
    // то нужен postcss-import перед Tailwind, чтобы сначала «схватить» все @import-ы
    "postcss-import": {},
  },
};
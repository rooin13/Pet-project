/** @type {import('next').NextConfig} */
const nextConfig = {
  // отключаем ошибки типов при билде
  typescript: {
    ignoreBuildErrors: true,
  },

  // ваши существующие настройки
  images: {
    domains: ['cinemaguide.skillbox.cc'],
  },
};

export default nextConfig;

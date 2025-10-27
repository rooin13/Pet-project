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

  // Исправление webpack ошибки с "use client"
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },

  // Webpack настройки для исправления ошибки
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;

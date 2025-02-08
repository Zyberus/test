const withBundleAnalyzer = require('@next/bundle-analyzer')({enabled: process.env.ANALYZE === 'true'});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'fs': false,
      'path': false,
    };
    return config;
  },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Ensure all pages are generated
  exportPathMap: async function() {
    return {
      '/': { page: '/' },
      '/about': { page: '/about' },
      '/contact': { page: '/contact' },
      '/features': { page: '/features' },
      '/apps': { page: '/apps' },
      '/apps/chat': { page: '/apps/chat' },
      '/apps/image-converter': { page: '/apps/image-converter' },
      '/404': { page: '/404' },
      '/not-found': { page: '/not-found' },
      '/portfolio': { page: '/portfolio' },
    };
  },
  // Disable image optimization since we're doing static export
  experimental: {
    images: {
      unoptimized: true,
    },
  },
};

module.exports = withBundleAnalyzer(nextConfig);

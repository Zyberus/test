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
  // Explicitly define all routes for static export
  exportPathMap: async function() {
    const paths = {
      '/': { page: '/' },
      '/about': { page: '/about' },
      '/contact': { page: '/contact' },
      '/features': { page: '/features' },
      '/portfolio': { page: '/portfolio' },
      '/apps/chat': { page: '/apps/chat' },
      '/apps/image-converter': { page: '/apps/image-converter' },
      '/404': { page: '/404' },
      '/not-found': { page: '/not-found' },
    };

    return paths;
  },
  // Ensure static generation works correctly
  experimental: {
    appDir: true,
    disableOptimizedLoading: true,
    workerThreads: true,
    cpus: 4,
    // Enable static generation for app directory
    enableAppDir: true,
  },
  // Increase memory limit for build
  env: {
    NODE_OPTIONS: '--max-old-space-size=4096'
  },
  // Ensure all pages are generated
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  distDir: '.next',
  generateBuildId: async () => {
    return 'build-' + Date.now();
  }
};

module.exports = withBundleAnalyzer(nextConfig);

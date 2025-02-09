const withBundleAnalyzer = require('@next/bundle-analyzer')({enabled: process.env.ANALYZE === 'true'});

/** @type {import('next').NextConfig} */
// Debug function to log build information
const logBuildInfo = (phase, info) => {
  console.log(`[Build Debug] ${phase}:`, info);
};

const nextConfig = {
  // Explicitly define static pages
  exportPathMap: async function (defaultPathMap) {
    return {
      '/': { page: '/' },
      '/about': { page: '/about' },
      '/contact': { page: '/contact' },
      '/features': { page: '/features' },
      '/apps/chat': { page: '/apps/chat' },
      '/apps/image-converter': { page: '/apps/image-converter' },
    };
  },
  output: 'export',
  onBuildStart: () => {
    logBuildInfo('Build Start', 'Initiating static page generation');
  },
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
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    logBuildInfo('Webpack Configuration', {
      buildId,
      dev,
      isServer,
      pages: Object.keys(defaultLoaders)
    });
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
  distDir: '.next',
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
  experimental: {
    workerThreads: true,
    cpus: 4,
  },
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
};

module.exports = withBundleAnalyzer(nextConfig);
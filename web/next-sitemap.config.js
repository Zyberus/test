/** @type {import('next-sitemap').IConfig} */

// Debug function to log sitemap generation
const logSitemapInfo = (phase, info) => {
  console.log(`[Sitemap Debug] ${phase}:`, info);
};

module.exports = {
  transform: (config, path) => {
    logSitemapInfo('Processing Path', { path });
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
  siteUrl: process.env.NEXT_PUBLIC_URL || 'https://app-nest.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  outDir: 'out',
  exclude: ['/404', '/not-found'],
  additionalPaths: async (config) => [
    await config.transform(config, '/apps/image-converter'),
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/404', '/not-found'],
      },
    ],
  },
}

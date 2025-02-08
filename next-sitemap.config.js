/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://app-nest.com',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  sitemapSize: 7000,
  priority: 1.0,
  changefreq: 'daily',
  exclude: [
    '/404',
    '/500',
    '/private/*',
    '/admin/*',
    '/*.json',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/private/', '/admin/', '/*.json'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 1,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        crawlDelay: 1,
      },
    ],
    additionalSitemaps: [
      'https://app-nest.com/sitemap.xml',
      'https://app-nest.com/sitemap-index.xml',
    ],
  },
  transform: async (config, path) => {
    // Custom transform function
    return {
      loc: path,
      changefreq: path === '/' ? 'daily' : 'weekly',
      priority: path === '/' ? 1.0 : 0.8,
      lastmod: new Date().toISOString(),
      alternateRefs: [
        {
          href: `https://app-nest.com${path}`,
          hreflang: 'x-default',
        },
        {
          href: `https://app-nest.com/en${path}`,
          hreflang: 'en',
        },
      ],
    }
  },
}

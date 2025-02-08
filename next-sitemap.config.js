/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://app-nest.netlify.app',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  priority: 1.0,
  changefreq: 'daily',
  exclude: ['/404', '/500'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/private/', '/admin/'],
      },
    ],
    additionalSitemaps: [
      'https://app-nest.netlify.app/sitemap.xml',
    ],
  },
  transform: async (config, path) => {
    // Custom transform function (optional)
    return {
      loc: path, // => this will be exported as http(s)://<config.siteUrl>/<path>
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
      alternateRefs: [
        {
          href: `https://app-nest.netlify.app${path}`,
          hreflang: 'x-default',
        },
        {
          href: `https://app-nest.netlify.app/en${path}`,
          hreflang: 'en',
        },
      ],
    }
  },
}

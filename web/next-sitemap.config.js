/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_URL || 'https://app-nest.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  outDir: 'out',
  exclude: ['/404', '/not-found'],
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

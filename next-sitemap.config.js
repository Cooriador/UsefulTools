// next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://your-domain.com',
  generateRobotsTxt: true,
  changefreq: 'yearly',
  priority: 0.7,
  sitemapSize: 7_000,
}

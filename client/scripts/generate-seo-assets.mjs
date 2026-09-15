import { mkdir, writeFile } from 'node:fs/promises';
import { ALL_ROUTES } from '../src/lib/routesMeta.js';
import { blogPosts } from '../src/lib/blogPosts.js';
import { resolveSiteUrl, resolveApiUrl } from './seo-config.mjs';

const siteUrl = resolveSiteUrl();
const apiUrl = resolveApiUrl();
const distDir = new URL('../dist/', import.meta.url);
const NL = String.fromCharCode(10);

const escapeXml = (value) => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
const today = new Date().toISOString().split('T')[0];
const toDate = (value) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date.toISOString().split('T')[0] : today;
};

async function fetchProducts() {
  const products = [];
  for (let page = 1; page <= 100; page += 1) {
    try {
      const response = await fetch(`${apiUrl}/products?page=${page}&limit=48`);
      if (!response.ok) break;
      const data = await response.json();
      products.push(...(data.products || []));
      if (!data.pagination?.hasMore) break;
    } catch (error) {
      console.warn(`Sitemap: could not fetch products (${error.message}).`);
      break;
    }
  }
  return products;
}

const products = await fetchProducts();

const entries = [
  ...ALL_ROUTES.map((route) => ({ loc: `${siteUrl}${route.path}`, lastmod: today, changefreq: route.changefreq, priority: route.priority, images: [] })),
  ...blogPosts.map((post) => ({ loc: `${siteUrl}/blog/${post.slug}`, lastmod: toDate(post.updatedAt || post.publishedAt), changefreq: 'monthly', priority: '0.6', images: post.image ? [`${siteUrl}${post.image}`] : [] })),
  ...products.filter((product) => product.slug).map((product) => ({ loc: `${siteUrl}/product/${product.slug}`, lastmod: toDate(product.updatedAt), changefreq: 'weekly', priority: '0.7', images: (product.images || []).slice(0, 3) })),
];

const lines = ['<?xml version="1.0" encoding="UTF-8"?>'];
lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">');
entries.forEach((entry) => {
  lines.push('  <url>');
  lines.push(`    <loc>${escapeXml(entry.loc)}</loc>`);
  lines.push(`    <lastmod>${entry.lastmod}</lastmod>`);
  lines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
  lines.push(`    <priority>${entry.priority}</priority>`);
  entry.images.filter(Boolean).forEach((image) => {
    lines.push('    <image:image>');
    lines.push(`      <image:loc>${escapeXml(image)}</image:loc>`);
    lines.push('    </image:image>');
  });
  lines.push('  </url>');
});
lines.push('</urlset>');

const robots = ['User-agent: *', 'Allow: /', 'Disallow: /admin', 'Disallow: /cart', 'Disallow: /checkout', 'Disallow: /order-success', 'Disallow: /wishlist', 'Disallow: /api/', 'Disallow: /*?search=', 'Disallow: /*?utm_', 'Disallow: /*?fbclid=', 'Disallow: /*?gclid=', 'Disallow: /*?ref=', '', `Sitemap: ${siteUrl}/sitemap.xml`, ''].join(NL);

await mkdir(distDir, { recursive: true });
await writeFile(new URL('sitemap.xml', distDir), lines.join(NL), 'utf8');
await writeFile(new URL('robots.txt', distDir), robots, 'utf8');

console.log(`Sitemap written: ${entries.length} URLs (${products.length} products) for ${siteUrl}`);
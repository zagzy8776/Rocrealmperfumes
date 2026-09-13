import { mkdir, writeFile } from 'node:fs/promises';

const siteUrl = (process.env.VITE_SITE_URL || 'http://localhost:5173').replace(/\/$/, '');
const apiUrl = (process.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
const publicDir = new URL('../public/', import.meta.url);

const staticPaths = ['/', '/shop', '/gifts', '/perfume-finder', '/blog', '/gallery', '/delivery', '/about', '/contact'];
const blogSlugs = ['best-perfume-store-in-owerri','best-perfumes-for-women-in-nigeria','best-perfumes-for-men-in-nigeria','best-oil-perfumes-that-last-long','best-perfumes-for-hot-nigerian-weather','how-to-choose-a-signature-scent','best-perfume-gifts-in-nigeria'];

async function getProducts() {
  const slugs = [];
  let page = 1;
  while (page <= 100) {
    const response = await fetch(`${apiUrl}/products?page=${page}&limit=48`);
    if (!response.ok) break;
    const data = await response.json();
    for (const product of data.products || []) slugs.push(product.slug);
    if (!data.pagination?.hasMore) break;
    page += 1;
  }
  return slugs;
}

const productSlugs = await getProducts();
const urls = [...new Set([...staticPaths, ...blogSlugs.map((slug) => `/blog/${slug}`), ...productSlugs.map((slug) => `/product/${slug}`)])];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((path) => `  <url><loc>${siteUrl}${path}</loc></url>`).join('\n')}\n</urlset>\n`;

await mkdir(publicDir, { recursive: true });
await writeFile(new URL('sitemap.xml', publicDir), xml, 'utf8');
await writeFile(new URL('robots.txt', publicDir), `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /cart\nDisallow: /checkout\nDisallow: /order-success\nDisallow: /wishlist\nDisallow: /api/\n\nSitemap: ${siteUrl}/sitemap.xml\n`, 'utf8');
console.log(`Generated sitemap with ${urls.length} URLs for ${siteUrl}`);

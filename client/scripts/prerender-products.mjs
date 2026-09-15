import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALL_ROUTES } from '../src/lib/routesMeta.js';
import { blogPosts } from '../src/lib/blogPosts.js';
import { FAQ_ITEMS } from '../src/lib/faq.js';
import { buildTitle } from '../src/lib/site.js';
import { resolveSiteUrl, resolveApiUrl } from './seo-config.mjs';

const siteUrl = resolveSiteUrl();
const apiUrl = resolveApiUrl();
const dist = new URL('../dist/', import.meta.url);
const distDir = fileURLToPath(dist);
const NL = String.fromCharCode(10);
const escapeHtml = (value) => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const escapeJson = (value) => JSON.stringify(value).replaceAll('<', '\\u003c');

const STORE = {
  '@type': 'Store',
  '@id': `${siteUrl}/#store`,
  name: 'Roc Realm Perfumes',
  legalName: 'Roc Realm Nigeria Limited',
  url: `${siteUrl}/`,
  image: `${siteUrl}/og-image.jpg`,
  logo: `${siteUrl}/logo.png.jpeg`,
  telephone: '+2348085100229',
  email: 'rocrealmnigerialimited@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Prof Avenue Junction, by Spibat Road, Uratta',
    addressLocality: 'Owerri',
    addressRegion: 'Imo State',
    postalCode: '460221',
    addressCountry: 'NG',
  },
  hasMap: 'https://www.google.com/maps/search/?api=1&query=Roc+Realm+Perfumes+Uratta+Owerri',
  sameAs: ['https://instagram.com/rocrealm_perfumes', 'https://www.tiktok.com/@rocrealm_perfumes', 'https://www.google.com/search?kgmid=/g/11z5srdjhd'],
  areaServed: [{ '@type': 'City', name: 'Owerri' }, { '@type': 'City', name: 'Port Harcourt' }, { '@type': 'City', name: 'Onitsha' }, { '@type': 'City', name: 'Awka' }, { '@type': 'City', name: 'Enugu' }],
  priceRange: '₦₦₦',
  currenciesAccepted: 'NGN',
  paymentAccepted: 'Cash, Bank transfer, Pay on delivery',
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '20:00' }],
};

const breadcrumb = (crumbs) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((crumb, index) => ({ '@type': 'ListItem', position: index + 1, name: crumb.name, item: `${siteUrl}${crumb.path}` })),
});

const faqPage = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
});

function applyHead(template, meta) {
  const image = meta.image || `${siteUrl}/og-image.jpg`;
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(meta.title)}</title>`)
    .replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${escapeHtml(meta.description)}" />`)
    .replace(/<meta property="og:title"[^>]*>/i, `<meta property="og:title" content="${escapeHtml(meta.title)}" />`)
    .replace(/<meta property="og:description"[^>]*>/i, `<meta property="og:description" content="${escapeHtml(meta.description)}" />`)
    .replace(/<meta property="og:image"[^>]*>/i, `<meta property="og:image" content="${escapeHtml(image)}" />`)
    .replace(/<meta property="og:type"[^>]*>/i, `<meta property="og:type" content="${meta.type || 'website'}" />`)
    .replace(/<meta property="og:url"[^>]*>/i, `<meta property="og:url" content="${escapeHtml(meta.canonical)}" />`)
    .replace(/<meta name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`)
    .replace(/<meta name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`)
    .replace(/<meta name="twitter:image"[^>]*>/i, `<meta name="twitter:image" content="${escapeHtml(image)}" />`)
    .replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`);
  const schema = (meta.jsonLd || []).filter(Boolean).map((node) => `<script type="application/ld+json">${escapeJson(node)}</script>`).join(NL + '    ');
  if (schema) html = html.replace('</head>', `    ${schema}${NL}  </head>`);
  const leftover = html.match(/%VITE_[A-Z0-9_]+%/g);
  if (leftover) {
    console.warn(`Replaced unresolved env tokens: ${[...new Set(leftover)].join(', ')}`);
    html = html.replace(/%VITE_[A-Z0-9_]+%/g, (token) => (token.includes('SITE_URL') ? siteUrl : ''));
  }
  return html;
}

async function writePage(pathname, html) {
  const dir = join(distDir, pathname.replace(/^\//, ''));
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'index.html'), html, 'utf8');
}

async function fetchProducts() {
  const products = [];
  try {
    const first = await fetch(`${apiUrl}/products?limit=48`);
    if (!first.ok) throw new Error(`products API returned ${first.status}`);
    const data = await first.json();
    products.push(...(data.products || []));
    for (let page = 2; page <= (data.pagination?.totalPages || 1); page += 1) {
      const response = await fetch(`${apiUrl}/products?page=${page}&limit=48`);
      if (!response.ok) break;
      const pageData = await response.json();
      products.push(...(pageData.products || []));
    }
  } catch (error) {
    console.warn(`Pre-render: product pages skipped (${error.message}).`);
  }
  return products;
}

const template = await readFile(new URL('index.html', dist), 'utf8');

await writeFile(new URL('index.html', dist), applyHead(template, { title: ALL_ROUTES[0].title, description: ALL_ROUTES[0].description, canonical: `${siteUrl}/`, jsonLd: [STORE] }), 'utf8');

for (const route of ALL_ROUTES.filter((item) => item.path !== '/')) {
  const jsonLd = [breadcrumb(route.crumbs), route.path === '/faq' ? faqPage(FAQ_ITEMS) : null];
  await writePage(route.path, applyHead(template, { title: route.title, description: route.description, canonical: `${siteUrl}${route.path}`, jsonLd }));
}
console.log(`Pre-rendered ${ALL_ROUTES.length} static routes.`);

const products = await fetchProducts();
for (const product of products) {
  if (!product.slug) continue;
  const url = `${siteUrl}/product/${product.slug}`;
  const image = product.images?.[0] ? new URL(product.images[0], siteUrl).href : `${siteUrl}/og-image.jpg`;
  const description = product.description || `Buy ${product.name} from Roc Realm Perfumes, a perfume store in Owerri, Imo State.`;
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description,
      image: (product.images || []).map((item) => new URL(item, siteUrl).href),
      sku: product.id,
      category: product.category?.name,
      brand: { '@type': 'Brand', name: product.brandType || 'Roc Realm Perfumes' },
      keywords: (product.notes || []).join(', ') || undefined,
      offers: {
        '@type': 'Offer',
        url,
        priceCurrency: 'NGN',
        price: Number(product.salePrice || product.price),
        itemCondition: 'https://schema.org/NewCondition',
        availability: Number(product.stock) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        seller: { '@id': `${siteUrl}/#store` },
      },
    },
    breadcrumb([{ name: 'Home', path: '/' }, { name: 'Shop', path: '/shop' }, { name: product.name, path: `/product/${product.slug}` }]),
  ];
  await writePage(`/product/${product.slug}`, applyHead(template, { title: buildTitle(`${product.name} | Roc Realm Perfumes Owerri`), description, canonical: url, image, type: 'product', jsonLd }));
}
console.log(`Pre-rendered ${products.length} product pages.`);

for (const post of blogPosts) {
  const url = `${siteUrl}/blog/${post.slug}`;
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt,
      image: [`${siteUrl}/og-image.jpg`],
      author: { '@type': 'Organization', name: 'Roc Realm Perfumes' },
      publisher: { '@type': 'Organization', name: 'Roc Realm Perfumes', logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png.jpeg` } },
      url,
      datePublished: post.publishedAt || '2026-01-05',
      dateModified: post.updatedAt || post.publishedAt || '2026-01-05',
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      keywords: (post.keywords || []).join(', ') || undefined,
    },
    breadcrumb([{ name: 'Home', path: '/' }, { name: 'Fragrance Journal', path: '/blog' }, { name: post.title, path: `/blog/${post.slug}` }]),
    post.faq?.length ? faqPage(post.faq) : null,
  ];
  await writePage(`/blog/${post.slug}`, applyHead(template, { title: buildTitle(post.seoTitle || post.title), description: post.excerpt, canonical: url, type: 'article', jsonLd }));
}
console.log(`Pre-rendered ${blogPosts.length} blog pages.`);
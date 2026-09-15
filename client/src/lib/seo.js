import { SITE_URL, DEFAULT_OG_IMAGE, absoluteUrl, canonicalUrl, isNoindexPath, buildTitle } from './site.js';
import { LOCATION_KEYWORD_LINE, TRENDING_KEYWORD_LINE } from './keywords.js';
import {
  organizationStructuredData,
  websiteStructuredData,
  breadcrumbStructuredData,
  productStructuredData,
  itemListStructuredData,
  faqStructuredData,
  articleStructuredData,
} from './schema.js';

export { SITE_URL, DEFAULT_OG_IMAGE };

const OG_WIDTH = '1200';
const OG_HEIGHT = '630';
const BRAND = 'Roc Realm Perfumes';
const DEFAULT_DESCRIPTION = `Shop original designer and Arabian perfumes, oil perfumes, body mists, diffusers and gift sets at Roc Realm Perfumes in Owerri, Imo State. Trending notes: ${TRENDING_KEYWORD_LINE}. Delivery to ${LOCATION_KEYWORD_LINE}.`;

const PAGE_SCHEMA_IDS = ['product-jsonld', 'breadcrumb-jsonld', 'faq-jsonld', 'article-jsonld', 'itemlist-jsonld'];
const GLOBAL_SCHEMA_IDS = ['organization-jsonld', 'website-jsonld'];

const upsertMeta = (selector, attributes) => {
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement('meta');
    document.head.appendChild(tag);
  }
  Object.entries(attributes).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    tag.setAttribute(key, value);
  });
};

const removeById = (id) => {
  const node = document.getElementById(id);
  if (node) node.remove();
};

export const clearPageStructuredData = () => PAGE_SCHEMA_IDS.forEach(removeById);
export const clearAllStructuredData = () => [...PAGE_SCHEMA_IDS, ...GLOBAL_SCHEMA_IDS].forEach(removeById);

export const setJsonLd = (id, data) => {
  if (!data) return;
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
};

export const setCanonicalMeta = ({ url, noindex = false } = {}) => {
  const href = canonicalUrl(url || window.location.href);
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
  const blocked = noindex || isNoindexPath(window.location.pathname, window.location.search);
  upsertMeta('meta[name="robots"]', {
    name: 'robots',
    content: blocked
      ? 'noindex,follow'
      : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
  });
};

export const setLocalGeoMeta = () => {
  upsertMeta('meta[name="geo.region"]', { name: 'geo.region', content: 'NG-IM' });
  upsertMeta('meta[name="geo.placename"]', { name: 'geo.placename', content: 'Owerri, Imo State' });
  upsertMeta('meta[name="ICBM"]', { name: 'ICBM', content: '5.4897, 7.0342' });
  upsertMeta('meta[name="author"]', { name: 'author', content: 'Roc Realm Nigeria Limited' });
};

export const setPageMeta = ({ title, description, image, url, type = 'website', noindex = false, keywords } = {}) => {
  const finalTitle = buildTitle(title);
  const finalDescription = description || DEFAULT_DESCRIPTION;
  const finalUrl = canonicalUrl(url || window.location.href);
  const finalImage = absoluteUrl(image);
  document.title = finalTitle;
  upsertMeta('meta[name="description"]', { name: 'description', content: finalDescription });
  if (keywords) upsertMeta('meta[name="keywords"]', { name: 'keywords', content: keywords });
  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: finalTitle });
  upsertMeta('meta[property="og:description"]', { property: 'og:description', content: finalDescription });
  upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type });
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: finalUrl });
  upsertMeta('meta[property="og:image"]', { property: 'og:image', content: finalImage });
  upsertMeta('meta[property="og:image:width"]', { property: 'og:image:width', content: OG_WIDTH });
  upsertMeta('meta[property="og:image:height"]', { property: 'og:image:height', content: OG_HEIGHT });
  upsertMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: `${BRAND} - perfume store in Owerri, Imo State` });
  upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: BRAND });
  upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'en_NG' });
  upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: finalTitle });
  upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: finalDescription });
  upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: finalImage });
  upsertMeta('meta[name="twitter:image:alt"]', { name: 'twitter:image:alt', content: `${BRAND} - perfume store in Owerri, Imo State` });
  setCanonicalMeta({ url: finalUrl, noindex });
};

export const setOrganizationStructuredData = (testimonials = []) => {
  setJsonLd('organization-jsonld', organizationStructuredData(testimonials));
  setJsonLd('website-jsonld', websiteStructuredData());
};

export const setProductStructuredData = (product, reviews = []) => {
  if (!product) return;
  setJsonLd('product-jsonld', productStructuredData(product, reviews));
  setBreadcrumbStructuredData([
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: product.name, path: `/product/${product.slug}` },
  ]);
};

export const setArticleStructuredData = (post) => {
  if (!post) return;
  setJsonLd('article-jsonld', articleStructuredData(post));
  setBreadcrumbStructuredData([
    { name: 'Home', path: '/' },
    { name: 'Fragrance Journal', path: '/blog' },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);
};

export const setFAQStructuredData = (items = []) => {
  if (!items.length) return;
  setJsonLd('faq-jsonld', faqStructuredData(items));
};

export const setBreadcrumbStructuredData = (items = []) => {
  if (!items.length) return;
  setJsonLd('breadcrumb-jsonld', breadcrumbStructuredData(items));
};

export const setItemListStructuredData = (products = [], name) => {
  if (!products.length) return;
  setJsonLd('itemlist-jsonld', itemListStructuredData(products, name));
};

export const setCategoryBreadcrumbSchema = (categoryName, categorySlug) => {
  const items = [{ name: 'Home', path: '/' }, { name: 'Shop', path: '/shop' }];
  if (categoryName && categorySlug) items.push({ name: categoryName, path: `/shop?category=${categorySlug}` });
  setBreadcrumbStructuredData(items);
};
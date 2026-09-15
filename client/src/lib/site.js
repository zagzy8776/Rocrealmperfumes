// In the browser the real origin always wins. The Node fallback stays local on purpose:
// a canonical URL must never point at a domain the business does not actually own.
const env = import.meta.env || {};
const rawSiteUrl = env.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173');

export const SITE_URL = String(rawSiteUrl).replace(/\/+$/, '');

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const absoluteUrl = (value) => {
  if (!value) return DEFAULT_OG_IMAGE;
  try {
    return new URL(value, SITE_URL).href;
  } catch {
    return DEFAULT_OG_IMAGE;
  }
};

const TRACKING_PARAMS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id',
  'fbclid', 'gclid', 'msclkid', 'igshid', 'ref', 'referrer', 'src',
];

export const isNoindexPath = (pathname = '', search = '') => {
  if (/^\/(admin|cart|checkout|order-success|wishlist)/.test(pathname)) return true;
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  return params.has('search');
};

export const canonicalUrl = (href) => {
  try {
    const url = new URL(href, SITE_URL);
    TRACKING_PARAMS.forEach((param) => url.searchParams.delete(param));
    const kept = new URLSearchParams();
    const category = url.searchParams.get('category');
    if (category) kept.set('category', category);
    const pathname = url.pathname === '/' ? '/' : url.pathname.replace(/\/+$/, '');
    const query = kept.toString();
    return `${SITE_URL}${pathname}${query ? `?${query}` : ''}`;
  } catch {
    return `${SITE_URL}/`;
  }
};

export const buildTitle = (title) => {
  const brand = 'Roc Realm Perfumes';
  const clean = String(title || '').trim().replace(/\s*\|\s*Roc Realm Perfumes\s*$/i, '');
  if (!clean) return `${brand} | Best Perfume Store in Owerri, Imo State`;
  if (clean.length + brand.length + 3 <= 60) return `${clean} | ${brand}`;
  return clean.length <= 60 ? clean : `${clean.slice(0, 57).trimEnd()}...`;
};

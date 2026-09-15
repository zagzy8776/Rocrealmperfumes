import { SERVICE_AREAS } from './locations.js';

export const STATIC_ROUTES = [
  {
    path: '/',
    title: 'Roc Realm Perfumes | Best Perfume Store Owerri',
    description: 'Perfume store in Owerri, Imo State: original designer, Arabian and oil perfumes, body mists, diffusers and gift sets. Delivery in Owerri and nationwide.',
    priority: '1.0',
    changefreq: 'weekly',
    crumbs: [{ name: 'Home', path: '/' }],
  },
  {
    path: '/shop',
    title: 'Shop Perfumes in Owerri | Roc Realm Perfumes',
    description: 'Shop original designer, Arabian and oil perfumes, oud and gift sets at Roc Realm Perfumes, Owerri. Owerri delivery plus nationwide dispatch.',
    priority: '0.9',
    changefreq: 'daily',
    crumbs: [{ name: 'Home', path: '/' }, { name: 'Shop', path: '/shop' }],
  },
  {
    path: '/gifts',
    title: 'Perfume Gifts in Owerri | Roc Realm Perfumes',
    description: 'Perfume gift sets, birthday and anniversary fragrances for her and him at Roc Realm Perfumes, Owerri, with gift-ready packaging.',
    priority: '0.8',
    changefreq: 'weekly',
    crumbs: [{ name: 'Home', path: '/' }, { name: 'Gifts', path: '/gifts' }],
  },
  {
    path: '/perfume-finder',
    title: 'Perfume Finder Quiz | Roc Realm Perfumes',
    description: 'Answer a few questions about budget, mood and occasion and get a personalised perfume recommendation from our Owerri store.',
    priority: '0.7',
    changefreq: 'monthly',
    crumbs: [{ name: 'Home', path: '/' }, { name: 'Perfume Finder', path: '/perfume-finder' }],
  },
  {
    path: '/blog',
    title: 'Perfume Guides and Tips | Roc Realm Perfumes',
    description: 'Perfume guides for Nigeria: how to spot fake perfume, oil perfume longevity, best scents for Nigerian heat, gifting ideas and choosing a signature scent.',
    priority: '0.7',
    changefreq: 'weekly',
    crumbs: [{ name: 'Home', path: '/' }, { name: 'Fragrance Journal', path: '/blog' }],
  },
  {
    path: '/fragrance-glossary',
    title: 'Fragrance Glossary | Roc Realm Perfumes',
    description: 'Learn perfume notes, scent families, concentrations and trending terms like vanilla gourmand, pistachio and oud before you buy in Owerri, Imo State.',
    priority: '0.7',
    changefreq: 'monthly',
    crumbs: [{ name: 'Home', path: '/' }, { name: 'Fragrance Glossary', path: '/fragrance-glossary' }],
  },
  {
    path: '/faq',
    title: 'Perfume FAQ Owerri | Roc Realm Perfumes',
    description: 'Perfume FAQ: delivery and payment, spotting fake perfume, longevity, trending notes and gifting. Roc Realm Perfumes, Uratta, Owerri, Imo State.',
    priority: '0.7',
    changefreq: 'monthly',
    crumbs: [{ name: 'Home', path: '/' }, { name: 'Perfume FAQ', path: '/faq' }],
  },
  {
    path: '/delivery',
    title: 'Perfume Delivery Owerri and Nigeria | Roc Realm',
    description: 'Delivery fees and options: free pickup in Uratta Owerri, Owerri delivery 3,000 naira, and 1,000 naira waybill or park dispatch nationwide.',
    priority: '0.7',
    changefreq: 'monthly',
    crumbs: [{ name: 'Home', path: '/' }, { name: 'Delivery', path: '/delivery' }],
  },
  {
    path: '/gallery',
    title: 'Perfume Gallery | Roc Realm Perfumes',
    description: 'Photos of perfumes, gift sets, diffusers and packaging from Roc Realm Perfumes, a perfume store in Owerri, Imo State.',
    priority: '0.6',
    changefreq: 'monthly',
    crumbs: [{ name: 'Home', path: '/' }, { name: 'Gallery', path: '/gallery' }],
  },
  {
    path: '/about',
    title: 'About Roc Realm Perfumes Owerri',
    description: 'Roc Realm Nigeria Limited is a perfume store in Owerri, Imo State selling original designer, Arabian and oil perfumes, diffusers and home scents.',
    priority: '0.6',
    changefreq: 'monthly',
    crumbs: [{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }],
  },
  {
    path: '/contact',
    title: 'Contact Roc Realm Perfumes Owerri',
    description: 'Contact our Owerri store: Prof Avenue Junction, by Spibat Road, Uratta. Call 08085100229, message WhatsApp or get directions on Google Maps.',
    priority: '0.6',
    changefreq: 'monthly',
    crumbs: [{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }],
  },
];

export const LOCATION_ROUTES = SERVICE_AREAS.map((area) => ({
  path: `/locations/${area.slug}`,
  title: area.title,
  description: area.description,
  priority: '0.7',
  changefreq: 'monthly',
  crumbs: [
    { name: 'Home', path: '/' },
    { name: 'Delivery locations', path: '/delivery' },
    { name: `${area.city}, ${area.state}`, path: `/locations/${area.slug}` },
  ],
}));

export const ALL_ROUTES = [...STATIC_ROUTES, ...LOCATION_ROUTES];

export const getRouteMeta = (path) => ALL_ROUTES.find((route) => route.path === path);
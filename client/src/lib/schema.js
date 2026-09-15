import { SITE_URL, DEFAULT_OG_IMAGE, absoluteUrl } from './site.js';
import { businessInfo } from './api.js';

export const STORE_ID = `${SITE_URL}/#store`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

const OPENING_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const organizationStructuredData = (testimonials = []) => {
  const rated = testimonials.filter((item) => Number(item.rating) > 0);
  const average = rated.length
    ? rated.reduce((sum, item) => sum + Number(item.rating), 0) / rated.length
    : 0;
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': STORE_ID,
    name: businessInfo.brand,
    legalName: businessInfo.name,
    description:
      'Perfume store in Owerri, Imo State. Original designer and Arabian fragrances, oil perfumes, body mists, diffusers, humidifiers and gift sets. Delivery to Port Harcourt, Onitsha, Anambra and Enugu.',
    url: `${SITE_URL}/`,
    image: DEFAULT_OG_IMAGE,
    logo: `${SITE_URL}/logo.png.jpeg`,
    telephone: businessInfo.storePhoneE164,
    email: businessInfo.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: businessInfo.address.street,
      addressLocality: businessInfo.address.locality,
      addressRegion: businessInfo.address.region,
      postalCode: businessInfo.address.postalCode,
      addressCountry: businessInfo.address.country,
    },
    hasMap: businessInfo.hasMap,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: businessInfo.whatsappE164,
        areaServed: 'NG',
        availableLanguage: ['en'],
      },
    ],
    sameAs: [
      businessInfo.instagramUrl,
      businessInfo.tiktokUrl,
      `https://www.google.com/search?kgmid=${businessInfo.kgmid}`,
    ],
    areaServed: [
      { '@type': 'City', name: 'Owerri' },
      { '@type': 'State', name: 'Imo State' },
      { '@type': 'City', name: 'Port Harcourt' },
      { '@type': 'City', name: 'Onitsha' },
      { '@type': 'City', name: 'Awka' },
      { '@type': 'City', name: 'Enugu' },
    ],
    priceRange: '₦₦₦',
    currenciesAccepted: 'NGN',
    paymentAccepted: 'Cash, Bank transfer, Pay on delivery',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: OPENING_DAYS,
        opens: '09:00',
        closes: '20:00',
      },
    ],
    aggregateRating: rated.length
      ? {
          '@type': 'AggregateRating',
          ratingValue: Number(average.toFixed(1)),
          reviewCount: rated.length,
          bestRating: '5',
          worstRating: '1',
        }
      : undefined,
  };
};

export const websiteStructuredData = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: businessInfo.brand,
  inLanguage: 'en-NG',
  publisher: { '@id': STORE_ID },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/shop?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
});

export const breadcrumbStructuredData = (items = []) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path || item.url || '/'),
  })),
});

const shippingDetails = [
  {
    '@type': 'OfferShippingDetails',
    shippingRate: { '@type': 'MonetaryAmount', value: 3000, currency: 'NGN' },
    shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'NG', addressRegion: 'Imo State' },
    deliveryTime: {
      '@type': 'ShippingDeliveryTime',
      handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
      transitTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 2, unitCode: 'DAY' },
    },
  },
  {
    '@type': 'OfferShippingDetails',
    shippingRate: { '@type': 'MonetaryAmount', value: 1000, currency: 'NGN' },
    shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'NG' },
    deliveryTime: {
      '@type': 'ShippingDeliveryTime',
      handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
      transitTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 4, unitCode: 'DAY' },
    },
  },
];

export const productStructuredData = (product, reviews = []) => {
  if (!product) return null;
  const url = `${SITE_URL}/product/${product.slug}`;
  const rated = (reviews || []).filter((review) => Number(review.rating) > 0);
  const average = rated.length
    ? rated.reduce((sum, review) => sum + Number(review.rating), 0) / rated.length
    : 0;
  const price = Number(product.salePrice || product.price);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product.name,
    description:
      product.description ||
      `Buy ${product.name} from Roc Realm Perfumes, a perfume store in Owerri, Imo State. Delivery to Port Harcourt, Onitsha, Anambra and Enugu.`,
    image: (product.images || []).map(absoluteUrl),
    sku: product.id,
    category: product.category?.name,
    brand: product.brandType
      ? { '@type': 'Brand', name: product.brandType }
      : { '@type': 'Brand', name: businessInfo.brand },
    size: product.size || undefined,
    audience: product.gender
      ? { '@type': 'PeopleAudience', suggestedGender: product.gender }
      : undefined,
    keywords: (product.notes || []).join(', ') || undefined,
    additionalProperty: [
      product.scentFamily
        ? { '@type': 'PropertyValue', name: 'Scent family', value: product.scentFamily }
        : null,
      product.occasion
        ? { '@type': 'PropertyValue', name: 'Occasion', value: product.occasion }
        : null,
      product.gender
        ? { '@type': 'PropertyValue', name: 'Gender', value: product.gender }
        : null,
    ].filter(Boolean),
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'NGN',
      price: Number.isFinite(price) ? price : undefined,
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        Number(product.stock) > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: { '@id': STORE_ID },
      shippingDetails,
    },
    aggregateRating: rated.length
      ? {
          '@type': 'AggregateRating',
          ratingValue: Number(average.toFixed(1)),
          reviewCount: rated.length,
          bestRating: '5',
          worstRating: '1',
        }
      : undefined,
    review: rated.slice(0, 5).map((review) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: review.name || 'Verified customer' },
      datePublished: review.createdAt,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: Number(review.rating),
        bestRating: '5',
        worstRating: '1',
      },
      reviewBody: review.comment,
    })),
  };
};

export const itemListStructuredData = (products = [], name = 'Perfume collection') => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name,
  numberOfItems: products.length,
  itemListElement: products.slice(0, 24).map((product, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: absoluteUrl(`/product/${product.slug}`),
    name: product.name,
  })),
});

export const faqStructuredData = (items = []) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
});

export const articleStructuredData = (post) => {
  if (!post) return null;
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: [post.image ? absoluteUrl(post.image) : DEFAULT_OG_IMAGE],
    author: { '@type': 'Organization', name: businessInfo.brand, '@id': STORE_ID },
    publisher: {
      '@type': 'Organization',
      name: businessInfo.brand,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png.jpeg` },
    },
    url,
    datePublished: post.publishedAt || post.date,
    dateModified: post.updatedAt || post.publishedAt || post.date,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: (post.keywords || []).join(', ') || undefined,
  };
};

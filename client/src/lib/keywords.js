/**
 * SEO keyword inventory for Roc Realm Perfumes (Owerri-first).
 *
 * Placement rules (do NOT dump everything into every meta tag):
 * - HIGH_INTENT_LOCAL  → Home + Contact meta keywords / titles / H1s
 * - PRODUCT_KEYWORDS   → Shop, category filters, product detail context
 * - BRAND_KEYWORDS     → Product pages when brand matches, glossary, search hints
 * - BUDGET_KEYWORDS    → Shop value filters, student/deal messaging
 * - OCCASION_KEYWORDS  → /gifts page + seasonal campaigns
 * - LONG_TAIL_QUESTIONS→ Blog post titles/slugs + FAQ seeds
 *
 * Meta keywords attributes are a secondary signal; primary SEO is natural
 * language in title, description, H1, and body content.
 */

export const LOCATION_KEYWORDS = {
  owerri: [
    // Group 1 — High-Intent Local (money keywords)
    'perfume store in Owerri',
    'best perfume shop in Owerri',
    'where to buy original perfumes in Owerri',
    'fragrance store Owerri',
    'perfume shop near me Owerri',
    'buy designer perfumes Owerri',
    'original perfumes Owerri Imo State',
    'luxury perfume store Owerri',
    'perfume delivery in Owerri',
    'scent shop Owerri',
    'best fragrance dealer in Owerri',
    'authentic perfumes Owerri',
    'perfume outlet Owerri',
    'shop for perfumes in Owerri',
    'perfume vendors in Owerri',
    'high-end perfumes Owerri',
    'affordable perfume store Owerri',
    'Owerri perfume marketplace',
    'designer scent shop Owerri',
    'premium fragrances Owerri',
    // retained useful variants
    'perfume shop in Owerri',
    'best perfume store in Owerri',
    'body mist Owerri',
    'diffuser Owerri',
    'humidifier Owerri',
    'perfume gift set Owerri',
  ],
  imo: [
    'perfume shop in Imo State',
    'perfume store Imo State',
    'buy perfume in Imo State',
    'fragrance shop Imo State',
    'online perfume store Imo State',
    'perfume vendor Imo State',
    'original perfumes Owerri Imo State',
  ],
  portHarcourt: [
    'perfume shop in Port Harcourt',
    'buy perfume in Port Harcourt',
    'perfume delivery Port Harcourt',
    'original perfume Port Harcourt',
    'designer perfume Port Harcourt',
    'fragrance store Port Harcourt',
    'perfume vendor Port Harcourt',
  ],
  onitsha: [
    'perfume shop in Onitsha',
    'buy perfume in Onitsha',
    'perfume store Onitsha',
    'original perfume Onitsha',
    'perfume vendor Onitsha',
    'Onitsha Main Market perfume',
  ],
  anambra: [
    'perfume shop in Anambra',
    'fragrance shop Anambra State',
    'perfume vendor Awka',
    'perfume shop Nnewi',
    'buy perfume Anambra State',
  ],
  enugu: [
    'perfume shop in Enugu',
    'buy perfume in Enugu',
    'perfume delivery Enugu',
    'original perfume Enugu',
    'fragrance store Enugu',
    'perfume vendor Enugu',
  ],
  national: [
    'best perfume store in Nigeria',
    'buy original perfume online Nigeria',
    'Arabian perfume Nigeria',
    'luxury perfume Nigeria',
    'perfume vendor Nigeria',
    'order perfume online Nigeria',
  ],
};

/** Group 1 alias for Home / Contact page meta */
export const HIGH_INTENT_LOCAL = LOCATION_KEYWORDS.owerri;

/** Group 2 — Product / inventory keywords → Shop & product pages */
export const PRODUCT_KEYWORDS = [
  'designer perfumes for men Owerri',
  'designer perfumes for women Owerri',
  'unisex fragrances Owerri',
  'long-lasting perfumes Owerri',
  'perfume oils in Owerri',
  'Arabic perfumes Owerri',
  'oud perfumes Owerri',
  'niche fragrances Owerri',
  'perfume gift sets Owerri',
  'miniature perfumes Owerri',
  'luxury perfume oils Owerri',
  'concentrated perfume oils Owerri',
  'floral scents Owerri',
  'woody fragrances Owerri',
  'fresh and citrus perfumes Owerri',
  'sweet smelling perfumes Owerri',
  'strong perfumes for men Owerri',
  'elegant scents for women Owerri',
  'summer fragrances Owerri',
  'winter perfumes Owerri',
];

/** Group 3 — Brand-specific search keywords → product detail when brand matches */
export const BRAND_KEYWORDS = [
  'Buy Chanel perfumes Owerri',
  'Dior perfumes in Owerri',
  'Gucci fragrances Owerri',
  'Versace perfumes Owerri',
  'Baccarat Rouge 540 Owerri',
  'Creed Aventus Owerri',
  'Armani perfumes Owerri',
  'Yves Saint Laurent (YSL) Owerri',
  'Tom Ford fragrances Owerri',
  'Lancôme perfumes Owerri',
  'Carolina Herrera Owerri',
  'Givenchy perfumes Owerri',
  'Prada fragrances Owerri',
  'Narciso Rodriguez Owerri',
  'Viktor&Rolf perfumes Owerri',
  'Mugler perfumes Owerri',
  'Valentino fragrances Owerri',
  'Montblanc perfumes Owerri',
  'Versace Eros Owerri',
  'Burberry perfumes Owerri',
];

/** Group 4 — Budget / deal-hunter keywords → Shop filters & value messaging */
export const BUDGET_KEYWORDS = [
  'cheap perfumes in Owerri',
  'affordable designer scents Owerri',
  'budget-friendly perfumes Owerri',
  'perfume dupes in Owerri',
  'high-quality perfume oils Owerri',
  'cheap perfume oils Owerri',
  'best value perfumes Owerri',
  'discount perfume shop Owerri',
  'wholesale perfumes Owerri',
  'perfume sales Owerri',
  'cheap original perfumes Owerri',
  'low-cost fragrances Owerri',
  'student-friendly perfume shop Owerri',
  'best perfume oil prices in Owerri',
  'affordable Arabic perfumes Owerri',
];

/** Group 5 — Occasion & gifting → /gifts + seasonal campaigns */
export const OCCASION_KEYWORDS = [
  'birthday perfume gifts Owerri',
  'anniversary perfume gifts Owerri',
  "Valentine's Day perfumes Owerri",
  'wedding fragrance gifts Owerri',
  'corporate perfume gifts Owerri',
  'Christmas perfume hampers Owerri',
  'luxury gift boxes Owerri',
  'best perfumes for gifting in Owerri',
  'romantic scents for couples Owerri',
  'personalized perfume gifts Owerri',
];

/**
 * Group 6 — Long-tail question keywords → blog titles / FAQ seeds.
 * Each entry maps cleanly to a blog slug strategy.
 */
export const LONG_TAIL_QUESTIONS = [
  'How to tell if a perfume is original in Owerri?',
  'Which is the best perfume store in Owerri?',
  'Where can I find long-lasting perfume oils in Owerri?',
  'Best smelling perfumes for Nigerian weather Owerri',
  'How to make perfume last longer in Owerri heat?',
  'Top 10 perfumes for men in Owerri',
  'Top 10 perfumes for women in Owerri',
  'Difference between EDP and EDT perfumes Owerri',
  'Where to buy authentic Arabic oud in Owerri?',
  'Best perfume for office wear in Owerri',
  'How to spot fake designer perfumes in Owerri?',
  'Best luxury scents for weddings in Owerri',
  'Which perfume oil lasts the longest in Owerri?',
  'Affordable perfume alternatives in Owerri',
  'Guide to buying perfumes in Owerri',
];

export const HYPER_LOCAL_AREAS = [
  'New Owerri',
  'Ikenegbu',
  'World Bank',
  'MCC Road',
  'Douglas Road',
  'Wetheral Road',
  'Orji',
  'Amakohia',
  'Egbu',
  'Nekede',
  'Ihiagwa',
  'FUTO',
  'Imo State University',
  'Alvan Ikoku',
  'Sam Mbakwe Airport',
  'Shoprite Owerri',
  'Relief Market',
  'Owerri Municipal',
  'Uratta',
  'Okigwe',
  'Orlu',
  'Mbaise',
  'Oguta',
];

export const TRENDING_PERFUME_KEYWORDS = [
  'trending perfumes in Nigeria',
  'vanilla gourmand perfume',
  'pistachio perfume',
  'coconut perfume',
  'cherry perfume',
  'oud perfume',
  'unisex fragrance',
  'long lasting perfume',
  'perfume oil that lasts',
  'body mist and hair mist',
  'designer perfume dupes',
  'perfume layering',
];

export const TRENDING_NOTES = [
  'vanilla',
  'pistachio',
  'caramel',
  'praline',
  'almond',
  'coconut',
  'coffee',
  'cherry',
  'jasmine',
  'rose',
  'orange blossom',
  'bergamot',
  'ylang-ylang',
  'iris',
  'saffron',
  'oud',
  'sandalwood',
  'cedar',
  'patchouli',
  'vetiver',
  'tonka bean',
  'amber',
  'white musk',
  'gardenia',
  'peony',
  'blackcurrant',
  'raspberry',
  'lavender',
  'mint',
  'sea salt',
  'aquatic',
  'green tea',
  'tobacco',
  'leather',
  'incense',
];

export const FRAGRANCE_FORMATS = [
  'eau de parfum',
  'eau de toilette',
  'parfum',
  'roll-on perfume oil',
  'attar',
  'body mist',
  'hair mist',
  'room spray',
  'reed diffuser',
  'ultrasonic humidifier',
  'car diffuser',
  'perfume gift set',
  'sample decant',
];

export const INTENT_KEYWORDS = [
  'original perfume',
  'authentic perfume',
  'not fake perfume',
  'long lasting perfume',
  'perfume with strong projection',
  'affordable perfume under 20000 naira',
  'perfume for men',
  'perfume for women',
  'unisex perfume',
  'perfume for office',
  'perfume for church',
  'perfume for Nigerian weather',
  'perfume gift for her',
  'perfume gift for him',
];

export const LOCATION_KEYWORD_LINE =
  'Owerri, Imo State, Port Harcourt, Onitsha, Anambra, Enugu';

export const TRENDING_KEYWORD_LINE =
  'vanilla gourmand, pistachio, coconut, aquatic, jasmine, vetiver, oud and unisex fragrances';

/** Cap meta keywords to ~15–20 strongest terms to avoid stuffing */
export const metaKeywords = (...groups) =>
  [...new Set(groups.flat())].slice(0, 20).join(', ');

export const keywordText = (groups = Object.values(LOCATION_KEYWORDS)) =>
  [...new Set(groups.flat())].join(', ');

/**
 * Match brand keywords against a product name for product-page meta enrichment.
 * Returns 0–3 brand phrases if the product name contains a known brand token.
 */
export const brandKeywordsForProduct = (productName = '') => {
  const lower = String(productName).toLowerCase();
  const tokens = [
    ['chanel', 'Buy Chanel perfumes Owerri'],
    ['dior', 'Dior perfumes in Owerri'],
    ['gucci', 'Gucci fragrances Owerri'],
    ['versace eros', 'Versace Eros Owerri'],
    ['versace', 'Versace perfumes Owerri'],
    ['baccarat', 'Baccarat Rouge 540 Owerri'],
    ['creed', 'Creed Aventus Owerri'],
    ['aventus', 'Creed Aventus Owerri'],
    ['armani', 'Armani perfumes Owerri'],
    ['yves saint laurent', 'Yves Saint Laurent (YSL) Owerri'],
    ['ysl', 'Yves Saint Laurent (YSL) Owerri'],
    ['tom ford', 'Tom Ford fragrances Owerri'],
    ['lancôme', 'Lancôme perfumes Owerri'],
    ['lancome', 'Lancôme perfumes Owerri'],
    ['carolina herrera', 'Carolina Herrera Owerri'],
    ['givenchy', 'Givenchy perfumes Owerri'],
    ['prada', 'Prada fragrances Owerri'],
    ['narciso', 'Narciso Rodriguez Owerri'],
    ['viktor', 'Viktor&Rolf perfumes Owerri'],
    ['mugler', 'Mugler perfumes Owerri'],
    ['valentino', 'Valentino fragrances Owerri'],
    ['montblanc', 'Montblanc perfumes Owerri'],
    ['burberry', 'Burberry perfumes Owerri'],
  ];
  const hits = [];
  for (const [token, phrase] of tokens) {
    if (lower.includes(token) && !hits.includes(phrase)) hits.push(phrase);
    if (hits.length >= 3) break;
  }
  return hits;
};

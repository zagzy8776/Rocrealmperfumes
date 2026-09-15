const rawBlogPosts = [
  {
    slug: 'best-perfume-store-in-owerri',
    title: 'Best Perfume Store in Owerri: Why Roc Realm Perfumes Stands Out',
    seoTitle: 'Best Perfume Store in Owerri: Why Roc Realm Stands Out',
    excerpt: 'A guide for perfume lovers in Owerri looking for designer perfumes, oil perfumes, gift sets, and trusted WhatsApp ordering.',
    content: ['Roc Realm Perfumes is built for customers who want a premium perfume shopping experience in Owerri, Imo State.', 'From designer perfumes and oil perfumes to diffusers, sprays, humidifiers, and gift-ready sets, the store makes it easy to discover quality scents and confirm orders on WhatsApp.', 'If you are searching for a perfume store in Owerri, focus on product quality, scent guidance, delivery support, and customer reviews. Roc Realm brings these together in one luxury online store.'],
  },
  { slug: 'best-perfumes-for-women-in-nigeria', title: 'Best Perfumes for Women in Nigeria', excerpt: 'Soft, bold, fresh, sweet, and elegant perfume ideas for Nigerian weather and everyday confidence.', content: ['Great perfumes for women in Nigeria should balance beauty, projection, and comfort in warm weather.', 'Popular scent directions include vanilla, floral, fruity, amber, musk, and clean fresh blends.', 'For office wear, choose soft projection. For evenings and events, richer amber, vanilla, oud, and floral scents can stand out beautifully.'] },
  { slug: 'best-perfumes-for-men-in-nigeria', title: 'Best Perfumes for Men in Nigeria', excerpt: 'A guide to masculine, fresh, woody, aquatic, and long-lasting scents for Nigerian men.', content: ['Men in Nigeria often need scents that stay fresh and confident through heat and busy days.', 'Citrus, aquatic, woody, amber, musk, and oud blends are strong options for daily wear, work, and events.', 'Choose lighter fresh scents for daytime and deeper woody or oud scents for evening.'] },
  { slug: 'best-oil-perfumes-that-last-long', title: 'Best Oil Perfumes That Last Long', excerpt: 'How to choose perfume oils with good longevity, projection, and value.', content: ['Oil perfumes are loved because they sit close to the skin and can last for hours.', 'Look for musk, amber, vanilla, oud, and powdery blends if you want long-lasting comfort.', 'Apply to pulse points and avoid rubbing aggressively after application.'] },
  { slug: 'best-perfumes-for-hot-nigerian-weather', title: 'Best Perfumes for Hot Nigerian Weather', excerpt: 'Fresh perfume ideas that work better in warm weather.', content: ['Hot Nigerian weather can make heavy perfumes feel too strong, so fresh and balanced scents are important.', 'Citrus, aquatic, clean musk, soft floral, and airy woody notes are great for daytime.', 'Reserve dense oud, gourmand, and heavy amber scents for evenings or cooler settings.'] },
  { slug: 'how-to-choose-a-signature-scent', title: 'How to Choose a Signature Scent', excerpt: 'Find a perfume that matches your personality, budget, lifestyle, and occasion.', content: ['A signature scent should feel like you: comfortable, memorable, and suitable for your daily life.', 'Start by choosing a scent family such as fresh, sweet, floral, woody, oud, or musk.', 'Then consider your budget, how strong you want it, and whether you need it for office, date night, church, events, or gifting.'] },
  { slug: 'best-perfume-gifts-in-nigeria', title: 'Best Perfume Gifts in Nigeria', excerpt: 'Gift ideas for birthdays, anniversaries, couples, and luxury surprises.', content: ['Perfumes make excellent gifts because they feel personal, elegant, and memorable.', 'For her, consider floral, sweet, vanilla, or soft musk scents. For him, try fresh, woody, amber, or oud scents.', 'Gift sets with perfumes, oils, diffusers, and sprays can make the present feel more complete.'] },
];

// Publication dates, keyword targets and per-post FAQs. Owerri and Imo State come first.
const POST_META = {
  'best-perfume-store-in-owerri': {
    publishedAt: '2026-01-08',
    keywords: ['perfume store in Owerri', 'best perfume shop in Owerri', 'perfume delivery in Owerri', 'buy original perfume Owerri'],
    headings: [
      'Why Roc Realm Perfumes stands out in Owerri',
      'What you can buy at our Uratta store',
      'How to order from Owerri, Port Harcourt and beyond',
    ],
    faq: [
      ['Do you deliver in Owerri?', 'Yes. Owerri delivery is 3,000 naira and is coordinated by rider after your order is confirmed on WhatsApp. Pickup from our Uratta store is free.'],
      ['Is Roc Realm Perfumes a registered store?', 'Yes. Roc Realm Perfumes is operated by Roc Realm Nigeria Limited from Prof Avenue Junction, by Spibat Road, Uratta, Owerri, Imo State.'],
    ],
  },
  'best-perfumes-for-women-in-nigeria': {
    publishedAt: '2026-01-14',
    keywords: ['best perfume for women in Nigeria', 'vanilla perfume Nigeria', 'floral perfume Nigeria', 'long lasting perfume for women'],
    headings: ['What makes a perfume work for women in Nigeria', 'Scent directions worth trying', 'Choosing by occasion'],
    faq: [
      ['Which perfume lasts longest on a woman in Nigerian weather?', 'Eau de parfum and oil-based blends with amber, vanilla, musk or oud last longest. We can recommend specific options for your budget on WhatsApp.'],
      ['Can you suggest a perfume gift for her?', 'Yes. Tell us her age, style and budget and we will suggest floral, vanilla or soft musk scents that suit her.'],
    ],
  },
  'best-perfumes-for-men-in-nigeria': {
    publishedAt: '2026-01-20',
    keywords: ['best perfume for men in Nigeria', 'oud perfume for men', 'long lasting perfume for men', 'masculine fragrance Nigeria'],
    headings: ['Scents that hold up in Nigerian heat', 'Best scent families for men', 'Day versus evening choices'],
    faq: [
      ['What is the best perfume for men in hot weather?', 'Fresh citrus, aquatic, clean musk and light woody scents stay comfortable all day. Reserve oud, amber and tobacco blends for evenings.'],
      ['Do you stock original designer and Arabian perfumes for men?', 'Yes. We stock original masculine designer scents, Arabian oud and concentrated oil perfumes for men.'],
    ],
  },
  'best-oil-perfumes-that-last-long': {
    publishedAt: '2026-01-27',
    keywords: ['best oil perfume Nigeria', 'perfume oil that lasts long', 'attar Nigeria', 'roll on perfume oil Owerri'],
    headings: ['Why oil perfumes last longer', 'Notes that hold longest', 'How to apply perfume oil'],
    faq: [
      ['Do oil perfumes last longer than sprays?', 'Oil perfumes sit closer to the skin and usually outlast eau de toilette sprays, especially amber, musk, vanilla and oud blends.'],
      ['How should I apply perfume oil?', 'Apply to pulse points such as wrists, neck and behind the ears, and avoid rubbing the skin afterwards.'],
    ],
  },
  'best-perfumes-for-hot-nigerian-weather': {
    publishedAt: '2026-02-03',
    keywords: ['best perfume for Nigerian weather', 'perfume for harmattan', 'fresh perfume Nigeria', 'aquatic perfume Owerri'],
    headings: ['Why heavy perfumes struggle in the heat', 'Fresh notes that work best', 'When to wear rich fragrances'],
    faq: [
      ['What notes are best for Nigerian heat?', 'Citrus, aquatic, sea salt, clean musk, green tea and soft florals stay fresh when temperatures rise.'],
      ['Should I avoid oud in hot weather?', 'Not entirely. Wear oud and gourmand scents lightly for evenings, or choose fresher oud blends for daytime.'],
    ],
  },
  'how-to-choose-a-signature-scent': {
    publishedAt: '2026-02-10',
    keywords: ['how to choose a signature scent', 'perfume finder Owerri', 'personal fragrance Nigeria', 'signature perfume'],
    headings: ['Start with a scent family', 'Match the scent to your lifestyle', 'Test before you commit'],
    faq: [
      ['How many perfumes should I own?', 'Most customers do well with two or three: one fresh daytime scent, one richer evening fragrance and one signature for special occasions.'],
      ['Can you help me choose?', 'Yes. Use our perfume finder quiz or send your budget and scent mood on WhatsApp and we will recommend options in stock.'],
    ],
  },
  'best-perfume-gifts-in-nigeria': {
    publishedAt: '2026-02-17',
    keywords: ['perfume gift Nigeria', 'perfume gift set Owerri', 'birthday perfume gift', 'anniversary fragrance Nigeria'],
    headings: ['Perfume gifts that feel personal', 'Gift ideas for her and for him', 'Making the gift feel complete'],
    faq: [
      ['Can you deliver a perfume gift as a surprise?', 'Yes. Tell us it is a gift on WhatsApp and we will coordinate presentation and delivery to the recipient in Owerri, Port Harcourt, Onitsha, Anambra or Enugu.'],
      ['Do you sell gift sets?', 'Yes. We have gift-ready sets combining perfumes, oil perfumes, body mists, diffusers and home scents.'],
    ],
  },
};

const enrichPost = (post) => {
  const meta = POST_META[post.slug] || {};
  const headings = meta.headings || [];
  return {
    ...post,
    publishedAt: meta.publishedAt || '2026-01-05',
    updatedAt: meta.updatedAt || meta.publishedAt || '2026-01-05',
    keywords: meta.keywords || [],
    image: '/og-image.jpg',
    sections: headings
      .map((heading, index) => ({ heading, paragraphs: [post.content[index]].filter(Boolean) }))
      .filter((section) => section.paragraphs.length),
    faq: (meta.faq || []).map(([question, answer]) => ({ question, answer })),
  };
};

// City-focused posts targeting delivery keywords across the South East.
const CITY_POSTS = [
  {
    slug: 'perfume-shops-in-owerri-how-to-buy-original',
    title: 'Perfume Shops in Owerri: How to Buy Original Fragrances',
    excerpt: 'How to tell an original perfume from a refill in Owerri, which checks expose fakes, and what to ask before you pay.',
    publishedAt: '2026-02-24',
    keywords: ['perfume shops in Owerri', 'original perfume Owerri', 'fake perfume Nigeria', 'perfume store Uratta'],
    sections: [
      {
        heading: 'Why so many Owerri shoppers end up with refills',
        paragraphs: [
          'Owerri has hundreds of perfume vendors, from Relief Market stalls to Instagram sellers, and that means a wide range of authenticity. Most people who end up disappointed were sold a refilled bottle in original packaging, or a tester with no batch code.',
          'If you are buying in Owerri, ask three questions before you pay: can I see the batch code, is this the same bottle in the photo, and what happens if the scent is not what I expected? A serious perfume store answers all three without hesitation.',
        ],
      },
      {
        heading: 'Checks that expose a fake quickly',
        paragraphs: [
          'Look at the crimp around the spray nozzle, the weight of the bottle, how cleanly the cap clicks, and whether the printing is crisp. Then spray on skin, not paper: original fragrances open with top notes, settle into a heart and finish with a base instead of smelling flat from the first second.',
          'Originality also shows in longevity. A genuine eau de parfum with amber, oud or musk should still be detectable on skin hours later, while diluted refills fade within the hour.',
        ],
      },
      {
        heading: 'Buying original perfume in Owerri',
        paragraphs: [
          'Roc Realm Perfumes sells original designer and Arabian fragrances from Prof Avenue Junction, by Spibat Road, Uratta. You can visit the store, order online or confirm on WhatsApp, and pickup is free.',
        ],
      },
    ],
    faq: [
      { question: 'Where can I buy original perfume in Owerri?', answer: 'Roc Realm Perfumes at Prof Avenue Junction, by Spibat Road, Uratta, Owerri, Imo State sells original designer and Arabian fragrances, with free store pickup and 3,000 naira delivery within Owerri.' },
      { question: 'How do I check if a perfume is original?', answer: 'Check the batch code, bottle weight, spray crimp, cap fit and printing, then test on skin to see whether the scent develops through top, heart and base notes.' },
    ],
  },
  {
    slug: 'perfume-delivery-in-port-harcourt-what-to-expect',
    title: 'Perfume Delivery in Port Harcourt: What to Expect',
    excerpt: 'How perfume delivery to Port Harcourt works from an Owerri store, what it costs, and how to protect your bottle in transit.',
    publishedAt: '2026-03-03',
    keywords: ['perfume delivery Port Harcourt', 'buy perfume Port Harcourt', 'perfume shop in Port Harcourt', 'original perfume Rivers State'],
    sections: [
      {
        heading: 'How dispatch from Owerri to Port Harcourt works',
        paragraphs: [
          'Orders are confirmed on WhatsApp before anything leaves Owerri. We then send your parcel by park dispatch or waybill for 1,000 naira, and any remaining rider or terminal cost in Port Harcourt is confirmed with you first.',
          'Deliveries reach GRA, Rumuokoro, Trans-Amadi, Woji, Ada George and Peter Odili Road areas, and you receive the transport details so you can follow up directly.',
        ],
      },
      {
        heading: 'Protecting your perfume in transit',
        paragraphs: [
          'Fragrance bottles travel well when packed upright with padding around the cap, which is how we pack glass bottles and oil perfumes. If a bottle arrives damaged or does not match your order, tell us immediately with photos and we will resolve it.',
        ],
      },
    ],
    faq: [
      { question: 'How much is perfume delivery to Port Harcourt?', answer: 'Park dispatch or waybill from our Owerri store to Port Harcourt is 1,000 naira, with any remaining rider or terminal cost confirmed with you before dispatch.' },
      { question: 'How long does delivery to Port Harcourt take?', answer: 'Most Port Harcourt parcels arrive within one to three days after dispatch, depending on the transport company and your exact area.' },
    ],
  },
  {
    slug: 'perfume-shopping-in-onitsha-anambra-and-enugu',
    title: 'Perfume Shopping in Onitsha, Anambra and Enugu',
    excerpt: 'Buying original perfume in Onitsha, Awka, Nnewi and Enugu, and why verified sourcing matters more than a low price.',
    publishedAt: '2026-03-10',
    keywords: ['perfume shop in Onitsha', 'perfume vendor Awka', 'perfume delivery Enugu', 'fragrance shop Anambra'],
    sections: [
      {
        heading: 'The Onitsha and Anambra perfume market',
        paragraphs: [
          'Onitsha Main Market and the surrounding streets sell more perfume than anywhere else in the South East, which also makes it the easiest place to buy a refill without knowing it. The lowest price is rarely the original bottle.',
          'When you buy from a registered store instead, you get a batch code, consistent sourcing and someone accountable if something is wrong. Roc Realm Perfumes ships to Onitsha, Awka, Nnewi, Ogidi, Nkpor and the wider Anambra State area.',
        ],
      },
      {
        heading: 'Ordering perfume into Enugu',
        paragraphs: [
          'Enugu customers order the same way: confirm the scent on WhatsApp, pay by transfer or on delivery where available, and receive the parcel by park dispatch to Enugu, Independence Layout, Trans-Ekulu or Nsukka.',
          'If you are unsure what to buy, tell us the notes you already enjoy and we will shortlist two or three options in your budget rather than pushing the most expensive bottle.',
        ],
      },
    ],
    faq: [
      { question: 'Do you deliver perfume to Onitsha and Enugu?', answer: 'Yes. We deliver to Onitsha, Awka, Nnewi and across Anambra State, and to Enugu city, Independence Layout, Trans-Ekulu and Nsukka. Park dispatch is 1,000 naira with any remaining rider cost confirmed before dispatch.' },
      { question: 'Can I buy original perfume without visiting Owerri?', answer: 'Yes. Order online or on WhatsApp and we ship nationwide, confirming the exact bottle, size and price before you pay.' },
    ],
  },
];

export const blogPosts = [
  ...rawBlogPosts.map(enrichPost),
  ...CITY_POSTS.map((post) => ({
    ...post,
    image: post.image || '/og-image.jpg',
    updatedAt: post.updatedAt || post.publishedAt,
    content: post.sections.flatMap((section) => section.paragraphs),
  })),
];

export const getBlogPost = (slug) => blogPosts.find((post) => post.slug === slug);

export const getRelatedPosts = (slug, limit = 3) => {
  const current = getBlogPost(slug);
  if (!current) return [];
  return blogPosts
    .filter((post) => post.slug !== slug)
    .map((post) => ({
      post,
      score: (post.keywords || []).filter((keyword) => (current.keywords || []).includes(keyword)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);
};
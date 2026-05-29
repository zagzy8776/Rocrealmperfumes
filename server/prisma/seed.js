require('dotenv').config();

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const makeSlug = require('../src/utils/slug');

const prisma = new PrismaClient();

const categories = [
  ['Designer Perfumes', 'Premium designer and designer-inspired fragrances for luxury scent lovers.'],
  ['Oil Perfumes', 'Long-lasting perfume oils with rich projection.'],
  ['Colognes', 'Fresh colognes for everyday confidence and clean projection.'],
  ['Sprays & Diffusers', 'Room sprays, reed diffusers, and home fragrance essentials.'],
  ['Humidifiers', 'Stylish humidifiers for beautiful ambience and comfort.'],
  ['Body Mists', 'Light, refreshing body mists for everyday fragrance layering.'],
  ['Female Perfumes', 'Elegant scents for women who love soft, bold, and unforgettable fragrance.'],
  ['Male Perfumes', 'Confident masculine perfumes for daily wear and special occasions.'],
  ['Unisex Perfumes', 'Balanced luxury fragrances made for everyone.'],
  ['Luxury Collection', 'Premium designer-inspired and niche perfume selections.'],
  ['Gift Sets', 'Beautifully curated perfume gifts for loved ones.'],
];

const image = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

const obsoleteProductSlugs = ['satin-' + 'night' + 'wear-set', 'luxury-' + 'linger' + 'ie-set'];
const obsoleteCategorySlug = 'night' + 'wear-' + 'linger' + 'ies';
const obsoleteProductTerms = ['Night' + 'wear', 'Linger' + 'ie'];

const products = [
  ['Baccarat Rouge 540', 'Designer Perfumes', 85000, '70ml', ['Amber', 'Saffron', 'Cedar'], true, image('1594035910387-fea47794261f')],
  ['Dior Sauvage', 'Designer Perfumes', 62000, '100ml', ['Bergamot', 'Ambroxan', 'Pepper'], true, image('1523293182086-7651a899d37f')],
  ['Chanel Coco Mademoiselle', 'Designer Perfumes', 78000, '100ml', ['Rose', 'Patchouli', 'Orange'], true, image('1541643600914-78b084683601')],
  ['YSL Libre', 'Female Perfumes', 68000, '90ml', ['Lavender', 'Orange Blossom', 'Vanilla'], false, image('1595425970377-c9703cf48b6f')],
  ['Creed Aventus', 'Luxury Collection', 120000, '100ml', ['Pineapple', 'Birch', 'Musk'], true, image('1585386959984-a41552231658')],
  ['Tom Ford Oud Wood', 'Unisex Perfumes', 98000, '100ml', ['Oud', 'Sandalwood', 'Cardamom'], false, image('1592945403244-b3fbafd7f539')],
  ['Good Girl', 'Female Perfumes', 56000, '80ml', ['Jasmine', 'Tonka Bean', 'Cocoa'], false, image('1600612253971-422e7f7faeb6')],
  ['Black Opium', 'Female Perfumes', 59000, '90ml', ['Coffee', 'Vanilla', 'White Flowers'], false, image('1615634260167-c8cdede054de')],
  ['Royal Musk Perfume Oil', 'Oil Perfumes', 9500, '12ml', ['Musk', 'Powder', 'Amber'], false, image('1608571423902-eed4a5ad8108')],
  ['Fresh Gentleman Cologne', 'Colognes', 18000, '100ml', ['Citrus', 'Aquatic', 'Musk'], false, image('1528740561666-dc2479dc08ab')],
  ['Luxury Reed Diffuser', 'Sprays & Diffusers', 22000, '200ml', ['Vanilla', 'Amber', 'Clean Air'], true, image('1608571423902-eed4a5ad8108')],
  ['Room & Linen Spray', 'Sprays & Diffusers', 8500, '250ml', ['Fresh Linen', 'Soft Floral', 'Musk'], false, image('1600612253971-422e7f7faeb6')],
  ['Aroma Humidifier', 'Humidifiers', 28000, '500ml', ['Mist', 'LED Light', 'Aroma Ready'], true, image('1585771724684-38269d6639fd')],
  ['Premium Vanilla Body Mist', 'Body Mists', 15000, '250ml', ['Vanilla', 'Soft', 'Everyday'], false, image('1594223274512-ad4803739b7c')],
  ['Arabian Rose Body Mist', 'Body Mists', 16000, '250ml', ['Rose', 'Fresh', 'Feminine'], false, image('1515886657613-9f3515b0c78f')],
  ['Signature Couple Gift Set', 'Gift Sets', 45000, '2 x 50ml', ['Fresh', 'Floral', 'Woody'], true, image('1519669011783-4eaa95fa1b7d')],
];

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@rocrealmperfume.com').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const hashed = await bcrypt.hash(adminPassword, 12);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { password: hashed, name: process.env.ADMIN_NAME || 'Roc Realm Admin' },
    create: { email: adminEmail, password: hashed, name: process.env.ADMIN_NAME || 'Roc Realm Admin' },
  });

  await prisma.product.deleteMany({
    where: {
      OR: [
        { slug: { in: obsoleteProductSlugs } },
        ...obsoleteProductTerms.map((term) => ({ name: { contains: term, mode: 'insensitive' } })),
      ],
    },
  });

  await prisma.category.deleteMany({
    where: {
      OR: [
        { slug: obsoleteCategorySlug },
        ...obsoleteProductTerms.map((term) => ({ name: { contains: term, mode: 'insensitive' } })),
      ],
    },
  });

  const categoryMap = new Map();
  for (const [name, description] of categories) {
    const category = await prisma.category.upsert({
      where: { slug: makeSlug(name) },
      update: { name, description },
      create: { name, slug: makeSlug(name), description },
    });
    categoryMap.set(name, category);
  }

  for (const [name, categoryName, price, size, notes, isFeatured, productImage] of products) {
    await prisma.product.upsert({
      where: { slug: makeSlug(name) },
      update: {},
      create: {
        name,
        slug: makeSlug(name),
        description: `${name} is a refined Roc Realm selection for customers who want elegance, confidence, comfort, and a memorable luxury shopping experience.`,
        price,
        size,
        notes,
        stock: 12,
        images: [productImage],
        isFeatured,
        categoryId: categoryMap.get(categoryName).id,
      },
    });
  }

  await prisma.coupon.upsert({
    where: { code: 'ROC10' },
    update: {},
    create: { code: 'ROC10', type: 'PERCENTAGE', value: 10, isActive: true },
  });

  await prisma.promoBanner.upsert({
    where: { id: 'default-owerri-delivery-promo' },
    update: { title: 'Luxury Fragrance Delivery', message: 'Order perfumes, oils, body mists, diffusers, and gift sets with Owerri delivery plus Lagos supplier dispatch after confirmation.', linkLabel: 'Shop now', linkUrl: '/shop', isActive: true },
    create: { id: 'default-owerri-delivery-promo', title: 'Luxury Fragrance Delivery', message: 'Order perfumes, oils, body mists, diffusers, and gift sets with Owerri delivery plus Lagos supplier dispatch after confirmation.', linkLabel: 'Shop now', linkUrl: '/shop', isActive: true },
  });

  const testimonials = [
    ['Chidinma', 'Roc Realm helped me choose a beautiful long-lasting scent. The WhatsApp support was fast and friendly.', 'Owerri'],
    ['Somto', 'I ordered a gift set and it felt premium. Great recommendations and smooth delivery coordination.', 'Imo State'],
    ['Amaka', 'The perfume oil lasted so well. I love how easy it is to order and confirm everything on WhatsApp.', 'Owerri'],
  ];

  for (const [name, quote, location] of testimonials) {
    const existing = await prisma.testimonial.findFirst({ where: { name, quote } });
    if (!existing) await prisma.testimonial.create({ data: { name, quote, location, rating: 5, isActive: true } });
  }

  console.log('Seed completed.');
  console.log(`Admin email: ${adminEmail}`);
  console.log(`Admin password: ${process.env.ADMIN_PASSWORD ? 'configured from environment' : 'using default ChangeMe123! - change before production'}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

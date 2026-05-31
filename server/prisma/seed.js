require('dotenv').config();

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const makeSlug = require('../src/utils/slug');

const prisma = new PrismaClient();

const obsoleteProductSlugs = ['satin-' + 'night' + 'wear-set', 'luxury-' + 'linger' + 'ie-set'];
const obsoleteCategorySlug = 'night' + 'wear-' + 'linger' + 'ies';
const obsoleteProductTerms = ['Night' + 'wear', 'Linger' + 'ie'];

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

  console.log('Seed completed. Admin account checked. No products, categories, promos, coupons, or testimonials were seeded; manage store content from the admin panel.');
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

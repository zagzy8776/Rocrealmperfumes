require('dotenv').config();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || '';
  if (!adminEmail || !adminPassword || adminPassword.length < 12) throw new Error('ADMIN_EMAIL and a strong ADMIN_PASSWORD (12+ characters) are required. Refusing to seed a default credential.');
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET of at least 32 characters is required before seeding.');

  const hashed = await bcrypt.hash(adminPassword, 12);
  await prisma.admin.upsert({ where:{email:adminEmail}, update:{password:hashed,name:process.env.ADMIN_NAME||'Roc Realm Admin'}, create:{email:adminEmail,password:hashed,name:process.env.ADMIN_NAME||'Roc Realm Admin'} });

  console.log('Seed completed. Admin account checked. Store content is managed from the admin panel.');
}
main().catch((error)=>{console.error(error);process.exit(1);}).finally(async()=>{await prisma.$disconnect();});

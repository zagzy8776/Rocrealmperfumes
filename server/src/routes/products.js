const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { requireAdmin } = require('../middleware/auth');
const makeSlug = require('../utils/slug');
const { formatProduct } = require('../utils/money');

const router = express.Router();

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
  salePrice: z.coerce.number().positive().optional().nullable(),
  size: z.string().optional().nullable(),
  notes: z.array(z.string()).default([]),
  images: z.array(z.string().url()).default([]),
  stock: z.coerce.number().int().min(0).default(0),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  categoryId: z.string().optional().nullable(),
});

router.get('/', asyncHandler(async (req, res) => {
  const { search, category, featured, active } = req.query;

  const products = await prisma.product.findMany({
    where: {
      isActive: active === 'false' ? undefined : true,
      isFeatured: featured === 'true' ? true : undefined,
      category: category ? { slug: String(category) } : undefined,
      OR: search ? [
        { name: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } },
      ] : undefined,
    },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ products: products.map(formatProduct) });
}));

router.get('/admin/all', requireAdmin, asyncHandler(async (req, res) => {
  const products = await prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: 'desc' } });
  res.json({ products: products.map(formatProduct) });
}));

router.get('/:slug', asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { slug: req.params.slug },
    include: { category: true },
  });

  if (!product || !product.isActive) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  res.json({ product: formatProduct(product) });
}));

router.post('/', requireAdmin, asyncHandler(async (req, res) => {
  const data = productSchema.parse(req.body);
  const baseSlug = makeSlug(data.name);
  const existing = await prisma.product.count({ where: { slug: { startsWith: baseSlug } } });
  const slug = existing ? `${baseSlug}-${existing + 1}` : baseSlug;

  const product = await prisma.product.create({
    data: { ...data, slug, salePrice: data.salePrice || null, categoryId: data.categoryId || null },
    include: { category: true },
  });

  res.status(201).json({ product: formatProduct(product) });
}));

router.put('/:id', requireAdmin, asyncHandler(async (req, res) => {
  const data = productSchema.parse(req.body);
  const current = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!current) return res.status(404).json({ message: 'Product not found.' });

  const nextSlug = current.name === data.name ? current.slug : makeSlug(data.name);
  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: { ...data, slug: nextSlug, salePrice: data.salePrice || null, categoryId: data.categoryId || null },
    include: { category: true },
  });

  res.json({ product: formatProduct(product) });
}));

router.delete('/:id', requireAdmin, asyncHandler(async (req, res) => {
  await prisma.product.delete({ where: { id: req.params.id } });
  res.json({ message: 'Product deleted.' });
}));

module.exports = router;

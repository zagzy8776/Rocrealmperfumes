const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

const reviewSchema = z.object({
  name: z.string().trim().min(2).max(60),
  comment: z.string().trim().min(8).max(1200),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  productId: z.string().min(1),
});

const reviewUpdateSchema = z.object({
  name: z.string().trim().min(2).max(60).optional(),
  comment: z.string().trim().min(8).max(1200).optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  isApproved: z.boolean().optional(),
});

router.get('/product/:productId', asyncHandler(async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: { productId: req.params.productId, isApproved: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: { id: true, name: true, rating: true, comment: true, createdAt: true },
  });
  const count = reviews.length;
  const average = count ? reviews.reduce((sum, review) => sum + review.rating, 0) / count : 0;
  res.json({ reviews, summary: { count, average: Number(average.toFixed(1)) } });
}));

router.post('/', asyncHandler(async (req, res) => {
  const data = reviewSchema.parse(req.body);
  const product = await prisma.product.findFirst({
    where: { id: data.productId, isActive: true },
    select: { id: true },
  });
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  const review = await prisma.review.create({ data });
  res.status(201).json({ review });
}));

router.get('/admin/all', requireAdmin, asyncHandler(async (req, res) => {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
    include: { product: { select: { name: true, slug: true } } },
  });
  res.json({ reviews });
}));

router.put('/:id', requireAdmin, asyncHandler(async (req, res) => {
  const data = reviewUpdateSchema.parse(req.body);
  const review = await prisma.review.update({ where: { id: req.params.id }, data });
  res.json({ review });
}));

router.delete('/:id', requireAdmin, asyncHandler(async (req, res) => {
  await prisma.review.delete({ where: { id: req.params.id } });
  res.json({ message: 'Review deleted.' });
}));

module.exports = router;
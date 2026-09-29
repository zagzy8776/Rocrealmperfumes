const express = require('express');
const { z } = require('zod');
const { randomUUID } = require('crypto');
const prisma = require('../lib/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { requireAdmin } = require('../middleware/auth');
const { ensureReviewTable } = require('../lib/ensureReviewTable');

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

const emptySummary = { reviews: [], summary: { count: 0, average: 0 } };

const isMissingTable = (error) =>
  error?.code === 'P2021' || /does not exist|relation .*review/i.test(String(error?.message || ''));

router.get(
  '/product/:productId',
  asyncHandler(async (req, res) => {
    try {
      await ensureReviewTable();
      const reviews = await prisma.review.findMany({
        where: { productId: req.params.productId, isApproved: true },
        orderBy: { createdAt: 'desc' },
        take: 50,
        select: { id: true, name: true, rating: true, comment: true, createdAt: true },
      });
      const count = reviews.length;
      const average = count ? reviews.reduce((sum, review) => sum + review.rating, 0) / count : 0;
      res.json({ reviews, summary: { count, average: Number(average.toFixed(1)) } });
    } catch (error) {
      if (isMissingTable(error)) return res.json(emptySummary);
      throw error;
    }
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const data = reviewSchema.parse(req.body);
    await ensureReviewTable();
    const product = await prisma.product.findFirst({
      where: { id: data.productId, isActive: true },
      select: { id: true },
    });
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    const now = new Date();
    const review = await prisma.review.create({
      data: {
        id: randomUUID().replace(/-/g, '').slice(0, 25),
        productId: data.productId,
        name: data.name,
        rating: data.rating,
        comment: data.comment,
        isApproved: true,
        createdAt: now,
        updatedAt: now,
      },
    });
    res.status(201).json({ review });
  }),
);

router.get(
  '/admin/all',
  requireAdmin,
  asyncHandler(async (req, res) => {
    try {
      await ensureReviewTable();
      const reviews = await prisma.review.findMany({
        orderBy: { createdAt: 'desc' },
        take: 200,
        include: { product: { select: { name: true, slug: true } } },
      });
      res.json({ reviews });
    } catch (error) {
      if (isMissingTable(error)) return res.json({ reviews: [] });
      throw error;
    }
  }),
);

router.put(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const data = reviewUpdateSchema.parse(req.body);
    await ensureReviewTable();
    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: { ...data, updatedAt: new Date() },
    });
    res.json({ review });
  }),
);

router.delete(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    await ensureReviewTable();
    await prisma.review.delete({ where: { id: req.params.id } });
    res.json({ message: 'Review deleted.' });
  }),
);

module.exports = router;

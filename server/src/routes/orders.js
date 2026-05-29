const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { requireAdmin } = require('../middleware/auth');
const { formatOrder } = require('../utils/money');
const { calculateDiscount } = require('./coupons');

const router = express.Router();

const orderSchema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(7),
  customerEmail: z.string().email().optional().or(z.literal('')).nullable(),
  deliveryAddress: z.string().min(5),
  deliveryCity: z.string().optional().nullable(),
  deliveryNote: z.string().optional().nullable(),
  paymentMethod: z.enum(['BANK_TRANSFER', 'PAY_ON_DELIVERY', 'WHATSAPP_CONFIRMATION']),
  couponCode: z.string().optional().nullable(),
  items: z.array(z.object({ productId: z.string(), quantity: z.coerce.number().int().positive() })).min(1),
});

const makeOrderNumber = () => `RRP-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 900 + 100)}`;

router.post('/', asyncHandler(async (req, res) => {
  const data = orderSchema.parse(req.body);
  const ids = data.items.map((item) => item.productId);
  const products = await prisma.product.findMany({ where: { id: { in: ids }, isActive: true } });

  if (products.length !== ids.length) {
    return res.status(400).json({ message: 'One or more products are unavailable.' });
  }

  const productMap = new Map(products.map((product) => [product.id, product]));
  const orderItems = data.items.map((item) => {
    const product = productMap.get(item.productId);
    if (item.quantity > product.stock) {
      const error = new Error(`${product.name} has only ${product.stock} available.`);
      error.statusCode = 400;
      throw error;
    }
    const unitPrice = Number(product.salePrice || product.price);
    return {
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      productImage: product.images[0] || null,
      productPrice: unitPrice,
      quantity: item.quantity,
      total: unitPrice * item.quantity,
    };
  });

  const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
  let coupon = null;
  if (data.couponCode) {
    coupon = await prisma.coupon.findUnique({ where: { code: data.couponCode.toUpperCase() } });
    if (!coupon || !coupon.isActive || (coupon.expiresAt && coupon.expiresAt < new Date())) coupon = null;
  }

  const discount = calculateDiscount(coupon, subtotal);
  const total = Math.max(0, subtotal - discount);

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber: makeOrderNumber(),
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail || null,
        deliveryAddress: data.deliveryAddress,
        deliveryCity: data.deliveryCity || null,
        deliveryNote: data.deliveryNote || null,
        paymentMethod: data.paymentMethod,
        couponCode: coupon?.code || null,
        subtotal,
        discount,
        total,
        items: { create: orderItems },
      },
      include: { items: true },
    });

    await Promise.all(data.items.map((item) => tx.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    })));

    return created;
  });

  res.status(201).json({ order: formatOrder(order) });
}));

router.get('/', requireAdmin, asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: 'desc' } });
  res.json({ orders: orders.map(formatOrder) });
}));

router.get('/stats/summary', requireAdmin, asyncHandler(async (req, res) => {
  const [orders, products, pendingOrders, outOfStockProducts] = await Promise.all([
    prisma.order.findMany({ where: { status: { not: 'CANCELLED' } } }),
    prisma.product.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.product.count({ where: { stock: 0 } }),
  ]);

  const totalSales = orders.reduce((sum, order) => sum + Number(order.total), 0);
  res.json({ totalProducts: products, totalOrders: orders.length, pendingOrders, outOfStockProducts, totalSales });
}));

router.get('/:id', requireAdmin, asyncHandler(async (req, res) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.id }, include: { items: true } });
  if (!order) return res.status(404).json({ message: 'Order not found.' });
  res.json({ order: formatOrder(order) });
}));

router.put('/:id/status', requireAdmin, asyncHandler(async (req, res) => {
  const schema = z.object({ status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'DELIVERED', 'CANCELLED']) });
  const { status } = schema.parse(req.body);
  const order = await prisma.order.update({ where: { id: req.params.id }, data: { status }, include: { items: true } });
  res.json({ order: formatOrder(order) });
}));

module.exports = router;

const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { requireAdmin } = require('../middleware/auth');
const { formatOrder } = require('../utils/money');
const { calculateDiscount } = require('./coupons');

const router = express.Router();
const bankDetails = { bankName: 'Moniepoint', accountNumber: '5042844833', accountName: 'Roc Realm Nigeria Limited' };
const deliveryFees = { PICKUP: 0, OWERRI_DELIVERY: 3000, WAYBILL_PARK: 1000, OTHER_STATES_DISPATCH: 0 };

const orderSchema = z.object({
  customerName: z.string().trim().min(2).max(120),
  customerPhone: z.string().trim().min(7).max(30),
  customerEmail: z.string().email().optional().or(z.literal('')).nullable(),
  deliveryAddress: z.string().trim().min(5).max(500),
  deliveryCity: z.string().trim().max(120).optional().nullable(),
  deliveryNote: z.string().trim().max(500).optional().nullable(),
  deliveryMethod: z.enum(['PICKUP', 'OWERRI_DELIVERY', 'WAYBILL_PARK', 'OTHER_STATES_DISPATCH']).default('PICKUP'),
  paymentMethod: z.enum(['BANK_TRANSFER', 'PAY_ON_DELIVERY', 'WHATSAPP_CONFIRMATION']),
  couponCode: z.string().trim().max(50).optional().nullable(),
  source: z.string().trim().max(80).optional().nullable(),
  medium: z.string().trim().max(80).optional().nullable(),
  campaign: z.string().trim().max(160).optional().nullable(),
  items: z.array(z.object({ productId: z.string(), quantity: z.coerce.number().int().positive().max(100) })).min(1).max(50),
}).superRefine((data, ctx) => {
  const ids = data.items.map((item) => item.productId);
  if (new Set(ids).size !== ids.length) ctx.addIssue({ code: 'custom', path: ['items'], message: 'Duplicate products are not allowed.' });
});

const makeOrderNumber = () => `RRP-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 900 + 100)}`;

router.post('/', asyncHandler(async (req, res) => {
  const data = orderSchema.parse(req.body);
  const products = await prisma.product.findMany({ where: { id: { in: data.items.map((item) => item.productId) }, isActive: true } });
  if (products.length !== data.items.length) return res.status(400).json({ message: 'One or more products are unavailable.' });

  const productMap = new Map(products.map((product) => [product.id, product]));
  const orderItems = data.items.map((item) => {
    const product = productMap.get(item.productId);
    const unitPrice = Number(product.salePrice || product.price);
    return { productId: product.id, productName: product.name, productSlug: product.slug, productImage: product.images[0] || null, productPrice: unitPrice, quantity: item.quantity, total: unitPrice * item.quantity };
  });
  const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
  let coupon = null;
  if (data.couponCode) {
    coupon = await prisma.coupon.findUnique({ where: { code: data.couponCode.toUpperCase() } });
    if (!coupon || !coupon.isActive || (coupon.expiresAt && coupon.expiresAt < new Date())) coupon = null;
  }
  const discount = calculateDiscount(coupon, subtotal);
  const deliveryFee = deliveryFees[data.deliveryMethod] || 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  // Creating an unpaid order no longer consumes inventory. Inventory is deducted atomically when an admin confirms/fulfills it.
  const order = await prisma.order.create({
    data: {
      orderNumber: makeOrderNumber(), customerName: data.customerName, customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || null, deliveryAddress: data.deliveryAddress, deliveryCity: data.deliveryCity || null,
      deliveryNote: data.deliveryNote || null, deliveryMethod: data.deliveryMethod, deliveryFee, paymentMethod: data.paymentMethod,
      paymentStatus: 'UNPAID', couponCode: coupon?.code || null, bankName: bankDetails.bankName, accountNumber: bankDetails.accountNumber,
      accountName: bankDetails.accountName, source: data.source || null, medium: data.medium || null, campaign: data.campaign || null,
      subtotal, discount, total, items: { create: orderItems },
    }, include: { items: true },
  });
  res.status(201).json({ order: formatOrder(order) });
}));

router.get('/', requireAdmin, asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: 'desc' } });
  res.json({ orders: orders.map(formatOrder) });
}));

router.get('/stats/summary', requireAdmin, asyncHandler(async (req, res) => {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const [orders, products, pendingOrders, outOfStockProducts, todayOrders, monthOrders, orderItems, visitors, productList] = await Promise.all([
    prisma.order.findMany({ where: { status: { not: 'CANCELLED' } } }), prisma.product.count(), prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.product.count({ where: { stock: 0 } }), prisma.order.findMany({ where: { status: { not: 'CANCELLED' }, createdAt: { gte: today } } }),
    prisma.order.findMany({ where: { status: { not: 'CANCELLED' }, createdAt: { gte: monthStart } } }), prisma.orderItem.findMany(),
    prisma.visitorEvent.groupBy({ by: ['productSlug'], _count: { productSlug: true }, where: { productSlug: { not: null } } }),
    prisma.product.findMany({ select: { id: true, name: true, slug: true, costPrice: true } }),
  ]);
  const totalSales = orders.reduce((sum, order) => sum + Number(order.total), 0);
  const revenueToday = todayOrders.reduce((sum, order) => sum + Number(order.total), 0);
  const revenueThisMonth = monthOrders.reduce((sum, order) => sum + Number(order.total), 0);
  const averageOrderValue = orders.length ? totalSales / orders.length : 0;
  const costMap = new Map(productList.map((product) => [product.id, Number(product.costPrice || 0)]));
  const totalCost = orderItems.reduce((sum, item) => sum + ((costMap.get(item.productId) || 0) * item.quantity), 0);
  const grossProfit = totalSales - totalCost;
  const profitMargin = totalSales ? (grossProfit / totalSales) * 100 : 0;
  const bestSellingMap = new Map();
  orderItems.forEach((item) => { const key = item.productSlug || item.productName; const current = bestSellingMap.get(key) || { productName: item.productName, productSlug: item.productSlug, quantity: 0, revenue: 0, cost: 0, profit: 0 }; current.quantity += item.quantity; current.revenue += Number(item.total); current.cost += (costMap.get(item.productId) || 0) * item.quantity; current.profit = current.revenue - current.cost; bestSellingMap.set(key, current); });
  const productViewMap = new Map(visitors.map((item) => [item.productSlug, item._count.productSlug]));
  const bestSellingProducts = [...bestSellingMap.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 8);
  const viewedNotSelling = [...productViewMap.entries()].map(([slug, views]) => ({ slug, views, sold: bestSellingMap.get(slug)?.quantity || 0 })).filter((item) => item.views > 0 && item.sold === 0).sort((a, b) => b.views - a.views).slice(0, 8);
  const sourceRevenue = orders.reduce((acc, order) => { const source = order.source || 'Unknown'; acc[source] = (acc[source] || 0) + Number(order.total); return acc; }, {});
  const repeatCustomers = Object.values(orders.reduce((acc, order) => { const key = order.customerPhone.replace(/\D/g, ''); acc[key] ||= { name: order.customerName, phone: order.customerPhone, orders: 0, totalSpent: 0 }; acc[key].orders += 1; acc[key].totalSpent += Number(order.total); return acc; }, {})).filter((item) => item.orders > 1).sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 8);
  res.json({ totalProducts: products, totalOrders: orders.length, pendingOrders, outOfStockProducts, totalSales, revenueToday, revenueThisMonth, averageOrderValue, totalCost, grossProfit, profitMargin, bestSellingProducts, viewedNotSelling, sourceRevenue, repeatCustomers });
}));

router.get('/payment/bank-details', (req, res) => res.json({ bankDetails }));

router.get('/customers/summary', requireAdmin, asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: 'desc' } });
  const customers = Object.values(orders.reduce((acc, order) => { const key = order.customerPhone.replace(/\D/g, '') || order.customerPhone; acc[key] ||= { name: order.customerName, phone: order.customerPhone, email: order.customerEmail, totalOrders: 0, totalSpent: 0, lastOrderDate: order.createdAt, products: {} }; acc[key].totalOrders += 1; acc[key].totalSpent += Number(order.total); if (new Date(order.createdAt) > new Date(acc[key].lastOrderDate)) acc[key].lastOrderDate = order.createdAt; order.items.forEach((item) => { acc[key].products[item.productName] = (acc[key].products[item.productName] || 0) + item.quantity; }); return acc; }, {})).map((customer) => ({ ...customer, favoriteProduct: Object.entries(customer.products).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Not enough data', products: undefined })).sort((a, b) => b.totalSpent - a.totalSpent);
  res.json({ customers });
}));

router.get('/:id', requireAdmin, asyncHandler(async (req, res) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.id }, include: { items: true } });
  if (!order) return res.status(404).json({ message: 'Order not found.' });
  res.json({ order: formatOrder(order) });
}));

router.put('/:id/status', requireAdmin, asyncHandler(async (req, res) => {
  const { status } = z.object({ status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'DELIVERED', 'CANCELLED']) }).parse(req.body);
  const order = await prisma.$transaction(async (tx) => {
    const current = await tx.order.findUnique({ where: { id: req.params.id }, include: { items: true } });
    if (!current) { const error = new Error('Order not found.'); error.statusCode = 404; throw error; }
    if (current.status === status) return current;

    const fulfillmentStatus = ['CONFIRMED', 'PROCESSING', 'DELIVERED'];
    if (fulfillmentStatus.includes(status) && !current.stockDeductedAt) {
      if (current.paymentMethod !== 'PAY_ON_DELIVERY' && current.paymentStatus !== 'PAID') {
        const error = new Error('Payment must be confirmed before fulfilling this order.'); error.statusCode = 400; throw error;
      }
      for (const item of current.items) {
        const result = await tx.product.updateMany({ where: { id: item.productId, isActive: true, stock: { gte: item.quantity } }, data: { stock: { decrement: item.quantity } } });
        if (result.count !== 1) { const error = new Error(`${item.productName} does not have enough stock.`); error.statusCode = 409; throw error; }
      }
      return tx.order.update({ where: { id: current.id }, data: { status, stockDeductedAt: new Date() }, include: { items: true } });
    }
    return tx.order.update({ where: { id: current.id }, data: { status }, include: { items: true } });
  });
  res.json({ order: formatOrder(order) });
}));

router.put('/:id/payment-reported', asyncHandler(async (req, res) => {
  const token = req.headers['x-order-action-token'];
  if (!token || token.length < 24) return res.status(401).json({ message: 'Order action token required.' });
  const order = await prisma.order.findFirst({ where: { id: req.params.id, orderNumber: token }, include: { items: true } });
  if (!order) return res.status(404).json({ message: 'Order not found.' });
  const updated = await prisma.order.update({ where: { id: order.id }, data: { paymentStatus: 'PAYMENT_REPORTED', paymentReportedAt: new Date() }, include: { items: true } });
  res.json({ order: formatOrder(updated) });
}));

router.put('/:id/payment-status', requireAdmin, asyncHandler(async (req, res) => {
  const { paymentStatus } = z.object({ paymentStatus: z.enum(['UNPAID', 'PAYMENT_REPORTED', 'PAID']) }).parse(req.body);
  const order = await prisma.order.update({ where: { id: req.params.id }, data: { paymentStatus, paidAt: paymentStatus === 'PAID' ? new Date() : null }, include: { items: true } });
  res.json({ order: formatOrder(order) });
}));

router.put('/:id/manual-discount', requireAdmin, asyncHandler(async (req, res) => {
  const { manualDiscount, discountReason } = z.object({ manualDiscount: z.coerce.number().min(0), discountReason: z.string().max(300).optional().nullable() }).parse(req.body);
  const current = await prisma.order.findUnique({ where: { id: req.params.id }, include: { items: true } });
  if (!current) return res.status(404).json({ message: 'Order not found.' });
  const total = Math.max(0, Number(current.subtotal) - Number(current.discount) - manualDiscount + Number(current.deliveryFee || 0));
  const order = await prisma.order.update({ where: { id: req.params.id }, data: { manualDiscount, discountReason: discountReason || null, total }, include: { items: true } });
  res.json({ order: formatOrder(order) });
}));

module.exports = router;

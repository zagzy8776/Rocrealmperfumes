const crypto = require('crypto');
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
  customerName: z.string().trim().min(2).max(120), customerPhone: z.string().trim().min(7).max(30),
  customerEmail: z.string().email().optional().or(z.literal('')).nullable(), deliveryAddress: z.string().trim().min(5).max(500),
  deliveryCity: z.string().trim().max(120).optional().nullable(), deliveryNote: z.string().trim().max(500).optional().nullable(),
  deliveryMethod: z.enum(['PICKUP','OWERRI_DELIVERY','WAYBILL_PARK','OTHER_STATES_DISPATCH']).default('PICKUP'),
  paymentMethod: z.enum(['BANK_TRANSFER','PAY_ON_DELIVERY','WHATSAPP_CONFIRMATION']), couponCode: z.string().trim().max(50).optional().nullable(),
  source: z.string().trim().max(80).optional().nullable(), medium: z.string().trim().max(80).optional().nullable(), campaign: z.string().trim().max(160).optional().nullable(),
  items: z.array(z.object({ productId: z.string(), quantity: z.coerce.number().int().positive().max(100) })).min(1).max(50),
}).superRefine((data, ctx) => { if (new Set(data.items.map((item) => item.productId)).size !== data.items.length) ctx.addIssue({ code:'custom', path:['items'], message:'Duplicate products are not allowed.' }); });
const makeOrderNumber = () => `RRP-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 900 + 100)}`;
const makeCustomerActionToken = () => crypto.randomBytes(32).toString('hex');

router.post('/', asyncHandler(async (req, res) => {
  const data = orderSchema.parse(req.body);
  const products = await prisma.product.findMany({ where: { id: { in: data.items.map((item) => item.productId) }, isActive: true } });
  if (products.length !== data.items.length) return res.status(400).json({ message: 'One or more products are unavailable.' });
  const productMap = new Map(products.map((product) => [product.id, product]));
  const orderItems = data.items.map((item) => { const product = productMap.get(item.productId); const unitPrice = Number(product.salePrice || product.price); return { productId: product.id, productName: product.name, productSlug: product.slug, productImage: product.images[0] || null, productPrice: unitPrice, quantity: item.quantity, total: unitPrice * item.quantity }; });
  const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
  let coupon = null;
  if (data.couponCode) { coupon = await prisma.coupon.findUnique({ where: { code: data.couponCode.toUpperCase() } }); if (!coupon || !coupon.isActive || (coupon.expiresAt && coupon.expiresAt < new Date())) coupon = null; }
  const discount = calculateDiscount(coupon, subtotal); const deliveryFee = deliveryFees[data.deliveryMethod] || 0; const total = Math.max(0, subtotal - discount + deliveryFee);
  const order = await prisma.order.create({ data: {
    orderNumber: makeOrderNumber(), customerActionToken: makeCustomerActionToken(), customerName: data.customerName, customerPhone: data.customerPhone,
    customerEmail: data.customerEmail || null, deliveryAddress: data.deliveryAddress, deliveryCity: data.deliveryCity || null, deliveryNote: data.deliveryNote || null,
    deliveryMethod: data.deliveryMethod, deliveryFee, paymentMethod: data.paymentMethod, paymentStatus: 'UNPAID', couponCode: coupon?.code || null,
    bankName: bankDetails.bankName, accountNumber: bankDetails.accountNumber, accountName: bankDetails.accountName, source: data.source || null, medium: data.medium || null,
    campaign: data.campaign || null, subtotal, discount, total, items: { create: orderItems },
  }, include: { items: true } });
  res.status(201).json({ order: formatOrder(order), customerActionToken: order.customerActionToken });
}));

router.get('/', requireAdmin, asyncHandler(async (req,res)=>{ const orders=await prisma.order.findMany({include:{items:true},orderBy:{createdAt:'desc'}}); res.json({orders:orders.map(formatOrder)}); }));
router.get('/stats/summary', requireAdmin, asyncHandler(async (req,res)=>{
  const today=new Date(); today.setHours(0,0,0,0); const monthStart=new Date(today.getFullYear(),today.getMonth(),1);
  const [orders,products,pendingOrders,outOfStockProducts,todayOrders,monthOrders,orderItems,visitors,productList]=await Promise.all([
    prisma.order.findMany({where:{status:{not:'CANCELLED'}}}),prisma.product.count(),prisma.order.count({where:{status:'PENDING'}}),prisma.product.count({where:{stock:0}}),
    prisma.order.findMany({where:{status:{not:'CANCELLED'},createdAt:{gte:today}}}),prisma.order.findMany({where:{status:{not:'CANCELLED'},createdAt:{gte:monthStart}}}),prisma.orderItem.findMany(),
    prisma.visitorEvent.groupBy({by:['productSlug'],_count:{productSlug:true},where:{productSlug:{not:null}}}),prisma.product.findMany({select:{id:true,name:true,slug:true,costPrice:true}}),
  ]);
  const totalSales=orders.reduce((s,o)=>s+Number(o.total),0),revenueToday=todayOrders.reduce((s,o)=>s+Number(o.total),0),revenueThisMonth=monthOrders.reduce((s,o)=>s+Number(o.total),0),averageOrderValue=orders.length?totalSales/orders.length:0;
  const costMap=new Map(productList.map(p=>[p.id,Number(p.costPrice||0)])); const totalCost=orderItems.reduce((s,i)=>s+(costMap.get(i.productId)||0)*i.quantity,0); const grossProfit=totalSales-totalCost; const profitMargin=totalSales?(grossProfit/totalSales)*100:0;
  const bestSellingMap=new Map(); orderItems.forEach(i=>{const k=i.productSlug||i.productName;const c=bestSellingMap.get(k)||{productName:i.productName,productSlug:i.productSlug,quantity:0,revenue:0,cost:0,profit:0};c.quantity+=i.quantity;c.revenue+=Number(i.total);c.cost+=(costMap.get(i.productId)||0)*i.quantity;c.profit=c.revenue-c.cost;bestSellingMap.set(k,c);});
  const productViewMap=new Map(visitors.map(i=>[i.productSlug,i._count.productSlug])); const bestSellingProducts=[...bestSellingMap.values()].sort((a,b)=>b.quantity-a.quantity).slice(0,8); const viewedNotSelling=[...productViewMap.entries()].map(([slug,views])=>({slug,views,sold:bestSellingMap.get(slug)?.quantity||0})).filter(i=>i.views>0&&i.sold===0).sort((a,b)=>b.views-a.views).slice(0,8);
  const sourceRevenue=orders.reduce((a,o)=>{const source=o.source||'Unknown';a[source]=(a[source]||0)+Number(o.total);return a;},{}); const repeatCustomers=Object.values(orders.reduce((a,o)=>{const k=o.customerPhone.replace(/\D/g,'');a[k] ||= {name:o.customerName,phone:o.customerPhone,orders:0,totalSpent:0};a[k].orders+=1;a[k].totalSpent+=Number(o.total);return a;},{})).filter(i=>i.orders>1).sort((a,b)=>b.totalSpent-a.totalSpent).slice(0,8);
  res.json({totalProducts:products,totalOrders:orders.length,pendingOrders,outOfStockProducts,totalSales,revenueToday,revenueThisMonth,averageOrderValue,totalCost,grossProfit,profitMargin,bestSellingProducts,viewedNotSelling,sourceRevenue,repeatCustomers});
}));
router.get('/payment/bank-details',(req,res)=>res.json({bankDetails}));
router.get('/customers/summary',requireAdmin,asyncHandler(async(req,res)=>{const orders=await prisma.order.findMany({include:{items:true},orderBy:{createdAt:'desc'}});const customers=Object.values(orders.reduce((a,o)=>{const k=o.customerPhone.replace(/\D/g,'')||o.customerPhone;a[k] ||= {name:o.customerName,phone:o.customerPhone,email:o.customerEmail,totalOrders:0,totalSpent:0,lastOrderDate:o.createdAt,products:{}};a[k].totalOrders+=1;a[k].totalSpent+=Number(o.total);if(new Date(o.createdAt)>new Date(a[k].lastOrderDate))a[k].lastOrderDate=o.createdAt;o.items.forEach(i=>{a[k].products[i.productName]=(a[k].products[i.productName]||0)+i.quantity;});return a;},{})).map(c=>({...c,favoriteProduct:Object.entries(c.products).sort((a,b)=>b[1]-a[1])[0]?.[0]||'Not enough data',products:undefined})).sort((a,b)=>b.totalSpent-a.totalSpent);res.json({customers});}));
router.get('/:id',requireAdmin,asyncHandler(async(req,res)=>{const order=await prisma.order.findUnique({where:{id:req.params.id},include:{items:true}});if(!order)return res.status(404).json({message:'Order not found.'});res.json({order:formatOrder(order)});}));
router.put('/:id/status',requireAdmin,asyncHandler(async(req,res)=>{const {status}=z.object({status:z.enum(['PENDING','CONFIRMED','PROCESSING','DELIVERED','CANCELLED'])}).parse(req.body);const order=await prisma.$transaction(async tx=>{const current=await tx.order.findUnique({where:{id:req.params.id},include:{items:true}});if(!current){const e=new Error('Order not found.');e.statusCode=404;throw e;}if(current.status===status)return current;const fulfillment=['CONFIRMED','PROCESSING','DELIVERED'];if(fulfillment.includes(status)&&!current.stockDeductedAt){if(current.paymentMethod!=='PAY_ON_DELIVERY'&&current.paymentStatus!=='PAID'){const e=new Error('Payment must be confirmed before fulfilling this order.');e.statusCode=400;throw e;}for(const item of current.items){const result=await tx.product.updateMany({where:{id:item.productId,isActive:true,stock:{gte:item.quantity}},data:{stock:{decrement:item.quantity}}});if(result.count!==1){const e=new Error(`${item.productName} does not have enough stock.`);e.statusCode=409;throw e;}}return tx.order.update({where:{id:current.id},data:{status,stockDeductedAt:new Date()},include:{items:true}});}return tx.order.update({where:{id:current.id},data:{status},include:{items:true}});});res.json({order:formatOrder(order)});}));
router.put('/:id/payment-reported',asyncHandler(async(req,res)=>{const token=req.headers['x-order-action-token'];if(!token||token.length!==64)return res.status(401).json({message:'Order action token required.'});const order=await prisma.order.findFirst({where:{id:req.params.id,customerActionToken:token},include:{items:true}});if(!order)return res.status(404).json({message:'Order not found.'});const updated=await prisma.order.update({where:{id:order.id},data:{paymentStatus:'PAYMENT_REPORTED',paymentReportedAt:new Date()},include:{items:true}});res.json({order:formatOrder(updated)});}));
router.put('/:id/payment-status',requireAdmin,asyncHandler(async(req,res)=>{const {paymentStatus}=z.object({paymentStatus:z.enum(['UNPAID','PAYMENT_REPORTED','PAID'])}).parse(req.body);const order=await prisma.order.update({where:{id:req.params.id},data:{paymentStatus,paidAt:paymentStatus==='PAID'?new Date():null},include:{items:true}});res.json({order:formatOrder(order)});}));
router.put('/:id/manual-discount',requireAdmin,asyncHandler(async(req,res)=>{const {manualDiscount,discountReason}=z.object({manualDiscount:z.coerce.number().min(0),discountReason:z.string().max(300).optional().nullable()}).parse(req.body);const current=await prisma.order.findUnique({where:{id:req.params.id},include:{items:true}});if(!current)return res.status(404).json({message:'Order not found.'});const total=Math.max(0,Number(current.subtotal)-Number(current.discount)-manualDiscount+Number(current.deliveryFee||0));const order=await prisma.order.update({where:{id:req.params.id},data:{manualDiscount,discountReason:discountReason||null,total},include:{items:true}});res.json({order:formatOrder(order)});}));
module.exports=router;

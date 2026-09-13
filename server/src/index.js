require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const couponRoutes = require('./routes/coupons');
const galleryRoutes = require('./routes/gallery');
const analyticsRoutes = require('./routes/analytics');
const testimonialRoutes = require('./routes/testimonials');
const promoRoutes = require('./routes/promos');
const stockAlertRoutes = require('./routes/stockAlerts');
const prisma = require('./lib/prisma');
const { requireAdmin } = require('./middleware/auth');

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((origin) => origin.trim()).filter(Boolean)
  : ['http://localhost:5173'];

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(compression());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }));
app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => res.json({ name: 'Roc Realm Perfume API', status: 'healthy' }));
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'database_unavailable' });
  }
});

app.get('/api/db/status', requireAdmin, async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const [productCount, adminCount, categoryCount] = await Promise.all([
      prisma.product.count(), prisma.admin.count(), prisma.category.count(),
    ]);
    res.json({ status: 'connected', productCount, adminCount, categoryCount });
  } catch (error) {
    console.error('Database status error:', error);
    res.status(500).json({ status: 'database_error' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/promos', promoRoutes);
app.use('/api/stock-alerts', stockAlertRoutes);

app.use((req, res) => res.status(404).json({ message: 'Route not found.' }));
app.use((error, req, res, next) => {
  console.error(error);
  if (error.name === 'ZodError') return res.status(400).json({ message: 'Validation error.', errors: error.issues });
  if (error.statusCode) return res.status(error.statusCode).json({ message: error.message });
  if (error.code === 'P2002') return res.status(409).json({ message: 'A record with this value already exists.' });
  if (error.code === 'P2025') return res.status(404).json({ message: 'Record not found.' });
  if (error.code === 'P2021') return res.status(500).json({ message: 'Database tables are missing.' });
  if (error.code === 'P1001') return res.status(503).json({ message: 'Database server cannot be reached.' });
  if (error.name === 'PrismaClientInitializationError') return res.status(500).json({ message: 'Database configuration is invalid.' });
  if (error.code === 'CLOUDINARY_NOT_CONFIGURED') return res.status(500).json({ message: 'Image upload is not configured.' });
  if (error.http_code) return res.status(500).json({ message: 'Image upload failed.' });
  res.status(500).json({ message: 'Something went wrong.' });
});

app.listen(port, () => console.log(`Roc Realm Perfume API running on port ${port}`));

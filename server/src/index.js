require('dotenv').config();

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const couponRoutes = require('./routes/coupons');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : ['http://localhost:5173'],
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => {
  res.json({ name: 'Roc Realm Perfume API', status: 'healthy' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

app.use((error, req, res, next) => {
  console.error(error);

  if (error.name === 'ZodError') {
    return res.status(400).json({ message: 'Validation error.', errors: error.issues });
  }

  if (error.code === 'P2002') {
    return res.status(409).json({ message: 'A record with this value already exists.' });
  }

  if (error.code === 'P2025') {
    return res.status(404).json({ message: 'Record not found.' });
  }

  res.status(500).json({ message: 'Something went wrong.' });
});

app.listen(port, () => {
  console.log(`Roc Realm Perfume API running on port ${port}`);
});

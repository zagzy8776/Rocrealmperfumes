const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();
const COOKIE_NAME = 'rrp_admin_token';
const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post('/login', asyncHandler(async (req, res) => {
  const data = loginSchema.parse(req.body);
  const admin = await prisma.admin.findUnique({ where: { email: data.email.toLowerCase() } });
  if (!admin) return res.status(401).json({ message: 'Invalid email or password.' });

  const isMatch = await bcrypt.compare(data.password, admin.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid email or password.' });

  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    return res.status(500).json({ message: 'Authentication is not configured securely.' });
  }

  const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie(COOKIE_NAME, token, cookieOptions());
  res.json({ admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } });
}));

router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' });
  res.status(204).end();
});

router.get('/me', requireAdmin, (req, res) => {
  res.json({ admin: req.admin });
});

module.exports = router;

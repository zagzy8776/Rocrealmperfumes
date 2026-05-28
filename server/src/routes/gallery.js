const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 6 * 1024 * 1024 },
  fileFilter(req, file, callback) {
    if (!file.mimetype.startsWith('image/')) return callback(new Error('Only image files are allowed.'));
    callback(null, true);
  },
});

const hasCloudinary = Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const serializeImage = (image) => image;

const uploadToCloudinary = (file) => new Promise((resolve, reject) => {
  if (!hasCloudinary) return reject(new Error('Cloudinary is not configured on the server.'));

  const stream = cloudinary.uploader.upload_stream(
    { folder: 'roc-realm-gallery', resource_type: 'image' },
    (error, result) => {
      if (error) return reject(error);
      resolve(result);
    }
  );

  stream.end(file.buffer);
});

router.get('/', asyncHandler(async (req, res) => {
  const includeInactive = req.query.active === 'false';
  const images = await prisma.galleryImage.findMany({
    where: { isActive: includeInactive ? undefined : true },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
  });
  res.json({ images: images.map(serializeImage) });
}));

router.get('/admin/all', requireAdmin, asyncHandler(async (req, res) => {
  const images = await prisma.galleryImage.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ images: images.map(serializeImage) });
}));

router.post('/', requireAdmin, upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Please choose an image to upload.' });
  const result = await uploadToCloudinary(req.file);

  const image = await prisma.galleryImage.create({
    data: {
      title: req.body.title || null,
      caption: req.body.caption || null,
      imageUrl: result.secure_url,
      publicId: result.public_id,
      isFeatured: req.body.isFeatured === 'true',
      isActive: req.body.isActive !== 'false',
    },
  });

  res.status(201).json({ image: serializeImage(image) });
}));

router.post('/url', requireAdmin, asyncHandler(async (req, res) => {
  const schema = z.object({
    title: z.string().optional().nullable(),
    caption: z.string().optional().nullable(),
    imageUrl: z.string().url(),
    isFeatured: z.boolean().default(false),
    isActive: z.boolean().default(true),
  });
  const data = schema.parse(req.body);
  const image = await prisma.galleryImage.create({ data });
  res.status(201).json({ image: serializeImage(image) });
}));

router.put('/:id', requireAdmin, asyncHandler(async (req, res) => {
  const schema = z.object({
    title: z.string().optional().nullable(),
    caption: z.string().optional().nullable(),
    isFeatured: z.boolean(),
    isActive: z.boolean(),
  });
  const data = schema.parse(req.body);
  const image = await prisma.galleryImage.update({ where: { id: req.params.id }, data });
  res.json({ image: serializeImage(image) });
}));

router.delete('/:id', requireAdmin, asyncHandler(async (req, res) => {
  const image = await prisma.galleryImage.findUnique({ where: { id: req.params.id } });
  if (!image) return res.status(404).json({ message: 'Gallery image not found.' });

  if (image.publicId && hasCloudinary) {
    await cloudinary.uploader.destroy(image.publicId).catch(() => null);
  }

  await prisma.galleryImage.delete({ where: { id: req.params.id } });
  res.json({ message: 'Gallery image deleted.' });
}));

module.exports = router;

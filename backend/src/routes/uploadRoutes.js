const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const authMiddleware = require('../middleware/authMiddleware');
const { uploadBikeImage } = require('../controllers/uploadController');

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const originalName = file.originalname || 'bike-image';
    const format =
      originalName.includes('.')
        ? originalName.split('.').pop().toLowerCase()
        : undefined;

    return {
      folder: 'mra-bikes',
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
      format
    };
  }
});

const upload = multer({ storage });

router.post(
  '/bike-image',
  authMiddleware,
  upload.single('image'),
  uploadBikeImage
);

module.exports = router;

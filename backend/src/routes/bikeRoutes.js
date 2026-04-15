const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const authMiddleware = require('../middleware/authMiddleware');
const controller = require('../controllers/bikeController');

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

router.use(authMiddleware);

router.get('/', controller.getBikes);
router.get('/:id', controller.getBike);
router.post('/', upload.array('images', 10), controller.createBike);
router.put('/:id', controller.updateBike);
router.delete('/:id', controller.deleteBike);

module.exports = router;

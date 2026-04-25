const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const authMiddleware = require('../middleware/authMiddleware');
const controller = require('../controllers/photoStickerController');

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: 'mra-fotostickers',
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`
  })
});

const upload = multer({ storage });

router.use(authMiddleware);

router.get('/', controller.getStickers);
router.post('/', upload.single('image'), controller.createSticker);
router.put('/:id/toggle', controller.toggleSticker);
router.delete('/:id', controller.deleteSticker);

module.exports = router;

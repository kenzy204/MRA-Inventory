const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/authMiddleware');
const controller = require('../controllers/bikeController');

const router = express.Router();

const uploadsDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
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

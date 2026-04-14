const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const controller = require('../controllers/settingsController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', controller.getSettings);
router.put('/', controller.updateSettings);

module.exports = router;
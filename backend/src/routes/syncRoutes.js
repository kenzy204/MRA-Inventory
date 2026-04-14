const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const controller = require('../controllers/syncController');

const router = express.Router();

router.use(authMiddleware);

router.post('/:bikeId', controller.manualSync);
router.get('/logs/all', controller.getSyncLogs);

module.exports = router;
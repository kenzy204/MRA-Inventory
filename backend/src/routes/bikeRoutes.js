const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const controller = require('../controllers/bikeController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', controller.getBikes);
router.get('/:id', controller.getBike);
router.post('/', controller.createBike);
router.put('/:id', controller.updateBike);
router.delete('/:id', controller.deleteBike);

module.exports = router;
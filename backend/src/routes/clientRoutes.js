const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const controller = require('../controllers/clientController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', controller.getClients);
router.get('/:id', controller.getClient);
router.post('/', controller.createClient);
router.put('/:id', controller.updateClient);
router.delete('/:id', controller.deleteClient);

module.exports = router;

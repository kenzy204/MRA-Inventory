const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const controller = require('../controllers/mraCenterController');

const router = express.Router();

router.use(authMiddleware);

//
// PROFILE
//
router.get('/profile', controller.getProfile);
router.put('/profile', controller.updateProfile);

//
// LOCATIONS
//
router.get('/locations', controller.getLocations);
router.post('/locations', controller.createLocation);
router.put('/locations/:id', controller.updateLocation);
router.delete('/locations/:id', controller.deleteLocation);

//
// OPENING HOURS
//
router.get('/opening-hours/:locationId', controller.getOpeningHours);
router.put('/opening-hours/:locationId', controller.updateOpeningHours);

module.exports = router;

const bikeService = require('../services/bikeService');
const syncService = require('../services/syncService');

async function getBikes(req, res) {
  try {
    const bikes = await bikeService.getAllBikes();
    res.json(bikes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getBike(req, res) {
  try {
    const bike = await bikeService.getBikeById(req.params.id);
    if (!bike) return res.status(404).json({ message: 'Bike not found' });
    res.json(bike);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


async function createBike(req, res) {
  try {
    const id = await bikeService.createBike(req.body);

    let syncErrorMessage = null;

    try {
      await syncService.syncBike(id, 'create');
    } catch (syncError) {
      console.error('Shopify sync failed on create:', syncError.message);
      syncErrorMessage = syncError.message;
    }

    const bike = await bikeService.getBikeById(id);

    res.status(201).json({
      bike,
      shopifySync: syncErrorMessage
        ? { success: false, message: syncErrorMessage }
        : { success: true }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateBike(req, res) {
  try {
    await bikeService.updateBike(req.params.id, req.body);

    let syncErrorMessage = null;

    try {
      await syncService.syncBike(req.params.id, 'update');
    } catch (syncError) {
      console.error('Shopify sync failed on update:', syncError.message);
      syncErrorMessage = syncError.message;
    }

    const bike = await bikeService.getBikeById(req.params.id);

    res.json({
      bike,
      shopifySync: syncErrorMessage
        ? { success: false, message: syncErrorMessage }
        : { success: true }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteBike(req, res) {
  try {
    await bikeService.softDeleteBike(req.params.id);

    let syncErrorMessage = null;

    try {
      await syncService.syncBike(req.params.id, 'delete');
    } catch (syncError) {
      console.error('Shopify sync failed on delete:', syncError.message);
      syncErrorMessage = syncError.message;
    }

    res.json({
      success: true,
      shopifySync: syncErrorMessage
        ? { success: false, message: syncErrorMessage }
        : { success: true }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getBikes,
  getBike,
  createBike,
  updateBike,
  deleteBike
};

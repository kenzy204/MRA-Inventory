const bikeService = require('../services/bikeService');
const syncService = require('../services/syncService');

async function uploadBikeImage(req, res) {
  try {
    const bikeId = Number(req.body.bikeId);

    if (!Number.isInteger(bikeId) || bikeId <= 0) {
      return res.status(400).json({ message: 'Invalid bikeId' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageUrl = req.file.path;

    await bikeService.addBikeImage(bikeId, imageUrl);

    try {
      await syncService.syncNewImagesOnly(bikeId);
    } catch (syncError) {
      console.error('Shopify image append failed:', syncError.message);
    }

    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  uploadBikeImage
};

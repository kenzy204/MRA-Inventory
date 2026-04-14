const bikeService = require('../services/bikeService');
const syncService = require('../services/syncService');

async function uploadBikeImage(req, res) {
  try {
    const bikeId = Number(req.body.bikeId);
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageUrl = `${process.env.PUBLIC_BACKEND_URL}/uploads/${req.file.filename}`;

    await bikeService.addBikeImage(bikeId, imageUrl);

    try {
      await syncService.syncBike(bikeId, 'update');
    } catch (syncError) {
      console.error('Shopify sync failed after image upload:', syncError.message);
    }

    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  uploadBikeImage
};

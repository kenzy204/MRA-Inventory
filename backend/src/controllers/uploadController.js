const bikeService = require('../services/bikeService');
const syncService = require('../services/syncService');

async function uploadBikeImage(req, res) {
  try {
    const bikeId = Number(req.body.bikeId);

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!process.env.PUBLIC_BACKEND_URL) {
      return res.status(500).json({ message: 'PUBLIC_BACKEND_URL is missing' });
    }

    const imageUrl = `${String(process.env.PUBLIC_BACKEND_URL).replace(/\/+$/, '')}/uploads/${req.file.filename}`;

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

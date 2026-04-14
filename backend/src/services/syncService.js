const { getPool } = require('../config/db');
const bikeService = require('./bikeService');
const {
  upsertProductWithProductSet,
  appendImagesToExistingProduct,
  archiveProduct,
  getPublications,
  filterTargetPublications,
  publishProductToPublications
} = require('./shopifyService');

async function createLog(bikeId, actionType, syncStatus, message) {
  const pool = await getPool();

  await pool.query(
    `
      INSERT INTO sync_logs (bike_id, action_type, sync_status, message)
      VALUES ($1, $2, $3, $4)
    `,
    [
      bikeId || null,
      actionType,
      syncStatus,
      message || null
    ]
  );
}

async function ensurePublicBackendUrlForImages(bike) {
  if (Array.isArray(bike.images) && bike.images.length > 0 && !process.env.PUBLIC_BACKEND_URL) {
    throw new Error('PUBLIC_BACKEND_URL is required to sync bike images to Shopify');
  }
}

async function syncBike(bikeId, actionType = 'update') {
  const numericBikeId = Number(bikeId);
  const bike = await bikeService.getBikeById(numericBikeId);

  try {
    if (!bike) {
      throw new Error('Bike not found');
    }

    if (actionType === 'delete') {
      if (bike.shopify_product_id) {
        await archiveProduct(bike.shopify_product_id);
      }

      await bikeService.updateSyncData(numericBikeId, { sync_status: 'success' });
      await createLog(numericBikeId, 'delete', 'success', 'Bike archived in Shopify');
      return;
    }

    await ensurePublicBackendUrlForImages(bike);

    const result = await upsertProductWithProductSet(bike);

    const publications = await getPublications();
    const targetPublications = filterTargetPublications(publications);

    await publishProductToPublications(
      result.productId,
      targetPublications.map((p) => p.id)
    );

    await bikeService.updateSyncData(numericBikeId, {
      shopify_product_id: result.productId,
      shopify_variant_id: result.variantId,
      shopify_inventory_item_id: result.inventoryItemId,
      sync_status: 'success'
    });

    const syncedImageCount = Array.isArray(result.media) ? result.media.length : 0;

    await createLog(
      numericBikeId,
      actionType,
      'success',
      `Bike synced with Shopify using productSet${syncedImageCount ? ` (${syncedImageCount} image(s))` : ''}`
    );
  } catch (error) {
    await bikeService.updateSyncData(numericBikeId, { sync_status: 'error' });
    await createLog(numericBikeId, actionType, 'error', error.message);
    throw error;
  }
}

async function syncNewImagesOnly(bikeId) {
  const numericBikeId = Number(bikeId);
  const bike = await bikeService.getBikeById(numericBikeId);

  try {
    if (!bike) {
      throw new Error('Bike not found');
    }

    if (!bike.shopify_product_id) {
      throw new Error('Bike is not linked to a Shopify product yet');
    }

    await ensurePublicBackendUrlForImages(bike);

    const result = await appendImagesToExistingProduct(
      bike.shopify_product_id,
      bike,
      bike.images || []
    );

    await bikeService.updateSyncData(numericBikeId, {
      sync_status: 'success'
    });

    const syncedImageCount = Array.isArray(result.media) ? result.media.length : 0;

    await createLog(
      numericBikeId,
      'append-images',
      'success',
      `Images appended to Shopify product${syncedImageCount ? ` (${syncedImageCount} media item(s) returned)` : ''}`
    );

    return result;
  } catch (error) {
    await bikeService.updateSyncData(numericBikeId, { sync_status: 'error' });
    await createLog(numericBikeId, 'append-images', 'error', error.message);
    throw error;
  }
}

module.exports = {
  syncBike,
  syncNewImagesOnly,
  createLog
};

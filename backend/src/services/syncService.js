
// const { getPool, sql } = require('../config/db');
// const bikeService = require('./bikeService');
// const { upsertProductWithProductSet, archiveProduct } = require('./shopifyService');

// async function createLog(bikeId, actionType, syncStatus, message) {
//   const pool = await getPool();

//   await pool.request()
//     .input('bike_id', sql.Int, bikeId || null)
//     .input('action_type', sql.NVarChar, actionType)
//     .input('sync_status', sql.NVarChar, syncStatus)
//     .input('message', sql.NVarChar(sql.MAX), message || null)
//     .query(`
//       INSERT INTO sync_logs (bike_id, action_type, sync_status, message)
//       VALUES (@bike_id, @action_type, @sync_status, @message)
//     `);
// }

// async function syncBike(bikeId, actionType) {
//   const bike = await bikeService.getBikeById(Number(bikeId));

//   try {
//     if (!bike) {
//       throw new Error('Bike not found');
//     }

//     if (actionType === 'delete') {
//       if (bike.shopify_product_id) {
//         await archiveProduct(bike.shopify_product_id);
//       }

//       await bikeService.updateSyncData(bikeId, { sync_status: 'success' });
//       await createLog(bikeId, 'delete', 'success', 'Bike archived in Shopify');
//       return;
//     }

//     const result = await upsertProductWithProductSet(bike);

//     await bikeService.updateSyncData(bikeId, {
//       shopify_product_id: result.productId,
//       shopify_variant_id: result.variantId,
//       shopify_inventory_item_id: result.inventoryItemId,
//       sync_status: 'success'
//     });

//     await createLog(bikeId, actionType, 'success', 'Bike synced with Shopify using productSet');
//   } catch (error) {
//     await bikeService.updateSyncData(bikeId, { sync_status: 'error' });
//     await createLog(bikeId, actionType, 'error', error.message);
//     throw error;
//   }
// }

// module.exports = {
//   syncBike,
//   createLog
// };
///=================================================================================

// const { getPool, sql } = require('../config/db');
// const bikeService = require('./bikeService');
// const {
//   upsertProductWithProductSet,
//   archiveProduct,
//   getPublications,
//   filterTargetPublications,
//   publishProductToPublications
// } = require('./shopifyService');

// async function createLog(bikeId, actionType, syncStatus, message) {
//   const pool = await getPool();

//   await pool.request()
//     .input('bike_id', sql.Int, bikeId || null)
//     .input('action_type', sql.NVarChar, actionType)
//     .input('sync_status', sql.NVarChar, syncStatus)
//     .input('message', sql.NVarChar(sql.MAX), message || null)
//     .query(`
//       INSERT INTO sync_logs (bike_id, action_type, sync_status, message)
//       VALUES (@bike_id, @action_type, @sync_status, @message)
//     `);
// }

// async function syncBike(bikeId, actionType) {
//   const numericBikeId = Number(bikeId);
//   const bike = await bikeService.getBikeById(numericBikeId);

//   try {
//     if (!bike) {
//       throw new Error('Bike not found');
//     }

//     if (actionType === 'delete') {
//       if (bike.shopify_product_id) {
//         await archiveProduct(bike.shopify_product_id);
//       }

//       await bikeService.updateSyncData(numericBikeId, { sync_status: 'success' });
//       await createLog(numericBikeId, 'delete', 'success', 'Bike archived in Shopify');
//       return;
//     }

//     if (Array.isArray(bike.images) && bike.images.length > 0 && !process.env.PUBLIC_BACKEND_URL) {
//       throw new Error('PUBLIC_BACKEND_URL is required to sync bike images to Shopify');
//     }

//     const result = await upsertProductWithProductSet(bike);

//     const publications = await getPublications();
//     const targetPublications = filterTargetPublications(publications);

//     await publishProductToPublications(
//       result.productId,
//       targetPublications.map((p) => p.id)
//     );

//     await bikeService.updateSyncData(numericBikeId, {
//       shopify_product_id: result.productId,
//       shopify_variant_id: result.variantId,
//       shopify_inventory_item_id: result.inventoryItemId,
//       sync_status: 'success'
//     });

//     const syncedImageCount = Array.isArray(result.media) ? result.media.length : 0;

//     await createLog(
//       numericBikeId,
//       actionType,
//       'success',
//       `Bike synced with Shopify using productSet${syncedImageCount ? ` (${syncedImageCount} image(s))` : ''}`
//     );
//   } catch (error) {
//     await bikeService.updateSyncData(numericBikeId, { sync_status: 'error' });
//     await createLog(numericBikeId, actionType, 'error', error.message);
//     throw error;
//   }
// }

// module.exports = {
//   syncBike,
//   createLog
// };

const { getPool } = require('../config/db');
const bikeService = require('./bikeService');
const {
  upsertProductWithProductSet,
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

async function syncBike(bikeId, actionType) {
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

    if (Array.isArray(bike.images) && bike.images.length > 0 && !process.env.PUBLIC_BACKEND_URL) {
      throw new Error('PUBLIC_BACKEND_URL is required to sync bike images to Shopify');
    }

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

module.exports = {
  syncBike,
  createLog
};
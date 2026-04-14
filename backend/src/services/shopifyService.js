
// const axios = require('axios');
// const crypto = require('crypto');
// const { getPool } = require('../config/db');

// async function getSettings() {
//   const pool = await getPool();
//   const result = await pool.request().query('SELECT TOP 1 * FROM settings ORDER BY id ASC');
//   const settings = result.recordset[0];

//   if (!settings?.shopify_store_url || !settings?.shopify_access_token || !settings?.shopify_location_id) {
//     throw new Error('Shopify settings missing');
//   }

//   return settings;
// }

// async function shopifyGraphQL(query, variables = {}) {
//   const settings = await getSettings();

//   const url = `https://${settings.shopify_store_url}/admin/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`;

//   const response = await axios.post(
//     url,
//     { query, variables },
//     {
//       headers: {
//         'Content-Type': 'application/json',
//         'X-Shopify-Access-Token': settings.shopify_access_token
//       }
//     }
//   );

//   if (response.data.errors) {
//     throw new Error(`Shopify GraphQL errors: ${JSON.stringify(response.data.errors)}`);
//   }

//   return response.data.data;
// }

// function buildProductMetafields(bike) {
//   const metafields = [];

//   if (bike.condition) {
//     metafields.push({
//       namespace: 'custom',
//       key: 'condition',
//       type: 'single_line_text_field',
//       value: String(bike.condition)
//     });
//   }

//   if (bike.motor_type) {
//     metafields.push({
//       namespace: 'custom',
//       key: 'motor-type',
//       type: 'single_line_text_field',
//       value: String(bike.motor_type)
//     });
//   }

//   if (bike.battery_capacity) {
//     metafields.push({
//       namespace: 'custom',
//       key: 'battery',
//       type: 'single_line_text_field',
//       value: String(bike.battery_capacity)
//     });
//   }

//   if (bike.frame_size) {
//     metafields.push({
//       namespace: 'custom',
//       key: 'frame_size',
//       type: 'single_line_text_field',
//       value: String(bike.frame_size)
//     });
//   }

//   return metafields;
// }

// function buildProductTags(bike) {
//   if (!bike.tags) return [];

//   if (Array.isArray(bike.tags)) {
//     return bike.tags.map((t) => String(t).trim()).filter(Boolean);
//   }

//   return String(bike.tags)
//     .split(',')
//     .map((t) => t.trim())
//     .filter(Boolean);
// }

// function buildProductTitle(bike) {
//   if (bike.title && bike.title.trim()) return bike.title.trim();
//   return `${bike.brand || ''} ${bike.model || ''}`.trim();
// }

// async function upsertProductWithProductSet(bike) {
//   const settings = await getSettings();

//   const mutation = `
//     mutation upsertBikeProduct($productSet: ProductSetInput!, $synchronous: Boolean!, $identifier: ProductSetIdentifiers) {
//       productSet(synchronous: $synchronous, input: $productSet, identifier: $identifier) {
//         product {
//           id
//           title
//           status
//           tags
//           variants(first: 5) {
//             nodes {
//               id
//               price
//               inventoryItem {
//                 id
//               }
//               selectedOptions {
//                 name
//                 value
//               }
//             }
//           }
//         }
//         userErrors {
//           field
//           message
//         }
//       }
//     }
//   `;

//   const variables = {
//     synchronous: true,
//     identifier: bike.shopify_product_id
//       ? { id: bike.shopify_product_id }
//       : null,
//     productSet: {
//       title: buildProductTitle(bike),
//       descriptionHtml: bike.description || '',
//       vendor: bike.brand || '',
//       status: bike.is_deleted ? 'ARCHIVED' : 'ACTIVE',
//       tags: buildProductTags(bike),
//       metafields: buildProductMetafields(bike),

//       productOptions: [
//         {
//           name: 'Title',
//           values: [
//             {
//               name: 'Default Title'
//             }
//           ]
//         }
//       ],

//       variants: [
//         {
//           optionValues: [
//             {
//               optionName: 'Title',
//               name: 'Default Title'
//             }
//           ],
//           price: String(Number(bike.price || 0)),
//           inventoryQuantities: [
//             {
//               locationId: settings.shopify_location_id,
//               name: 'available',
//               quantity: Number(bike.stock || 0)
//             }
//           ]
//         }
//       ]
//     }
//   };

//   const data = await shopifyGraphQL(mutation, variables);
//   const payload = data.productSet;

//   if (payload.userErrors?.length) {
//     throw new Error(JSON.stringify(payload.userErrors));
//   }

//   const product = payload.product;
//   const variant = product?.variants?.nodes?.[0];

//   return {
//     productId: product?.id || null,
//     variantId: variant?.id || null,
//     inventoryItemId: variant?.inventoryItem?.id || null
//   };
// }

// async function archiveProduct(productId) {
//   const mutation = `
//     mutation archiveBike($product: ProductUpdateInput!) {
//       productUpdate(product: $product) {
//         product {
//           id
//           status
//         }
//         userErrors {
//           field
//           message
//         }
//       }
//     }
//   `;

//   const data = await shopifyGraphQL(mutation, {
//     product: {
//       id: productId,
//       status: 'ARCHIVED'
//     }
//   });

//   const payload = data.productUpdate;

//   if (payload.userErrors?.length) {
//     throw new Error(JSON.stringify(payload.userErrors));
//   }

//   return payload.product;
// }

// module.exports = {
//   shopifyGraphQL,
//   upsertProductWithProductSet,
//   archiveProduct
// };

//========================================================================================
const axios = require('axios');
const path = require('path');
const { getPool } = require('../config/db');

async function getSettings() {
  const pool = await getPool();

  const result = await pool.query(
    'SELECT * FROM settings ORDER BY id ASC LIMIT 1'
  );

  const settings = result.rows[0];

  if (
    !settings?.shopify_store_url ||
    !settings?.shopify_access_token ||
    !settings?.shopify_location_id
  ) {
    throw new Error('Shopify settings missing');
  }

  return settings;
}

async function shopifyGraphQL(query, variables = {}) {
  const settings = await getSettings();

  const url = `https://${settings.shopify_store_url}/admin/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`;

  const response = await axios.post(
    url,
    { query, variables },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': settings.shopify_access_token
      }
    }
  );

  if (response.data.errors?.length) {
    throw new Error(
      `Shopify GraphQL errors: ${JSON.stringify(response.data.errors)}`
    );
  }

  return response.data.data;
}

function buildProductMetafields(bike) {
  const metafields = [];

  if (bike.condition) {
    metafields.push({
      namespace: 'custom',
      key: 'condition',
      type: 'single_line_text_field',
      value: String(bike.condition)
    });
  }

  if (bike.motor_type) {
    metafields.push({
      namespace: 'custom',
      key: 'motor_type',
      type: 'single_line_text_field',
      value: String(bike.motor_type)
    });
  }

  if (bike.battery_capacity) {
    metafields.push({
      namespace: 'custom',
      key: 'battery_capacity',
      type: 'single_line_text_field',
      value: String(bike.battery_capacity)
    });
  }

  if (bike.frame_size) {
    metafields.push({
      namespace: 'custom',
      key: 'frame_size',
      type: 'single_line_text_field',
      value: String(bike.frame_size)
    });
  }

  if (bike.range_km !== null && bike.range_km !== undefined && bike.range_km !== '') {
    metafields.push({
      namespace: 'custom',
      key: 'range_km',
      type: 'number_integer',
      value: String(Number(bike.range_km))
    });
  }

  if (bike.mileage !== null && bike.mileage !== undefined && bike.mileage !== '') {
    metafields.push({
      namespace: 'custom',
      key: 'mileage',
      type: 'number_integer',
      value: String(Number(bike.mileage))
    });
  }

  return metafields;
}

function buildProductTags(bike) {
  if (!bike.tags) return [];

  if (Array.isArray(bike.tags)) {
    return bike.tags.map((t) => String(t).trim()).filter(Boolean);
  }

  return String(bike.tags)
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

function buildProductTitle(bike) {
  if (bike.title && String(bike.title).trim()) {
    return String(bike.title).trim();
  }

  return `${bike.brand || ''} ${bike.model || ''}`.trim() || `Bike ${bike.id}`;
}

function normalizeBaseUrl(url) {
  return String(url || '').replace(/\/+$/, '');
}

function buildPublicImageUrl(imageUrl) {
  if (!imageUrl) return null;

  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }

  const baseUrl = normalizeBaseUrl(process.env.PUBLIC_BACKEND_URL);

  if (!baseUrl) {
    throw new Error('PUBLIC_BACKEND_URL is missing');
  }

  const normalizedPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  return `${baseUrl}${normalizedPath}`;
}

function buildProductMedia(bike) {
  if (!Array.isArray(bike.images) || bike.images.length === 0) {
    return [];
  }

  return bike.images
    .map((img, index) => {
      if (!img?.image_url) return null;

      const originalSource = buildPublicImageUrl(img.image_url);
      if (!originalSource) return null;

      const ext = path.extname(img.image_url || '').toLowerCase();
      const supportedImageExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff'];

      if (ext && !supportedImageExts.includes(ext)) {
        return null;
      }

    return {
  originalSource,
  alt: `${buildProductTitle(bike)} image ${index + 1}`
};
    })
    .filter(Boolean);
}

async function upsertProductWithProductSet(bike) {
  const settings = await getSettings();

  const mutation = `
    mutation upsertBikeProduct(
      $productSet: ProductSetInput!,
      $synchronous: Boolean!,
      $identifier: ProductSetIdentifiers
    ) {
      productSet(
        synchronous: $synchronous,
        input: $productSet,
        identifier: $identifier
      ) {
        product {
          id
          title
          status
          tags
          media(first: 20) {
            nodes {
              ... on MediaImage {
                id
                alt
                status
                image {
                  url
                }
              }
            }
          }
          variants(first: 5) {
            nodes {
              id
              sku
              price
              inventoryItem {
                id
              }
            }
          }
        }
        productSetOperation {
          id
          status
          userErrors {
            code
            field
            message
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

 const files = buildProductFiles(bike);

  const variables = {
    synchronous: true,
    identifier: bike.shopify_product_id
      ? { id: bike.shopify_product_id }
      : null,
    productSet: {
      title: buildProductTitle(bike),
      descriptionHtml: bike.description || '',
      vendor: bike.brand || '',
      status: bike.is_deleted ? 'ARCHIVED' : 'ACTIVE',
      tags: buildProductTags(bike),
      metafields: buildProductMetafields(bike),
      productOptions: [
        {
          name: 'Title',
          values: [{ name: 'Default Title' }]
        }
      ],
      variants: [
        {
          optionValues: [
            {
              optionName: 'Title',
              name: 'Default Title'
            }
          ],
          price: String(Number(bike.price || 0)),
          sku: bike.sku ? String(bike.sku) : undefined,
          inventoryQuantities: [
            {
              locationId: settings.shopify_location_id,
              name: 'available',
              quantity: Number(bike.stock || 0)
            }
          ]
        }
      ],
      files
    }
  };

  const data = await shopifyGraphQL(mutation, variables);
  const payload = data?.productSet;

  if (!payload) {
    throw new Error('Invalid Shopify response: missing productSet payload');
  }

  if (payload.userErrors?.length) {
    throw new Error(JSON.stringify(payload.userErrors));
  }

  if (payload.productSetOperation?.userErrors?.length) {
    throw new Error(JSON.stringify(payload.productSetOperation.userErrors));
  }

  const product = payload.product;
  const variant = product?.variants?.nodes?.[0] || null;

  return {
    productId: product?.id || null,
    variantId: variant?.id || null,
    inventoryItemId: variant?.inventoryItem?.id || null,
    media: product?.media?.nodes || []
  };
}

async function getPublications() {
  const query = `
    query getPublications {
      publications(first: 50) {
        nodes {
          id
          name
          autoPublish
        }
      }
    }
  `;

  const data = await shopifyGraphQL(query);
  return data?.publications?.nodes || [];
}

function filterTargetPublications(publications) {
  const wantedNames = [
    'Online Store',
    'Point of Sale',
    'Shop',
    'Google & YouTube'
  ];

  return publications.filter((pub) =>
    wantedNames.some(
      (name) => pub.name?.toLowerCase() === name.toLowerCase()
    )
  );
}

async function publishProductToPublications(productId, publicationIds) {
  if (!productId) {
    throw new Error('Missing Shopify product ID for publication');
  }

  if (!Array.isArray(publicationIds) || publicationIds.length === 0) {
    return { publishedCount: 0 };
  }

  const mutation = `
    mutation publishProduct($id: ID!, $input: [PublicationInput!]!) {
      publishablePublish(id: $id, input: $input) {
        publishable {
          ... on Product {
            id
            status
          }
        }
        shop {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    id: productId,
    input: publicationIds.map((publicationId) => ({
      publicationId
    }))
  };

  const data = await shopifyGraphQL(mutation, variables);
  const payload = data?.publishablePublish;

  if (payload?.userErrors?.length) {
    throw new Error(JSON.stringify(payload.userErrors));
  }

  return {
    publishedCount: publicationIds.length
  };
}

async function archiveProduct(productId) {
  const mutation = `
    mutation archiveBike($product: ProductUpdateInput!) {
      productUpdate(product: $product) {
        product {
          id
          status
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyGraphQL(mutation, {
    product: {
      id: productId,
      status: 'ARCHIVED'
    }
  });

  const payload = data?.productUpdate;

  if (payload?.userErrors?.length) {
    throw new Error(JSON.stringify(payload.userErrors));
  }

  return payload.product;
}

module.exports = {
  shopifyGraphQL,
  upsertProductWithProductSet,
  archiveProduct,
  getPublications,
  filterTargetPublications,
  publishProductToPublications
};

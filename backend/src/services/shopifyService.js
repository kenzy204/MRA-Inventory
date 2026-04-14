
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


const axios = require('axios');
const path = require('path');
const { getPool } = require('../config/db');

// async function getSettings() {
//   const pool = await getPool();
//   const result = await pool.request().query('SELECT TOP 1 * FROM settings ORDER BY id ASC');
//   const settings = result.recordset[0];

//   if (!settings?.shopify_store_url || !settings?.shopify_access_token || !settings?.shopify_location_id) {
//     throw new Error('Shopify settings missing');
//   }

//   return settings;
// }
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

  if (response.data.errors) {
    throw new Error(`Shopify GraphQL errors: ${JSON.stringify(response.data.errors)}`);
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
      key: 'motor-type',
      type: 'single_line_text_field',
      value: String(bike.motor_type)
    });
  }

  if (bike.battery_capacity) {
    metafields.push({
      namespace: 'custom',
      key: 'battery',
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
  if (bike.title && bike.title.trim()) return bike.title.trim();
  return `${bike.brand || ''} ${bike.model || ''}`.trim();
}

function normalizeBaseUrl(url) {
  return String(url || '').replace(/\/+$/, '');
}

function buildPublicImageUrl(imageUrl) {
  const baseUrl = normalizeBaseUrl(process.env.PUBLIC_BACKEND_URL);

  if (!baseUrl) {
    throw new Error('PUBLIC_BACKEND_URL is missing');
  }

  if (!imageUrl) return null;

  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }

  const normalizedPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  return `${baseUrl}${normalizedPath}`;
}

function buildProductFiles(bike) {
  if (!Array.isArray(bike.images) || bike.images.length === 0) {
    return [];
  }

  return bike.images
    .map((img, index) => {
      if (!img?.image_url) return null;

      const originalSource = buildPublicImageUrl(img.image_url);
      const ext = path.extname(img.image_url) || '.jpg';
      const safeTitle = buildProductTitle(bike)
        .toLowerCase()
        .replace(/[^a-z0-9]+/gi, '-')
        .replace(/^-+|-+$/g, '') || `bike-${bike.id}`;

      return {
        originalSource,
        alt: `${buildProductTitle(bike)} image ${index + 1}`,
        filename: `${safeTitle}-${index + 1}${ext}`,
        contentType: 'IMAGE'
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
      productSet(synchronous: $synchronous, input: $productSet, identifier: $identifier) {
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
                image {
                  url
                }
              }
            }
          }
          variants(first: 5) {
            nodes {
              id
              price
              inventoryItem {
                id
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

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
      files: buildProductFiles(bike), // ده يفضل زي ما هو
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
          inventoryQuantities: [
            {
              locationId: settings.shopify_location_id,
              name: 'available',
              quantity: Number(bike.stock || 0)
            }
          ]
        }
      ]
    }
  };

  const data = await shopifyGraphQL(mutation, variables);
  const payload = data.productSet;

  if (payload.userErrors?.length) {
    throw new Error(JSON.stringify(payload.userErrors));
  }

  const product = payload.product;
  const variant = product?.variants?.nodes?.[0];

  return {
    productId: product?.id || null,
    variantId: variant?.id || null,
    inventoryItemId: variant?.inventoryItem?.id || null,
    media: product?.media?.nodes || []
  };
}

/**
 * تجيب كل publications المتاحة في الاستور
 */
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

/**
 * اختاري القنوات اللي إنتِ عايزاها بالاسم
 */
function filterTargetPublications(publications) {
  const wantedNames = [
    'Online Store',
    'Point of Sale',
    'Shop',
    'Google & YouTube'
  ];

  return publications.filter((pub) =>
    wantedNames.some((name) => pub.name?.toLowerCase() === name.toLowerCase())
  );
}

/**
 * انشري المنتج على publications معينة
 */
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
  const payload = data.publishablePublish;

  if (payload.userErrors?.length) {
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

  const payload = data.productUpdate;

  if (payload.userErrors?.length) {
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
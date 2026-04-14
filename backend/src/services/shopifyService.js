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

function pushMetafield(metafields, key, type, value) {
  if (value === undefined || value === null || value === '') return;

  metafields.push({
    namespace: 'custom',
    key,
    type,
    value: String(value)
  });
}

function pushBooleanMetafield(metafields, key, value) {
  if (value === undefined || value === null || value === '') return;

  let normalized = value;

  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();

    if (['ja', 'yes', 'true', '1'].includes(lower)) normalized = true;
    else if (['nee', 'no', 'false', '0'].includes(lower)) normalized = false;
  }

  metafields.push({
    namespace: 'custom',
    key,
    type: 'boolean',
    value: normalized ? 'true' : 'false'
  });
}

function buildProductMetafields(bike) {
  const metafields = [];

  // Aandrijving
  pushMetafield(metafields, 'merk', 'single_line_text_field', bike.merk);
  pushMetafield(metafields, 'type', 'single_line_text_field', bike.type);
  pushMetafield(metafields, 'positie', 'single_line_text_field', bike.positie);
  pushMetafield(metafields, 'koppel_motor_nm', 'number_decimal', bike.koppel_motor_nm);
  pushMetafield(metafields, 'type-aandrijving', 'multi_line_text_field', bike.type_aandrijving);

  // Accu
  pushMetafield(metafields, 'accu_capaciteit_wh', 'number_integer', bike.accu_capaciteit_wh);
  pushMetafield(metafields, 'accu_positie', 'single_line_text_field', bike.accu_positie);
  pushBooleanMetafield(metafields, 'accu_uitneembaar', bike.accu_uitneembaar);
  pushMetafield(metafields, 'accu', 'multi_line_text_field', bike.accu);

  // Rem
  pushMetafield(metafields, 'type-rem', 'single_line_text_field', bike.type_remmen);
  pushMetafield(metafields, 'merk_remmen', 'single_line_text_field', bike.merk_remmen);
  pushMetafield(metafields, 'remmen', 'multi_line_text_field', bike.remmen);

  // Display
  pushMetafield(metafields, 'display_merk', 'single_line_text_field', bike.display_merk);
  pushMetafield(metafields, 'display_type', 'single_line_text_field', bike.display_type);
  pushMetafield(metafields, 'display', 'multi_line_text_field', bike.display);

  // Vering
  pushBooleanMetafield(metafields, 'voorvork_vering_aanwezig', bike.voorvork_vering_aanwezig);
  pushMetafield(metafields, 'voorvork_vering_type', 'single_line_text_field', bike.voorvork_vering_type);
  pushBooleanMetafield(metafields, 'verende_zadelpen_aanwezig', bike.verende_zadelpen_aanwezig);
  pushMetafield(metafields, 'verende_zadelpen_type', 'single_line_text_field', bike.verende_zadelpen_type);
  pushBooleanMetafield(metafields, 'zadelvering', bike.zadelvering);
  pushMetafield(metafields, 'vering', 'multi_line_text_field', bike.vering);

  // Banden
  pushMetafield(metafields, 'bandmerk', 'single_line_text_field', bike.bandmerk);
  pushMetafield(metafields, 'bandmodel', 'single_line_text_field', bike.bandmodel);
  pushBooleanMetafield(metafields, 'anti_lek_banden', bike.anti_lek_banden);
  pushMetafield(metafields, 'bandbreedte', 'single_line_text_field', bike.bandbreedte);
  pushMetafield(metafields, 'banden', 'multi_line_text_field', bike.banden);

  // Frame
  pushMetafield(metafields, 'frame_size', 'number_decimal', bike.frame_size);
  pushMetafield(metafields, 'type_frame', 'single_line_text_field', bike.type_frame);
  pushMetafield(metafields, 'framemateriaal', 'single_line_text_field', bike.framemateriaal);
  pushMetafield(metafields, 'frame', 'multi_line_text_field', bike.frame);

  // Wielen
  pushMetafield(metafields, 'wielmaat', 'single_line_text_field', bike.wielmaat);

  // Levering
  pushMetafield(metafields, 'aantal_sleutels', 'number_integer', bike.aantal_sleutels);
  pushBooleanMetafield(metafields, 'fabrieksgarantie', bike.fabrieksgarantie);

  // Gebruik
  pushMetafield(metafields, 'kilometerstand', 'number_integer', bike.kilometerstand);
  pushMetafield(metafields, 'km_s', 'single_line_text_field', bike.km_s);

  // Staat van de fiets
  pushMetafield(metafields, 'condition', 'single_line_text_field', bike.condition);

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

function buildSafeFilename(bike, index, imageUrl) {
  const ext = path.extname(imageUrl || '').toLowerCase() || '.jpg';

  const supportedImageExts = [
    '.jpg',
    '.jpeg',
    '.png',
    '.webp',
    '.gif',
    '.bmp',
    '.tiff'
  ];

  if (!supportedImageExts.includes(ext)) {
    return null;
  }

  const safeTitle =
    buildProductTitle(bike)
      .toLowerCase()
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-+|-+$/g, '') || `bike-${bike.id}`;

  return `${safeTitle}-${index + 1}${ext}`;
}

function buildProductFiles(bike) {
  if (!Array.isArray(bike.images) || bike.images.length === 0) {
    return [];
  }

  return bike.images
    .map((img, index) => {
      if (!img?.image_url) return null;

      const originalSource = buildPublicImageUrl(img.image_url);
      if (!originalSource) return null;

      const filename = buildSafeFilename(bike, index, img.image_url);
      if (!filename) return null;

      return {
        originalSource,
        alt: `${buildProductTitle(bike)} image ${index + 1}`,
        filename,
        contentType: 'IMAGE'
      };
    })
    .filter(Boolean);
}

function buildCreateMediaInputs(bike, images) {
  if (!Array.isArray(images) || images.length === 0) {
    return [];
  }

  return images
    .map((img, index) => {
      if (!img?.image_url) return null;

      const originalSource = buildPublicImageUrl(img.image_url);
      if (!originalSource) return null;

      return {
        originalSource,
        alt: `${buildProductTitle(bike)} image ${index + 1}`,
        mediaContentType: 'IMAGE'
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
      ...(files.length ? { files } : {})
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

async function appendImagesToExistingProduct(productId, bike, images) {
  if (!productId) {
    throw new Error('Missing Shopify product ID');
  }

  const media = buildCreateMediaInputs(bike, images);

  if (media.length === 0) {
    return { media: [] };
  }

  const mutation = `
    mutation UpdateProductWithNewMedia(
      $product: ProductUpdateInput!,
      $media: [CreateMediaInput!]
    ) {
      productUpdate(product: $product, media: $media) {
        product {
          id
          media(first: 20) {
            nodes {
              ... on MediaImage {
                id
                alt
                mediaContentType
                preview {
                  status
                }
                image {
                  url
                }
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

  const data = await shopifyGraphQL(mutation, {
    product: { id: productId },
    media
  });

  const payload = data?.productUpdate;

  if (!payload) {
    throw new Error('Invalid Shopify response: missing productUpdate payload');
  }

  if (payload.userErrors?.length) {
    throw new Error(JSON.stringify(payload.userErrors));
  }

  return {
    media: payload.product?.media?.nodes || []
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
  appendImagesToExistingProduct,
  archiveProduct,
  getPublications,
  filterTargetPublications,
  publishProductToPublications
};

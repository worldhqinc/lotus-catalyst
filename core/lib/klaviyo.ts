import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';

import { client } from '~/client';
import { graphql } from '~/client/graphql';

export async function klaviyoNewsletterSignup(email: string, source: string) {
  return await fetch('https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs', {
    method: 'POST',
    headers: {
      accept: 'application/vnd.api+json',
      revision: '2025-04-15',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Klaviyo-API-Key ${process.env.KLAVIYO_PRIVATE_API_KEY}`,
    },
    body: JSON.stringify({
      data: {
        type: 'profile-subscription-bulk-create-job',
        attributes: {
          custom_source: source,
          profiles: {
            data: [
              {
                type: 'profile',
                attributes: {
                  email,
                  subscriptions: {
                    email: {
                      marketing: {
                        consent: 'SUBSCRIBED',
                      },
                    },
                  },
                },
              },
            ],
          },
        },
        relationships: {
          list: {
            data: {
              type: 'list',
              id: process.env.KLAVIYO_NEWSLETTER_LIST_ID,
            },
          },
        },
      },
    }),
  });
}

export async function klaviyoProductRegistrationSubmission(
  email: string,
  firstName: string,
  lastName: string,
  source: string,
) {
  return await fetch('https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs', {
    method: 'POST',
    headers: {
      accept: 'application/vnd.api+json',
      revision: '2025-04-15',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Klaviyo-API-Key ${process.env.KLAVIYO_PRIVATE_API_KEY}`,
    },
    body: JSON.stringify({
      data: {
        type: 'profile-subscription-bulk-create-job',
        attributes: {
          custom_source: source,
          profiles: {
            data: [
              {
                type: 'profile',
                attributes: {
                  email,
                  first_name: firstName,
                  last_name: lastName,
                  subscriptions: {
                    email: {
                      marketing: {
                        consent: 'SUBSCRIBED',
                      },
                    },
                  },
                },
              },
            ],
          },
        },
        relationships: {
          list: {
            data: {
              type: 'list',
              id: process.env.KLAVIYO_PRODUCT_REGISTRATION_LIST_ID,
            },
          },
        },
      },
    }),
  });
}

export async function klaviyoBackInStockSubscription(email: string, sku: string) {
  const variantId = await getDefaultProductVariantId(sku);

  return await fetch('https://a.klaviyo.com/api/back-in-stock-subscriptions', {
    method: 'POST',
    headers: {
      accept: 'application/vnd.api+json',
      revision: '2025-04-15',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Klaviyo-API-Key ${process.env.KLAVIYO_PRIVATE_API_KEY}`,
    },
    body: JSON.stringify({
      data: {
        type: 'back-in-stock-subscription',
        attributes: {
          profile: {
            data: {
              type: 'profile',
              attributes: {
                email,
              },
            },
          },
          channels: ['EMAIL'],
        },
        relationships: {
          variant: {
            data: {
              type: 'catalog-variant',
              id: `$bigcommerce:::$default:::${variantId}`,
            },
          },
        },
      },
    }),
  });
}

const GetProductBySkuQuery = graphql(`
  query GetProductBySkuQuery($sku: String!) {
    site {
      product(sku: $sku) {
        entityId
      }
    }
  }
`);

const GetDefaultProductVariantId = graphql(`
  query GetDefaultProductVariantId($productId: Int!) {
    site {
      product(entityId: $productId) {
        variants(first: 1) {
          edges {
            node {
              entityId
            }
          }
        }
      }
    }
  }
`);

async function getDefaultProductVariantId(sku: string) {
  const { data: productData } = await client.fetch({
    document: GetProductBySkuQuery,
    variables: { sku },
    fetchOptions: { cache: 'no-store' },
  });

  const { data } = await client.fetch({
    document: GetDefaultProductVariantId,
    variables: { productId: productData.site.product?.entityId ?? 0 },
    fetchOptions: { cache: 'no-store' },
  });

  if (!data.site.product?.variants) {
    return undefined;
  }

  return removeEdgesAndNodes(data.site.product.variants)[0]?.entityId ?? undefined;
}

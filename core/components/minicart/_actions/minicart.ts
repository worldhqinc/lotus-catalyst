'use server';

import { SubmissionResult } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { z } from 'zod';

import { getSessionCustomerAccessToken } from '~/auth';
import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { TAGS } from '~/client/tags';
import { addToOrCreateCart, getCartId } from '~/lib/cart';
import { getPreferredCurrencyCode } from '~/lib/currency';

const GetMinicartQuery = graphql(`
  query GetMinicartQuery($cartId: String) {
    site {
      cart(entityId: $cartId) {
        entityId
        lineItems {
          physicalItems {
            name
            image {
              altText
              url: urlTemplate(lossy: true)
            }
            entityId
            quantity
            productEntityId
            variantEntityId
            originalPrice {
              currencyCode
              value
            }
            listPrice {
              currencyCode
              value
            }
          }
          digitalItems {
            name
            image {
              altText
              url: urlTemplate(lossy: true)
            }
            entityId
            quantity
            productEntityId
            variantEntityId
            originalPrice {
              currencyCode
              value
            }
            listPrice {
              currencyCode
              value
            }
          }
        }
      }
    }
  }
`);

const GetAdditionalProductDataQuery = graphql(`
  query GetAdditionalProductData($entityId: Int!) {
    site {
      product(entityId: $entityId) {
        path
        customFields {
          edges {
            node {
              entityId
              name
              value
            }
          }
        }
      }
    }
  }
`);

const GetProductRelatedQuery = graphql(`
  query GetProductRelatedQuery($entityId: Int!, $currencyCode: currencyCode) {
    site {
      product(entityId: $entityId) {
        relatedProducts(first: 8) {
          edges {
            node {
              entityId
              name
              path
              defaultImage {
                altText
                url: urlTemplate(lossy: true)
              }
              prices(currencyCode: $currencyCode) {
                price {
                  value
                }
                basePrice {
                  value
                }
              }
              customFields {
                edges {
                  node {
                    name
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`);

const UpdateCartLineItemMutation = graphql(`
  mutation UpdateCartLineItem($input: UpdateCartLineItemInput!) {
    cart {
      updateCartLineItem(input: $input) {
        cart {
          entityId
        }
      }
    }
  }
`);

const DeleteCartLineItemMutation = graphql(`
  mutation DeleteCartLineItemMutation($input: DeleteCartLineItemInput!) {
    cart {
      deleteCartLineItem(input: $input) {
        cart {
          entityId
        }
      }
    }
  }
`);

export interface CartItem {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  productEntityId: number;
  variantEntityId: number | null;
  currencyCode: string;
  href: string;
  image?: {
    src: string;
    alt: string;
  };
  relatedProducts?: Array<{
    id: string;
    title: string;
    subtitle?: string;
    price: number;
    originalPrice?: number;
    currencyCode: string;
    image?: {
      src: string;
      alt: string;
    };
    href: string;
  }>;
}

interface State {
  items: CartItem[];
  lastResult: SubmissionResult | null;
}

const schema = z.object({
  id: z.string(),
  quantity: z.coerce.number().optional(),
  intent: z.enum(['update', 'remove', 'add']),
});

interface RelatedProductNode {
  entityId: number;
  name: string;
  path: string;
  defaultImage: {
    altText: string;
    url: string;
  } | null;
  prices: {
    price: {
      value: number;
    };
    basePrice: {
      value: number;
    } | null;
  } | null;
  customFields: {
    edges: Array<{
      node: {
        name: string;
        value: string;
      };
    }> | null;
  };
}

export const getMinicartItems = async (): Promise<CartItem[]> => {
  const cartId = await getCartId();

  if (!cartId) {
    return [];
  }

  const customerAccessToken = await getSessionCustomerAccessToken();

  const response = await client.fetch({
    document: GetMinicartQuery,
    variables: { cartId },
    customerAccessToken,
    fetchOptions: {
      cache: 'no-store',
      next: {
        tags: [TAGS.cart],
      },
    },
  });

  const cart = response.data.site.cart;

  if (!cart) {
    return [];
  }

  const additionalProductData = await Promise.all(
    cart.lineItems.physicalItems.map(async (item) => {
      const additionalDataResponse = await client.fetch({
        document: GetAdditionalProductDataQuery,
        variables: { entityId: item.productEntityId },
      });

      return {
        productEntityId: item.productEntityId,
        path: additionalDataResponse.data.site.product?.path,
        customFields: additionalDataResponse.data.site.product?.customFields,
      };
    }),
  );
  const additionalProductDataMap = new Map(
    additionalProductData.map((additionalData) => [additionalData.productEntityId, additionalData]),
  );

  const productIds = new Set([
    ...cart.lineItems.physicalItems.map((item) => item.productEntityId),
    ...cart.lineItems.digitalItems.map((item) => item.productEntityId),
  ]);

  const currencyCode = await getPreferredCurrencyCode();
  const relatedProductsMap = new Map<number, CartItem['relatedProducts']>();

  await Promise.all(
    Array.from(productIds).map(async (productId) => {
      try {
        const relatedResponse = await client.fetch({
          document: GetProductRelatedQuery,
          variables: {
            entityId: productId,
            currencyCode,
          },
          customerAccessToken,
          fetchOptions: { cache: 'no-store' },
        });

        const edges = relatedResponse.data.site.product?.relatedProducts.edges || [];

        const cartProductIds = new Set([
          ...cart.lineItems.physicalItems.map((item) => item.productEntityId),
          ...cart.lineItems.digitalItems.map((item) => item.productEntityId),
        ]);

        relatedProductsMap.set(
          productId,
          edges
            .map((edge: { node: RelatedProductNode }) => ({
              id: edge.node.entityId.toString(),
              title: edge.node.name,
              subtitle:
                edge.node.customFields.edges?.find(
                  (field) => field.node.name === 'Web Product Name Descriptor',
                )?.node.value ?? '',
              price: edge.node.prices?.price.value ?? 0,
              originalPrice:
                edge.node.prices?.basePrice?.value &&
                edge.node.prices.basePrice.value > edge.node.prices.price.value
                  ? edge.node.prices.basePrice.value
                  : undefined,
              currencyCode: currencyCode || 'USD',
              image: edge.node.defaultImage
                ? {
                    src: edge.node.defaultImage.url,
                    alt: edge.node.defaultImage.altText,
                  }
                : undefined,
              href: edge.node.path,
            }))
            // Filter out products that are already in the cart
            .filter((product) => !cartProductIds.has(Number(product.id))),
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Error fetching related products for product ${productId}:`, error);
        relatedProductsMap.set(productId, []);
      }
    }),
  );

  const items: CartItem[] = [...cart.lineItems.physicalItems, ...cart.lineItems.digitalItems].map(
    (item) => ({
      id: item.entityId,
      title: item.name,
      subtitle:
        additionalProductDataMap
          .get(item.productEntityId)
          ?.customFields?.edges?.find((field) => field.node.name === 'Web Product Name Descriptor')
          ?.node.value ?? '',
      price: item.listPrice.value,
      originalPrice:
        item.originalPrice.value > item.listPrice.value ? item.originalPrice.value : undefined,
      quantity: item.quantity,
      productEntityId: item.productEntityId,
      variantEntityId: item.variantEntityId,
      currencyCode: item.listPrice.currencyCode,
      image: item.image ? { src: item.image.url, alt: item.image.altText } : undefined,
      relatedProducts: relatedProductsMap.get(item.productEntityId),
      href: additionalProductDataMap.get(item.productEntityId)?.path,
    }),
  );

  return items;
};

export async function minicartAction(prevState: State, formData: FormData): Promise<State> {
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== 'success') {
    return { ...prevState, lastResult: submission.reply() };
  }

  const cartId = await getCartId();

  if (!cartId) {
    return {
      ...prevState,
      lastResult: submission.reply({ formErrors: ['Cart not found'] }),
    };
  }

  const customerAccessToken = await getSessionCustomerAccessToken();
  const { id, quantity, intent } = submission.value;

  try {
    if (intent === 'add') {
      await addToOrCreateCart({
        lineItems: [
          {
            productEntityId: Number(id),
            quantity: quantity ?? 1,
          },
        ],
      });
    } else {
      const currentItems = await getMinicartItems();
      const currentItem = currentItems.find((item) => item.id === id);

      if (currentItem) {
        if (intent === 'update' && quantity !== undefined) {
          await client.fetch({
            document: UpdateCartLineItemMutation,
            variables: {
              input: {
                cartEntityId: cartId,
                lineItemEntityId: id,
                data: {
                  lineItem: {
                    quantity,
                    productEntityId: currentItem.productEntityId,
                    variantEntityId: currentItem.variantEntityId,
                  },
                },
              },
            },
            customerAccessToken,
            fetchOptions: { cache: 'no-store' },
          });
        } else if (intent === 'remove') {
          await client.fetch({
            document: DeleteCartLineItemMutation,
            variables: {
              input: {
                cartEntityId: cartId,
                lineItemEntityId: id,
              },
            },
            customerAccessToken,
            fetchOptions: { cache: 'no-store' },
          });
        }
      }
    }

    const items = await getMinicartItems();

    return { items, lastResult: submission.reply() };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error updating cart:', error);

    return {
      ...prevState,
      lastResult: submission.reply({ formErrors: ['Failed to update cart'] }),
    };
  }
}

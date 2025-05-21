'use server';

import { SubmissionResult } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { z } from 'zod';

import { getSessionCustomerAccessToken } from '~/auth';
import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { TAGS } from '~/client/tags';
import { addToOrCreateCart, getCartId } from '~/lib/cart';

const GetMinicartQuery = graphql(`
  query GetMinicartQuery($cartId: String) {
    site {
      cart(entityId: $cartId) {
        entityId
        lineItems {
          physicalItems {
            name
            brand
            imageUrl
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
            brand
            imageUrl
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
              brand {
                name
              }
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
  brand: {
    name: string;
  } | null;
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

  const productIds = new Set([
    ...cart.lineItems.physicalItems.map((item) => item.productEntityId),
    ...cart.lineItems.digitalItems.map((item) => item.productEntityId),
  ]);

  const relatedProductsMap = new Map<number, CartItem['relatedProducts']>();

  await Promise.all(
    Array.from(productIds).map(async (productId) => {
      try {
        const relatedResponse = await client.fetch({
          document: GetProductRelatedQuery,
          variables: {
            entityId: productId,
            currencyCode: 'USD',
          },
          customerAccessToken,
          fetchOptions: { cache: 'no-store' },
        });

        const edges = relatedResponse.data.site.product?.relatedProducts.edges || [];

        relatedProductsMap.set(
          productId,
          edges.map((edge: { node: RelatedProductNode }) => ({
            id: edge.node.entityId.toString(),
            title: edge.node.name,
            subtitle: edge.node.brand?.name ?? undefined,
            price: edge.node.prices?.price.value ?? 0,
            originalPrice:
              edge.node.prices?.basePrice?.value &&
              edge.node.prices.basePrice.value > edge.node.prices.price.value
                ? edge.node.prices.basePrice.value
                : undefined,
            image: edge.node.defaultImage
              ? {
                  src: edge.node.defaultImage.url,
                  alt: edge.node.defaultImage.altText,
                }
              : undefined,
            href: edge.node.path,
          })),
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
      subtitle: item.brand || '',
      price: item.listPrice.value,
      originalPrice:
        item.originalPrice.value > item.listPrice.value ? item.originalPrice.value : undefined,
      quantity: item.quantity,
      productEntityId: item.productEntityId,
      variantEntityId: item.variantEntityId,
      image: item.imageUrl
        ? {
            src: item.imageUrl,
            alt: item.name,
          }
        : undefined,
      relatedProducts: relatedProductsMap.get(item.productEntityId),
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

'use server';

import { SubmissionResult } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { z } from 'zod';

import { getSessionCustomerAccessToken } from '~/auth';
import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { TAGS } from '~/client/tags';
import { getCartId } from '~/lib/cart';

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
            extendedListPrice {
              currencyCode
              value
            }
            extendedSalePrice {
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
            extendedListPrice {
              currencyCode
              value
            }
            extendedSalePrice {
              currencyCode
              value
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
}

interface State {
  items: CartItem[];
  lastResult: SubmissionResult | null;
}

const schema = z.object({
  id: z.string(),
  quantity: z.coerce.number().optional(),
  intent: z.enum(['update', 'remove']),
});

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

  const items: CartItem[] = [];

  // Transform physical items
  cart.lineItems.physicalItems.forEach((item) => {
    items.push({
      id: item.entityId,
      title: item.name,
      subtitle: item.brand || '',
      price: item.extendedSalePrice.value / item.quantity,
      originalPrice: item.extendedListPrice.value / item.quantity,
      quantity: item.quantity,
      productEntityId: item.productEntityId,
      variantEntityId: item.variantEntityId,
      image: item.imageUrl
        ? {
            src: item.imageUrl,
            alt: item.name,
          }
        : undefined,
    });
  });

  // Transform digital items
  cart.lineItems.digitalItems.forEach((item) => {
    items.push({
      id: item.entityId,
      title: item.name,
      subtitle: item.brand || '',
      price: item.extendedSalePrice.value / item.quantity,
      originalPrice: item.extendedListPrice.value / item.quantity,
      quantity: item.quantity,
      productEntityId: item.productEntityId,
      variantEntityId: item.variantEntityId,
      image: item.imageUrl
        ? {
            src: item.imageUrl,
            alt: item.name,
          }
        : undefined,
    });
  });

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

  // Get the current cart item to get its productEntityId
  const currentItems = await getMinicartItems();
  const currentItem = currentItems.find((item) => item.id === id);

  if (!currentItem) {
    return {
      ...prevState,
      lastResult: submission.reply({ formErrors: ['Item not found'] }),
    };
  }

  try {
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

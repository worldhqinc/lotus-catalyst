'use server';

import { SubmissionResult } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { getTranslations } from 'next-intl/server';
import { ReactNode } from 'react';
import { z } from 'zod';

import { client } from '~/client';
import { GetProductBySkuQuery } from '~/client/queries/get-product-by-sku';
import { Link } from '~/components/link';
import { addToOrCreateCart } from '~/lib/cart';
import { MissingCartError } from '~/lib/cart/error';

const schema = z.object({
  sku: z.string().min(1),
});

interface State {
  lastResult: SubmissionResult | null;
  successMessage?: ReactNode;
  errorMessage?: string;
}

export async function addToCartBySku(prevState: State, formData: FormData): Promise<State> {
  const t = await getTranslations('Product.ProductDetails');
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== 'success') {
    return { lastResult: submission.reply() };
  }

  const { sku } = schema.parse(submission.value);

  const { data } = await client.fetch({
    document: GetProductBySkuQuery,
    variables: { sku },
    fetchOptions: { cache: 'no-store' },
  });

  const product = data.site.product;

  if (!product?.entityId) {
    return {
      lastResult: submission.reply(),
      errorMessage: t('unknownError'),
    };
  }

  try {
    await addToOrCreateCart({
      lineItems: [
        {
          productEntityId: product.entityId,
          quantity: 1,
        },
      ],
    });

    return {
      lastResult: submission.reply(),
      successMessage: t.rich('successMessage', {
        cartItems: 1,
        cartLink: (chunks) => (
          <Link className="underline" href="/cart" prefetch="viewport" prefetchKind="full">
            {chunks}
          </Link>
        ),
      }),
    };
  } catch (error) {
    if (error instanceof MissingCartError) {
      return {
        ...prevState,
        lastResult: { status: 'error' },
        errorMessage: t('missingCart'),
      };
    }

    return {
      ...prevState,
      lastResult: { status: 'error' },
      errorMessage: t('unknownError'),
    };
  }
}

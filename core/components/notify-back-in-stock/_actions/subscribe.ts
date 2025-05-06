'use server';

import { SubmissionResult } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';

import { klaviyoBackInStockSubscription } from '~/lib/klaviyo';

import { schema } from '../schema';

export const subscribe = async (
  _lastResult: {
    lastResult: SubmissionResult | null;
    successMessage?: string | null;
    errorMessage?: string | null;
  },
  formData: FormData,
) => {
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== 'success') {
    return { lastResult: submission.reply() };
  }

  const klaviyoResponse = await klaviyoBackInStockSubscription(
    submission.value.email,
    submission.value.productId,
  );

  if (!klaviyoResponse.ok) {
    return {
      lastResult: submission.reply(),
      successMessage: null,
      errorMessage: 'Unable to subscribe, please try again.',
    };
  }

  return {
    lastResult: submission.reply(),
    successMessage: 'We will notify you when the product is back in stock!',
    errorMessage: null,
  };
};

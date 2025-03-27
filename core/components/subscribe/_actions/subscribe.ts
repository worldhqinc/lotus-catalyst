'use server';

import { SubmissionResult } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { getTranslations } from 'next-intl/server';

import { schema } from '@/vibes/soul/primitives/inline-email-form/schema';

export const subscribe = async (
  _lastResult: {
    lastResult: SubmissionResult | null;
    successMessage?: string | null;
    errorMessage?: string | null;
  },
  formData: FormData,
) => {
  const t = await getTranslations('Components.Subscribe');

  const submission = parseWithZod(formData, { schema });

  if (submission.status !== 'success') {
    return { lastResult: submission.reply() };
  }

  const response = await fetch(
    `https://a.klaviyo.com/api/lists/${process.env.KLAVIYO_LIST_ID}/relationships/profiles/`,
    {
      method: 'POST',
      headers: {
        accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        revision: '2025-01-15',
        Authorization: `Klaviyo-API-Key ${process.env.KLAVIYO_API_KEY}`,
      },
      body: JSON.stringify({
        data: [
          {
            type: 'profile',
            attributes: {
              email: submission.value.email,
            },
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    return { lastResult: submission.reply(), successMessage: null, errorMessage: t('error') };
  }

  return { lastResult: submission.reply(), successMessage: t('success'), errorMessage: null };
};

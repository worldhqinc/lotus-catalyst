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

  const response = await fetch('https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs', {
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
          custom_source: 'lotuscooking.com Newsletter Signup',
          profiles: {
            data: [
              {
                type: 'profile',
                attributes: {
                  email: submission.value.email,
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

  if (!response.ok) {
    return { lastResult: submission.reply(), successMessage: null, errorMessage: t('error') };
  }

  return { lastResult: submission.reply(), successMessage: t('success'), errorMessage: null };
};

'use server';

import { SubmissionResult } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { getTranslations } from 'next-intl/server';

import { schema } from '@/vibes/soul/primitives/inline-email-form/schema';
import { klaviyoNewsletterSignup } from '~/lib/klaviyo';

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

  const klaviyoResponse = await klaviyoNewsletterSignup(
    submission.value.email,
    'lotuscooking.com Footer Newsletter Signup',
  );

  if (!klaviyoResponse.ok) {
    return { lastResult: submission.reply(), successMessage: null, errorMessage: t('error') };
  }

  return { lastResult: submission.reply(), successMessage: t('success'), errorMessage: null };
};

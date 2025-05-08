'use server';

import { z } from 'zod';

import { klaviyoNewsletterSignup, klaviyoProductRegistrationSubmission } from '~/lib/klaviyo';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid Email address'),
  product: z.string().refine((val) => val !== 'null', 'Please select a Product'),
  subscribe: z.string().optional(),
});

interface FormState {
  errors: Record<string, string[]> | null;
  success: boolean;
  formData?: Record<string, string | null>;
}

export async function submitForm(state: FormState, formData: FormData): Promise<FormState> {
  const submission = schema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    product: formData.get('productType'),
    subscribe: formData.get('subscribe'),
  });

  if (!submission.success) {
    const errors = submission.error.errors.reduce<Record<string, string[]>>((acc, error) => {
      const field = error.path[0]?.toString() ?? '';

      if (!acc[field]) {
        acc[field] = [];
      }

      acc[field].push(error.message);

      return acc;
    }, {});

    return {
      errors,
      success: false,
      formData: Object.fromEntries(
        Array.from(formData.entries()).map(([key, value]) => [
          key,
          value instanceof File ? value.name : value.toString(),
        ]),
      ),
    };
  }

  try {
    try {
      await klaviyoProductRegistrationSubmission(
        submission.data.email,
        submission.data.firstName,
        submission.data.lastName,
        'Product Registration',
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error submitting form:', error);
    }

    if (submission.data.subscribe) {
      try {
        await klaviyoNewsletterSignup(submission.data.email, 'Product Registration');
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error submitting form:', error);
      }
    }

    // TODO handle errors

    return {
      errors: null,
      success: true,
      formData: submission.data,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error submitting product registration form:', error);

    return {
      errors: { general: ['Something went wrong, please try again.'] },
      success: false,
      formData: Object.fromEntries(
        Array.from(formData.entries()).map(([key, value]) => [
          key,
          value instanceof File ? value.name : value.toString(),
        ]),
      ),
    };
  }
}

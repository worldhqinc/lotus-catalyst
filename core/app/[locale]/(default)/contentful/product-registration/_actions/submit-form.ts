'use server';

import { z } from 'zod';

import { klaviyoNewsletterSignup, klaviyoProductRegistrationSubmission } from '~/lib/klaviyo';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid Email address'),
  modelNumber: z
    .string()
    .min(1, 'Please select a Model number')
    .refine((val) => val !== 'null', 'Please select a valid Model number'),
  subscribe: z.string().optional().nullable(),
});

interface FormState {
  errors: Record<string, string[]> | null;
  success: boolean;
  formData?: Record<string, string | null>;
}

export async function submitForm(state: FormState, formData: FormData): Promise<FormState> {
  const formValues = {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    productType: formData.get('productType'),
    modelNumber: formData.get('modelNumber'),
    subscribe: formData.get('subscribe'),
  };

  const submission = schema.safeParse({
    ...formValues,
  });

  const formDataFormatted = Object.fromEntries(
    Object.entries(formValues).map(([key, value]) => [
      key,
      value instanceof Object ? JSON.stringify(value) : (value?.toString() ?? null),
    ]),
  );

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
      formData: formDataFormatted,
    };
  }

  try {
    const registrationResponse = await klaviyoProductRegistrationSubmission(
      submission.data.email,
      submission.data.firstName,
      submission.data.lastName,
      submission.data.modelNumber,
    );

    if (!registrationResponse.ok) {
      // eslint-disable-next-line no-console
      console.error(
        'Error submitting product registration form:',
        await registrationResponse.json(),
      );

      return {
        errors: { general: ['Something went wrong, please try again.'] },
        success: false,
        formData: formDataFormatted,
      };
    }

    if (submission.data.subscribe === 'on') {
      const newsletterResponse = await klaviyoNewsletterSignup(
        submission.data.email,
        'Product Registration',
      );

      if (!newsletterResponse.ok) {
        // eslint-disable-next-line no-console
        console.error(
          'Error submitting product registration form, newsletter signup:',
          newsletterResponse,
        );

        return {
          errors: { general: ['Something went wrong, please try again.'] },
          success: false,
          formData: formDataFormatted,
        };
      }
    }

    return {
      errors: null,
      success: true,
      formData: formDataFormatted,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error submitting product registration form:', error);

    return {
      errors: { general: ['Something went wrong, please try again.'] },
      success: false,
      formData: formDataFormatted,
    };
  }
}

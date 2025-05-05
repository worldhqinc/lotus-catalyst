'use server';

import { isString } from '~/lib/utils';

import { FormState } from '../_components/contact-form';
import { TicketField } from '../page';

export async function submitForm(fields: TicketField[], _prevState: FormState, formData: FormData) {
  const values: Record<string, string | null> = {};
  const errors: Record<string, string[]> = {};

  fields.forEach((field: TicketField) => {
    const fieldValue = formData.get(field.id.toString());

    values[field.id] = isString(fieldValue) ? fieldValue : null;

    if (field.required && !formData.get(field.id.toString())) {
      errors[field.id] = ['Required'];
    }
  });

  const emailValue = formData.get('email');
  const email = isString(emailValue) ? emailValue : null;

  values.email = email;

  if (!email) {
    errors.email = ['Required'];
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      success: false,
      formData: values,
    };
  }

  try {
    const customFieldValues = Object.entries(values).map(([key, value]) => {
      return {
        id: key,
        value,
      };
    });

    const response = await fetch(
      `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/requests.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          request: {
            ticket_form_id: process.env.ZENDESK_TICKET_FORM_ID,
            brand_id: process.env.ZENDESK_BRAND_ID,
            requester: {
              name: `${values['19286622537499']} ${values['19286636932123']}`,
              email,
            },
            subject: values['19286594698395'],
            comment: { body: values['19286587899803'] },
            custom_fields: customFieldValues,
          },
        }),
      },
    );

    if (!response.ok) {
      return {
        errors: { general: ['Something went wrong, please try again later.'] },
        success: false,
        formData: values,
      };
    }

    return {
      errors: null,
      success: true,
      formData: values,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error submitting form:', error);

    return {
      errors: { general: ['Something went wrong, please try again later.'] },
      success: false,
      formData: values,
    };
  }
}

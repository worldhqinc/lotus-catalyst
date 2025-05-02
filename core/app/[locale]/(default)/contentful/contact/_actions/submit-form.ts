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
      errors[field.id] = ['This field is required'];
    }
  });

  const email = isString(formData.get('email')) ? formData.get('email') : null;

  if (!email) {
    errors.email = ['This field is required'];
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      success: false,
    };
  }

  try {
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
            custom_fields: [
              {
                id: 36454171980187,
                value: values['36454171980187'],
              },
              {
                id: 19286594698395,
                value: values['19286594698395'],
              },
              {
                id: 19286587899803,
                value: values['19286587899803'],
              },
              {
                id: 19286622537499,
                value: values['19286622537499'],
              },
              {
                id: 19286636932123,
                value: values['19286636932123'],
              },
              {
                id: 19286636612123,
                value: values['19286636612123'],
              },
              {
                id: 19286636656539,
                value: values['19286636656539'],
              },
              {
                id: 19286622380315,
                value: values['19286622380315'],
              },
              {
                id: 19286636991003,
                value: values['19286636991003'],
              },
              {
                id: 19286762770075,
                value: values['19286762770075'],
              },
              {
                id: 19286761835035,
                value: values['19286761835035'],
              },
              {
                id: 19286716398235,
                value: values['19286716398235'],
              },
            ],
          },
        }),
      },
    );

    if (!response.ok) {
      return {
        errors: { general: ['Something went wrong, please try again later.'] },
        success: false,
      };
    }

    return {
      errors: null,
      success: true,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error submitting form:', error);

    return {
      errors: { general: ['Something went wrong, please try again later.'] },
      success: false,
    };
  }
}

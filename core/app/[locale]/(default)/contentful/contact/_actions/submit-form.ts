'use server';

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export async function submitForm(_prevState: unknown, formData: FormData) {
  const firstNameValue = formData.get('first_name');
  const lastNameValue = formData.get('last_name');
  const subjectValue = formData.get('subject');
  const emailValue = formData.get('email');
  const stateValue = formData.get('state');
  const inquiryValue = formData.get('inquiry');
  const modelValue = formData.get('model');

  const firstName = isString(firstNameValue) ? firstNameValue : null;
  const lastName = isString(lastNameValue) ? lastNameValue : null;
  const subject = isString(subjectValue) ? subjectValue : null;
  const email = isString(emailValue) ? emailValue : null;
  const state = isString(stateValue) ? stateValue : null;
  const inquiry = isString(inquiryValue) ? inquiryValue : null;
  const model = isString(modelValue) ? modelValue : null;

  if (!firstName || !lastName || !email || !subject) {
    throw new Error('First name, last name, email and subject are required');
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
              name: `${firstName} ${lastName}`,
              email,
            },
            subject,
            custom_fields: [
              {
                id: 19286622537499,
                value: firstName,
              },
              {
                id: 19286636932123,
                value: lastName,
              },
              {
                id: 19286636991003,
                value: state,
              },
              {
                id: 19286719042331,
                value: inquiry,
              },
              {
                id: 19286761835035,
                value: model,
              },
            ],
            comment: { body: 'test' },
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to submit form');
    }

    return { success: true };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error submitting form:', error);

    throw new Error('Failed to submit form');
  }
}

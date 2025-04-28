'use server';

import { FormState } from '../_components/contact-form';

interface ContactFormData {
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  state: string | null;
  inquiry: string | null;
  model: string | null;
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export async function submitForm(_prevState: FormState, formData: FormData) {
  const emailValue = formData.get('email');
  const subjectValue = formData.get('19286594698395');
  const descriptionValue = formData.get('19286587899803');
  const firstNameValue = formData.get('19286622537499');
  const lastNameValue = formData.get('19286636932123');
  const stateValue = formData.get('19286636991003');
  const inquiryValue = formData.get('19286719042331');
  const modelValue = formData.get('19286761835035');

  const email = isString(emailValue) ? emailValue : null;
  const subject = isString(subjectValue) ? subjectValue : null;
  const description = isString(descriptionValue) ? descriptionValue : null;
  const firstName = isString(firstNameValue) ? firstNameValue : null;
  const lastName = isString(lastNameValue) ? lastNameValue : null;
  const state = isString(stateValue) ? stateValue : null;
  const inquiry = isString(inquiryValue) ? inquiryValue : null;
  const model = isString(modelValue) ? modelValue : null;

  const formDataModel: ContactFormData = {
    email,
    firstName,
    lastName,
    state,
    inquiry,
    model,
  };

  const errors: Record<string, string[]> = {};

  if (!formDataModel.email) {
    errors.email = ['Email is required'];
  }

  if (!formDataModel.firstName) {
    errors['19286622537499'] = ['First name is required'];
  }

  if (!formDataModel.lastName) {
    errors['19286636932123'] = ['Last name is required'];
  }

  if (!formDataModel.state) {
    errors['19286636991003'] = ['State is required'];
  }

  if (!formDataModel.inquiry) {
    errors['19286719042331'] = ['Inquiry type is required'];
  }

  if (!formDataModel.model) {
    errors['19286761835035'] = ['Model is required'];
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
              name: `${firstName} ${lastName}`,
              email,
            },
            subject,
            comment: { body: description },
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

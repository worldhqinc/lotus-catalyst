'use client';

import { useActionState } from 'react';

import { submitForm } from '../_actions/submit-form';
import { TicketField } from '../page';

export interface FormState {
  errors: string[] | null;
  success: boolean;
}

export const ContactForm = ({ fields }: { fields: TicketField[] }) => {
  const initialState: FormState = {
    errors: null,
    success: false,
  };

  const [state, formAction] = useActionState(submitForm, initialState);

  if (state.success) {
    return <div>Success</div>;
  }

  return (
    <form action={formAction} className="mt-6 flex max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700" htmlFor="email">
          Email Address
        </label>
        <input
          className="rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          id="email"
          name="email"
          required
          type="email"
        />
      </div>
      {fields.map((field) => (
        <div className="flex flex-col gap-2" key={field.id}>
          <label className="text-sm font-medium text-gray-700" htmlFor={field.id.toString()}>
            {field.title_in_portal}
          </label>
          <p className="text-sm text-gray-500">{field.description}</p>
          {field.custom_field_options ? (
            <select
              className="rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              id={field.id.toString()}
              name={field.id.toString()}
              required={field.required}
            >
              <option value="">-</option>
              {field.custom_field_options.map((option) => (
                <option key={option.id} value={option.value}>
                  {option.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              className="rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              id={field.id.toString()}
              name={field.id.toString()}
              required={field.required}
              type="text"
            />
          )}
        </div>
      ))}
      <button
        className="mt-4 inline-flex justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};

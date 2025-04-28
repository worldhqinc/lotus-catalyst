'use client';

import { useActionState, useState } from 'react';

import { submitForm } from '../_actions/submit-form';
import { TicketField } from '../page';

import { Button } from '@/vibes/soul/primitives/button';
import { Modal } from '@/vibes/soul/primitives/modal';

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

  const [isOpen, setIsOpen] = useState(false);

  if (state.success) {
    return <div>Success</div>;
  }

  return (
    <Modal
      isOpen={isOpen}
      setOpen={setIsOpen}
      title="Send an email"
      trigger={<Button className="w-full md:w-auto" size="medium">Send an email</Button>}
    >
      <form action={formAction} className="mt-6 flex max-w-lg flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700" htmlFor="email">
            Email Address
          </label>
          <input
            className="focus:border-primary focus:ring-primary rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:outline-none"
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
                className="focus:border-primary focus:ring-primary rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:outline-none"
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
                className="focus:border-primary focus:ring-primary rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:outline-none"
                id={field.id.toString()}
                name={field.id.toString()}
                required={field.required}
                type="text"
              />
            )}
          </div>
        ))}
        <button
          className="bg-primary hover:bg-primary/90 focus:ring-primary mt-4 inline-flex justify-center rounded-md px-4 py-2 text-sm font-medium text-white focus:ring-2 focus:ring-offset-2 focus:outline-none"
          type="submit"
        >
          Submit
        </button>
      </form>
    </Modal>
  );
};

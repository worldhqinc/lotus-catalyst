'use client';

import { useActionState, useState } from 'react';

import { submitForm } from '../_actions/submit-form';
import { TicketField } from '../page';

import { Input } from '@/vibes/soul/form/input';
import { Label } from '@/vibes/soul/form/label';
import { Select } from '@/vibes/soul/form/select';

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
      trigger={
        <Button className="w-full md:w-auto" size="medium">
          Send an email
        </Button>
      }
    >
      <form action={formAction} className="flex max-w-lg flex-col gap-6 md:gap-4">
        <div className="flex flex-col gap-1">
          <Label className="text-foreground text-sm font-medium" htmlFor="email">
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            required
            type="email"
          />
        </div>
        {fields.map((field) => (
          <div className="flex flex-col gap-1" key={field.id}>
            <Label className="text-foreground text-sm font-medium" htmlFor={field.id.toString()}>
              {field.title_in_portal}
            </Label>
            {field.description && (
              <p className="text-contrast-400 text-xs">{field.description}</p>
            )}
            {field.custom_field_options ? (
              <Select
                id={field.id.toString()}
                name={field.id.toString()}
                options={field.custom_field_options.map((option) => ({
                  label: option.name,
                  value: option.value,
                }))}
                required={field.required}
              />
            ) : (
              <Input
                id={field.id.toString()}
                name={field.id.toString()}
                required={field.required}
                type="text"
              />
            )}
          </div>
        ))}
        <div className="flex justify-end gap-2 md:mt-2">
          <Button className="flex-1 md:flex-none" onClick={() => setIsOpen(false)} size="medium" variant="tertiary">
            Cancel
          </Button>
          <Button className="flex-1 md:flex-none" size="medium" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </Modal>
  );
};

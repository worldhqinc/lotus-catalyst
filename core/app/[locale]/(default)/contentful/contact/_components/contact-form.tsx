'use client';

import { useActionState, useEffect, useState } from 'react';

import { Input } from '@/vibes/soul/form/input';
import { Label } from '@/vibes/soul/form/label';
import { Select } from '@/vibes/soul/form/select';
import { Button } from '@/vibes/soul/primitives/button';
import { Modal } from '@/vibes/soul/primitives/modal';
import { toast } from '@/vibes/soul/primitives/toaster';

import { submitForm } from '../_actions/submit-form';
import { TicketField } from '../page';

export interface FormState {
  errors: Record<string, string[]> | null;
  success: boolean;
}

// Safely extract error strings or return undefined
const getErrorsOrUndefined = (
  errors: Record<string, string[]> | null,
  fieldName: string,
): string[] | undefined => {
  return errors?.[fieldName] || undefined;
};

export const ContactForm = ({ fields }: { fields: TicketField[] }) => {
  const initialState: FormState = {
    errors: null,
    success: false,
  };

  const handleSubmitWithParam = submitForm.bind(null, fields);
  const [state, formAction] = useActionState(handleSubmitWithParam, initialState);
  const [isOpen, setIsOpen] = useState(false);
  const [formFields, setFormFields] = useState<TicketField[]>(fields);

  const handleSelectChange = (field: TicketField, value: string) => {
    setFormFields((prevFields) => {
      return prevFields.map((f) => {
        if (
          field.conditions?.some(
            (condition) =>
              condition.value === value &&
              condition.child_fields.some((child) => child.id === f.id),
          )
        ) {
          return { ...f, hidden: false };
        }

        if (
          field.conditions?.some(
            (condition) =>
              condition.value !== value &&
              condition.child_fields.some((child) => child.id === f.id),
          )
        ) {
          return { ...f, hidden: true };
        }

        return f;
      });
    });
  };

  useEffect(() => {
    if (state.success) {
      setIsOpen(false);
      toast.success(
        '<strong>Thank you!</strong> One of our customer service reps will be in touch within 48 hours.',
      );
    }
  }, [state.success]);

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
      <form action={formAction} className="flex max-w-lg flex-col gap-6 md:gap-4" noValidate>
        <div className="flex flex-col gap-1">
          <Label className="text-foreground text-sm font-medium" htmlFor="email">
            Email Address
          </Label>
          <Input
            errors={getErrorsOrUndefined(state.errors, 'email')}
            id="email"
            name="email"
            required
            type="email"
          />
        </div>
        {formFields.map(
          (field) =>
            !field.hidden && (
              <div className="flex flex-col gap-1" key={field.id}>
                <Label
                  className="text-foreground text-sm font-medium"
                  htmlFor={field.id.toString()}
                >
                  {field.title_in_portal}
                </Label>
                {field.description ? (
                  <p className="text-contrast-400 text-xs">{field.description}</p>
                ) : null}
                {field.custom_field_options ? (
                  <Select
                    errors={getErrorsOrUndefined(state.errors, field.id.toString())}
                    id={field.id.toString()}
                    name={field.id.toString()}
                    onValueChange={(value) => handleSelectChange(field, value)}
                    options={field.custom_field_options.map((option) => ({
                      label: option.name,
                      value: option.value,
                    }))}
                    required={field.required}
                  />
                ) : (
                  <Input
                    errors={getErrorsOrUndefined(state.errors, field.id.toString())}
                    id={field.id.toString()}
                    name={field.id.toString()}
                    required={field.required}
                    type="text"
                  />
                )}
              </div>
            ),
        )}
        <div className="flex justify-end gap-2 md:mt-2">
          <Button
            className="flex-1 md:flex-none"
            onClick={() => setIsOpen(false)}
            size="medium"
            variant="tertiary"
          >
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

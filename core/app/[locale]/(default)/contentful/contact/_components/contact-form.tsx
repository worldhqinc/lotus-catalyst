'use client';

import { Loader2 } from 'lucide-react';
import { useActionState, useEffect, useRef, useState } from 'react';

import { FieldError } from '@/vibes/soul/form/field-error';
import { Input } from '@/vibes/soul/form/input';
import { Label } from '@/vibes/soul/form/label';
import { Select } from '@/vibes/soul/form/select';
import { Button } from '@/vibes/soul/primitives/button';
import { toast } from '@/vibes/soul/primitives/toaster';

import { submitForm } from '../_actions/submit-form';
import { TicketField } from '../form/page';

export interface FormState {
  errors: Record<string, string[]> | null;
  success: boolean;
  formData?: Record<string, string | null>;
}

const getErrorsOrUndefined = (
  errors: Record<string, string[]> | null,
  fieldName: string,
): string[] | undefined => {
  return errors?.[fieldName] || undefined;
};

const getFormValue = (formData: Record<string, string | null> | undefined, key: string): string => {
  if (!formData) return '';

  const value = formData[key];

  return value ?? '';
};

export const ContactForm = ({ fields }: { fields: TicketField[] }) => {
  const initialState: FormState = {
    errors: null,
    success: false,
    formData: {},
  };

  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmitWithParam = submitForm.bind(null, fields);
  const [formState, formAction, isPending] = useActionState<FormState, FormData>(
    handleSubmitWithParam,
    initialState,
  );
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
    if (formState.success) {
      formRef.current?.reset();
      window.scrollTo({ top: 0, behavior: 'smooth' });

      toast.success(
        <div
          dangerouslySetInnerHTML={{
            __html:
              '<strong>Thank you!</strong> One of our customer service reps will be in touch within 48 hours.',
          }}
        />,
      );
    }

    if (formState.errors) {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [formState.success, formState.errors, formRef]);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-6 md:gap-4"
      id="contact-form"
      noValidate
      ref={formRef}
    >
      <h2 className="mb-6 text-2xl font-medium tracking-[1.8px] uppercase">Email</h2>
      {formState.errors && (
        <FieldError className="mt-4 mb-4" key="form-errors-general">
          Form has errors, see below.
        </FieldError>
      )}
      <div className="flex flex-col gap-1">
        <Label className="text-foreground text-sm font-medium" htmlFor="email">
          Email Address *
        </Label>
        <Input
          defaultValue={getFormValue(formState.formData, 'email')}
          errors={getErrorsOrUndefined(formState.errors, 'email')}
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
              <Label className="text-foreground text-sm font-medium" htmlFor={field.id.toString()}>
                {field.title_in_portal}
                {field.required ? '*' : ''}
              </Label>
              {field.description ? (
                <p className="text-contrast-400 text-xs">{field.description}</p>
              ) : null}
              {field.custom_field_options ? (
                <Select
                  defaultValue={getFormValue(formState.formData, field.id.toString())}
                  errors={getErrorsOrUndefined(formState.errors, field.id.toString())}
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
                  defaultValue={getFormValue(formState.formData, field.id.toString())}
                  errors={getErrorsOrUndefined(formState.errors, field.id.toString())}
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
        <Button className="flex-1 md:flex-none" disabled={isPending} size="medium" type="submit">
          {isPending ? <Loader2 className="mr-2 animate-spin" size={16} /> : 'Submit'}
        </Button>
      </div>
    </form>
  );
};

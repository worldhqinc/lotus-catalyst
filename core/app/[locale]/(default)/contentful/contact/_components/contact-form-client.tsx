'use client';

import { Loader2 } from 'lucide-react';
import { type ChangeEvent, useActionState, useEffect, useRef, useState } from 'react';

import { FormStatus } from '@/vibes/soul/form/form-status';
import { Input } from '@/vibes/soul/form/input';
import { Label } from '@/vibes/soul/form/label';
import { SelectField } from '@/vibes/soul/form/select-field';
import { Button } from '@/vibes/soul/primitives/button';
import { ButtonLink } from '@/vibes/soul/primitives/button-link';
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
  return errors?.[fieldName]?.map((error) =>
    error === 'Required' ? `${fieldName} is required` : error,
  );
};

export const ContactFormClient = ({ fields }: { fields: TicketField[] }) => {
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

  const [formValues, setFormValues] = useState<Record<string, string>>(
    fields.reduce((acc, field) => ({ ...acc, [field.id.toString()]: '' }), { email: '' }),
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (field: TicketField, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [field.id.toString()]: value,
    }));

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
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast.success(
        <div
          dangerouslySetInnerHTML={{
            __html:
              '<strong>Thank you!</strong> One of our customer service reps will be in touch within 48 hours.',
          }}
        />,
      );
      setFormValues(
        fields.reduce((acc, field) => ({ ...acc, [field.id.toString()]: '' }), { email: '' }),
      );
      setFormFields(fields);
      formRef.current?.reset();
    }
  }, [formState.success, fields]);

  // Force select components to re-render when form state changes
  const formDataKey = JSON.stringify(formState.formData);

  return (
    <form action={formAction} className="flex flex-col gap-6 md:gap-4" noValidate ref={formRef}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-medium tracking-[1.8px] uppercase">Email</h2>
        <p className="text-foreground text-sm">
          Required Fields <span className="text-contrast-400">*</span>
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <Label className="text-foreground text-sm font-medium" htmlFor="email">
          Email Address<span className="text-contrast-400">*</span>
        </Label>
        <Input
          data-1p-ignore
          errors={getErrorsOrUndefined(formState.errors, 'email')}
          id="email"
          name="email"
          onChange={handleInputChange}
          required
          type="email"
          value={formValues.email}
        />
      </div>
      {formFields.map(
        (field) =>
          !field.hidden && (
            <div className="flex flex-col gap-1" key={field.id}>
              {field.custom_field_options ? (
                <SelectField
                  description={field.description}
                  errors={getErrorsOrUndefined(formState.errors, field.id.toString())}
                  id={field.id.toString()}
                  key={`${field.id}-${formDataKey}`}
                  label={field.title_in_portal}
                  name={field.id.toString()}
                  onValueChange={(value) => handleSelectChange(field, value)}
                  options={field.custom_field_options.map((option) => ({
                    label: option.name,
                    value: option.value,
                  }))}
                  required={field.required}
                  value={formValues[field.id.toString()] ?? ''}
                />
              ) : (
                <>
                  <Label
                    className="text-foreground text-sm font-medium"
                    htmlFor={field.id.toString()}
                  >
                    {field.title_in_portal}
                    {field.required ? <span className="text-contrast-400">*</span> : ''}
                  </Label>
                  {field.description ? (
                    <p className="text-contrast-400 text-xs">{field.description}</p>
                  ) : null}
                  <Input
                    errors={getErrorsOrUndefined(formState.errors, field.id.toString())}
                    id={field.id.toString()}
                    name={field.id.toString()}
                    onChange={handleInputChange}
                    required={field.required}
                    type="text"
                    value={formValues[field.id.toString()]}
                  />
                </>
              )}
            </div>
          ),
      )}
      <div className="flex justify-end gap-2 md:mt-2">
        <ButtonLink
          className="flex-1 md:flex-none"
          href="/contact"
          size="medium"
          variant="tertiary"
        >
          Back to Contact Us
        </ButtonLink>
        <Button className="flex-1 md:flex-none" disabled={isPending} size="medium" type="submit">
          {isPending ? <Loader2 className="mr-2 animate-spin" size={16} /> : 'Submit'}
        </Button>
      </div>
      {formState.errors && (
        <FormStatus className="mt-4 mb-4" key="form-errors-general" type="error">
          Form has errors, see above.
        </FormStatus>
      )}
    </form>
  );
};

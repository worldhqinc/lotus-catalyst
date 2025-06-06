'use client';

import { Loader2 } from 'lucide-react';
import { type ChangeEvent, useActionState, useEffect, useRef, useState } from 'react';

import { Checkbox } from '@/vibes/soul/form/checkbox';
import { FormStatus } from '@/vibes/soul/form/form-status';
import { Input } from '@/vibes/soul/form/input';
import { Label } from '@/vibes/soul/form/label';
import { SelectField } from '@/vibes/soul/form/select-field';
import { Button } from '@/vibes/soul/primitives/button';
import { toast } from '@/vibes/soul/primitives/toaster';
import { Link } from '~/components/link';

import { submitForm } from '../_actions/submit-form';

interface FormState {
  errors: Record<string, string[]> | null;
  success: boolean;
  formData?: Record<string, string | null>;
}

interface Props {
  modelNumberOptions: Array<{ label: string; value: string }>;
}

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  modelNumber: string;
  subscribe: string;
}

const getErrorsOrUndefined = (
  errors: Record<string, string[]> | null,
  fieldName: string,
): string[] | undefined => {
  return errors?.[fieldName] || undefined;
};

export function ProductRegistrationForm({ modelNumberOptions }: Props) {
  const initialState: FormState = {
    errors: null,
    success: false,
    formData: {},
  };

  const formRef = useRef<HTMLFormElement>(null);
  const [formState, formAction, isPending] = useActionState<FormState, FormData>(
    submitForm,
    initialState,
  );

  const [formValues, setFormValues] = useState<FormValues>({
    firstName: '',
    lastName: '',
    email: '',
    modelNumber: '',
    subscribe: 'off',
  });

  useEffect(() => {
    if (formState.success) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast.success('Thank you for registering your product!');
      setFormValues({
        firstName: '',
        lastName: '',
        email: '',
        modelNumber: '',
        subscribe: 'off',
      });
    }
  }, [formState.success]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormValues((prev) => ({
      ...prev,
      subscribe: checked ? 'on' : 'off',
    }));
  };

  // Force select components to re-render when form state changes
  const formDataKey = JSON.stringify(formState.formData);

  return (
    <div className="bg-contrast-100 product-registration-form px-4 py-8 md:py-16">
      <div className="mx-auto max-w-2xl rounded bg-white p-4 md:p-8">
        <form action={formAction} className="flex flex-col gap-8" ref={formRef}>
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="mb-6 text-2xl font-medium tracking-[1.8px] uppercase">About You</h2>
              <p className="text-foreground text-sm">
                Required Fields <span className="text-contrast-400">*</span>
              </p>
            </div>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex flex-1 flex-col gap-1">
                <Label className="text-foreground text-sm font-medium" htmlFor="firstName">
                  First name<span className="text-contrast-400">*</span>
                </Label>
                <Input
                  errors={getErrorsOrUndefined(formState.errors, 'firstName')}
                  id="firstName"
                  name="firstName"
                  onChange={handleInputChange}
                  type="text"
                  value={formValues.firstName}
                />
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <Label className="text-foreground text-sm font-medium" htmlFor="lastName">
                  Last name<span className="text-contrast-400">*</span>
                </Label>
                <Input
                  errors={getErrorsOrUndefined(formState.errors, 'lastName')}
                  id="lastName"
                  name="lastName"
                  onChange={handleInputChange}
                  type="text"
                  value={formValues.lastName}
                />
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-1">
              <Label className="text-foreground text-sm font-medium" htmlFor="email">
                Email address<span className="text-contrast-400">*</span>
              </Label>
              <Input
                data-1p-ignore
                errors={getErrorsOrUndefined(formState.errors, 'email')}
                id="email"
                name="email"
                onChange={handleInputChange}
                type="email"
                value={formValues.email}
              />
            </div>
          </div>
          <div>
            <h2 className="mb-6 text-2xl font-medium tracking-[1.8px] uppercase">Your Product</h2>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex flex-1 flex-col gap-1">
                <SelectField
                  className="flex-1"
                  errors={getErrorsOrUndefined(formState.errors, 'modelNumber')}
                  id="modelNumber"
                  key={`modelNumber-${formDataKey}`}
                  label="Model number"
                  name="modelNumber"
                  onValueChange={(value) => handleSelectChange('modelNumber', value)}
                  options={modelNumberOptions}
                  placeholder="Select a model number"
                  required
                  value={formValues.modelNumber}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <Checkbox
              checked={formValues.subscribe === 'on'}
              id="subscribe"
              name="subscribe"
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="subscribe">Yes! Please add me to your mailing list.</Label>
          </div>
          <Button className="md:self-start" disabled={isPending} size="medium" type="submit">
            {isPending ? <Loader2 className="mr-2 animate-spin" size={16} /> : 'Submit'}
          </Button>
          {formState.errors?.general ? (
            <FormStatus type="error">{formState.errors.general.join(', ')}</FormStatus>
          ) : null}
          <p className="text-xs leading-[20px]">
            Lotus Cooking needs the contact information you provide to us to contact you about our
            products and services. You may unsubscribe from these communications at any time. For
            information on how to unsubscribe, as well as our privacy practices and commitment to
            protecting your privacy, please review our{' '}
            <Link className="text-primary" href="/policies/privacy-policy">
              Privacy Policy
            </Link>
            .
          </p>
        </form>
      </div>
    </div>
  );
}

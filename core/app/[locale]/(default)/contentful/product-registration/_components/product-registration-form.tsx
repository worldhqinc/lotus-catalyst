'use client';

import { Loader2 } from 'lucide-react';
import { useActionState, useEffect, useRef } from 'react';

import { Checkbox } from '@/vibes/soul/form/checkbox';
import { FormStatus } from '@/vibes/soul/form/form-status';
import { Input } from '@/vibes/soul/form/input';
import { Label } from '@/vibes/soul/form/label';
import { Select } from '@/vibes/soul/form/select';
import { Button } from '@/vibes/soul/primitives/button';
import { toast } from '@/vibes/soul/primitives/toaster';
import { Link } from '~/components/link';

import { submitForm } from '../_actions/submit-form';

interface FormState {
  errors: Record<string, string[]> | null;
  success: boolean;
  formData?: Record<string, string | boolean | null>;
}

interface Props {
  modelNumberOptions: Array<{ label: string; value: string }>;
  productTypeOptions: Array<{ label: string; value: string }>;
}

const getErrorsOrUndefined = (
  errors: Record<string, string[]> | null,
  fieldName: string,
): string[] | undefined => {
  return errors?.[fieldName] || undefined;
};

const getFormValue = (
  formData: Record<string, string | boolean | null> | undefined,
  key: string,
): string => {
  if (!formData) return '';

  const value = formData[key];

  if (typeof value === 'boolean') return value ? 'on' : 'off';

  return value ?? '';
};

export function ProductRegistrationForm({ modelNumberOptions, productTypeOptions }: Props) {
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

  useEffect(() => {
    if (formState.success) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast.success('Thank you for registering your product!');
      formRef.current?.reset();
    }
  }, [formState.success]);

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
                  defaultValue={getFormValue(formState.formData, 'firstName')}
                  errors={getErrorsOrUndefined(formState.errors, 'firstName')}
                  id="firstName"
                  name="firstName"
                  type="text"
                />
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <Label className="text-foreground text-sm font-medium" htmlFor="lastName">
                  Last name<span className="text-contrast-400">*</span>
                </Label>
                <Input
                  defaultValue={getFormValue(formState.formData, 'lastName')}
                  errors={getErrorsOrUndefined(formState.errors, 'lastName')}
                  id="lastName"
                  name="lastName"
                  type="text"
                />
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-1">
              <Label className="text-foreground text-sm font-medium" htmlFor="email">
                Email address<span className="text-contrast-400">*</span>
              </Label>
              <Input
                defaultValue={getFormValue(formState.formData, 'email')}
                errors={getErrorsOrUndefined(formState.errors, 'email')}
                id="email"
                name="email"
                type="email"
              />
            </div>
          </div>
          <div>
            <h2 className="mb-6 text-2xl font-medium tracking-[1.8px] uppercase">Your Product</h2>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex flex-1 flex-col gap-1">
                <Label className="text-foreground text-sm font-medium" htmlFor="productType">
                  Product type<span className="text-contrast-400">*</span>
                </Label>
                <Select
                  aria-label="Select a product type"
                  className="flex-1"
                  defaultValue={getFormValue(formState.formData, 'productType')}
                  errors={getErrorsOrUndefined(formState.errors, 'productType')}
                  id="productType"
                  key={`productType-${formDataKey}`}
                  name="productType"
                  options={productTypeOptions}
                  placeholder="Select a product type"
                />
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <Label className="text-foreground text-sm font-medium" htmlFor="modelNumber">
                  Model number<span className="text-contrast-400">*</span>
                </Label>
                <Select
                  aria-label="Select a model number"
                  className="flex-1"
                  defaultValue={getFormValue(formState.formData, 'modelNumber')}
                  errors={getErrorsOrUndefined(formState.errors, 'modelNumber')}
                  id="modelNumber"
                  key={`modelNumber-${formDataKey}`}
                  name="modelNumber"
                  options={modelNumberOptions}
                  placeholder="Select a model number"
                />
              </div>
            </div>
          </div>
          <div>
            <div className="flex gap-4">
              <Checkbox
                defaultChecked={getFormValue(formState.formData, 'subscribe') === 'on'}
                id="subscribe"
                name="subscribe"
              />
              <Label htmlFor="subscribe">Yes! Please add me to your mailing list.</Label>
            </div>
          </div>
          <Button className="md:self-start" disabled={isPending} size="medium" type="submit">
            {isPending ? <Loader2 className="mr-2 animate-spin" size={16} /> : 'Submit'}
          </Button>
          {formState.errors?.general ? (
            <FormStatus type="error">{formState.errors.general.join(', ')}</FormStatus>
          ) : null}
          <div>
            <p className="text-xs leading-[26px]">
              Lotus Cooking needs the contact information you provide to us to contact you about our
              products and services. You may unsubscribe from these communications at any time. For
              information on how to unsubscribe, as well as our privacy practices and commitment to
              protecting your privacy, please review our{' '}
              <Link className="text-primary" href="/privacy-policy">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

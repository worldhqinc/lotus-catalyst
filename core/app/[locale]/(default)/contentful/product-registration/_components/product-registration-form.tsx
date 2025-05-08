'use client';

import { Loader2 } from 'lucide-react';
import { useActionState } from 'react';

import { Checkbox } from '@/vibes/soul/form/checkbox';
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
  formData?: Record<string, string | null>;
}

interface Props {
  productTypeOptions: Array<{ label: string; value: string }>;
  modelNumberOptions: Array<{ label: string; value: string }>;
}

export function ProductRegistrationForm({ productTypeOptions, modelNumberOptions }: Props) {
  const initialState: FormState = {
    errors: null,
    success: false,
    formData: {},
  };

  const [formState, formAction, isPending] = useActionState<FormState, FormData>(
    submitForm,
    initialState,
  );

  if (formState.success) {
    toast.success('Thank you for registering your product!');
  }

  return (
    <div className="bg-contrast-100 px-4 py-8 md:py-16">
      <div className="mx-auto max-w-2xl rounded bg-white p-4 md:p-8">
        <form action={formAction} className="flex flex-col gap-8" id="product-registration-form">
          {formState.errors?.general && (
            <div className="text-error text-sm">{formState.errors.general.join(', ')}</div>
          )}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="mb-6 text-2xl font-medium tracking-[1.8px] uppercase">About You</h2>
              <p className="text-md text-contrast-400">Required Fields *</p>
            </div>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex flex-1 flex-col gap-1">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  defaultValue={formState.formData?.firstName ?? ''}
                  errors={formState.errors?.firstName}
                  id="firstName"
                  name="firstName"
                  type="text"
                />
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  defaultValue={formState.formData?.lastName ?? ''}
                  errors={formState.errors?.lastName}
                  id="lastName"
                  name="lastName"
                  type="text"
                />
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-1">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                defaultValue={formState.formData?.email ?? ''}
                errors={formState.errors?.email}
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
                <Label htmlFor="productType">Product Type *</Label>
                <Select
                  aria-label="Select a Product Type"
                  className="flex-1"
                  defaultValue={formState.formData?.productType ?? ''}
                  errors={formState.errors?.productType}
                  key="productTypeSelect"
                  name="productType"
                  options={productTypeOptions}
                />
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <Label htmlFor="modelNumber">Model Number *</Label>
                <Select
                  aria-label="Select a Model Number"
                  className="flex-1"
                  defaultValue={formState.formData?.modelNumber ?? ''}
                  errors={formState.errors?.modelNumber}
                  key="modelNumberSelect"
                  name="modelNumber"
                  options={modelNumberOptions}
                />
              </div>
            </div>
          </div>
          <div>
            <div className="flex gap-4">
              <Checkbox
                defaultChecked={formState.formData?.subscribe === 'on'}
                id="subscribe"
                name="subscribe"
              />
              <Label htmlFor="subscribe">Yes! Please add me to your mailing list.</Label>
            </div>
          </div>
          <Button className="md:self-start" disabled={isPending} size="medium" type="submit">
            {isPending ? <Loader2 className="mr-2 animate-spin" size={16} /> : 'Submit'}
          </Button>
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

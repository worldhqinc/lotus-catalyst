'use client';

import { getFormProps, getInputProps, SubmissionResult, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { FormStatus } from '@/vibes/soul/form/form-status';
import { Input } from '@/vibes/soul/form/input';
import { Label } from '@/vibes/soul/form/label';
import { Button } from '@/vibes/soul/primitives/button';

import { schema } from './schema';

type Action<State, Payload> = (state: Awaited<State>, payload: Payload) => State | Promise<State>;

export type SignInAction = Action<SubmissionResult | null, FormData>;

interface Props {
  action: SignInAction;
  emailLabel?: string;
  passwordLabel?: string;
  submitLabel?: string;
}

export function SignInForm({
  action,
  emailLabel = 'Email',
  passwordLabel = 'Password',
  submitLabel = 'Sign in',
}: Props) {
  const [lastResult, formAction] = useActionState(action, null);
  const [form, fields] = useForm({
    lastResult,
    defaultValue: { email: '', password: '' },
    constraint: getZodConstraint(schema),
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  return (
    <form {...getFormProps(form)} action={formAction} className="flex grow flex-col gap-8">
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-1">
          <Label className="text-foreground text-sm font-medium" htmlFor={fields.email.id}>
            {emailLabel}
            <span className="text-contrast-400">*</span>
          </Label>
          <Input
            {...getInputProps(fields.email, { type: 'text' })}
            errors={fields.email.errors}
            key={fields.email.id}
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-foreground text-sm font-medium" htmlFor={fields.password.id}>
            {passwordLabel}
            <span className="text-contrast-400">*</span>
          </Label>
          <Input
            {...getInputProps(fields.password, { type: 'password' })}
            errors={fields.password.errors}
            key={fields.password.id}
            required
          />
        </div>
      </div>
      <SubmitButton>{submitLabel}</SubmitButton>
      {form.errors?.map((error, index) => (
        <FormStatus key={index} type="error">
          {error}
        </FormStatus>
      ))}
    </form>
  );
}

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <Button
      className="mt-auto @2xl:self-start"
      loading={pending}
      size="medium"
      type="submit"
      variant="primary"
    >
      {children}
    </Button>
  );
}

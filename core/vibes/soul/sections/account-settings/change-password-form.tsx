'use client';

import { getFormProps, getInputProps, SubmissionResult, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { ReactNode, useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';

import { Input } from '@/vibes/soul/form/input';
import { Label } from '@/vibes/soul/form/label';
import { Button } from '@/vibes/soul/primitives/button';

import { changePasswordSchema } from './schema';

type Action<State, Payload> = (state: Awaited<State>, payload: Payload) => State | Promise<State>;

export type ChangePasswordAction = Action<SubmissionResult | null, FormData>;

export interface ChangePasswordFormProps {
  action: ChangePasswordAction;
  currentPasswordLabel?: string;
  newPasswordLabel?: string;
  confirmPasswordLabel?: string;
  submitLabel?: string;
}

export function ChangePasswordForm({
  action,
  currentPasswordLabel = 'Current password',
  newPasswordLabel = 'New password',
  confirmPasswordLabel = 'Confirm password',
  submitLabel = 'Update',
}: ChangePasswordFormProps) {
  const [lastResult, formAction] = useActionState(action, null);
  const [form, fields] = useForm({
    constraint: getZodConstraint(changePasswordSchema),
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: changePasswordSchema });
    },
  });

  useEffect(() => {
    if (lastResult?.error) {
      // eslint-disable-next-line no-console
      console.log(lastResult.error);
    }
  }, [lastResult]);

  return (
    <form {...getFormProps(form)} action={formAction} className="space-y-5">
      <div className="flex flex-col gap-1">
        <Label className="text-foreground text-sm font-medium" htmlFor={fields.currentPassword.id}>
          {currentPasswordLabel}
          <span className="text-contrast-400">*</span>
        </Label>
        <Input
          {...getInputProps(fields.currentPassword, { type: 'password' })}
          errors={fields.currentPassword.errors}
          key={fields.currentPassword.id}
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label className="text-foreground text-sm font-medium" htmlFor={fields.password.id}>
          {newPasswordLabel}
          <span className="text-contrast-400">*</span>
        </Label>
        <Input
          {...getInputProps(fields.password, { type: 'password' })}
          errors={fields.password.errors}
          key={fields.password.id}
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label className="text-foreground text-sm font-medium" htmlFor={fields.confirmPassword.id}>
          {confirmPasswordLabel}
          <span className="text-contrast-400">*</span>
        </Label>
        <Input
          {...getInputProps(fields.confirmPassword, { type: 'password' })}
          className="mb-6"
          errors={fields.confirmPassword.errors}
          key={fields.confirmPassword.id}
          required
        />
      </div>
      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}

function SubmitButton({ children }: { children: ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <Button loading={pending} size="medium" type="submit">
      {children}
    </Button>
  );
}

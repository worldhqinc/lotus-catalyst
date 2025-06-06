'use client';

import { getFormProps, getInputProps, SubmissionResult, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { ReactNode, useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';

import { Input } from '@/vibes/soul/form/input';
import { Label } from '@/vibes/soul/form/label';
import { Button } from '@/vibes/soul/primitives/button';
import { toast } from '@/vibes/soul/primitives/toaster';

import { changePasswordSchema } from './schema';

type Action<S, P> = (state: Awaited<S>, payload: P) => S | Promise<S>;

interface State {
  lastResult: SubmissionResult | null;
  successMessage?: string;
}

export type ChangePasswordAction = Action<State, FormData>;

export interface ChangePasswordFormProps {
  action: ChangePasswordAction;
  currentPasswordLabel?: string;
  newPasswordLabel?: string;
  confirmPasswordLabel?: string;
  submitLabel?: string;
}

export function ChangePasswordForm({
  action,
  currentPasswordLabel = 'Current Password',
  newPasswordLabel = 'New Password',
  confirmPasswordLabel = 'Confirm Password',
  submitLabel = 'Update',
}: ChangePasswordFormProps) {
  const [state, formAction] = useActionState(action, { lastResult: null });
  const [form, fields] = useForm({
    constraint: getZodConstraint(changePasswordSchema),
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: changePasswordSchema });
    },
  });

  useEffect(() => {
    if (state.lastResult?.status === 'success' && state.successMessage != null) {
      toast.success(state.successMessage);
    }

    if (state.lastResult?.error) {
      // eslint-disable-next-line no-console
      console.log(state.lastResult.error);
    }
  }, [state]);

  return (
    <form {...getFormProps(form)} action={formAction} className="space-y-5">
      <div className="flex flex-col gap-1">
        <Label className="text-foreground text-sm font-medium" htmlFor={fields.currentPassword.id}>
          {currentPasswordLabel}
          <span className="text-contrast-400">*</span>
        </Label>
        <Input
          {...getInputProps(fields.currentPassword, { type: 'password' })}
          errors={fields.currentPassword.errors?.map((error) =>
            error === 'Required' ? `${currentPasswordLabel} is required` : error,
          )}
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
          errors={fields.password.errors?.map((error) =>
            error === 'Required' ? `${newPasswordLabel} is required` : error,
          )}
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
          errors={fields.confirmPassword.errors?.map((error) =>
            error === 'Required' ? `${confirmPasswordLabel} is required` : error,
          )}
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

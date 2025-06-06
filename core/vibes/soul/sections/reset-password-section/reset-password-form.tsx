'use client';

import { getFormProps, getInputProps, SubmissionResult, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { useActionState } from 'react';

import { FormStatus } from '@/vibes/soul/form/form-status';
import { Input } from '@/vibes/soul/form/input';
import { Label } from '@/vibes/soul/form/label';
import { Button } from '@/vibes/soul/primitives/button';

import { schema } from './schema';

type Action<State, Payload> = (state: Awaited<State>, payload: Payload) => State | Promise<State>;

export type ResetPasswordAction = Action<
  { lastResult: SubmissionResult | null; successMessage?: string },
  FormData
>;

interface Props {
  action: ResetPasswordAction;
  submitLabel?: string;
  newPasswordLabel?: string;
  confirmPasswordLabel?: string;
}

export function ResetPasswordForm({
  action,
  newPasswordLabel = 'New password',
  confirmPasswordLabel = 'Confirm Password',
  submitLabel = 'Update',
}: Props) {
  const [{ lastResult, successMessage }, formAction, isPending] = useActionState(action, {
    lastResult: null,
  });
  const [form, fields] = useForm({
    lastResult,
    constraint: getZodConstraint(schema),
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  return (
    <form {...getFormProps(form)} action={formAction} className="flex grow flex-col gap-8">
      <div className="space-y-4">
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
          <Label
            className="text-foreground text-sm font-medium"
            htmlFor={fields.confirmPassword.id}
          >
            {confirmPasswordLabel}
            <span className="text-contrast-400">*</span>
          </Label>
          <Input
            {...getInputProps(fields.confirmPassword, { type: 'password' })}
            errors={fields.confirmPassword.errors?.map((error) =>
              error === 'Required' ? `${confirmPasswordLabel} is required` : error,
            )}
            key={fields.confirmPassword.id}
            required
          />
        </div>
      </div>
      <Button
        className="@2xl:self-start"
        loading={isPending}
        size="medium"
        type="submit"
        variant="primary"
      >
        {submitLabel}
      </Button>
      {form.errors?.map((error, index) => (
        <FormStatus key={index} type="error">
          {error}
        </FormStatus>
      ))}
      {form.status === 'success' && successMessage != null && (
        <FormStatus>{successMessage}</FormStatus>
      )}
    </form>
  );
}

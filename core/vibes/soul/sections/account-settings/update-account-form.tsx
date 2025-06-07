'use client';

import { getFormProps, getInputProps, SubmissionResult, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { useActionState, useEffect, useOptimistic, useTransition } from 'react';
import { z } from 'zod';

import { Input } from '@/vibes/soul/form/input';
import { Label } from '@/vibes/soul/form/label';
import { Button } from '@/vibes/soul/primitives/button';
import { toast } from '@/vibes/soul/primitives/toaster';

import { updateAccountSchema } from './schema';

type Action<S, P> = (state: Awaited<S>, payload: P) => S | Promise<S>;

export type UpdateAccountAction = Action<State, FormData>;

export type Account = z.infer<typeof updateAccountSchema>;

interface State {
  account: Account;
  successMessage?: string;
  lastResult: SubmissionResult | null;
}

export interface UpdateAccountFormProps {
  action: UpdateAccountAction;
  account: Account;
  firstNameLabel?: string;
  lastNameLabel?: string;
  emailLabel?: string;
  companyLabel?: string;
  submitLabel?: string;
}

export function UpdateAccountForm({
  action,
  account,
  firstNameLabel = 'First Name',
  lastNameLabel = 'Last Name',
  emailLabel = 'Email',
  companyLabel = 'Company',
  submitLabel = 'Update',
}: UpdateAccountFormProps) {
  const [state, formAction] = useActionState(action, { account, lastResult: null });
  const [pending, startTransition] = useTransition();

  const [optimisticState, setOptimisticState] = useOptimistic<State, FormData>(
    state,
    (prevState, formData) => {
      const intent = formData.get('intent');
      const submission = parseWithZod(formData, { schema: updateAccountSchema });

      if (submission.status !== 'success') return prevState;

      switch (intent) {
        case 'update': {
          return {
            ...prevState,
            account: submission.value,
          };
        }

        default:
          return prevState;
      }
    },
  );

  const [form, fields] = useForm({
    lastResult: state.lastResult,
    defaultValue: optimisticState.account,
    constraint: getZodConstraint(updateAccountSchema),
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: updateAccountSchema });
    },
  });

  useEffect(() => {
    if (state.lastResult?.status === 'success' && typeof state.successMessage === 'string') {
      toast.success(state.successMessage);
    }
  }, [state]);

  return (
    <form
      {...getFormProps(form)}
      action={(formData) => {
        startTransition(() => {
          formAction(formData);
          setOptimisticState(formData);
        });
      }}
      className="space-y-5"
    >
      <div className="flex flex-col gap-5 md:flex-row">
        <div className="flex flex-1 flex-col gap-1">
          <Label className="text-foreground text-sm font-medium" htmlFor={fields.firstName.id}>
            {firstNameLabel}
            <span className="text-contrast-400">*</span>
          </Label>
          <Input
            {...getInputProps(fields.firstName, { type: 'text' })}
            errors={fields.firstName.errors?.map((error) =>
              error === 'Required' ? `${firstNameLabel} is required` : error,
            )}
            key={fields.firstName.id}
            required
          />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <Label className="text-foreground text-sm font-medium" htmlFor={fields.lastName.id}>
            {lastNameLabel}
            <span className="text-contrast-400">*</span>
          </Label>
          <Input
            {...getInputProps(fields.lastName, { type: 'text' })}
            errors={fields.lastName.errors?.map((error) =>
              error === 'Required' ? `${lastNameLabel} is required` : error,
            )}
            key={fields.lastName.id}
            required
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <Label className="text-foreground text-sm font-medium" htmlFor={fields.email.id}>
          {emailLabel}
          <span className="text-contrast-400">*</span>
        </Label>
        <Input
          {...getInputProps(fields.email, { type: 'text' })}
          errors={fields.email.errors?.map((error) =>
            error === 'Required' ? `${emailLabel} is required` : error,
          )}
          key={fields.email.id}
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label className="text-foreground text-sm font-medium" htmlFor={fields.company.id}>
          {companyLabel}
        </Label>
        <Input
          {...getInputProps(fields.company, { type: 'text' })}
          errors={fields.company.errors?.map((error) =>
            error === 'Required' ? `${companyLabel} is required` : error,
          )}
          key={fields.company.id}
        />
      </div>
      <Button loading={pending} name="intent" size="medium" type="submit" value="update">
        {submitLabel}
      </Button>
    </form>
  );
}

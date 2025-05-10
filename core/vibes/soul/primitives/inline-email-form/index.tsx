'use client';

import { getFormProps, getInputProps, SubmissionResult, useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { clsx } from 'clsx';
import { ArrowRight } from 'lucide-react';
import { useActionState } from 'react';

import { FormStatus } from '@/vibes/soul/form/form-status';
import { Button } from '@/vibes/soul/primitives/button';

import { schema } from './schema';

type Action<State, Payload> = (
  prevState: Awaited<State>,
  formData: Payload,
) => State | Promise<State>;

export function InlineEmailForm({
  className,
  arrowClassName,
  inputClassName,
  inputContainerClassName,
  action,
  submitLabel = 'Submit',
  placeholder = 'Enter your email',
}: {
  className?: string;
  arrowClassName?: string;
  inputClassName?: string;
  inputContainerClassName?: string;
  placeholder?: string;
  submitLabel?: string;
  action: Action<
    {
      lastResult: SubmissionResult | null;
      successMessage?: string | null;
      errorMessage?: string | null;
    },
    FormData
  >;
}) {
  const [{ lastResult, successMessage, errorMessage }, formAction, isPending] = useActionState(
    action,
    {
      lastResult: null,
      successMessage: null,
      errorMessage: null,
    },
  );

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
  });

  const { errors = [] } = fields.email;

  return (
    <form
      {...getFormProps(form)}
      action={formAction}
      className={clsx('newsletter-signup-form space-y-2', className)}
    >
      <div
        className={clsx(
          'bg-background focus-within:border-primary relative border-b text-base transition-colors duration-200 focus:outline-hidden',
          errors.length ? 'border-error' : 'border-contrast-200',
          inputContainerClassName,
        )}
      >
        <input
          {...getInputProps(fields.email, { type: 'email' })}
          className={clsx(
            'placeholder-contrast-gray-500 text-foreground placeholder:font-heading h-14 w-full bg-transparent pr-16 placeholder:font-normal focus:outline-hidden @4xl:placeholder:text-xl',
            inputClassName,
          )}
          data-1p-ignore
          key={fields.email.id}
          placeholder={placeholder}
        />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 pr-2">
          <Button
            aria-label={submitLabel}
            className="bg-transparent"
            loading={isPending}
            shape="circle"
            size="small"
            type="submit"
            variant="tertiary"
          >
            <ArrowRight className={arrowClassName} size={20} strokeWidth={1.5} />
          </Button>
        </div>
      </div>
      {errors.map((error, index) => (
        <FormStatus key={index} type="error">
          {error}
        </FormStatus>
      ))}
      {form.status === 'success' && errorMessage ? (
        <FormStatus type="error">{errorMessage}</FormStatus>
      ) : null}
      {form.status === 'success' && successMessage ? (
        <FormStatus type="success">{successMessage}</FormStatus>
      ) : null}
    </form>
  );
}

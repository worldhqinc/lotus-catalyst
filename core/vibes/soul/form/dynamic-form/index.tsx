/* eslint-disable complexity */
'use client';

import {
  FieldMetadata,
  FormProvider,
  getFormProps,
  getInputProps,
  SubmissionResult,
  useForm,
  useInputControl,
} from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { MouseEvent, ReactNode, startTransition, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { z } from 'zod';

import { ButtonRadioGroup } from '@/vibes/soul/form/button-radio-group';
import { CardRadioGroup } from '@/vibes/soul/form/card-radio-group';
import { Checkbox } from '@/vibes/soul/form/checkbox';
import { CheckboxGroup } from '@/vibes/soul/form/checkbox-group';
import { DatePicker } from '@/vibes/soul/form/date-picker';
import { FormStatus } from '@/vibes/soul/form/form-status';
import { Input } from '@/vibes/soul/form/input';
import { Label } from '@/vibes/soul/form/label';
import { NumberInput } from '@/vibes/soul/form/number-input';
import { RadioGroup } from '@/vibes/soul/form/radio-group';
import { SelectField } from '@/vibes/soul/form/select-field';
import { SwatchRadioGroup } from '@/vibes/soul/form/swatch-radio-group';
import { Textarea } from '@/vibes/soul/form/textarea';
import { Button, ButtonProps } from '@/vibes/soul/primitives/button';
import { Link } from '~/components/link';

import { Field, FieldGroup, schema } from './schema';

type Action<S, P> = (state: Awaited<S>, payload: P) => S | Promise<S>;

interface State<F extends Field> {
  fields: Array<F | FieldGroup<F>>;
  lastResult: SubmissionResult | null;
}

export type DynamicFormAction<F extends Field> = Action<State<F>, FormData>;

export interface DynamicFormProps<F extends Field> {
  fields: Array<F | FieldGroup<F>>;
  action: DynamicFormAction<F>;
  buttonSize?: ButtonProps['size'];
  cancelLabel?: string;
  submitLabel?: string;
  submitName?: string;
  submitValue?: string;
  onCancel?: (e: MouseEvent<HTMLButtonElement>) => void;
  isRegisterForm?: boolean;
  required?: boolean;
}

export function DynamicForm<F extends Field>({
  action,
  fields: defaultFields,
  buttonSize = 'medium',
  cancelLabel = 'Cancel',
  submitLabel = 'Submit',
  submitName,
  submitValue,
  isRegisterForm = false,
  onCancel,
  required = false,
}: DynamicFormProps<F>) {
  const [{ lastResult, fields }, formAction] = useActionState(action, {
    fields: defaultFields,
    lastResult: null,
  });
  const dynamicSchema = schema(fields, required);
  const defaultValue = fields
    .flatMap((f) => (Array.isArray(f) ? f : [f]))
    .reduce<z.infer<typeof dynamicSchema>>(
      (acc, field) => ({
        ...acc,
        [field.name]: 'defaultValue' in field ? field.defaultValue : '',
      }),
      {},
    );
  const [form, formFields] = useForm({
    lastResult,
    constraint: getZodConstraint(dynamicSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: dynamicSchema });
    },
    defaultValue,
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onSubmit(event, { formData }) {
      event.preventDefault();

      startTransition(() => {
        formAction(formData);
      });
    },
  });

  return (
    <FormProvider context={form.context}>
      <form {...getFormProps(form)} action={formAction}>
        <div className="space-y-6">
          {fields.map((field, index) => {
            if (Array.isArray(field)) {
              return (
                <div className="flex flex-col gap-4 lg:flex-row lg:[&_>*]:flex-1" key={index}>
                  {field.map((f) => {
                    const groupFormField = formFields[f.name];

                    if (!groupFormField) return null;

                    return (
                      <DynamicFormField
                        field={f}
                        formField={groupFormField}
                        formFields={formFields}
                        key={groupFormField.id}
                      />
                    );
                  })}
                </div>
              );
            }

            const formField = formFields[field.name];

            if (formField == null) return null;

            return (
              <DynamicFormField
                field={field}
                formField={formField}
                formFields={formFields}
                key={formField.id}
              />
            );
          })}
          <div className="flex gap-2 pt-3">
            {onCancel && (
              <Button
                aria-label={`${cancelLabel} ${submitLabel}`}
                onClick={onCancel}
                size={buttonSize}
                variant="tertiary"
              >
                {cancelLabel}
              </Button>
            )}
            <SubmitButton name={submitName} size={buttonSize} value={submitValue}>
              {submitLabel}
            </SubmitButton>
          </div>
          {form.errors?.map((error, index) => (
            <FormStatus key={index} type="error">
              {error}
            </FormStatus>
          ))}
        </div>
      </form>
      {isRegisterForm && (
        <div className="mt-4">
          <p>
            Already have an account?{' '}
            <Link className="link text-primary" href="/login">
              Sign in
            </Link>
          </p>
        </div>
      )}
    </FormProvider>
  );
}

function SubmitButton({
  children,
  name,
  value,
  size,
}: {
  children: ReactNode;
  name?: string;
  value?: string;
  size: ButtonProps['size'];
}) {
  const { pending } = useFormStatus();

  return (
    <Button loading={pending} name={name} size={size} type="submit" value={value}>
      {children}
    </Button>
  );
}

function DynamicFormField({
  field,
  formField,
}: {
  field: Field;
  formField: FieldMetadata<string | string[] | number | boolean | Date | undefined>;
  formFields: Record<
    string,
    FieldMetadata<string | string[] | number | boolean | Date | undefined>
  >;
}) {
  const controls = useInputControl(formField);

  switch (field.type) {
    case 'number':
      return (
        <div className="flex flex-col gap-1">
          <Label className="text-foreground text-sm font-medium" htmlFor={field.id}>
            {field.label}
            {field.required && <span className="text-contrast-400">*</span>}
          </Label>
          <NumberInput
            {...getInputProps(formField, { type: 'number' })}
            decrementLabel={field.decrementLabel}
            errors={formField.errors}
            incrementLabel={field.incrementLabel}
            key={field.name}
          />
        </div>
      );

    case 'text':
      return (
        <div className="flex flex-col gap-1">
          <Label className="text-foreground text-sm font-medium" htmlFor={field.id}>
            {field.label}
            {field.required && <span className="text-contrast-400">*</span>}
          </Label>
          <Input
            {...getInputProps(formField, { type: 'text' })}
            errors={formField.errors?.map((error) =>
              error === 'Required' ? `${field.label} is required` : error,
            )}
            key={field.name}
          />
        </div>
      );

    case 'textarea':
      return (
        <div className="flex flex-col gap-1">
          <Label className="text-foreground text-sm font-medium" htmlFor={field.id}>
            {field.label}
            {field.required && <span className="text-contrast-400">*</span>}
          </Label>
          <Textarea
            {...getInputProps(formField, { type: 'text' })}
            errors={formField.errors}
            key={field.name}
          />
        </div>
      );

    case 'password':
    case 'confirm-password':
      return (
        <div className="flex flex-col gap-1">
          <Label className="text-foreground text-sm font-medium" htmlFor={field.id}>
            {field.label}
            {field.required && <span className="text-contrast-400">*</span>}
          </Label>
          <Input
            {...getInputProps(formField, { type: 'password' })}
            errors={formField.errors?.map((error) =>
              error === 'Required' ? `${field.label} is required` : error,
            )}
            key={field.name}
            onBlur={controls.blur}
            onChange={(e) => {
              controls.change(e.target.value);
              requestAnimationFrame(() => controls.blur());
            }}
            onFocus={controls.focus}
          />
        </div>
      );

    case 'email':
      return (
        <div className="flex flex-col gap-1">
          <Label className="text-foreground text-sm font-medium" htmlFor={field.id}>
            Email
            {field.required && <span className="text-contrast-400">*</span>}
          </Label>
          <Input
            {...getInputProps(formField, { type: 'email' })}
            errors={formField.errors?.map((error) =>
              error === 'Required' ? 'Email is required' : error,
            )}
            key={field.name}
            onBlur={controls.blur}
            onChange={(e) => {
              controls.change(e.target.value);
              requestAnimationFrame(() => controls.blur());
            }}
            onFocus={controls.focus}
          />
        </div>
      );

    case 'checkbox':
      return (
        <Checkbox
          errors={formField.errors}
          key={field.name}
          label={null}
          name={formField.name}
          onBlur={controls.blur}
          onCheckedChange={(value) => controls.change(String(value))}
          onFocus={controls.focus}
          required={formField.required}
          value={controls.value}
        />
      );

    case 'checkbox-group':
      return (
        <CheckboxGroup
          errors={formField.errors}
          key={field.name}
          label={undefined}
          name={formField.name}
          onValueChange={controls.change}
          options={field.options}
          value={Array.isArray(controls.value) ? controls.value : []}
        />
      );

    case 'select':
      return (
        <SelectField
          errors={formField.errors?.map((error) =>
            error === 'Required' ? `${field.label} is required` : error,
          )}
          key={field.name}
          label={field.label}
          name={formField.name}
          onBlur={controls.blur}
          onFocus={controls.focus}
          onValueChange={controls.change}
          options={field.options}
          required={formField.required}
          value={typeof controls.value === 'string' ? controls.value : ''}
        />
      );

    case 'radio-group':
      return (
        <RadioGroup
          errors={formField.errors}
          key={field.name}
          label={field.label}
          name={formField.name}
          onBlur={controls.blur}
          onFocus={controls.focus}
          onValueChange={controls.change}
          options={field.options}
          required={formField.required}
          value={typeof controls.value === 'string' ? controls.value : ''}
        />
      );

    case 'swatch-radio-group':
      return (
        <SwatchRadioGroup
          errors={formField.errors}
          id={formField.id}
          key={field.name}
          label={field.label}
          name={formField.name}
          onBlur={controls.blur}
          onFocus={controls.focus}
          onValueChange={controls.change}
          options={field.options}
          required={formField.required}
          value={typeof controls.value === 'string' ? controls.value : ''}
        />
      );

    case 'card-radio-group':
      return (
        <CardRadioGroup
          errors={formField.errors}
          id={formField.id}
          key={field.name}
          label={field.label}
          name={formField.name}
          onBlur={controls.blur}
          onFocus={controls.focus}
          onValueChange={controls.change}
          options={field.options}
          required={formField.required}
          value={typeof controls.value === 'string' ? controls.value : ''}
        />
      );

    case 'button-radio-group':
      return (
        <ButtonRadioGroup
          errors={formField.errors}
          id={formField.id}
          key={field.name}
          label={field.label}
          name={formField.name}
          onBlur={controls.blur}
          onFocus={controls.focus}
          onValueChange={controls.change}
          options={field.options}
          required={formField.required}
          value={typeof controls.value === 'string' ? controls.value : ''}
        />
      );

    case 'date':
      return (
        <div className="flex flex-col gap-1">
          <Label className="text-foreground text-sm font-medium" htmlFor={field.id}>
            {field.label}
            {field.required && <span className="text-contrast-400">*</span>}
          </Label>
          <DatePicker
            disabledDays={
              field.minDate != null && field.maxDate != null
                ? {
                    before: new Date(field.minDate),
                    after: new Date(field.maxDate),
                  }
                : undefined
            }
            errors={formField.errors}
            key={field.name}
            label={field.label}
            name={formField.name}
            onBlur={controls.blur}
            onFocus={controls.focus}
            onSelect={(date) =>
              controls.change(date ? Intl.DateTimeFormat().format(date) : undefined)
            }
            required={formField.required}
            selected={typeof controls.value === 'string' ? new Date(controls.value) : undefined}
          />
        </div>
      );
  }
}

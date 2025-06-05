'use client';

import { clsx } from 'clsx';
import * as React from 'react';

import { FieldError } from '@/vibes/soul/form/field-error';
import { Label } from '@/vibes/soul/form/label';
import { Select, type SelectProps } from '@/vibes/soul/primitives/select';

export interface SelectFieldProps extends SelectProps {
  label: string;
  name: string;
  value: string;
  hideLabel?: boolean;
  className?: string;
  required?: boolean;
  description?: string;
}

export function SelectField({
  label,
  className,
  hideLabel = false,
  name,
  value,
  colorScheme,
  pending,
  placeholder,
  variant,
  options,
  errors,
  required,
  description,
  onFocus,
  onBlur,
  onOptionMouseEnter,
  onValueChange,
  ...rest
}: SelectFieldProps) {
  const id = React.useId();

  return (
    <div className={clsx('w-full', className)}>
      <Label
        className={clsx(hideLabel && 'sr-only', 'text-foreground mb-1 text-sm font-medium')}
        colorScheme={colorScheme}
        htmlFor={id}
      >
        {label}
        {required ? <span className="text-contrast-400">*</span> : ''}
      </Label>
      {description ? <p className="text-contrast-400 text-xs">{description}</p> : null}
      {/* Workaround for https://github.com/radix-ui/primitives/issues/3198, remove when fixed */}
      <input name={name} type="hidden" value={value} />
      <Select
        colorScheme={colorScheme}
        errors={errors}
        id={id}
        label={label}
        name={`${name}_display`} // Temp `_display` to avoid conflicts with the hidden input
        onBlur={onBlur}
        onFocus={onFocus}
        onOptionMouseEnter={onOptionMouseEnter}
        onValueChange={onValueChange}
        options={options}
        pending={pending}
        placeholder={placeholder}
        value={value}
        variant={variant}
        {...rest}
      />
      {errors?.map((error) => (
        <FieldError className="mt-2" key={error}>
          {error}
        </FieldError>
      ))}
    </div>
  );
}

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
}: SelectFieldProps) {
  const id = React.useId();

  return (
    <div className={clsx('w-full', className)}>
      <Label
        className={clsx(hideLabel && 'sr-only', 'text-foreground mb-2 text-sm font-medium')}
        colorScheme={colorScheme}
        htmlFor={id}
      >
        {label}
        {required ? <span className="text-contrast-400">*</span> : ''}
      </Label>
      {description ? <p className="text-contrast-400 text-xs">{description}</p> : null}
      <Select
        colorScheme={colorScheme}
        errors={errors}
        id={id}
        label={label}
        name={name}
        onBlur={onBlur}
        onFocus={onFocus}
        onOptionMouseEnter={onOptionMouseEnter}
        onValueChange={onValueChange}
        options={options}
        pending={pending}
        placeholder={placeholder}
        value={value}
        variant={variant}
      />
      {errors?.map((error) => (
        <FieldError className="mt-2" key={error}>
          {error}
        </FieldError>
      ))}
    </div>
  );
}

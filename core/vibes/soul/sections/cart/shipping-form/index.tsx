'use client';

import {
  getFormProps,
  getInputProps,
  SubmissionResult,
  useForm,
  useInputControl,
} from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { clsx } from 'clsx';
import { startTransition, useActionState, useEffect, useMemo, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { FormStatus } from '@/vibes/soul/form/form-status';
import { Input } from '@/vibes/soul/form/input';
import { Label } from '@/vibes/soul/form/label';
import { RadioGroup } from '@/vibes/soul/form/radio-group';
import { SelectField } from '@/vibes/soul/form/select-field';
import { Button } from '@/vibes/soul/primitives/button';

import { shippingActionFormDataSchema } from '../schema';

type Action<State, Payload> = (state: Awaited<State>, payload: Payload) => State | Promise<State>;

export interface ShippingFormState {
  lastResult: SubmissionResult | null;
  address: Address | null;
  shippingOptions: ShippingOption[] | null;
  shippingOption: ShippingOption | null;
  form: 'address' | 'shipping' | null;
}

interface ShippingOption {
  label: string;
  value: string;
  price: string;
}

interface Country {
  label: string;
  value: string;
}

interface States {
  country: string;
  states: Array<{
    label: string;
    value: string;
  }>;
}

interface Address {
  country: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

interface Props {
  action: Action<ShippingFormState, FormData>;
  countries?: Country[];
  states?: States[];
  address?: Address;
  shippingOptions?: ShippingOption[];
  shippingOption?: ShippingOption;
  shippingLabel?: string;
  addLabel?: string;
  changeLabel?: string;
  countryLabel?: string;
  cityLabel?: string;
  stateLabel?: string;
  postalCodeLabel?: string;
  updateShippingOptionsLabel?: string;
  viewShippingOptionsLabel?: string;
  cancelLabel?: string;
  editAddressLabel?: string;
  shippingOptionsLabel?: string;
  updateShippingLabel?: string;
  addShippingLabel?: string;
  showShippingForm?: boolean;
  noShippingOptionsLabel?: string;
}

export function ShippingForm({
  action,
  address,
  countries,
  states,
  shippingOptions,
  shippingOption,
  shippingLabel = 'Shipping',
  addLabel = 'Add',
  changeLabel = 'Change',
  countryLabel = 'Country',
  cityLabel = 'City',
  stateLabel = 'State/Province',
  postalCodeLabel = 'Postal code',
  updateShippingOptionsLabel = 'Update shipping options',
  viewShippingOptionsLabel = 'View shipping options',
  cancelLabel = 'Cancel',
  editAddressLabel = 'Edit address',
  shippingOptionsLabel = 'Shipping options',
  updateShippingLabel = 'Update shipping',
  addShippingLabel = 'Add shipping',
  showShippingForm = false,
  noShippingOptionsLabel = 'There are no shipping options available for your address',
}: Props) {
  const [showForms, setShowForms] = useState(showShippingForm);
  const [showAddressForm, setShowAddressForm] = useState(!address);

  const [state, formAction] = useActionState(action, {
    lastResult: null,
    address: address ?? null,
    shippingOptions: shippingOptions ?? null,
    shippingOption: shippingOption ?? null,
    form: null,
  });

  const [addressForm, addressFields] = useForm({
    lastResult: state.form === 'address' ? state.lastResult : null,
    constraint: getZodConstraint(shippingActionFormDataSchema),
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    defaultValue: {
      country: state.address?.country,
      city: state.address?.city,
      state: state.address?.state,
      postalCode: state.address?.postalCode,
    },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: shippingActionFormDataSchema });
    },
    onSubmit(event, { formData }) {
      event.preventDefault();

      startTransition(() => {
        formAction(formData);
        setShowAddressForm(false);
      });
    },
  });

  const [shippingOptionsForm, shippingOptionsFields] = useForm({
    lastResult: state.form === 'shipping' ? state.lastResult : null,
    constraint: getZodConstraint(shippingActionFormDataSchema),
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    defaultValue: {
      shippingOption: state.shippingOption?.value,
    },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: shippingActionFormDataSchema });
    },
    onSubmit(event, { formData }) {
      event.preventDefault();

      startTransition(() => {
        formAction(formData);
        setShowForms(false);
      });
    },
  });

  const formattedAddress = useMemo(() => {
    const country = Array.isArray(countries)
      ? countries.find((c) => c.value === state.address?.country)?.label
      : state.address?.country;

    const city = state.address?.city;

    const statesArray = Array.isArray(states)
      ? states.find((s) => {
          if (s.country === state.address?.country) {
            return true;
          }

          return false;
        })
      : undefined;

    const stateOrProvince = Array.isArray(statesArray?.states)
      ? statesArray.states.find((s) => s.value === state.address?.state)?.label
      : state.address?.state;

    const cityAndState = [city, stateOrProvince].filter((item) => item !== undefined).join(', ');
    const postalCode = state.address?.postalCode ?? '';

    const firstLine = `${cityAndState} ${postalCode}`.trim();

    return (
      <div className="text-sm">
        {Boolean(firstLine) && (
          <>
            {firstLine} <br />
          </>
        )}
        {country}
      </div>
    );
  }, [
    countries,
    state.address?.country,
    state.address?.city,
    state.address?.state,
    state.address?.postalCode,
    states,
  ]);

  useEffect(() => {
    if (addressForm.errors && addressForm.errors.length > 0) {
      if (state.shippingOptions) {
        setShowForms(true);
        setShowAddressForm(true);
      }
    }
  }, [setShowForms, setShowAddressForm, addressForm.errors, state.shippingOptions]);

  useEffect(() => {
    if (shippingOptionsForm.errors && shippingOptionsForm.errors.length > 0) {
      setShowForms(true);
    }
  }, [setShowForms, shippingOptionsForm.errors]);

  const shippingOptionsControl = useInputControl(shippingOptionsFields.shippingOption);
  const countryControl = useInputControl(addressFields.country);
  const stateControl = useInputControl(addressFields.state);

  useEffect(() => {
    if (
      Array.isArray(countries) &&
      countries.length === 1 &&
      countries[0] &&
      !countryControl.value &&
      !state.address?.country
    ) {
      countryControl.change(countries[0].value);
    }
  }, [countries, countryControl, state.address?.country]);

  return (
    <div>
      <div>
        <div className="flex justify-between text-sm leading-6">
          <span>{shippingLabel}</span>
          {state.shippingOption ? (
            <span>{state.shippingOption.price}</span>
          ) : (
            !showForms && (
              <button
                className="link text-primary font-medium"
                onClick={() => setShowForms(!showForms)}
              >
                {addLabel}
              </button>
            )
          )}
        </div>

        {state.shippingOption && (
          <div className="flex gap-1.5 text-xs">
            <span className="text-contrast-400 font-medium">{state.shippingOption.label}</span>
            {!showForms && (
              <button className="link text-primary font-medium" onClick={() => setShowForms(true)}>
                {changeLabel}
              </button>
            )}
          </div>
        )}
      </div>

      <div className={clsx('space-y-4', { hidden: !showForms })}>
        <div className="mt-4 flex items-start justify-end">
          <p className="text-foreground text-sm">
            Required Fields <span className="text-contrast-400">*</span>
          </p>
        </div>
        <form
          {...getFormProps(addressForm)}
          action={formAction}
          className={clsx('mt-4 space-y-4', { hidden: !showAddressForm })}
        >
          {Array.isArray(countries) ? (
            <SelectField
              errors={addressFields.country.errors?.map((error) =>
                error === 'Required' ? `${countryLabel} is required` : error,
              )}
              key={addressFields.country.id}
              label={countryLabel}
              name={addressFields.country.name}
              onBlur={countryControl.blur}
              onFocus={countryControl.focus}
              onValueChange={countryControl.change}
              options={countries}
              placeholder=""
              required
              value={countryControl.value ?? ''}
            />
          ) : (
            <Input
              {...getInputProps(addressFields.country, { type: 'text' })}
              errors={addressFields.country.errors?.map((error) =>
                error === 'Required' ? `${countryLabel} is required` : error,
              )}
              key={addressFields.country.id}
              label={countryLabel}
              required
            />
          )}
          <Input
            {...getInputProps(addressFields.city, { type: 'text' })}
            errors={addressFields.city.errors?.map((error) =>
              error === 'Required' ? `${cityLabel} is required` : error,
            )}
            key={addressFields.city.id}
            label={cityLabel}
            required
          />
          <div className="flex gap-3">
            {Array.isArray(states) ? (
              <SelectField
                disabled={addressFields.country.value === undefined}
                errors={addressFields.state.errors?.map((error) =>
                  error === 'Required' ? `${stateLabel} is required` : error,
                )}
                key={addressFields.state.id}
                label={stateLabel}
                name={addressFields.state.name}
                onBlur={stateControl.blur}
                onFocus={stateControl.focus}
                onValueChange={stateControl.change}
                options={
                  states.find((s) => s.country === addressFields.country.value)?.states ?? []
                }
                placeholder=""
                required
                value={stateControl.value ?? ''}
              />
            ) : (
              <Input
                {...getInputProps(addressFields.state, { type: 'text' })}
                errors={addressFields.state.errors?.map((error) =>
                  error === 'Required' ? `${stateLabel} is required` : error,
                )}
                key={addressFields.state.id}
                label={stateLabel}
                required
              />
            )}
            <Input
              {...getInputProps(addressFields.postalCode, { type: 'text' })}
              errors={addressFields.postalCode.errors?.map((error) =>
                error === 'Required' ? `${postalCodeLabel} is required` : error,
              )}
              key={addressFields.postalCode.id}
              label={postalCodeLabel}
              required
            />
          </div>

          {addressForm.errors?.map((error, index) => (
            <FormStatus key={index} type="error">
              {error}
            </FormStatus>
          ))}

          <div className="flex gap-1.5">
            <SubmitButton className="grow" name="intent" value="add-address">
              {state.address ? updateShippingOptionsLabel : viewShippingOptionsLabel}
            </SubmitButton>
            <Button
              className="shrink-0"
              onClick={() =>
                state.shippingOptions && state.shippingOptions.length > 0
                  ? setShowAddressForm(false)
                  : setShowForms(false)
              }
              size="medium"
              type="button"
              variant="tertiary"
            >
              {cancelLabel}
            </Button>
          </div>
        </form>

        <div className={clsx('mt-4 flex items-start gap-x-8', { hidden: showAddressForm })}>
          {formattedAddress}
          <button
            className="link text-primary text-sm"
            onClick={() => setShowAddressForm(true)}
            type="button"
          >
            {editAddressLabel}
          </button>
        </div>

        <form
          className={clsx('space-y-4', {
            hidden: state.shippingOptions === null || state.shippingOptions.length === 0,
          })}
          {...getFormProps(shippingOptionsForm)}
          action={formAction}
        >
          <div className="mt-4 space-y-3">
            <RadioGroup
              {...getInputProps(shippingOptionsFields.shippingOption, {
                type: 'radio',
                required: true,
              })}
              errors={shippingOptionsFields.shippingOption.errors}
              key={shippingOptionsFields.shippingOption.id}
              label={shippingOptionsLabel}
              name="shippingOption"
              onBlur={shippingOptionsControl.blur}
              onFocus={shippingOptionsControl.focus}
              onValueChange={shippingOptionsControl.change}
              options={
                state.shippingOptions?.map((option) => ({
                  label: option.label,
                  value: option.value,
                  description: option.price,
                })) ?? []
              }
              value={shippingOptionsControl.value}
            />

            {shippingOptionsForm.errors?.map((error, index) => (
              <FormStatus key={index} type="error">
                {error}
              </FormStatus>
            ))}
          </div>

          <div className="flex gap-1.5">
            <SubmitButton className="grow" name="intent" value="add-shipping">
              {shippingOption ? updateShippingLabel : addShippingLabel}
            </SubmitButton>
            <Button
              className="shrink-0"
              onClick={() => {
                setShowForms(false);
                setShowAddressForm(false);
              }}
              size="medium"
              type="button"
              variant="tertiary"
            >
              {cancelLabel}
            </Button>
          </div>
        </form>

        <div
          className={clsx('mt-6 space-y-3', {
            hidden: state.shippingOptions === null || state.shippingOptions.length > 0,
          })}
        >
          <Label>{shippingOptionsLabel}</Label>
          <p>{noShippingOptionsLabel}</p>
        </div>
      </div>
    </div>
  );
}

function SubmitButton(props: React.ComponentPropsWithoutRef<typeof Button>) {
  const { pending } = useFormStatus();

  return <Button {...props} loading={pending} size="medium" type="submit" variant="primary" />;
}

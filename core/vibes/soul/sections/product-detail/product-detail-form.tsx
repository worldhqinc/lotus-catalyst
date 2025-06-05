'use client';

import {
  FieldMetadata,
  FormProvider,
  FormStateInput,
  getFormProps,
  SubmissionResult,
  useForm,
  useInputControl,
} from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { createSerializer, parseAsString, useQueryStates } from 'nuqs';
import {
  forwardRef,
  ReactNode,
  startTransition,
  useActionState,
  useCallback,
  useEffect,
} from 'react';
import { useFormStatus } from 'react-dom';
import { z } from 'zod';

import { ButtonRadioGroup } from '@/vibes/soul/form/button-radio-group';
import { CardRadioGroup } from '@/vibes/soul/form/card-radio-group';
import { Checkbox } from '@/vibes/soul/form/checkbox';
import { DatePicker } from '@/vibes/soul/form/date-picker';
import { FormStatus } from '@/vibes/soul/form/form-status';
import { Input } from '@/vibes/soul/form/input';
import { NumberInput } from '@/vibes/soul/form/number-input';
import { RadioGroup } from '@/vibes/soul/form/radio-group';
import { SelectField } from '@/vibes/soul/form/select-field';
import { SwatchRadioGroup } from '@/vibes/soul/form/swatch-radio-group';
import { Textarea } from '@/vibes/soul/form/textarea';
import { Button } from '@/vibes/soul/primitives/button';
// import { useEvents } from '~/components/analytics/events';
import NotifyBackInStock from '~/components/notify-back-in-stock';
import { usePathname, useRouter } from '~/i18n/routing';

import { revalidateCart } from './actions/revalidate-cart';
import { Field, schema, SchemaRawShape } from './schema';

const SubmitButton = forwardRef<HTMLButtonElement, { children: ReactNode; disabled?: boolean }>(
  ({ children, disabled }, ref) => {
    const { pending } = useFormStatus();

    return (
      <Button
        className="w-full"
        disabled={disabled}
        loading={pending}
        ref={ref}
        size="medium"
        type="submit"
      >
        {children}
      </Button>
    );
  },
);

type Action<S, P> = (state: Awaited<S>, payload: P) => S | Promise<S>;

interface State<F extends Field> {
  fields: F[];
  lastResult: SubmissionResult | null;
  successMessage?: ReactNode;
}

export type ProductDetailFormAction<F extends Field> = Action<State<F>, FormData>;

export interface ProductDetailFormProps<F extends Field> {
  fields: F[];
  action: ProductDetailFormAction<F>;
  productId: string;
  sku: string;
  ctaLabel?: string;
  emptySelectPlaceholder?: string;
  ctaDisabled?: boolean;
  prefetch?: boolean;
  additionalActions?: ReactNode;
  detailFormRef?: React.Ref<HTMLDivElement>;
}

export function ProductDetailForm<F extends Field>({
  action,
  fields,
  productId,
  sku,
  ctaLabel = 'Add to cart',
  emptySelectPlaceholder = 'Select an option',
  ctaDisabled = false,
  prefetch = false,
  additionalActions,
  detailFormRef,
}: ProductDetailFormProps<F>) {
  const router = useRouter();
  const pathname = usePathname();
  // const events = useEvents();

  const searchParams = fields.reduce<Record<string, typeof parseAsString>>((acc, field) => {
    return field.persist === true ? { ...acc, [field.name]: parseAsString } : acc;
  }, {});

  const [params] = useQueryStates(searchParams, { shallow: false });

  const onPrefetch = (fieldName: string, value: string) => {
    if (prefetch) {
      const serialize = createSerializer(searchParams);

      const newUrl = serialize(pathname, { ...params, [fieldName]: value });

      router.prefetch(newUrl);
    }
  };

  const defaultValue = fields.reduce<{
    [Key in keyof SchemaRawShape]?: z.infer<SchemaRawShape[Key]>;
  }>(
    (acc, field) => ({
      ...acc,
      [field.name]: params[field.name] ?? field.defaultValue,
    }),
    { quantity: 1 },
  );

  const [{ lastResult, successMessage }, formAction] = useActionState(action, {
    fields,
    lastResult: null,
  });

  useEffect(() => {
    if (lastResult?.status === 'success') {
      router.refresh();

      startTransition(async () => {
        // This is needed to refresh the Data Cache after the product has been added to the cart.
        // The cart id is not picked up after the first time the cart is created/updated.
        await revalidateCart();
      });
    }
  }, [lastResult, successMessage, router]);

  const [form, formFields] = useForm({
    lastResult,
    constraint: getZodConstraint(schema(fields)),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: schema(fields) });
    },
    onSubmit(event, { formData }) {
      event.preventDefault();

      startTransition(() => {
        formAction(formData);

        // events.onAddToCart?.(formData);
      });
    },
    // @ts-expect-error: `defaultValue` types are conflicting with `onValidate`.
    defaultValue,
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
  });

  // const quantityControl = useInputControl(formFields.quantity);

  return (
    <FormProvider context={form.context}>
      <FormStateInput />
      <form {...getFormProps(form)} action={formAction}>
        <input name="id" type="hidden" value={productId} />
        <div className="space-y-6">
          {fields.map((field) => {
            return (
              <FormField
                emptySelectPlaceholder={emptySelectPlaceholder}
                field={field}
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                formField={formFields[field.name]!}
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                key={formFields[field.name]!.id}
                onPrefetch={onPrefetch}
              />
            );
          })}
          {form.errors?.map((error, index) => (
            <FormStatus className="py-3" key={index} type="error">
              {error}
            </FormStatus>
          ))}
          <div className="flex items-center gap-x-3" ref={detailFormRef}>
            {/* <NumberInput
              aria-label="Quantity"
              decrementLabel="Decrement"
              incrementLabel="Increment"
              min={1}
              name={formFields.quantity.name}
              onBlur={quantityControl.blur}
              onChange={(e) => quantityControl.change(e.currentTarget.value)}
              onFocus={quantityControl.focus}
              required
              value={quantityControl.value}
            /> */}
            {ctaDisabled ? (
              <NotifyBackInStock sku={sku} />
            ) : (
              <>
                <input name={formFields.quantity.name} type="hidden" value="1" />
                <SubmitButton disabled={ctaDisabled}>{ctaLabel}</SubmitButton>
              </>
            )}
          </div>
          {additionalActions}
        </div>
      </form>
    </FormProvider>
  );
}

// eslint-disable-next-line complexity
function FormField({
  field,
  formField,
  onPrefetch,
  emptySelectPlaceholder,
}: {
  field: Field;
  formField: FieldMetadata<string | number | boolean | Date | undefined>;
  onPrefetch: (fieldName: string, value: string) => void;
  emptySelectPlaceholder?: string;
}) {
  const controls = useInputControl(formField);

  const [params, setParams] = useQueryStates(
    field.persist === true ? { [field.name]: parseAsString.withOptions({ shallow: false }) } : {},
  );

  const handleChange = useCallback(
    (value: string) => {
      // Ensure that if page is reached without a full reload, we are still setting the selection properly based on query params.
      const fieldValue = value || String(params[field.name]);

      void setParams({ [field.name]: fieldValue || null }); // Passing `null` to remove the value from the query params if fieldValue is falsey
      controls.change(fieldValue);
    },
    [setParams, field, controls, params],
  );

  const handleOnOptionMouseEnter = (value: string) => {
    if (field.persist === true) {
      onPrefetch(field.name, value);
    }
  };

  switch (field.type) {
    case 'number':
      return (
        <NumberInput
          decrementLabel={field.decrementLabel}
          errors={formField.errors}
          incrementLabel={field.incrementLabel}
          key={formField.id}
          label={field.label}
          name={formField.name}
          onBlur={controls.blur}
          onChange={(e) => handleChange(e.currentTarget.value)}
          onFocus={controls.focus}
          required={formField.required}
          value={controls.value ?? ''}
        />
      );

    case 'text':
      return (
        <Input
          errors={formField.errors}
          key={formField.id}
          label={field.label}
          name={formField.name}
          onBlur={controls.blur}
          onChange={(e) => handleChange(e.currentTarget.value)}
          onFocus={controls.focus}
          required={formField.required}
          value={controls.value ?? ''}
        />
      );

    case 'date':
      return (
        <DatePicker
          defaultValue={controls.value}
          errors={formField.errors}
          key={formField.id}
          label={field.label}
          name={formField.name}
          onBlur={controls.blur}
          onChange={(e) => handleChange(e.currentTarget.value)}
          onFocus={controls.focus}
          required={formField.required}
        />
      );

    case 'textarea':
      return (
        <Textarea
          errors={formField.errors}
          key={formField.id}
          label={field.label}
          maxLength={field.maxLength}
          minLength={field.minLength}
          name={formField.name}
          onBlur={controls.blur}
          onChange={(e) => handleChange(e.currentTarget.value)}
          onFocus={controls.focus}
          required={formField.required}
          value={controls.value ?? ''}
        />
      );

    case 'checkbox':
      return (
        <Checkbox
          errors={formField.errors}
          key={formField.id}
          label={field.label}
          name={formField.name}
          onBlur={controls.blur}
          onCheckedChange={(value) => handleChange(String(value))}
          onFocus={controls.focus}
          required={formField.required}
          value={controls.value ?? 'false'}
        />
      );

    case 'select':
      return (
        <SelectField
          errors={formField.errors}
          key={formField.id}
          label={field.label}
          name={formField.name}
          onBlur={controls.blur}
          onFocus={controls.focus}
          onOptionMouseEnter={handleOnOptionMouseEnter}
          onValueChange={handleChange}
          options={field.options}
          placeholder={emptySelectPlaceholder}
          required={formField.required}
          value={controls.value ?? ''}
        />
      );

    case 'radio-group':
      return (
        <RadioGroup
          errors={formField.errors}
          key={formField.id}
          label={field.label}
          name={formField.name}
          onBlur={controls.blur}
          onFocus={controls.focus}
          onOptionMouseEnter={handleOnOptionMouseEnter}
          onValueChange={handleChange}
          options={field.options}
          required={formField.required}
          value={controls.value ?? ''}
        />
      );

    case 'swatch-radio-group':
      return (
        <SwatchRadioGroup
          errors={formField.errors}
          key={formField.id}
          label={field.label}
          name={formField.name}
          onBlur={controls.blur}
          onFocus={controls.focus}
          onOptionMouseEnter={handleOnOptionMouseEnter}
          onValueChange={handleChange}
          options={field.options}
          required={formField.required}
          value={controls.value ?? ''}
        />
      );

    case 'card-radio-group':
      return (
        <CardRadioGroup
          errors={formField.errors}
          key={formField.id}
          label={field.label}
          name={formField.name}
          onBlur={controls.blur}
          onFocus={controls.focus}
          onOptionMouseEnter={handleOnOptionMouseEnter}
          onValueChange={handleChange}
          options={field.options}
          required={formField.required}
          value={controls.value ?? ''}
        />
      );

    case 'button-radio-group':
      return (
        <ButtonRadioGroup
          errors={formField.errors}
          key={formField.id}
          label={field.label}
          name={formField.name}
          onBlur={controls.blur}
          onFocus={controls.focus}
          onOptionMouseEnter={handleOnOptionMouseEnter}
          onValueChange={handleChange}
          options={field.options}
          required={formField.required}
          value={controls.value ?? ''}
        />
      );
  }
}

'use client';

import { getFormProps, getInputProps, SubmissionResult, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import {
  ComponentProps,
  ReactNode,
  startTransition,
  useActionState,
  useEffect,
  useOptimistic,
  useState,
} from 'react';
import { useFormStatus } from 'react-dom';
import { z } from 'zod';

import { DynamicForm } from '@/vibes/soul/form/dynamic-form';
import { Field, FieldGroup } from '@/vibes/soul/form/dynamic-form/schema';
import { Badge } from '@/vibes/soul/primitives/badge';
import { Button } from '@/vibes/soul/primitives/button';
import { Spinner } from '@/vibes/soul/primitives/spinner';
import { toast } from '@/vibes/soul/primitives/toaster';

import { schema } from './schema';

export type Address = z.infer<typeof schema>;

export interface DefaultAddressConfiguration {
  id: string | null;
}

type Action<S, P> = (state: Awaited<S>, payload: P) => S | Promise<S>;

interface State<A extends Address, F extends Field> {
  addresses: A[];
  defaultAddress?: DefaultAddressConfiguration;
  lastResult: SubmissionResult | null;
  fields: Array<F | FieldGroup<F>>;
}

export interface AddressListSectionProps<A extends Address, F extends Field> {
  title?: string;
  addresses: A[];
  fields: Array<F | FieldGroup<F>>;
  minimumAddressCount?: number;
  defaultAddress?: DefaultAddressConfiguration;
  addressAction: Action<State<A, F>, FormData>;
  editLabel?: string;
  deleteLabel?: string;
  updateLabel?: string;
  createLabel?: string;
  showAddFormLabel?: string;
  setDefaultLabel?: string;
  cancelLabel?: string;
  countries: Array<{ code: string; name: string }>;
}

// eslint-disable-next-line valid-jsdoc
/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --address-list-section-border: hsl(var(--contrast-100));
 *   --address-list-section-title-font-family: var(--font-family-heading);
 *   --address-list-section-content-font-family: var(--font-family-body);
 *   --address-list-section-title: hsl(var(--foreground));
 *   --address-list-section-name: hsl(var(--foreground));
 *   --address-list-section-info: hsl(var(--contrast-500));
 * }
 * ```
 */
export function AddressListSection<A extends Address, F extends Field>({
  title = 'Addresses',
  addresses,
  fields,
  minimumAddressCount = 1,
  defaultAddress,
  addressAction,
  editLabel = 'Edit',
  deleteLabel = 'Delete',
  updateLabel = 'Update',
  createLabel = 'Create',
  cancelLabel = 'Cancel',
  showAddFormLabel = 'Add address',
  setDefaultLabel = 'Set as default',
  countries,
}: AddressListSectionProps<A, F>) {
  const [state, formAction] = useActionState(addressAction, {
    addresses,
    defaultAddress,
    lastResult: null,
    fields,
  });

  const [optimisticState, setOptimisticState] = useOptimistic<State<Address, F>, FormData>(
    state,
    (prevState, formData) => {
      const intent = formData.get('intent');
      const submission = parseWithZod(formData, { schema });

      if (submission.status !== 'success') return prevState;

      switch (intent) {
        case 'create': {
          const nextAddress = submission.value;

          return {
            ...prevState,
            addresses: [...prevState.addresses, nextAddress],
          };
        }

        case 'update': {
          return {
            ...prevState,
            addresses: prevState.addresses.map((a) =>
              a.id === submission.value.id ? submission.value : a,
            ),
          };
        }

        case 'delete': {
          return {
            ...prevState,
            addresses: prevState.addresses.filter((a) => a.id !== submission.value.id),
          };
        }

        case 'setDefault': {
          return { ...prevState, defaultAddress: { id: submission.value.id } };
        }

        default:
          return prevState;
      }
    },
  );
  const [activeAddressIds, setActiveAddressIds] = useState<string[]>([]);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [form] = useForm({
    lastResult: state.lastResult,
  });

  useEffect(() => {
    if (form.errors) {
      form.errors.forEach((error) => {
        toast.error(error);
      });
    }
  }, [form.errors]);

  return (
    <section className="w-full">
      <header className="border-contrast-200 border-b pb-6">
        <div className="flex items-center justify-between">
          <Title>{title}</Title>
          {!showNewAddressForm && (
            <Button onClick={() => setShowNewAddressForm(true)} size="medium" variant="tertiary">
              {showAddFormLabel}
            </Button>
          )}
        </div>
      </header>
      <div className="grid">
        {showNewAddressForm && (
          <div className="border-contrast-200 border-b py-6">
            <div className="max-w-[480px] space-y-4">
              <div className="mb-6 flex justify-end">
                <p className="text-foreground text-sm">
                  Required Fields <span className="text-contrast-400">*</span>
                </p>
              </div>
              <DynamicForm
                action={(_prevState, formData) => {
                  setShowNewAddressForm(false);

                  startTransition(() => {
                    formAction(formData);
                    setOptimisticState(formData);
                  });

                  return {
                    fields: optimisticState.fields,
                    lastResult: optimisticState.lastResult,
                  };
                }}
                buttonSize="medium"
                cancelLabel={cancelLabel}
                fields={optimisticState.fields.map((field) => {
                  if ('name' in field && field.name === 'id') {
                    return {
                      ...field,
                      name: 'id',
                      defaultValue: 'new',
                    };
                  }

                  return field;
                })}
                onCancel={() => setShowNewAddressForm(false)}
                submitLabel={createLabel}
                submitName="intent"
                submitValue="create"
              />
            </div>
          </div>
        )}
        {optimisticState.addresses.map((address) => {
          const addressFields = optimisticState.fields.map<F | FieldGroup<F>>((field) => {
            if (Array.isArray(field)) {
              return field.map((f) => {
                return {
                  ...f,
                  defaultValue: address[f.name] ?? '',
                };
              });
            }

            return {
              ...field,
              defaultValue: address[field.name] ?? '',
            };
          });

          return (
            <div className="border-contrast-200 border-b py-6" key={address.id}>
              {activeAddressIds.includes(address.id) ? (
                <div className="max-w-[480px] space-y-4">
                  <div className="mb-6 flex justify-end">
                    <p className="text-foreground text-sm">
                      Required Fields <span className="text-contrast-400">*</span>
                    </p>
                  </div>
                  <DynamicForm
                    action={(_prevState, formData) => {
                      setActiveAddressIds((prev) => prev.filter((id) => id !== address.id));

                      startTransition(() => {
                        formAction(formData);
                        setOptimisticState(formData);
                      });

                      return {
                        fields: optimisticState.fields,
                        lastResult: optimisticState.lastResult,
                      };
                    }}
                    buttonSize="small"
                    cancelLabel={cancelLabel}
                    fields={addressFields}
                    onCancel={() =>
                      setActiveAddressIds((prev) => prev.filter((id) => id !== address.id))
                    }
                    submitLabel={updateLabel}
                    submitName="intent"
                    submitValue="update"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <AddressPreview
                    address={address}
                    countries={countries}
                    isDefault={
                      optimisticState.defaultAddress
                        ? optimisticState.defaultAddress.id === address.id
                        : undefined
                    }
                  />
                  <div className="flex gap-2">
                    <Button
                      aria-label={`${editLabel}: ${address.firstName} ${address.lastName}`}
                      onClick={() => setActiveAddressIds((prev) => [...prev, address.id])}
                      size="medium"
                    >
                      {editLabel}
                    </Button>
                    {optimisticState.addresses.length > minimumAddressCount && (
                      <AddressActionButton
                        action={formAction}
                        address={address}
                        aria-label={`${deleteLabel}: ${address.firstName} ${address.lastName}`}
                        intent="delete"
                        onSubmit={(formData) => {
                          startTransition(() => {
                            formAction(formData);
                            setOptimisticState(formData);
                          });
                        }}
                      >
                        {deleteLabel}
                      </AddressActionButton>
                    )}

                    {optimisticState.defaultAddress &&
                      optimisticState.defaultAddress.id !== address.id && (
                        <AddressActionButton
                          action={formAction}
                          address={address}
                          aria-label={`${setDefaultLabel}: ${address.firstName} ${address.lastName}`}
                          intent="setDefault"
                          onSubmit={(formData) => {
                            startTransition(() => {
                              formAction(formData);
                              setOptimisticState(formData);
                            });
                          }}
                        >
                          {setDefaultLabel}
                        </AddressActionButton>
                      )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Title({ children }: { children: ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <h1 className="text-2xl leading-[120%] @2xl:text-4xl">
      {children}
      {pending && (
        <span className="ml-2">
          <Spinner />
        </span>
      )}
    </h1>
  );
}

function AddressPreview({
  address,
  isDefault = false,
  countries = [],
}: {
  address: Address;
  isDefault?: boolean;
  countries: Array<{ code: string; name: string }>;
}) {
  const countryName =
    countries.find((country) => country.code === address.countryCode)?.name || address.countryCode;

  return (
    <div className="flex gap-10 font-[family-name:var(--address-list-section-content-font-family,var(--font-family-body))]">
      <div>
        <p className="font-medium">
          {address.firstName} {address.lastName}
        </p>
        <div className="text-contrast-400 mt-2">
          <p>{address.company}</p>
          <p>{address.address1}</p>
          <p>{address.address2}</p>
          <p>
            {address.city}, {address.stateOrProvince} {address.postalCode}
          </p>
          <p>{countryName}</p>
          <p>{address.phone}</p>
        </div>
      </div>
      <div>{isDefault && <Badge>Default</Badge>}</div>
    </div>
  );
}

function AddressActionButton({
  address,
  intent,
  action,
  onSubmit,
  ...rest
}: {
  address: Address;
  intent: string;
  action: (formData: FormData) => void;
  onSubmit: (formData: FormData) => void;
} & Omit<ComponentProps<'button'>, 'onSubmit'>) {
  const [form, fields] = useForm({
    // @ts-expect-error The form requires index signature values to be of
    // type 'string', 'null', or 'undefined' but the zod .passthrough() method
    // returns the value 'unknown' for any index signature values.
    defaultValue: address,
    constraint: getZodConstraint(schema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    onSubmit(event, { submission, formData }) {
      event.preventDefault();

      if (submission?.status !== 'success') return;

      onSubmit(formData);
    },
  });

  return (
    <form {...getFormProps(form)} action={action}>
      <input {...getInputProps(fields.id, { type: 'hidden' })} key={fields.id.id} />
      <input {...getInputProps(fields.firstName, { type: 'hidden' })} key={fields.firstName.id} />
      <input {...getInputProps(fields.lastName, { type: 'hidden' })} key={fields.lastName.id} />
      <input {...getInputProps(fields.company, { type: 'hidden' })} key={fields.company.id} />
      <input {...getInputProps(fields.phone, { type: 'hidden' })} key={fields.phone.id} />
      <input {...getInputProps(fields.address1, { type: 'hidden' })} key={fields.address1.id} />
      <input {...getInputProps(fields.address2, { type: 'hidden' })} key={fields.address2.id} />
      <input {...getInputProps(fields.city, { type: 'hidden' })} key={fields.city.id} />
      <input
        {...getInputProps(fields.stateOrProvince, { type: 'hidden' })}
        key={fields.stateOrProvince.id}
      />
      <input {...getInputProps(fields.postalCode, { type: 'hidden' })} key={fields.postalCode.id} />
      <input
        {...getInputProps(fields.countryCode, { type: 'hidden' })}
        key={fields.countryCode.id}
      />
      <Button
        {...rest}
        name="intent"
        size="medium"
        type="submit"
        value={intent}
        variant="tertiary"
      />
    </form>
  );
}

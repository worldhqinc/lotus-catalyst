'use client';

import { getFormProps, getInputProps, SubmissionResult, useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { clsx } from 'clsx';
import { ArrowLeft, Minus, Plus, Trash } from 'lucide-react';
import {
  ComponentPropsWithoutRef,
  startTransition,
  useActionState,
  useEffect,
  useOptimistic,
} from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/vibes/soul/primitives/button';
import { toast } from '@/vibes/soul/primitives/toaster';
import { StickySidebarLayout } from '@/vibes/soul/sections/sticky-sidebar-layout';
import { Image } from '~/components/image';
import { Link } from '~/components/link';

import { CouponCodeForm, CouponCodeFormState } from './coupon-code-form';
import { HelpfulLinks } from './helpful-links';
import { cartLineItemActionFormDataSchema } from './schema';
import { ShippingForm, ShippingFormState } from './shipping-form';

import { CartEmptyState } from '.';

type Action<State, Payload> = (state: Awaited<State>, payload: Payload) => State | Promise<State>;

export interface CartLineItem {
  id: string;
  image: { alt: string; src: string };
  title: string;
  subtitle: string;
  quantity: number;
  price: string;
  basePrice?: string;
}

export interface CartSummaryItem {
  label: string;
  value: string;
}

export interface CartState<LineItem extends CartLineItem> {
  lineItems: LineItem[];
  lastResult: SubmissionResult | null;
}

export interface Cart<LineItem extends CartLineItem> {
  lineItems: LineItem[];
  summaryItems: CartSummaryItem[];
  total: string;
  totalLabel?: string;
}

interface CouponCode {
  action: Action<CouponCodeFormState, FormData>;
  couponCodes?: string[];
  ctaLabel?: string;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  removeLabel?: string;
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

interface Shipping {
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

export interface CartProps<LineItem extends CartLineItem> {
  title?: string;
  summaryTitle?: string;
  emptyState?: CartEmptyState;
  lineItemAction: Action<CartState<LineItem>, FormData>;
  checkoutAction: Action<SubmissionResult | null, FormData>;
  checkoutLabel?: string;
  deleteLineItemLabel?: string;
  decrementLineItemLabel?: string;
  incrementLineItemLabel?: string;
  cart: Cart<LineItem>;
  couponCode?: CouponCode;
  shipping?: Shipping;
}

const defaultEmptyState = {
  title: 'Your cart is empty',
  subtitle: 'Add some products to get started.',
  cta: { label: 'Continue shopping', href: '#' },
};

// eslint-disable-next-line valid-jsdoc
/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --cart-focus: hsl(var(--primary));
 *   --cart-font-family: var(--font-family-body);
 *   --cart-title-font-family: var(--font-family-heading);
 *   --cart-text: hsl(var(--foreground));
 *   --cart-subtitle-text: hsl(var(--contrast-500));
 *   --cart-subtext-text: hsl(var(--contrast-300));
 *   --cart-icon: hsl(var(--contrast-300));
 *   --cart-icon-hover: hsl(var(--foreground));
 *   --cart-border: hsl(var(--contrast-100));
 *   --cart-image-background: hsl(var(--contrast-100));
 *   --cart-button-background: hsl(var(--contrast-100));
 *   --cart-counter-icon: hsl(var(--contrast-300));
 *   --cart-counter-icon-hover: hsl(var(--foreground));
 *   --cart-counter-background: hsl(var(--background));
 *   --cart-counter-background-hover: hsl(var(--contast-100) / 50%);
 * }
 * ```
 */
export function CartClient<LineItem extends CartLineItem>({
  title,
  cart,
  couponCode,
  decrementLineItemLabel,
  incrementLineItemLabel,
  deleteLineItemLabel,
  lineItemAction,
  checkoutAction,
  checkoutLabel = 'Checkout',
  emptyState = defaultEmptyState,
  summaryTitle,
  shipping,
}: CartProps<LineItem>) {
  const [state, formAction] = useActionState(lineItemAction, {
    lineItems: cart.lineItems,
    lastResult: null,
  });

  const [form] = useForm({ lastResult: state.lastResult });

  useEffect(() => {
    if (form.errors) {
      form.errors.forEach((error) => {
        toast.error(error);
      });
    }
  }, [form.errors]);

  const [optimisticLineItems, setOptimisticLineItems] = useOptimistic<CartLineItem[], FormData>(
    state.lineItems,
    (prevState, formData) => {
      const submission = parseWithZod(formData, { schema: cartLineItemActionFormDataSchema });

      if (submission.status !== 'success') return prevState;

      switch (submission.value.intent) {
        case 'increment': {
          const { id } = submission.value;

          return prevState.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
          );
        }

        case 'decrement': {
          const { id } = submission.value;

          return prevState.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
          );
        }

        case 'delete': {
          const { id } = submission.value;

          return prevState.filter((item) => item.id !== id);
        }

        default:
          return prevState;
      }
    },
  );

  const optimisticQuantity = optimisticLineItems.reduce((total, item) => total + item.quantity, 0);

  if (optimisticQuantity === 0) {
    return <CartEmptyState {...emptyState} />;
  }

  return (
    <>
      <div className="@container container flex items-center justify-between pt-8 md:pt-16">
        <h1 className="text-2xl leading-none @xl:text-4xl">
          {title}
          <span className="text-contrast-400 ml-4">({optimisticQuantity})</span>
        </h1>
        <Link className="link hover:text-primary flex items-center gap-x-2" href="/shop/all">
          <ArrowLeft size={16} />
          Continue Shopping
        </Link>
      </div>
      <StickySidebarLayout
        className="font-[family-name:var(--cart-font-family,var(--font-family-body))] text-[var(--cart-text,hsl(var(--foreground)))]"
        gapXSize="gap-x-20"
        sidebar={
          <div>
            <h2 className="text-lg leading-none font-medium tracking-[1.8px] uppercase @xl:text-2xl">
              {summaryTitle}
            </h2>
            <dl aria-label="Receipt Summary" className="w-full">
              <div className="space-y-3 py-5">
                {cart.summaryItems.map((summaryItem, index) => (
                  <div className="flex justify-between text-sm leading-6" key={index}>
                    <dt>{summaryItem.label}</dt>
                    <dd>{summaryItem.value}</dd>
                  </div>
                ))}
                {shipping && <ShippingForm {...shipping} />}
              </div>
              {couponCode && (
                <CouponCodeForm
                  action={couponCode.action}
                  couponCodes={couponCode.couponCodes}
                  ctaLabel={couponCode.ctaLabel}
                  disabled={couponCode.disabled}
                  label={couponCode.label}
                  placeholder={couponCode.placeholder}
                  removeLabel={couponCode.removeLabel}
                />
              )}
              <div className="flex justify-between border-t border-[var(--cart-border,hsl(var(--contrast-100)))] py-5 font-medium">
                <dt>{cart.totalLabel ?? 'Total'}</dt>
                <dl>{cart.total}</dl>
              </div>
            </dl>
            <CheckoutButton action={checkoutAction} className="mt-4 w-full">
              {checkoutLabel}
            </CheckoutButton>
            <div className="mt-12">
              <HelpfulLinks />
            </div>
          </div>
        }
        sidebarPosition="after"
        sidebarSize="1/3"
      >
        <div className="w-full">
          {/* Cart Items */}
          <ul className="flex flex-col gap-5">
            {optimisticLineItems.map((lineItem) => (
              <li className="@container flex items-start gap-x-5 gap-y-4" key={lineItem.id}>
                <div className="relative aspect-square w-full max-w-24 overflow-hidden rounded-xl bg-[var(--cart-image-background,hsl(var(--contrast-100)))] focus-visible:ring-2 focus-visible:ring-[var(--cart-focus,hsl(var(--primary)))] focus-visible:ring-offset-4 focus-visible:outline-hidden">
                  <Image
                    alt={lineItem.image.alt}
                    className="object-cover"
                    fill
                    sizes="(min-width: 28rem) 9rem, (min-width: 24rem) 6rem, 100vw"
                    src={lineItem.image.src}
                  />
                </div>
                <div className="flex grow flex-col flex-wrap justify-between gap-y-2 @xl:flex-row">
                  <div className="flex w-full flex-1 flex-col @xl:w-1/2 @xl:pr-4">
                    <span className="leading-6 font-medium">{lineItem.title}</span>
                    <span className="text-contrast-400 text-sm leading-6">{lineItem.subtitle}</span>
                  </div>
                  <CounterForm
                    action={formAction}
                    decrementLabel={decrementLineItemLabel}
                    deleteLabel={deleteLineItemLabel}
                    incrementLabel={incrementLineItemLabel}
                    lineItem={lineItem}
                    onSubmit={(formData) => {
                      startTransition(() => {
                        formAction(formData);
                        setOptimisticLineItems(formData);
                      });
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </StickySidebarLayout>
    </>
  );
}

function CounterForm({
  lineItem,
  action,
  onSubmit,
  incrementLabel = 'Increase count',
  decrementLabel = 'Decrease count',
  deleteLabel = 'Remove item',
}: {
  lineItem: CartLineItem;
  incrementLabel?: string;
  decrementLabel?: string;
  deleteLabel?: string;
  action: (payload: FormData) => void;
  onSubmit: (formData: FormData) => void;
}) {
  const [form, fields] = useForm({
    defaultValue: { id: lineItem.id },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: cartLineItemActionFormDataSchema });
    },
    onSubmit(event, { formData }) {
      event.preventDefault();

      onSubmit(formData);
    },
  });

  return (
    <form {...getFormProps(form)} action={action}>
      <input {...getInputProps(fields.id, { type: 'hidden' })} key={fields.id.id} />
      <div className="cart-action-buttons flex w-full flex-wrap items-center justify-between gap-x-5 gap-y-2 @xl:justify-start">
        <div className="flex flex-[0_0_100%] items-end gap-1 @xl:ml-auto @xl:flex-none">
          <span className="font-medium">{lineItem.price}</span>
          {lineItem.basePrice ? (
            <span className="text-contrast-400 line-through">{lineItem.basePrice}</span>
          ) : null}
        </div>

        {/* Counter */}
        <div className="flex items-center rounded-lg border border-[var(--cart-counter-border,hsl(var(--contrast-100)))]">
          <button
            aria-label={decrementLabel}
            className={clsx(
              'group rounded-l-lg bg-[var(--cart-counter-background,hsl(var(--background)))] p-3 focus-visible:ring-2 focus-visible:ring-[var(--cart-focus,hsl(var(--primary)))] focus-visible:outline-hidden disabled:cursor-not-allowed',
              lineItem.quantity === 1
                ? 'opacity-50'
                : 'hover:bg-[var(--cart-counter-background-hover,hsl(var(--contrast-100)/50%))]',
            )}
            disabled={lineItem.quantity === 1}
            name="intent"
            type="submit"
            value="decrement"
          >
            <Minus
              className={clsx(
                'text-[var(--cart-counter-icon,hsl(var(--contrast-300)))] transition-colors duration-300',
                lineItem.quantity !== 1 &&
                  'group-hover:text-[var(--cart-counter-icon-hover,hsl(var(--foreground)))]',
              )}
              size={18}
              strokeWidth={1.5}
            />
          </button>
          <span className="flex w-8 justify-center select-none focus-visible:ring-2 focus-visible:ring-[var(--cart-focus,hsl(var(--primary)))] focus-visible:outline-hidden">
            {lineItem.quantity}
          </span>
          <button
            aria-label={incrementLabel}
            className={clsx(
              'group rounded-r-lg bg-[var(--cart-counter-background,hsl(var(--background)))] p-3 transition-colors duration-300 hover:bg-[var(--cart-counter-background-hover,hsl(var(--contrast-100)/50%))] focus-visible:ring-2 focus-visible:ring-[var(--cart-focus,hsl(var(--primary)))] focus-visible:outline-hidden disabled:cursor-not-allowed',
            )}
            name="intent"
            type="submit"
            value="increment"
          >
            <Plus
              className="text-[var(--cart-counter-icon,hsl(var(--contrast-300)))] transition-colors duration-300 group-hover:text-[var(--cart-counter-icon-hover,hsl(var(--foreground)))]"
              size={18}
              strokeWidth={1.5}
            />
          </button>
        </div>

        <button
          aria-label={deleteLabel}
          className="inline-flex"
          name="intent"
          type="submit"
          value="delete"
        >
          <Trash
            className="text-foreground ease-quad hover:text-primary transition-colors duration-300"
            size={20}
            strokeWidth={1}
          />
        </button>
      </div>
    </form>
  );
}

function CheckoutButton({
  action,
  ...props
}: { action: Action<SubmissionResult | null, FormData> } & ComponentPropsWithoutRef<
  typeof Button
>) {
  const [lastResult, formAction] = useActionState(action, null);

  const [form] = useForm({ lastResult });

  useEffect(() => {
    if (form.errors) {
      form.errors.forEach((error) => {
        toast.error(error);
      });
    }
  }, [form.errors]);

  return (
    <form action={formAction}>
      <SubmitButton {...props} />
    </form>
  );
}

function SubmitButton(props: ComponentPropsWithoutRef<typeof Button>) {
  const { pending } = useFormStatus();

  return <Button {...props} disabled={pending} loading={pending} size="medium" type="submit" />;
}

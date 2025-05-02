import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import * as Skeleton from '@/vibes/soul/primitives/skeleton';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { StickySidebarLayout } from '@/vibes/soul/sections/sticky-sidebar-layout';

import { CartClient, Cart as CartData, CartLineItem, CartProps } from './client';

export { type CartLineItem } from './client';

export function Cart<LineItem extends CartLineItem>({
  cart: streamableCart,
  decrementLineItemLabel: streamableDecrementLineItemLabel,
  title = 'Cart',
  summaryTitle = 'Summary',
  ...props
}: Omit<CartProps<LineItem>, 'cart'> & {
  cart: Streamable<CartData<LineItem>>;
}) {
  return (
    <Stream
      fallback={<CartSkeleton summaryTitle={summaryTitle} title={title} />}
      value={streamableCart}
    >
      {(cart) => <CartClient {...props} cart={cart} summaryTitle={summaryTitle} title={title} />}
    </Stream>
  );
}

export interface CartSkeletonProps {
  className?: string;
  placeholderCount?: number;
  summaryPlaceholderCount?: number;
  title?: string;
  summaryTitle?: string;
}

export function CartSkeleton({
  title = 'Cart',
  summaryTitle = 'Summary',
  placeholderCount = 2,
  summaryPlaceholderCount = 3,
}: CartSkeletonProps) {
  return (
    <>
      <div className="@container container pt-8 md:pt-16">
        <h1 className="text-2xl leading-none @xl:text-4xl">{title}</h1>
      </div>
      <StickySidebarLayout
        className="group/cart text-[var(--cart-text,hsl(var(--foreground)))]"
        gapXSize="gap-x-20"
        sidebar={
          <div>
            <h2 className="mb-10 text-lg leading-none font-medium tracking-[1.8px] uppercase @xl:text-2xl">
              {summaryTitle}
            </h2>
            <div className="group-has-[[data-pending]]/cart:animate-pulse">
              <div className="w-full" data-pending>
                <div className="divide-y divide-[var(--skeleton,hsl(var(--contrast-300)/15%))]">
                  {Array.from({ length: summaryPlaceholderCount }).map((_, index) => (
                    <div className="py-4" key={index}>
                      <div className="flex items-center justify-between">
                        <Skeleton.Text characterCount={10} className="rounded-md" />
                        <Skeleton.Text characterCount={8} className="rounded-md" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between border-t border-[var(--skeleton,hsl(var(--contrast-300)/15%))] py-6 text-xl font-bold">
                  <div className="flex items-center justify-between">
                    <Skeleton.Text characterCount={8} className="rounded-md" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton.Text characterCount={8} className="rounded-md" />
                  </div>
                </div>
              </div>
            </div>
            <Skeleton.Box className="mt-4 h-[58px] w-full rounded-full" />
          </div>
        }
        sidebarPosition="after"
        sidebarSize="1/3"
      >
        <div>
          {/* Cart Line Items */}
          <div className="group-has-[[data-pending]]/cart:animate-pulse">
            <ul className="flex flex-col gap-5" data-pending>
              {Array.from({ length: placeholderCount }).map((_, index) => (
                <li
                  className="@container flex flex-col items-start gap-x-5 gap-y-4 @sm:flex-row"
                  key={index}
                >
                  {/* Image */}
                  <Skeleton.Box className="aspect-square w-full max-w-24 rounded-xl" />
                  <div className="flex grow flex-col flex-wrap justify-between gap-y-2 @xl:flex-row">
                    <div className="flex w-full flex-1 flex-col @xl:w-1/2 @xl:pr-4">
                      {/* Line Item Title */}
                      <Skeleton.Text characterCount={15} className="rounded-md" />
                      {/* Subtitle */}
                      <Skeleton.Text characterCount={10} className="rounded-md" />
                    </div>
                    {/* Counter */}
                    <div>
                      <div className="flex w-full flex-wrap items-center gap-x-5 gap-y-2">
                        {/* Price */}
                        <Skeleton.Text characterCount={5} className="rounded-md" />
                        {/* Counter */}
                        <Skeleton.Box className="h-[44px] w-[118px] rounded-lg" />
                        {/* DeleteLineItemButton */}
                        <Skeleton.Box className="-ml-1 h-8 w-8 rounded-full" />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </StickySidebarLayout>
    </>
  );
}

export interface CartEmptyState {
  title: string;
  subtitle: string;
  cta: {
    label: string;
    href: string;
  };
}

export function CartEmptyState({ title, subtitle, cta }: CartEmptyState) {
  return (
    <SectionLayout>
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-heading mb-6 text-center text-4xl leading-none uppercase @xl:text-6xl">
          {title}
        </h1>
        <p className="text-contrast-400 mb-16 text-center leading-normal">{subtitle}</p>
        <ButtonLink href={cta.href}>{cta.label}</ButtonLink>
      </div>
    </SectionLayout>
  );
}

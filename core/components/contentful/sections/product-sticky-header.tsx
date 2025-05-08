'use client';

import { clsx } from 'clsx';
import { forwardRef, RefObject, useEffect, useState, useTransition } from 'react';

import { Stream, type Streamable } from '@/vibes/soul/lib/streamable';
import { Button } from '@/vibes/soul/primitives/button';
import { LogoLotus } from '@/vibes/soul/primitives/logo-lotus';
import { Price } from '@/vibes/soul/primitives/price-label';
import { addToCartBySkuForm } from '~/app/[locale]/(default)/cart/_actions/add-to-cart-by-sku-form';
import { productFinishedGoods } from '~/contentful/schema';
import { useRouter } from '~/i18n/routing';

interface ProductStickyHeaderProps {
  product: {
    price?: Streamable<Price | null>;
    id: string;
    sku?: string;
  };
  contentful: productFinishedGoods | null | undefined;
  addToBagButtonRef: RefObject<HTMLButtonElement | null>;
}

function AddToBagForm({ sku, price }: { sku?: string; price?: Price | null }) {
  const router = useRouter();
  const [isPending, start] = useTransition();

  let priceDisplay = '';

  if (typeof price === 'string') priceDisplay = price;
  else if (price && price.type === 'range') priceDisplay = `${price.minValue}–${price.maxValue}`;
  else if (price) priceDisplay = price.currentValue;

  if (!sku) {
    return (
      <Button disabled size="small">
        Add to bag{priceDisplay ? ` | ${priceDisplay}` : ''}
      </Button>
    );
  }

  return (
    <form
      action={(formData) => {
        start(() => {
          return addToCartBySkuForm(formData).then(() => {
            router.refresh();
          });
        });
      }}
    >
      <input name="sku" type="hidden" value={sku} />
      <Button disabled={isPending} loading={isPending} size="small" type="submit">
        Add to bag{priceDisplay ? ` | ${priceDisplay}` : ''}
      </Button>
    </form>
  );
}

export const ProductStickyHeader = forwardRef<HTMLDivElement, ProductStickyHeaderProps>(
  ({ product, contentful, addToBagButtonRef }, ref) => {
    const [showStickyHeader, setShowStickyHeader] = useState(false);

    useEffect(() => {
      function onScroll() {
        if (!addToBagButtonRef.current) return;

        const rect = addToBagButtonRef.current.getBoundingClientRect();

        setShowStickyHeader(rect.bottom < 0);
      }

      window.addEventListener('scroll', onScroll);
      onScroll();

      return () => window.removeEventListener('scroll', onScroll);
    }, [addToBagButtonRef]);

    return (
      <header
        className={clsx(
          'bg-contrast-100 fixed top-[var(--site-header-height,0px)] left-0 z-10 hidden w-full items-center justify-between px-6 py-3 shadow-md transition-opacity sm:flex @xl:px-12',
          showStickyHeader ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        ref={ref}
      >
        <div className="flex min-w-0 items-center gap-4">
          <LogoLotus height={32} type="icon" width={32} />
        </div>
        <nav className="ml-8 flex flex-1 items-center justify-center gap-8">
          <span
            className="text-surface-foreground max-w-xs truncate text-2xl font-medium tracking-widest uppercase @xl:max-w-md"
            title={contentful?.fields.productName || ''}
          >
            {contentful?.fields.productName}
          </span>
          <a
            className="text-surface-foreground/80 hover:text-surface-foreground transition-colors"
            href="#overview"
            style={{ scrollBehavior: 'smooth' }}
          >
            Overview
          </a>
          <a
            className="text-surface-foreground/80 hover:text-surface-foreground transition-colors"
            href="#features"
            style={{ scrollBehavior: 'smooth' }}
          >
            Features
          </a>
          {/* <a
            className="text-surface-foreground/80 hover:text-surface-foreground transition-colors"
            href="#reviews"
            style={{ scrollBehavior: 'smooth' }}
          >
            Reviews
          </a> */}
        </nav>
        <div className="flex items-center">
          <Stream
            fallback={
              <Button loading size="small">
                Add to bag
              </Button>
            }
            value={product.price}
          >
            {(price) => <AddToBagForm price={price} sku={product.sku} />}
          </Stream>
        </div>
      </header>
    );
  },
);

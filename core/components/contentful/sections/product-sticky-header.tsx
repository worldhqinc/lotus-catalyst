'use client';

import { clsx } from 'clsx';
import { ShoppingCart } from 'lucide-react';
import { forwardRef, RefObject, useEffect, useState, useTransition } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { Button } from '@/vibes/soul/primitives/button';
import { LogoLotus } from '@/vibes/soul/primitives/logo-lotus';
import { addToCartBySkuForm } from '~/app/[locale]/(default)/cart/_actions/add-to-cart-by-sku-form';
import { productFinishedGoods, productPartsAndAccessories } from '~/contentful/schema';
import { useRouter } from '~/i18n/routing';
import { formatTrademarkText } from '~/lib/utils';

function AddToBagForm({ sku, ctaDisabled }: { sku?: string; ctaDisabled?: boolean | null }) {
  const router = useRouter();
  const [isPending, start] = useTransition();

  if (ctaDisabled) {
    return null;
  }

  if (!sku) {
    return (
      <Button disabled size="small">
        Add to cart
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
      <Button
        className="!hidden sm:!inline-flex"
        disabled={isPending}
        loading={isPending}
        size="small"
        type="submit"
      >
        Add to cart
      </Button>
      <Button
        className="inline-flex sm:hidden"
        disabled={isPending}
        loading={isPending}
        shape="circle"
        size="small"
        type="submit"
      >
        <ShoppingCart className="h-5 w-5" />
      </Button>
    </form>
  );
}

export const ProductStickyHeader = forwardRef<
  HTMLDivElement,
  {
    product: {
      id: string;
      sku?: string;
    };
    contentful: productFinishedGoods | productPartsAndAccessories | null | undefined;
    detailFormRef: RefObject<HTMLDivElement | null>;
    streamableCtaDisabled?: Streamable<boolean | null>;
  }
>(({ product, contentful, detailFormRef, streamableCtaDisabled }, ref) => {
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  useEffect(() => {
    function onScroll() {
      if (!detailFormRef.current) return;

      const rect = detailFormRef.current.getBoundingClientRect();

      setShowStickyHeader(rect.bottom < 0);
    }

    window.addEventListener('scroll', onScroll);
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, [detailFormRef]);

  const scrollToFeatures = () => {
    const firstPageContent = document.querySelector('[data-page-content]');

    if (firstPageContent) {
      const elementPosition = firstPageContent.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - 146;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header
      className={clsx(
        'bg-contrast-100 ease-quad fixed top-[var(--site-header-height,0px)] left-0 z-25 w-full items-center justify-between py-3 shadow-md transition-all duration-200',
        showStickyHeader
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-full opacity-0',
      )}
      ref={ref}
    >
      <div className="container flex items-center justify-between">
        <div className="hidden sm:flex sm:min-w-0 sm:items-center sm:gap-4">
          <LogoLotus height={32} type="icon" width={32} />
        </div>
        <nav className="flex flex-1 items-center gap-8 sm:ml-8 sm:justify-center">
          <span
            className="text-surface-foreground max-w-xs truncate text-2xl font-medium tracking-widest uppercase @xl:max-w-md"
            title={contentful?.fields.webProductName || ''}
          >
            {formatTrademarkText(contentful?.fields.webProductName || '')}
          </span>
          <button
            className="text-surface-foreground/80 hover:text-surface-foreground hidden transition-colors sm:inline-flex"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Overview
          </button>
          <button
            className="text-surface-foreground/80 hover:text-surface-foreground hidden transition-colors sm:inline-flex"
            onClick={scrollToFeatures}
          >
            Features
          </button>
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
                Add to cart
              </Button>
            }
            value={Streamable.all([streamableCtaDisabled])}
          >
            {([ctaDisabled]) => <AddToBagForm ctaDisabled={ctaDisabled} sku={product.sku} />}
          </Stream>
        </div>
      </div>
    </header>
  );
});

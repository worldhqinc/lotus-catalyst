'use client';

import { clsx } from 'clsx';
import { startTransition } from 'react';
import { useFormStatus } from 'react-dom';

import { Badge } from '@/vibes/soul/primitives/badge';
import { Price, PriceLabel } from '@/vibes/soul/primitives/price-label';
import * as Skeleton from '@/vibes/soul/primitives/skeleton';
import { addToCartBySkuForm } from '~/app/[locale]/(default)/cart/_actions/add-to-cart-by-sku-form';
import { Image } from '~/components/image';
import { Link } from '~/components/link';
import NotifyBackInStock from '~/components/notify-back-in-stock';
import { useRouter } from '~/i18n/routing';

import { Button } from '../button';

import { Compare } from './compare';

export interface Product {
  id: string;
  title: string;
  href: string;
  image?: { src: string; alt: string };
  price?: Price;
  subtitle?: string;
  badge?: string;
  rating?: number;
  sku?: string;
  inStock?: boolean;
}

export interface ProductCardProps {
  className?: string;
  colorScheme?: 'light' | 'dark';
  aspectRatio?: '5:6' | '3:4' | '1:1';
  showCompare?: boolean;
  imagePriority?: boolean;
  imageSizes?: string;
  imageQuality?: number;
  compareLabel?: string;
  compareParamName?: string;
  fillContainer?: boolean;
  ratioOverride?: string;
  product: Product;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

// eslint-disable-next-line valid-jsdoc
/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --product-card-focus: hsl(var(--primary));
 *   --product-card-light-offset: hsl(var(--background));
 *   --product-card-light-background: hsl(var(--contrast-100));
 *   --product-card-light-title: hsl(var(--foreground));
 *   --product-card-light-subtitle: hsl(var(--foreground) / 75%);
 *   --product-card-dark-offset: hsl(var(--foreground));
 *   --product-card-dark-background: hsl(var(--contrast-500));
 *   --product-card-dark-title: hsl(var(--background));
 *   --product-card-dark-subtitle: hsl(var(--background) / 75%);
 *   --product-card-font-family: var(--font-family-body);
 * }
 * ```
 */
export function ProductCard({
  product: { id, title, subtitle, badge, price, image, href, sku, inStock = true },
  colorScheme = 'light',
  className,
  showCompare = false,
  aspectRatio = '1:1',
  compareLabel,
  compareParamName,
  imagePriority = false,
  imageSizes = '(min-width: 80rem) 40vw, (min-width: 64rem) 45vw, (min-width: 42rem) 50vw, (min-width: 24rem) 60vw, 100vw',
  imageQuality = 100,
  fillContainer = false,
  ratioOverride,
  onClick,
}: ProductCardProps) {
  const router = useRouter();

  // determine aspect ratio class: only apply when not fillContainer or when specifically overridden
  const ratioMapping = { '5:6': 'aspect-5/6', '3:4': 'aspect-3/4', '1:1': 'aspect-square' };
  const ratioClass = ratioOverride || (!fillContainer ? ratioMapping[aspectRatio] : undefined);

  return (
    <article
      className={clsx(
        'relative z-0',
        fillContainer
          ? 'group @container flex h-full w-full min-w-0 flex-col gap-2 font-[family-name:var(--card-font-family,var(--font-family-body))]'
          : 'group @container flex max-w-md min-w-0 flex-col gap-2 font-[family-name:var(--card-font-family,var(--font-family-body))]',
        className,
      )}
    >
      <div className="relative">
        <div
          className={clsx(
            fillContainer
              ? '@container relative overflow-hidden rounded-xl @md:rounded-2xl'
              : 'relative overflow-hidden rounded-xl @md:rounded-2xl',
            ratioClass,
            {
              light: 'bg-contrast-100',
              dark: 'bg-contrast-100',
            }[colorScheme],
          )}
        >
          {image != null ? (
            <Image
              alt={image.alt}
              className={clsx(
                'ease-quad w-full scale-100 object-cover transition-transform duration-200 select-none group-hover:scale-105',
                {
                  light: 'bg-contrast-100',
                  dark: 'bg-contrast-100',
                }[colorScheme],
              )}
              fill
              priority={imagePriority}
              quality={imageQuality}
              sizes={imageSizes}
              src={image.src}
            />
          ) : (
            <div
              className={clsx(
                'ease-quad pt-5 pl-5 text-4xl leading-[0.8] font-bold tracking-tighter break-words opacity-25 transition-transform duration-500 group-hover:scale-105 @xs:text-7xl',
                {
                  light: 'text-[var(--product-card-light-title,hsl(var(--foreground)))]',
                  dark: 'text-[var(--product-card-dark-title,hsl(var(--background)))]',
                }[colorScheme],
              )}
            >
              {title}
            </div>
          )}
          {badge != null && badge !== '' && (
            <Badge className="!bg-background absolute top-3 left-3" shape="rounded">
              {badge}
            </Badge>
          )}
          {!!sku && inStock && (
            <form
              action={() => {
                startTransition(async () => {
                  const formData = new FormData();

                  formData.append('sku', sku);
                  await addToCartBySkuForm(formData);
                  router.refresh();
                });
              }}
              className="pointer-events-none absolute inset-0 z-10 hidden lg:block"
            >
              <AddToBagForm sku={sku} />
            </form>
          )}
          {!!sku && !inStock && (
            <div className="pointer-events-none absolute inset-0 z-10 hidden lg:block">
              <div className="flex size-full items-end justify-center p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100 focus-within:opacity-100">
                <NotifyBackInStock
                  buttonClassName="pointer-events-auto w-full"
                  sku={sku}
                  textCta={false}
                />
              </div>
            </div>
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-start gap-x-4 gap-y-3 @xs:mt-3">
          <div className="flex-1 space-y-2 text-sm @[16rem]:text-base">
            <div>
              <h3
                className={clsx(
                  'block max-w-full font-medium [word-break:break-word]',
                  {
                    light: 'text-foreground',
                    dark: 'text-[var(--product-card-dark-title,hsl(var(--background)))]',
                  }[colorScheme],
                )}
              >
                {title}
              </h3>
              {subtitle != null && subtitle !== '' && (
                <span
                  className={clsx(
                    'mb-2 line-clamp-2 block text-sm leading-6 font-normal',
                    {
                      light: 'text-contrast-400',
                      dark: 'text-[var(--product-card-dark-subtitle,hsl(var(--background)/75%))]',
                    }[colorScheme],
                  )}
                >
                  {subtitle}
                </span>
              )}
            </div>
            {price != null && inStock && <PriceLabel colorScheme={colorScheme} price={price} />}
            <div className="relative z-20">
              {!inStock && !!sku && <NotifyBackInStock sku={sku} textCta={true} />}
            </div>
          </div>
          {/* {rating != null && (
            <div className="text-foreground mb-2 flex items-center gap-1 text-sm">
              <Star aria-hidden className="h-4 w-4" fill="currentColor" />
              <span className="text-sm font-normal">{rating.toFixed(1)}</span>
            </div>
          )} */}
        </div>
        {href !== '#' && (
          <Link
            aria-label={title}
            className={clsx(
              'absolute inset-0 rounded-t-2xl rounded-b-lg focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--product-card-focus,hsl(var(--primary)))] focus-visible:ring-offset-4',
              {
                light: 'ring-offset-[var(--product-card-light-offset,hsl(var(--background)))]',
                dark: 'ring-offset-[var(--product-card-dark-offset,hsl(var(--foreground)))]',
              }[colorScheme],
            )}
            href={href}
            id={id}
            onClick={onClick}
          >
            <span className="sr-only">View product</span>
          </Link>
        )}
      </div>
      {showCompare && (
        <div className="mt-0.5 shrink-0">
          <Compare
            colorScheme={colorScheme}
            label={compareLabel}
            paramName={compareParamName}
            product={{ id, title, href, image }}
          />
        </div>
      )}
    </article>
  );
}

export function ProductCardSkeleton({
  className,
  aspectRatio = '5:6',
}: {
  aspectRatio?: '5:6' | '3:4' | '1:1';
  className?: string;
}) {
  return (
    <div className={clsx('@container', className)}>
      <Skeleton.Box
        className={clsx(
          'rounded-xl @md:rounded-2xl',
          {
            '5:6': 'aspect-5/6',
            '3:4': 'aspect-3/4',
            '1:1': 'aspect-square',
          }[aspectRatio],
        )}
      />
      <div className="mt-2 flex flex-col items-start gap-x-4 gap-y-3 @xs:mt-3 @2xl:flex-row">
        <div className="w-full text-sm @[16rem]:text-base">
          <Skeleton.Text characterCount={10} className="rounded-sm" />
          <Skeleton.Text characterCount={8} className="rounded-sm" />
          <Skeleton.Text characterCount={6} className="rounded-sm" />
        </div>
      </div>
    </div>
  );
}

function AddToBagForm({ sku }: { sku: string }) {
  const { pending } = useFormStatus();

  return (
    <div
      className={clsx(
        'ease-quad flex size-full items-end justify-center p-4 transition-opacity duration-200 group-hover:opacity-100 focus-within:opacity-100',
        pending ? 'opacity-100' : 'opacity-0',
      )}
    >
      <input name="sku" type="hidden" value={sku} />
      <Button
        className="pointer-events-auto w-full"
        disabled={!sku || pending}
        loading={pending}
        size="medium"
        type="submit"
      >
        Add to cart
      </Button>
    </div>
  );
}

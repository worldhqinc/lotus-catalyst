import { clsx } from 'clsx';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { Badge } from '@/vibes/soul/primitives/badge';
import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { ProductCard, ProductCardSkeleton } from '@/vibes/soul/primitives/product-card';
import * as Skeleton from '@/vibes/soul/primitives/skeleton';
import { WishlistItem } from '@/vibes/soul/primitives/wishlist-item-card';
import { Wishlist } from '@/vibes/soul/sections/wishlist-details';

export interface WishlistItemActions {
  component: (wishlist?: Wishlist) => React.ReactNode;
  position?: 'left' | 'right';
}

interface Props {
  wishlist: Streamable<Wishlist>;
  itemActions?: WishlistItemActions;
  viewWishlistLabel?: string;
  className?: string;
  placeholderCount?: number;
  emptyStateText?: Streamable<string | null>;
}

export const WishlistListItem = ({
  className = '',
  itemActions,
  wishlist: streamableWishlist,
  viewWishlistLabel = 'View list',
  placeholderCount,
  emptyStateText,
}: Props) => {
  const { component: actionsComponent, position: actionsPosition = 'right' } = itemActions ?? {};

  return (
    <Stream
      fallback={
        <WishlistListItemSkeleton
          itemActions={itemActions}
          pending
          placeholderCount={placeholderCount}
        />
      }
      value={streamableWishlist}
    >
      {(wishlist) => {
        const { name, visibility, items, totalItems, href, id } = wishlist;

        return (
          <section
            aria-describedby={`wishlist-description-${id}`}
            aria-labelledby={`wishlist-title-${id}`}
            className={clsx('@container flex flex-col py-6', className)}
          >
            <div className="flex flex-1 flex-col justify-between @sm:flex-row @sm:items-center">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-medium" id={`wishlist-title-${id}`}>
                    {name}
                  </h2>
                  <Badge>{visibility.label}</Badge>
                </div>
                <div className="text-contrast-500 text-sm" id={`wishlist-description-${id}`}>
                  {totalItems.label}
                </div>
              </div>
              <div className="my-4 flex gap-2 whitespace-nowrap @sm:my-0 @sm:ml-2 @sm:items-center">
                {actionsPosition === 'left' && actionsComponent?.(wishlist)}
                <ButtonLink className="flex-1" href={href} size="medium" variant="primary">
                  {viewWishlistLabel}
                </ButtonLink>
                {actionsPosition === 'right' && actionsComponent?.(wishlist)}
              </div>
            </div>
            <WishlistListItemItems
              emptyStateText={emptyStateText}
              items={items}
              placeholderCount={placeholderCount}
            />
          </section>
        );
      }}
    </Stream>
  );
};

function WishlistListItemItems({
  emptyStateText,
  items: streamableWishlistItems,
  placeholderCount,
}: {
  items: Streamable<WishlistItem[]>;
  emptyStateText?: Streamable<string | null>;
  placeholderCount?: number;
}) {
  return (
    <Stream
      fallback={<WishlistListItemItemsSkeleton placeholderCount={placeholderCount} />}
      value={streamableWishlistItems}
    >
      {(items) => {
        if (items.length === 0) {
          return (
            <WishlistListItemItemsEmptyState
              emptyStateText={emptyStateText}
              placeholderCount={placeholderCount}
            />
          );
        }

        return (
          <div className="mt-8 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,_black_70%,_transparent_100%)]">
            <div className="flex min-w-[1024px] gap-4 overflow-x-hidden">
              {items.map(({ product }) => (
                <div className="max-w-[calc(1024px/6-20px)] min-w-36 shrink-0" key={product.id}>
                  <ProductCard aspectRatio="1:1" product={product} />
                </div>
              ))}
            </div>
          </div>
        );
      }}
    </Stream>
  );
}

function WishlistListItemItemsEmptyState({
  emptyStateText = "You haven't added products to your wishlist.",
  placeholderCount = 8,
}: {
  emptyStateText?: Streamable<string | null>;
  placeholderCount?: number;
}) {
  return (
    <div className="relative">
      <div className="[mask-image:linear-gradient(to_bottom,_black_25%,_transparent_100%)]">
        <WishlistListItemItemsSkeleton placeholderCount={placeholderCount} />
      </div>
      <div className="absolute inset-0 mx-auto px-3 py-24 pb-3 @4xl:px-10 @4xl:pt-24 @4xl:pb-10">
        <div className="mx-auto max-w-xl space-y-2 text-center @4xl:space-y-3">
          <p className="text-contrast-500 text-sm @4xl:text-lg">{emptyStateText}</p>
        </div>
      </div>
    </div>
  );
}

function WishlistListItemItemsSkeleton({
  className = '',
  placeholderCount = 8,
}: {
  className?: string;
  placeholderCount?: number;
}) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: placeholderCount }).map((_, index) => (
        <div className={clsx('min-w-36', className)} key={index}>
          <ProductCardSkeleton aspectRatio="1:1" />
        </div>
      ))}
    </div>
  );
}

export function WishlistListItemSkeleton({
  className = '',
  itemActions,
  placeholderCount,
  pending = false,
}: {
  className?: string;
  itemActions?: WishlistItemActions;
  placeholderCount?: number;
  pending?: boolean;
}) {
  const { component, position: actionsPosition = 'right' } = itemActions ?? {};

  return (
    <div
      className={clsx('@container my-4 flex flex-col', pending ? 'animate-pulse' : '', className)}
      data-pending={pending ? '' : undefined}
    >
      <div className="flex flex-1 flex-col justify-between @sm:flex-row @sm:items-center">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Skeleton.Text characterCount={12} className="rounded-sm text-lg" />
            <Skeleton.Text characterCount={5} className="rounded-sm px-2 py-0.5" />
          </div>
          <Skeleton.Text characterCount={5} className="rounded-sm" />
        </div>
        <div className="my-4 flex gap-2 @sm:my-0 @sm:ml-2 @sm:items-center">
          {actionsPosition === 'left' && component?.()}
          <Skeleton.Box className="h-[50px] min-w-[9ch] flex-1 rounded-lg" />
          {actionsPosition === 'right' && component?.()}
        </div>
      </div>
      <WishlistListItemItemsSkeleton placeholderCount={placeholderCount} />
    </div>
  );
}

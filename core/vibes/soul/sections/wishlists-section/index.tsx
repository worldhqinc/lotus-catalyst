import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { CursorPagination, CursorPaginationInfo } from '@/vibes/soul/primitives/cursor-pagination';
import { Wishlist } from '@/vibes/soul/sections/wishlist-details';
import { WishlistList } from '@/vibes/soul/sections/wishlist-list';
import { WishlistItemActions } from '@/vibes/soul/sections/wishlist-list-item';

interface Props {
  title: string;
  wishlists: Streamable<Wishlist[]>;
  paginationInfo?: Streamable<CursorPaginationInfo>;
  emptyStateCallToAction?: React.ReactNode;
  emptyStateSubtitle?: Streamable<string | null>;
  emptyStateTitle?: Streamable<string | null>;
  emptyWishlistStateText?: Streamable<string | null>;
  viewWishlistLabel?: string;
  placeholderCount?: number;
  actions?: React.ReactNode;
  itemActions?: WishlistItemActions;
}

export const WishlistsSection = ({
  title,
  wishlists,
  paginationInfo,
  emptyStateCallToAction,
  emptyStateSubtitle,
  emptyStateTitle,
  emptyWishlistStateText,
  viewWishlistLabel,
  placeholderCount,
  actions,
  itemActions,
}: Props) => {
  return (
    <section className="w-full">
      <header className="border-b-contrast-200 border-b">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl leading-[120%] @2xl:text-4xl">{title}</h1>
          {actions}
        </div>
      </header>

      <WishlistList
        emptyStateCallToAction={emptyStateCallToAction}
        emptyStateSubtitle={emptyStateSubtitle}
        emptyStateTitle={emptyStateTitle}
        emptyWishlistStateText={emptyWishlistStateText}
        itemActions={itemActions}
        placeholderCount={placeholderCount}
        viewWishlistLabel={viewWishlistLabel}
        wishlists={wishlists}
      />

      <Stream value={paginationInfo}>
        {(info) => info && (info.startCursor || info.endCursor) && <CursorPagination info={info} />}
      </Stream>
    </section>
  );
};

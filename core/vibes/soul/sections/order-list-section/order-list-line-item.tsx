import { clsx } from 'clsx';

import { PriceLabel } from '@/vibes/soul/primitives/price-label';
import { Image } from '~/components/image';
import { Link } from '~/components/link';

export interface OrderListLineItem {
  id: string;
  title: string;
  subtitle?: string;
  price: string;
  href?: string;
  image?: { src: string; alt: string };
}

interface Props {
  className?: string;
  lineItem: OrderListLineItem;
}

export function OrderListLineItem({ className, lineItem }: Props) {
  return lineItem.href ? (
    <Link
      className={clsx(
        'group ring-primary grid cursor-pointer rounded-xl ring-offset-4 focus-visible:ring-2 focus-visible:outline-0 @md:rounded-2xl @lg:basis-40',
        className,
      )}
      href={lineItem.href}
      id={lineItem.id}
    >
      <div>
        {lineItem.image?.src != null ? (
          <figure className="bg-contrast-100 relative aspect-square h-auto w-36 overflow-hidden rounded-lg">
            <Image
              alt={lineItem.image.alt}
              className="bg-contrast-100 w-full scale-100 object-cover transition-transform duration-500 ease-out select-none group-hover:scale-110"
              fill
              sizes="(min-width: 32rem) 10rem, 8rem"
              src={lineItem.image.src}
            />
          </figure>
        ) : (
          <div className="text-contrast-300 bg-contrast-100 aspect-square h-auto w-36 overflow-hidden rounded-lg">
            {lineItem.title}
          </div>
        )}
      </div>

      <div className="mt-2 px-1 text-sm leading-snug @xs:mt-3">
        <span className="block w-full max-w-36 font-medium break-words">{lineItem.title}</span>

        {lineItem.subtitle != null && lineItem.subtitle !== '' && (
          <span className="text-contrast-400 block font-normal">{lineItem.subtitle}</span>
        )}
        <PriceLabel className="mt-2" price={lineItem.price} />
      </div>
    </Link>
  ) : (
    <div
      className={clsx('group grid rounded-xl @md:rounded-2xl @lg:basis-40', className)}
      id={lineItem.id}
    >
      <div>
        {lineItem.image?.src != null ? (
          <figure className="bg-contrast-100 relative aspect-square h-auto w-36 overflow-hidden rounded-lg">
            <Image
              alt={lineItem.image.alt}
              className="bg-contrast-100 w-full scale-100 object-cover transition-transform duration-500 ease-out select-none group-hover:scale-110"
              fill
              sizes="(min-width: 32rem) 10rem, 8rem"
              src={lineItem.image.src}
            />
          </figure>
        ) : (
          <div className="text-contrast-300 bg-contrast-100 aspect-square h-auto w-36 overflow-hidden rounded-lg">
            {lineItem.title}
          </div>
        )}
      </div>

      <div className="mt-2 px-1 text-sm leading-snug @xs:mt-3">
        <span className="block font-medium">{lineItem.title}</span>

        {lineItem.subtitle != null && lineItem.subtitle !== '' && (
          <span className="text-contrast-400 block font-normal">{lineItem.subtitle}</span>
        )}
        <PriceLabel className="mt-2" price={lineItem.price} />
      </div>
    </div>
  );
}

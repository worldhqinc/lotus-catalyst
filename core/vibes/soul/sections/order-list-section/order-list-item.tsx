import { clsx } from 'clsx';

import { Badge } from '@/vibes/soul/primitives/badge';
import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { Carousel, CarouselContent, CarouselItem } from '@/vibes/soul/primitives/carousel';

import { OrderListLineItem } from './order-list-line-item';

export interface Order {
  id: string;
  totalPrice: string;
  status: string;
  href: string;
  lineItems: OrderListLineItem[];
}

interface Props {
  className?: string;
  order: Order;
  orderNumberLabel?: string;
  totalLabel?: string;
  viewDetailsLabel?: string;
}

export function OrderListItem({
  className,
  order,
  orderNumberLabel = 'Order #',
  totalLabel = 'Total',
  viewDetailsLabel = 'View details',
}: Props) {
  return (
    <div
      className={clsx(
        'border-contrast-200 border-t pt-5 pb-6 last:border-b @lg:pt-6 @lg:pb-10',
        className,
      )}
    >
      <div className="flex flex-col justify-between gap-x-10 gap-y-4 @lg:flex-row">
        <div className="flex items-center gap-x-12">
          <div>
            <span className="text-contrast-500 text-xs leading-[20px] tracking-[1.44px] uppercase">
              {orderNumberLabel}
            </span>
            <span className="block leading-normal font-medium">{order.id}</span>
          </div>
          <div>
            <span className="text-contrast-500 text-xs leading-[20px] tracking-[1.44px] uppercase">
              {totalLabel}
            </span>
            <span className="block leading-normal font-medium">{order.totalPrice}</span>
          </div>
          <Badge className="mt-0.5">{order.status}</Badge>
        </div>

        <ButtonLink href={order.href} size="medium">
          {viewDetailsLabel}
        </ButtonLink>
      </div>

      <div className="mt-8 [mask-image:linear-gradient(to_right,_black_0%,_black_80%,_transparent_98%)] lg:mt-6">
        <Carousel>
          <CarouselContent>
            {order.lineItems.map((lineItem) => (
              <CarouselItem className="pl-5" key={lineItem.id}>
                <OrderListLineItem lineItem={lineItem} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}

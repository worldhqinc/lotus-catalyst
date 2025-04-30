import { ArrowLeft } from 'lucide-react';

import { Badge } from '@/vibes/soul/primitives/badge';
import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { Image } from '~/components/image';
import { Link } from '~/components/link';

interface Summary {
  lineItems: Array<{
    label: string;
    value: string;
    subtext?: string;
  }>;
  total: string;
}

interface Address {
  name?: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipcode?: string;
  country?: string;
}

interface TrackingWithUrl {
  url: string;
}

interface TrackingWithNumber {
  number: string;
}

interface TrackingWithUrlAndNumber {
  url: string;
  number: string;
}

interface Shipment {
  name: string;
  status: string;
  tracking?: TrackingWithUrl | TrackingWithNumber | TrackingWithUrlAndNumber;
}

interface ShipmentLineItem {
  id: string;
  title: string;
  subtitle?: string;
  price: string;
  href?: string;
  image?: { src: string; alt: string };
  quantity: number;
  metadata?: Array<{ label: string; value: string }>;
}

interface Destination {
  id: string;
  title: string;
  address: Address;
  shipments: Shipment[];
  lineItems: ShipmentLineItem[];
}

export interface Order {
  id: string;
  status: string;
  statusColor?: 'success' | 'warning' | 'error' | 'info';
  date: string;
  destinations: Destination[];
  summary: Summary;
}

interface Props {
  order: Order;
  title?: string;
  shipmentAddressLabel?: string;
  shipmentMethodLabel?: string;
  summaryTotalLabel?: string;
  prevHref?: string;
}

export function OrderDetailsSection({
  order,
  title = `Order #${order.id}`,
  shipmentAddressLabel,
  shipmentMethodLabel,
  summaryTotalLabel,
  prevHref = '/orders',
}: Props) {
  return (
    <div className="@container">
      <div className="border-contrast-200 flex gap-4 border-b pb-8">
        <ButtonLink href={prevHref} shape="link" size="link" variant="link">
          <ArrowLeft />
        </ButtonLink>
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl leading-[120%]">{title}</h1>
            <Badge>{order.status}</Badge>
          </div>
          <p>{order.date}</p>
        </div>
      </div>
      <div className="grid @3xl:flex">
        <div className="divide-contrast-200 order-2 flex-1 divide-y @3xl:order-1 @3xl:pr-12">
          {order.destinations.map((destination) => (
            <Shipment
              addressLabel={shipmentAddressLabel}
              destination={destination}
              key={destination.id}
              methodLabel={shipmentMethodLabel}
            />
          ))}
        </div>
        <div className="order-1 pt-8 @3xl:order-2 @3xl:basis-72">
          <Summary summary={order.summary} totalLabel={summaryTotalLabel} />
        </div>
      </div>
    </div>
  );
}

function Shipment({
  destination,
  addressLabel = 'Shipping address',
  methodLabel = 'Shipping method',
}: {
  destination: Destination;
  addressLabel?: string;
  methodLabel?: string;
}) {
  return (
    <div className="py-8">
      <div className="space-y-6">
        <h3 className="text-xl @4xl:text-2xl @4xl:font-medium @4xl:tracking-[2.4px] @4xl:uppercase">
          {destination.title}
        </h3>
        <div className="grid gap-8 @xl:flex @xl:gap-20">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">{addressLabel}</h4>
            <div className="text-contrast-400">
              <p>{destination.address.name}</p>
              <p>{destination.address.street1}</p>
              <p>{destination.address.street2}</p>
              <p>
                {`${destination.address.city}, ${destination.address.state} ${destination.address.zipcode}`}
              </p>
              <p>{destination.address.country}</p>
            </div>
          </div>
          {destination.shipments.map((shipment) => (
            <div key={shipment.name}>
              <h4 className="text-sm font-medium">{methodLabel}</h4>
              <div>
                <p>{shipment.name}</p>
                <p>{shipment.status}</p>
                <ShipmentTracking tracking={shipment.tracking} />
              </div>
            </div>
          ))}
        </div>
        {destination.lineItems.map((lineItem) => (
          <ShipmentLineItem key={lineItem.id} lineItem={lineItem} />
        ))}
      </div>
    </div>
  );
}

function ShipmentTracking({
  tracking,
}: {
  tracking?: TrackingWithUrl | TrackingWithNumber | TrackingWithUrlAndNumber;
}) {
  if (!tracking) {
    return null;
  }

  if ('url' in tracking && 'number' in tracking) {
    return (
      <p>
        <Link href={tracking.url} target="_blank">
          {tracking.number}
        </Link>
      </p>
    );
  }

  if ('url' in tracking) {
    return (
      <p>
        <Link href={tracking.url} target="_blank">
          {tracking.url}
        </Link>
      </p>
    );
  }

  return <p>{tracking.number}</p>;
}

function ShipmentLineItem({ lineItem }: { lineItem: ShipmentLineItem }) {
  return lineItem.href ? (
    <Link
      className="group ring-primary flex shrink-0 cursor-pointer items-start gap-8 rounded-xl ring-offset-4 focus-visible:ring-2 focus-visible:outline-0 @sm:flex @sm:rounded-2xl"
      href={lineItem.href}
      id={lineItem.id}
    >
      <figure className="border-contrast-100 bg-contrast-200 aspect-square h-auto w-36 overflow-hidden rounded-lg border">
        {lineItem.image?.src != null ? (
          <Image
            alt={lineItem.image.alt}
            className="h-full w-full object-cover"
            fill
            sizes="10rem"
            src={lineItem.image.src}
          />
        ) : (
          <div className="text-contrast-300 pt-3 pl-2 text-4xl leading-[0.8] font-bold tracking-tighter transition-transform duration-500 ease-out group-hover:scale-105">
            {lineItem.title}
          </div>
        )}
      </figure>

      <div className="space-y-3 text-sm">
        <div>
          <div className="leading-[150%] font-medium">{lineItem.title}</div>
          {lineItem.subtitle != null && lineItem.subtitle !== '' && (
            <div className="text-contrast-500 font-normal">{lineItem.subtitle}</div>
          )}
        </div>
        <div className="flex gap-1 text-sm">
          <span>{lineItem.price}</span>
          <span>×</span>
          <span>{lineItem.quantity}</span>
        </div>
        <div>
          {lineItem.metadata?.map((metadata, index) => (
            <div className="flex gap-1 text-sm" key={index}>
              <span className="font-medium">{metadata.label}:</span>
              <span>{metadata.value}</span>
            </div>
          ))}
        </div>
      </div>
    </Link>
  ) : (
    <div
      className="group flex shrink-0 items-start gap-8 rounded-xl @sm:flex @sm:rounded-2xl"
      id={lineItem.id}
    >
      <figure className="border-contrast-100 bg-contrast-200 aspect-square h-auto w-36 overflow-hidden rounded-lg border">
        {lineItem.image?.src != null ? (
          <Image
            alt={lineItem.image.alt}
            className="h-full w-full object-cover"
            fill
            sizes="10rem"
            src={lineItem.image.src}
          />
        ) : (
          <div className="text-contrast-300 pt-3 pl-2 text-4xl leading-[0.8] font-bold tracking-tighter transition-transform duration-500 ease-out group-hover:scale-105">
            {lineItem.title}
          </div>
        )}
      </figure>

      <div className="space-y-3 text-sm leading-snug">
        <div>
          <div className="font-medium">{lineItem.title}</div>
          {lineItem.subtitle != null && lineItem.subtitle !== '' && (
            <div className="text-contrast-500 font-normal">{lineItem.subtitle}</div>
          )}
        </div>
        <div className="flex gap-1 text-sm">
          <span className="font-medium">{lineItem.price}</span>
          <span>×</span>
          <span className="font-medium">{lineItem.quantity}</span>
        </div>
        <div>
          {lineItem.metadata?.map((metadata, index) => (
            <div className="flex gap-1 text-sm" key={index}>
              <span className="font-medium">{metadata.label}:</span>
              <span>{metadata.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Summary({ summary, totalLabel = 'Total' }: { summary: Summary; totalLabel?: string }) {
  return (
    <div className="space-y-5">
      <h3 className="text-xl @4xl:text-2xl @4xl:font-medium @4xl:tracking-[2.4px] @4xl:uppercase">
        Order summary
      </h3>
      <div className="divide-contrast-200 divide-y">
        <div className="space-y-2 pb-3">
          {summary.lineItems.map((lineItem, index) => (
            <div className="flex justify-between" key={index}>
              <div>
                <div className="text-sm">{lineItem.label}</div>
                {lineItem.subtext != null && lineItem.subtext !== '' && (
                  <div className="text-contrast-400 text-xs">{lineItem.subtext}</div>
                )}
              </div>
              <span className="text-sm">{lineItem.value}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between py-3">
          <span className="font-medium">{totalLabel}</span>
          <span className="font-medium">{summary.total}</span>
        </div>
      </div>
    </div>
  );
}

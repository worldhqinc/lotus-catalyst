'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselScrollbar,
  useCarousel,
} from '@/vibes/soul/primitives/carousel';
import { ProductCard } from '@/vibes/soul/primitives/product-card';
import {
  CarouselProduct,
  ProductsCarouselEmptyState,
  ProductsCarouselSkeleton,
} from '@/vibes/soul/sections/product-carousel';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { Link } from '~/components/link';

function NavHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();

  return (
    <div className="mb-12 flex items-start justify-between">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl uppercase">{title}</h2>
        {subtitle ? <p className="text-icon-secondary max-w-md text-base">{subtitle}</p> : null}
      </div>
      <div className="flex gap-4">
        <button
          className="border-border rounded-full border bg-white p-3 disabled:opacity-50"
          disabled={!canScrollPrev}
          onClick={scrollPrev}
        >
          <ArrowLeft className="text-icon-primary h-5 w-5" />
        </button>
        <button
          className="border-border rounded-full border bg-white p-3 disabled:opacity-50"
          disabled={!canScrollNext}
          onClick={scrollNext}
        >
          <ArrowRight className="text-icon-primary h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export interface FeaturedProductCarouselProps {
  title: string;
  subtitle?: string;
  products: Streamable<CarouselProduct[]>;
  emptyStateTitle?: Streamable<string>;
  emptyStateSubtitle?: Streamable<string>;
  placeholderCount?: number;
  scrollbarLabel?: string;
  hideOverflow?: boolean;
}

export function FeaturedProductCarousel({
  title,
  subtitle,
  products,
  emptyStateTitle,
  emptyStateSubtitle,
  placeholderCount = 8,
  scrollbarLabel = 'Scroll',
  hideOverflow = false,
}: FeaturedProductCarouselProps) {
  return (
    <SectionLayout containerSize="2xl">
      <Stream
        fallback={
          <ProductsCarouselSkeleton
            className=""
            hideOverflow={hideOverflow}
            placeholderCount={placeholderCount}
          />
        }
        value={products}
      >
        {(items) =>
          items.length === 0 ? (
            <ProductsCarouselEmptyState
              className=""
              colorScheme="light"
              emptyStateSubtitle={emptyStateSubtitle}
              emptyStateTitle={emptyStateTitle}
              hideOverflow={hideOverflow}
              placeholderCount={placeholderCount}
            />
          ) : (
            <Carousel hideOverflow={hideOverflow}>
              <NavHeader subtitle={subtitle} title={title} />
              <CarouselContent className="mb-8 -ml-4 @2xl:-ml-5">
                {items.map((product, index) => (
                  <CarouselItem
                    className="basis-full pl-4 @md:basis-1/2 @lg:basis-1/3 @2xl:basis-1/4 @2xl:pl-5"
                    key={`${product.id}-${index}`}
                  >
                    <ProductCard
                      aspectRatio="1:1"
                      product={{ ...product, rating: product.rating ?? 0 }}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>

              <div className="mb-4 flex w-full justify-end px-4 @xl:px-6">
                <CarouselScrollbar colorScheme="light" label={scrollbarLabel} />
              </div>
            </Carousel>
          )
        }
      </Stream>
    </SectionLayout>
  );
}

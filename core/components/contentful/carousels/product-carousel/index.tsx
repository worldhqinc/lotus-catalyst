'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselScrollbar,
  useCarousel,
} from '@/vibes/soul/primitives/carousel';
import { ProductCard } from '@/vibes/soul/primitives/product-card';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { carouselProduct } from '~/contentful/schema';
import { contentfulProductCardTransformer } from '~/data-transformers/product-card-transformer';

interface Props {
  carousel: Pick<carouselProduct, 'fields'>;
}

function NavHeader({ title, subtitle }: { title: string; subtitle?: string | null }) {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();

  return (
    <div className="mb-8 flex items-start justify-between lg:mb-16">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-medium tracking-[1.8px] uppercase lg:text-2xl lg:tracking-[2.4px]">
          {title}
        </h2>
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

export function ProductCarousel({ carousel }: Props) {
  const { carouselTitle, subtitle, products: productEntries } = carousel.fields;

  const items = productEntries.map(contentfulProductCardTransformer);

  return (
    <SectionLayout containerSize="2xl">
      <Carousel hideOverflow={false}>
        <NavHeader subtitle={subtitle} title={carouselTitle} />

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
          <CarouselScrollbar colorScheme="light" label="Scroll" />
        </div>
      </Carousel>
    </SectionLayout>
  );
}

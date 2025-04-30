'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselScrollbar,
  useCarousel,
} from '@/vibes/soul/primitives/carousel';
import type { Price } from '@/vibes/soul/primitives/price-label';
import { ProductCard } from '@/vibes/soul/primitives/product-card';
import type { CarouselProduct } from '@/vibes/soul/sections/product-carousel';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import {
  carouselProduct,
  productFinishedGoodsSchema,
  productPartsAndAccessoriesSchema,
} from '~/contentful/schema';
import { ensureImageUrl } from '~/lib/utils';

interface Props {
  carousel: carouselProduct;
}

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

function parseProduct(
  entry: carouselProduct['fields']['products'][number],
): CarouselProduct | undefined {
  const entryObject = entry;

  if (entryObject.sys.contentType.sys.id === 'productPartsAndAccessories') {
    const product = productPartsAndAccessoriesSchema.parse(entry);
    const { fields } = product;
    const { featuredImage } = fields;
    const { file } = featuredImage.fields;

    const image = {
      src: ensureImageUrl(file.url),
      alt: featuredImage.fields.description ?? fields.productName,
    };

    const price: Price = fields.salePrice
      ? {
          type: 'sale',
          previousValue: fields.price ?? '0.00',
          currentValue: fields.salePrice,
        }
      : (fields.price ?? '0.00');

    return {
      id: product.sys.id,
      title: fields.productName,
      subtitle: 'Lorem ipsum dolor sit amet',
      href: fields.pageSlug ? `/${fields.pageSlug}` : '#',
      image,
      price,
      badge: fields.productBadge ?? undefined,
    };
  } else if (entryObject.sys.contentType.sys.id === 'productFinishedGoods') {
    const product = productFinishedGoodsSchema.parse(entry);
    const { fields } = product;
    const { featuredImage } = fields;
    const { file } = featuredImage?.fields ?? {};

    const image = featuredImage &&
      file && {
        src: ensureImageUrl(file.url),
        alt: featuredImage.fields.description ?? fields.productName,
      };

    const price: Price = fields.salePrice
      ? {
          type: 'sale',
          previousValue: fields.defaultPrice,
          currentValue: fields.salePrice,
        }
      : fields.defaultPrice;

    return {
      id: product.sys.id,
      title: fields.productName,
      subtitle: fields.shortDescription ?? undefined,
      href: fields.pageSlug ? `/${fields.pageSlug}` : '#',
      image,
      price,
      badge: fields.productBadge ?? undefined,
    };
  }
}

export function ProductCarousel({ carousel }: Props) {
  const { carouselTitle, subtitle, products: productEntries } = carousel.fields;

  const items = productEntries
    .map(parseProduct)
    .filter((p): p is CarouselProduct => p !== undefined);

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

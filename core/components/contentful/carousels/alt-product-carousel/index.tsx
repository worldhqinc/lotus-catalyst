'use client';

import { clsx } from 'clsx';
import { ArrowRight } from 'lucide-react';
import { ReactNode } from 'react';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from '@/vibes/soul/primitives/carousel';
import { Image } from '~/components/image';
import { Link } from '~/components/link';
import { assetSchema, carouselProduct, productFinishedGoodsSchema } from '~/contentful/schema';
import { ensureImageUrl } from '~/lib/utils';

function CarouselPagination({ className }: { className?: string }) {
  const { api } = useCarousel();

  if (!api) return null;

  const scrollSnaps = api.scrollSnapList();
  const selectedIndex = api.selectedScrollSnap();

  return (
    <div className={clsx('flex items-center gap-2', className)}>
      {scrollSnaps.map((_, index) => (
        <button
          aria-label={`View slide ${index + 1}`}
          className={clsx(
            'transition-all focus:outline-none',
            index === selectedIndex
              ? 'h-2 w-6 rounded-full bg-black'
              : 'h-2 w-2 rounded-full bg-gray-300',
          )}
          key={index}
          onClick={() => api.scrollTo(index)}
        />
      ))}
    </div>
  );
}

export function AltProductCarousel({
  carousel,
  cta,
}: {
  carousel: carouselProduct;
  cta: ReactNode;
}) {
  const productEntries = carousel.fields.products;
  const items = productEntries.map((entry) => {
    const parsed = productFinishedGoodsSchema.parse(entry);
    const { id } = parsed.sys;
    const fields = parsed.fields;
    const file = fields.featuredImage ? assetSchema.parse(fields.featuredImage).fields.file : null;
    const image = file ? { src: ensureImageUrl(file.url), alt: fields.productName } : undefined;
    const href = fields.pageSlug ? `/${fields.pageSlug}` : '#';
    const priceValue = fields.salePrice ?? fields.defaultPrice;
    const priceNumber = parseFloat(priceValue);
    const price = `$${priceNumber.toFixed(2)}`;

    return { id, image, href, title: fields.productName, subtitle: fields.shortDescription, price };
  });

  return (
    <section className="@container">
      <div className="relative mx-auto px-4 py-10 @xl:px-6 @xl:py-14 @4xl:px-8 @4xl:py-20">
        <Carousel hideOverflow={false}>
          <CarouselContent className="-ml-4 flex @2xl:-ml-5">
            {items.map((product, index) => (
              <CarouselItem
                className="basis-full pl-4 @md:basis-1/2 @lg:basis-1/3 @2xl:basis-1/4 @2xl:pl-5"
                key={`${product.id}-${index}`}
              >
                <div className="flex flex-col items-start gap-3">
                  <Link aria-label={`View ${product.title}`} className="w-full" href={product.href}>
                    <div className="border-contrast-200 relative aspect-square w-full border-b">
                      {product.image && (
                        <Image
                          alt={product.image.alt}
                          className="object-cover"
                          fill
                          src={product.image.src}
                        />
                      )}
                    </div>
                  </Link>
                  <div className="flex w-full items-center justify-between pt-2">
                    <span className="text-icon-primary truncate text-lg font-medium">
                      {product.title}
                    </span>
                    <ButtonLink
                      aria-label={`View ${product.title}`}
                      className="bg-transparent"
                      href={product.href}
                      shape="circle"
                      size="medium"
                      variant="tertiary"
                    >
                      <ArrowRight className="size-6" />
                    </ButtonLink>
                  </div>
                  {product.subtitle !== undefined && (
                    <p className="text-icon-secondary w-full truncate text-sm">
                      {product.subtitle}
                    </p>
                  )}
                  <span className="text-icon-primary text-base font-medium">{product.price}</span>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-8 flex justify-between gap-4">
            {cta}
            <CarouselPagination />
          </div>
        </Carousel>
      </div>
    </section>
  );
}

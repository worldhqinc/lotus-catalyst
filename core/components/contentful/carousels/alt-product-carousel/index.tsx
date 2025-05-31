'use client';

import { ArrowRight } from 'lucide-react';
import { ReactNode } from 'react';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselScrollbar,
} from '@/vibes/soul/primitives/carousel';
import { Image } from '~/components/image';
import { Link } from '~/components/link';
import { assetSchema, carouselProduct, productFinishedGoodsSchema } from '~/contentful/schema';
import { ensureImageUrl } from '~/lib/utils';

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
    const carouselFile = fields.carouselImage
      ? assetSchema.parse(fields.carouselImage).fields.file
      : null;
    const image = file
      ? {
          src: carouselFile ? ensureImageUrl(carouselFile.url) : ensureImageUrl(file.url),
          alt: fields.webProductName,
        }
      : undefined;
    const href = fields.pageSlug ? `/${fields.pageSlug}` : '#';
    const priceOriginal = fields.price;
    const priceOriginalNumber = parseFloat(priceOriginal ?? '0.00');
    const originalPrice = `$${priceOriginalNumber.toFixed(2)}`;
    const priceValue = fields.salePrice ?? fields.price;
    const priceNumber = parseFloat(priceValue ?? '0.00');
    const price = `$${priceNumber.toFixed(2)}`;

    return {
      id,
      image,
      href,
      title: fields.webProductName,
      subtitle: fields.webProductNameDescriptor,
      originalPrice: fields.salePrice ? originalPrice : null,
      price,
    };
  });

  return (
    <section className="@container">
      <div className="relative mx-auto">
        <Carousel hideOverflow={false} opts={{ dragFree: true }}>
          <CarouselContent className="flex">
            {items.map((product, index) => (
              <CarouselItem
                className="basis-1/2 @md:basis-1/2 @lg:basis-1/3 @2xl:basis-[30%]"
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
                    <div className="flex flex-col gap-1">
                      <h3 className="text-icon-primary truncate text-lg font-medium">
                        {product.title}
                      </h3>
                      {product.subtitle !== undefined && (
                        <p className="text-icon-secondary w-full text-sm">{product.subtitle}</p>
                      )}
                    </div>
                    <ButtonLink
                      aria-label={`View ${product.title}`}
                      className="!hidden bg-transparent lg:!inline-flex"
                      href={product.href}
                      shape="circle"
                      size="medium"
                      variant="tertiary"
                    >
                      <ArrowRight className="size-6" strokeWidth={1.5} />
                    </ButtonLink>
                  </div>
                  {product.originalPrice ? (
                    <div className="flex items-center gap-2">
                      <span className="text-icon-primary text-base">{product.price}</span>
                      <span className="text-icon-primary text-base line-through opacity-50">
                        {product.originalPrice}
                      </span>
                    </div>
                  ) : (
                    <span className="text-icon-primary text-base">{product.price}</span>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-8 flex items-center justify-between gap-4 @lg:mt-12">
            {cta}
            <div className="max-w-[120px] flex-1">
              <CarouselScrollbar colorScheme="light" label="Scroll" />
            </div>
          </div>
        </Carousel>
      </div>
    </section>
  );
}

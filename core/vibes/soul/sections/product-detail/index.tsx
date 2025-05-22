'use client';

import { Package2, RefreshCw } from 'lucide-react';
import { ReactNode, useRef } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { Accordion, AccordionItem } from '@/vibes/soul/primitives/accordion';
import { Badge } from '@/vibes/soul/primitives/badge';
import { Price, PriceLabel } from '@/vibes/soul/primitives/price-label';
import * as Skeleton from '@/vibes/soul/primitives/skeleton';
import { ProductGallery } from '@/vibes/soul/sections/product-detail/product-gallery';
import { FeatureCallout } from '~/components/contentful/feature-callout';
import { ProductStickyHeader } from '~/components/contentful/sections/product-sticky-header';
import {
  featureCalloutSchema,
  featureTilesSchema,
  productFinishedGoods,
  productPartsAndAccessories,
} from '~/contentful/schema';
import { ensureImageUrl } from '~/lib/utils';

import { ProductDetailForm, ProductDetailFormAction } from './product-detail-form';
import { Field } from './schema';

interface ProductDetailProduct {
  id: string;
  title: string;
  href: string;
  images: Streamable<Array<{ src: string; alt: string }>>;
  price?: Streamable<Price | null>;
  subtitle?: string;
  badge?: string;
  rating?: Streamable<number | null>;
  summary?: Streamable<string>;
  accordions?: Streamable<
    Array<{
      title: string;
      content: ReactNode;
    }>
  >;
  sku: string;
}

export interface ProductDetailProps<F extends Field> {
  product: Streamable<ProductDetailProduct | null>;
  contentful: Streamable<productFinishedGoods | productPartsAndAccessories | null | undefined>;
  action: ProductDetailFormAction<F>;
  fields: Streamable<F[]>;
  emptySelectPlaceholder?: string;
  ctaLabel?: Streamable<string | null>;
  ctaDisabled?: Streamable<boolean | null>;
  prefetch?: boolean;
  additionalInformationTitle?: string;
  additionalActions?: ReactNode;
}

export function ProductDetail<F extends Field>({
  product: streamableProduct,
  contentful: streamableContentful,
  action,
  fields: streamableFields,
  emptySelectPlaceholder,
  ctaLabel: streamableCtaLabel,
  ctaDisabled: streamableCtaDisabled,
  prefetch,
  additionalInformationTitle = 'Additional information',
  additionalActions,
}: ProductDetailProps<F>) {
  const detailFormRef = useRef<HTMLDivElement | null>(null);

  return (
    <Stream
      fallback={<ProductDetailSkeleton />}
      value={Streamable.all([streamableProduct, streamableContentful])}
    >
      {([product, contentful]) => {
        if (!product || !contentful) return null;

        const price = contentful.fields.price ?? '0.00';
        const priceData = contentful.fields.salePrice
          ? {
              type: 'sale' as const,
              previousValue: `$${contentful.fields.salePrice}`,
              currentValue: `$${price}`,
            }
          : `$${price}`;

        return (
          <>
            <ProductStickyHeader
              contentful={contentful}
              detailFormRef={detailFormRef}
              product={product}
              streamableCtaDisabled={streamableCtaDisabled}
            />
            <section className="@container">
              <div className="group/product-detail mx-auto w-full max-w-(--breakpoint-2xl) @xl:px-6 @xl:py-14 @4xl:px-8 @4xl:py-20">
                <div className="grid grid-cols-1 items-stretch gap-x-6 gap-y-6 @2xl:grid-cols-12">
                  <div className="group/product-gallery col-span-full @2xl:col-span-7">
                    <ProductGallery
                      badge={contentful.fields.badge}
                      featuredImage={
                        contentful.fields.featuredImage && {
                          src: ensureImageUrl(contentful.fields.featuredImage.fields.file.url),
                          alt: contentful.fields.featuredImage.fields.title ?? '',
                        }
                      }
                      images={(contentful.fields.additionalImages ?? []).map((image) => {
                        const tags = image.metadata.tags
                          .map((tag) => {
                            if (typeof tag === 'object' && tag !== null && 'sys' in tag) {
                              const sys = tag.sys;

                              if (isSysObject(sys)) {
                                return sys.id ?? null;
                              }
                            }

                            return null;
                          })
                          .filter((id): id is string => id !== null);

                        return {
                          src: ensureImageUrl(image.fields.file.url),
                          alt: image.fields.title ?? '',
                          tags,
                        };
                      })}
                      tiles={
                        'featureTiles' in contentful.fields
                          ? featureTilesSchema.parse(contentful.fields.featureTiles)
                          : null
                      }
                    />
                  </div>
                  <div className="col-span-full px-4 py-8 @xl:px-0 @xl:py-0 @2xl:col-span-5">
                    <div className="mb-8 flex items-start justify-between gap-4">
                      <div className="flex gap-2">
                        {contentful.fields.webProductLine?.map((line, index) => (
                          <Badge key={index}>{line}</Badge>
                        ))}
                      </div>
                      {'featureCallout' in contentful.fields &&
                        contentful.fields.featureCallout && (
                          <FeatureCallout
                            {...featureCalloutSchema.parse(contentful.fields.featureCallout)}
                          />
                        )}
                    </div>
                    <div className="flex flex-col gap-8" id="overview">
                      <div>
                        <h1 className="text-surface-foreground text-2xl leading-none @xl:text-3xl @4xl:text-4xl">
                          {contentful.fields.webProductName}
                        </h1>
                        {Boolean(contentful.fields.webProductNameDescriptor) && (
                          <p className="text-surface-foreground mt-4">
                            {contentful.fields.webProductNameDescriptor}
                          </p>
                        )}
                      </div>
                      <div className="group/product-price">
                        <PriceLabel className="text-xl @xl:text-2xl" price={priceData} />
                      </div>
                      {'warranty' in contentful.fields && Boolean(contentful.fields.warranty) && (
                        <div className="text-contrast-300 font-medium">
                          {contentful.fields.warranty}
                        </div>
                      )}
                      {'shortDescription' in contentful.fields &&
                        Boolean(contentful.fields.shortDescription) && (
                          <div className="text-contrast-400">
                            {contentful.fields.shortDescription}
                          </div>
                        )}
                      <div className="grid gap-2 @xl:grid-cols-2">
                        {[
                          {
                            icon: Package2,
                            label: 'Free shipping on all products',
                          },
                          {
                            icon: RefreshCw,
                            label: '60 Day Returns & Exchanges',
                          },
                        ].map(({ icon: Icon, label }, index) => (
                          <div className="flex items-center gap-2" key={index}>
                            <div className="bg-contrast-100 flex h-14 w-14 items-center justify-center rounded-lg">
                              <Icon className="h-6 w-6" strokeWidth={1.5} />
                            </div>
                            <span className="text-contrast-400">{label}</span>
                          </div>
                        ))}
                      </div>
                      <div className="group/product-detail-form">
                        <Stream
                          fallback={<ProductDetailFormSkeleton />}
                          value={Streamable.all([
                            streamableFields,
                            streamableCtaLabel,
                            streamableCtaDisabled,
                          ])}
                        >
                          {([fields, ctaLabel, ctaDisabled]) => (
                            <ProductDetailForm
                              action={action}
                              additionalActions={
                                <div className="flex items-center justify-between gap-2">
                                  <div className="text-contrast-400 text-md uppercase">
                                    Model {contentful.fields.modelNumber}
                                  </div>
                                  {additionalActions}
                                </div>
                              }
                              ctaDisabled={ctaDisabled ?? undefined}
                              ctaLabel={ctaLabel ?? undefined}
                              detailFormRef={detailFormRef}
                              emptySelectPlaceholder={emptySelectPlaceholder}
                              fields={fields}
                              prefetch={prefetch}
                              productId={product.id}
                              sku={product.sku}
                            />
                          )}
                        </Stream>
                      </div>
                      <h2 className="sr-only">{additionalInformationTitle}</h2>
                      <div className="group/product-accordion" id="features">
                        <Stream fallback={<ProductAccordionsSkeleton />} value={product.accordions}>
                          {(accordions) =>
                            accordions && (
                              <Accordion className="pt-4" type="multiple">
                                {accordions.map((accordion, index) => (
                                  <AccordionItem
                                    className="border-contrast-200 border-t py-4"
                                    key={index}
                                    title={accordion.title}
                                    value={index.toString()}
                                  >
                                    {accordion.content}
                                  </AccordionItem>
                                ))}
                              </Accordion>
                            )
                          }
                        </Stream>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        );
      }}
    </Stream>
  );
}

function ProductGallerySkeleton() {
  return (
    <Skeleton.Root className="group-has-[[data-pending]]/product-gallery:animate-pulse" pending>
      <div className="w-full overflow-hidden rounded-xl @xl:rounded-2xl">
        <div className="flex">
          <Skeleton.Box className="aspect-square w-full shrink-0 grow-0 basis-full @2xl:aspect-[4/5]" />
        </div>
      </div>
      <div className="mt-2 hidden max-w-full gap-2 overflow-x-auto md:flex">
        {Array.from({ length: 2 }).map((_, idx) => (
          <Skeleton.Box className="aspect-square flex-1 shrink-0 rounded-lg" key={idx} />
        ))}
      </div>
      <div className="bg-contrast-100 relative mt-4 hidden grid-cols-2 gap-2 rounded-xl px-4 py-10 @2xl:grid">
        {Array.from({ length: 2 }).map((_, idx) => (
          <div className="flex flex-col items-center justify-center gap-4" key={idx}>
            <Skeleton.Box className="h-12 w-12 rounded-full" />
            <Skeleton.Box className="h-4 w-52 rounded-md" />
          </div>
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-contrast-200 h-20 w-[1px]" />
        </div>
      </div>
    </Skeleton.Root>
  );
}

function PriceLabelSkeleton() {
  return <Skeleton.Box className="h-8 w-32 rounded-md @xl:h-10 @xl:w-40" />;
}

function RatingSkeleton() {
  return null;
  // return (
  //   <Skeleton.Root
  //     className="flex w-[136px] items-center gap-1 group-has-[[data-pending]]/product-rating:animate-pulse"
  //     pending
  //   >
  //     <Skeleton.Box className="h-4 w-[100px] rounded-md" />
  //     <Skeleton.Box className="h-6 w-8 rounded-xl" />
  //   </Skeleton.Root>
  // );
}

function ProductDetailFormSkeleton() {
  return (
    <Skeleton.Root
      className="flex flex-col gap-8 py-8 group-has-[[data-pending]]/product-detail-form:animate-pulse"
      pending
    >
      <div className="flex flex-col gap-5">
        <Skeleton.Box className="h-4 w-24 rounded-md" />
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton.Box className="h-11 w-[72px] rounded-full" key={idx} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <Skeleton.Box className="h-4 w-24 rounded-md" />
        <div className="flex gap-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Skeleton.Box className="h-10 w-10 rounded-full" key={idx} />
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton.Box className="h-12 w-[120px] rounded-lg" />
        <Skeleton.Box className="h-12 w-[216px] rounded-full" />
      </div>
    </Skeleton.Root>
  );
}

function ProductAccordionsSkeleton() {
  return (
    <Skeleton.Root
      className="flex flex-col gap-8 pt-4 group-has-[[data-pending]]/product-accordion:animate-pulse"
      pending
    >
      {Array.from({ length: 3 }).map((_, idx) => (
        <div className="border-contrast-200 border-t py-4" key={idx}>
          <div className="flex items-center justify-between">
            <Skeleton.Box className="h-4 w-32 rounded-md" />
            <Skeleton.Box className="h-4 w-4 rounded-full" />
          </div>
        </div>
      ))}
    </Skeleton.Root>
  );
}

function ProductDetailSkeleton() {
  return (
    <section className="@container">
      <div className="group/product-detail mx-auto w-full max-w-(--breakpoint-2xl) @xl:px-6 @xl:py-14 @4xl:px-8 @4xl:py-20">
        <div className="grid grid-cols-1 items-stretch gap-x-8 gap-y-8 @2xl:grid-cols-[70%_30%] @5xl:gap-x-12">
          <div className="group/product-gallery">
            <ProductGallerySkeleton />
          </div>
          <div className="px-4 py-8 @xl:px-0 @xl:py-0">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div className="flex gap-2">
                <Skeleton.Box className="h-6 w-20 rounded" />
                <Skeleton.Box className="h-6 w-20 rounded" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton.Box className="h-4 w-20 rounded-md" />
                <Skeleton.Box className="h-7 w-9 rounded-md" />
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <div>
                <Skeleton.Box className="h-8 w-96 rounded-md @xl:h-10" />
                <Skeleton.Box className="mt-4 h-6 w-64 rounded-md" />
              </div>
              <RatingSkeleton />
              <PriceLabelSkeleton />
              <Skeleton.Box className="h-4 w-32 rounded-md" />
              <Skeleton.Box className="h-16 w-full rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function isSysObject(value: unknown): value is { id?: string } {
  return typeof value === 'object' && value !== null && 'id' in value;
}

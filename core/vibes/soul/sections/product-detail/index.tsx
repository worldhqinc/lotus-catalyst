import { Package, RefreshCw } from 'lucide-react';
import { ReactNode } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { Accordion, AccordionItem } from '@/vibes/soul/primitives/accordion';
import { Badge } from '@/vibes/soul/primitives/badge';
import { Price, PriceLabel } from '@/vibes/soul/primitives/price-label';
import { Rating } from '@/vibes/soul/primitives/rating';
import * as Skeleton from '@/vibes/soul/primitives/skeleton';
import { type Breadcrumb, Breadcrumbs } from '@/vibes/soul/sections/breadcrumbs';
import { ProductGallery } from '@/vibes/soul/sections/product-detail/product-gallery';
import { productFinishedGoods } from '~/contentful/schema';
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
}

export interface ProductDetailProps<F extends Field> {
  breadcrumbs?: Streamable<Breadcrumb[]>;
  product: Streamable<ProductDetailProduct | null>;
  contentful: Streamable<productFinishedGoods | null | undefined>;
  action: ProductDetailFormAction<F>;
  fields: Streamable<F[]>;
  emptySelectPlaceholder?: string;
  ctaLabel?: Streamable<string | null>;
  ctaDisabled?: Streamable<boolean | null>;
  prefetch?: boolean;
  additionalInformationTitle?: string;
}

export function ProductDetail<F extends Field>({
  product: streamableProduct,
  contentful: streamableContentful,
  action,
  fields: streamableFields,
  breadcrumbs,
  emptySelectPlaceholder,
  ctaLabel: streamableCtaLabel,
  ctaDisabled: streamableCtaDisabled,
  prefetch,
  additionalInformationTitle = 'Additional information',
}: ProductDetailProps<F>) {
  return (
    <section className="@container">
      <div className="group/product-detail mx-auto w-full max-w-(--breakpoint-2xl) @xl:px-6 @xl:py-14 @4xl:px-8 @4xl:py-20">
        {breadcrumbs && (
          <div className="group/breadcrumbs mb-6">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
        )}
        <Stream
          fallback={<ProductDetailSkeleton />}
          value={Streamable.all([streamableProduct, streamableContentful])}
        >
          {([product, contentful]) =>
            product && (
              <div className="grid grid-cols-1 items-stretch gap-x-8 gap-y-8 @2xl:grid-cols-2 @5xl:gap-x-12">
                <div className="group/product-gallery">
                  <ProductGallery
                    badge={contentful?.fields.productBadge}
                    featuredImage={
                      contentful?.fields.featuredImage && {
                        src: ensureImageUrl(contentful.fields.featuredImage.fields.file.url),
                        alt: contentful.fields.featuredImage.fields.title ?? '',
                      }
                    }
                    images={(contentful?.fields.additionalImages ?? []).map((image) => ({
                      src: ensureImageUrl(image.fields.file.url),
                      alt: image.fields.title ?? '',
                    }))}
                  />
                </div>
                <div className="px-4 py-8 @xl:px-0 @xl:py-0">
                  <div className="mb-8 flex items-start justify-between gap-4">
                    <div className="flex gap-2">
                      {contentful?.fields.productLine?.map((line, index) => (
                        <Badge key={index}>{line}</Badge>
                      ))}
                    </div>
                    <div className="text-contrast-400 flex items-center gap-2 text-sm">
                      Featured on{' '}
                      <svg
                        fill="none"
                        height="28"
                        viewBox="0 0 37 28"
                        width="37"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18.5015 6.34296C15.2637 6.34432 12.1565 7.65449 9.85132 9.99031C7.54614 12.3261 6.22813 15.5 6.18213 18.8261H10.9104C10.9475 16.7823 11.7633 14.835 13.1827 13.4025C14.6021 11.97 16.5118 11.1667 18.5015 11.1651C20.4915 11.1661 22.4018 11.9692 23.8217 13.4017C25.2415 14.8343 26.0577 16.7819 26.0948 18.8261H30.8184C30.7724 15.5005 29.4547 12.3269 27.1501 9.99119C24.8454 7.65544 21.7388 6.34498 18.5015 6.34296Z"
                          fill="#8A8A8A"
                        />
                        <path
                          d="M18.5013 0C13.6261 0.00147864 8.94862 1.97992 5.48559 5.50523C2.02257 9.03054 0.0539905 13.8177 0.0078125 18.8261H4.825C4.87104 15.13 6.33194 11.6013 8.89152 9.00367C11.4511 6.40601 14.9034 4.9484 18.5013 4.94633C22.0996 4.94768 25.5526 6.40497 28.1127 9.0027C30.6729 11.6004 32.1342 15.1296 32.1802 18.8261H36.9923C36.9461 13.8181 34.9779 9.03135 31.5154 5.50611C28.0529 1.98088 23.376 0.00213988 18.5013 0Z"
                          fill="#8A8A8A"
                        />
                        <path
                          d="M18.5015 12.6112C16.8851 12.6127 15.3333 13.2637 14.1779 14.425C13.0224 15.5863 12.3548 17.1658 12.3179 18.8261H24.6873C24.6503 17.1654 23.9825 15.5856 22.8265 14.4242C21.6706 13.2628 20.1183 12.6121 18.5015 12.6112Z"
                          fill="#8A8A8A"
                        />
                        <path
                          d="M0 20.5031V22.2249H2.00192V27.8526H3.95638V22.2249H5.9583V20.5031H0Z"
                          fill="#8A8A8A"
                        />
                        <path
                          d="M25.2555 20.5027L22.5146 27.8255H24.6704L25.0121 26.8147H27.855L28.1967 27.8255H30.3524L27.6115 20.5027C26.8262 20.5027 26.0408 20.5027 25.2555 20.5027ZM26.4335 22.6094L27.2869 25.1341H25.5801L26.4335 22.6094Z"
                          fill="#8A8A8A"
                        />
                        <path
                          d="M29.5576 20.5028L32.3475 24.9054V27.8255H34.2237V24.9054L37 20.5028H34.8593L33.2883 23.172L31.7173 20.5028L29.5576 20.5028Z"
                          fill="#8A8A8A"
                        />
                        <path
                          d="M15.3696 20.5202V27.8336H18.5975C23.3547 27.907 23.9651 20.5999 18.5975 20.5202H15.3696ZM17.3146 22.2149H18.7188C21.1097 22.2149 20.8206 26.158 18.7188 26.158H17.3146V22.2149Z"
                          fill="#8A8A8A"
                        />
                        <path
                          d="M10.3296 20.4031C7.82345 20.4031 6.44434 22.092 6.44434 24.1753C6.44434 26.2586 7.97509 28 10.3675 28C12.7409 28 14.2148 26.2586 14.2148 24.1753C14.2148 22.092 12.7409 20.4031 10.3296 20.4031ZM10.3564 22.1221C11.5625 22.1221 12.2998 23.0466 12.2998 24.1872C12.2998 25.3277 11.5625 26.281 10.3754 26.281C9.17876 26.281 8.41312 25.3277 8.41312 24.1872C8.41312 23.0466 9.10287 22.1221 10.3564 22.1221Z"
                          fill="#8A8A8A"
                        />
                      </svg>
                    </div>
                  </div>
                  {/* Product Details */}
                  <div className="flex flex-col gap-8">
                    <div>
                      <h1 className="text-surface-foreground text-2xl leading-none @xl:text-3xl @4xl:text-4xl">
                        {contentful?.fields.productName}
                      </h1>
                      {Boolean(contentful?.fields.subCategory) && (
                        <p className="text-surface-foreground mt-4">
                          {[contentful?.fields.parentCategory, contentful?.fields.subCategory]
                            .filter(Boolean)
                            .join(' and ')}
                        </p>
                      )}
                    </div>
                    <div className="group/product-rating">
                      <Stream fallback={<RatingSkeleton />} value={product.rating}>
                        {(rating) => <Rating rating={rating ?? 0} />}
                      </Stream>
                    </div>
                    <div className="group/product-price">
                      <Stream fallback={<PriceLabelSkeleton />} value={product.price}>
                        {(price) => (
                          <PriceLabel className="my-3 text-xl @xl:text-2xl" price={price ?? ''} />
                        )}
                      </Stream>
                    </div>
                    {Boolean(contentful?.fields.couponCodesalesDates) && (
                      <div className="text-primary font-medium">
                        {contentful?.fields.couponCodesalesDates}
                      </div>
                    )}
                    {Boolean(contentful?.fields.shortDescription) && (
                      <div className="text-contrast-400">{contentful?.fields.shortDescription}</div>
                    )}
                    <div className="grid gap-2 @xl:grid-cols-2">
                      {[
                        {
                          icon: Package,
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
                            ctaDisabled={ctaDisabled ?? undefined}
                            ctaLabel={ctaLabel ?? undefined}
                            emptySelectPlaceholder={emptySelectPlaceholder}
                            fields={fields}
                            prefetch={prefetch}
                            productId={product.id}
                          />
                        )}
                      </Stream>
                    </div>
                    <h2 className="sr-only">{additionalInformationTitle}</h2>
                    <div className="group/product-accordion">
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
            )
          }
        </Stream>
      </div>
    </section>
  );
}

function ProductGallerySkeleton() {
  return (
    <Skeleton.Root className="group-has-[[data-pending]]/product-gallery:animate-pulse" pending>
      <div className="w-full overflow-hidden rounded-xl @xl:rounded-2xl">
        <div className="flex">
          <Skeleton.Box className="aspect-[4/5] h-full w-full shrink-0 grow-0 basis-full" />
        </div>
      </div>
      <div className="mt-2 flex max-w-full gap-2 overflow-x-auto">
        {Array.from({ length: 5 }).map((_, idx) => (
          <Skeleton.Box className="h-12 w-12 shrink-0 rounded-lg @md:h-16 @md:w-16" key={idx} />
        ))}
      </div>
    </Skeleton.Root>
  );
}

function PriceLabelSkeleton() {
  return <Skeleton.Box className="my-5 h-4 w-20 rounded-md" />;
}

function RatingSkeleton() {
  return (
    <Skeleton.Root
      className="flex w-[136px] items-center gap-1 group-has-[[data-pending]]/product-rating:animate-pulse"
      pending
    >
      <Skeleton.Box className="h-4 w-[100px] rounded-md" />
      <Skeleton.Box className="h-6 w-8 rounded-xl" />
    </Skeleton.Root>
  );
}

function ProductSummarySkeleton() {
  return (
    <Skeleton.Root
      className="flex w-full flex-col gap-3.5 pb-6 group-has-[[data-pending]]/product-summary:animate-pulse"
      pending
    >
      {Array.from({ length: 3 }).map((_, idx) => (
        <Skeleton.Box className="h-2.5 w-full" key={idx} />
      ))}
    </Skeleton.Root>
  );
}

function ProductDetailFormSkeleton() {
  return (
    <Skeleton.Root
      className="flex flex-col gap-8 py-8 group-has-[[data-pending]]/product-detail-form:animate-pulse"
      pending
    >
      <div className="flex flex-col gap-5">
        <Skeleton.Box className="h-2 w-10 rounded-md" />
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton.Box className="h-11 w-[72px] rounded-full" key={idx} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <Skeleton.Box className="h-3 w-16 rounded-md" />
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
      className="flex h-[600px] w-full flex-col gap-8 pt-4 group-has-[[data-pending]]/product-accordion:animate-pulse"
      pending
    >
      <div className="flex items-center justify-between">
        <Skeleton.Box className="h-2 w-20 rounded-xs" />
        <Skeleton.Box className="h-3 w-3 rounded-xs" />
      </div>
      <div className="mb-1 flex flex-col gap-4">
        <Skeleton.Box className="h-3 w-full rounded-xs" />
        <Skeleton.Box className="h-3 w-full rounded-xs" />
        <Skeleton.Box className="h-3 w-3/5 rounded-xs" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton.Box className="h-2 w-24 rounded-xs" />
        <Skeleton.Box className="h-3 w-3 rounded-full" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton.Box className="h-2 w-20 rounded-xs" />
        <Skeleton.Box className="h-3 w-3 rounded-full" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton.Box className="h-2 w-32 rounded-xs" />
        <Skeleton.Box className="h-3 w-3 rounded-full" />
      </div>
    </Skeleton.Root>
  );
}

export function ProductDetailSkeleton() {
  return (
    <Skeleton.Root
      className="grid grid-cols-1 items-stretch gap-x-6 gap-y-8 group-has-[[data-pending]]/product-detail:animate-pulse @2xl:grid-cols-2 @5xl:gap-x-12"
      pending
    >
      <div className="hidden @2xl:block">
        <ProductGallerySkeleton />
      </div>
      <div>
        <Skeleton.Box className="mb-6 h-4 w-20 rounded-lg" />
        <Skeleton.Box className="mb-6 h-6 w-72 rounded-lg" />
        <RatingSkeleton />
        <PriceLabelSkeleton />
        <ProductSummarySkeleton />
        <div className="mb-8 @2xl:hidden">
          <ProductGallerySkeleton />
        </div>
        <ProductDetailFormSkeleton />
      </div>
    </Skeleton.Root>
  );
}

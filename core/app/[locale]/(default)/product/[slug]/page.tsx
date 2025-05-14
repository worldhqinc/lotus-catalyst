import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { Check } from 'lucide-react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { SearchParams } from 'nuqs/server';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { ProductDetail } from '@/vibes/soul/sections/product-detail';
import { getSessionCustomerAccessToken } from '~/auth';
import { ProductCarousel } from '~/components/contentful/carousels/product-carousel';
import { PageContentEntries } from '~/components/contentful/page-content-entries';
import { Link } from '~/components/link';
import { productPartsAndAccessoriesSchema, supportDocumentSchema } from '~/contentful/schema';
import { pricesTransformer } from '~/data-transformers/prices-transformer';
import { productOptionsTransformer } from '~/data-transformers/product-options-transformer';
import { getPreferredCurrencyCode } from '~/lib/currency';
import { formatDimension, formatWeight } from '~/lib/unit-converter';
import { isMobileUser } from '~/lib/user-agent';

import { addToCart } from './_actions/add-to-cart';
import { ProductSchema } from './_components/product-schema';
import { ProductViewed } from './_components/product-viewed';
import { ProductShareButton } from './_components/share-button';
import { WishlistButton } from './_components/wishlist-button';
import { WishlistButtonForm } from './_components/wishlist-button/form';
import {
  getContentfulProductData,
  getProduct,
  getProductPageMetadata,
  getProductPricingAndRelatedProducts,
  getStreamableProduct,
} from './page-data';

interface Props {
  params: Promise<{ slug: string; locale: string }>;
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const customerAccessToken = await getSessionCustomerAccessToken();

  const productId = Number(slug);

  const product = await getProductPageMetadata(productId, customerAccessToken);

  if (!product) {
    return notFound();
  }

  const { pageTitle, metaDescription, metaKeywords } = product.seo;
  const { url, altText: alt } = product.defaultImage || {};

  return {
    title: pageTitle || product.name,
    description: metaDescription || `${product.plainTextDescription.slice(0, 150)}...`,
    keywords: metaKeywords ? metaKeywords.split(',') : null,
    openGraph: url
      ? {
          images: [
            {
              url,
              alt,
            },
          ],
        }
      : {
          images: [
            {
              url: '/images/lotus-social-share.jpg',
              alt: 'Lotus',
            },
          ],
        },
  };
}

export default async function Product(props: Props) {
  const { locale, slug } = await props.params;
  const customerAccessToken = await getSessionCustomerAccessToken();
  const detachedWishlistFormId = 'product-add-to-wishlist-form';

  setRequestLocale(locale);

  const t = await getTranslations('Product');
  const wishlistT = await getTranslations('Wishlist');
  const format = await getFormatter();

  const productId = Number(slug);

  const baseProduct = await getProduct(productId, customerAccessToken);

  if (!baseProduct) {
    return notFound();
  }

  const streamableProduct = Streamable.from(async () => {
    const options = await props.searchParams;

    const optionValueIds = Object.keys(options)
      .map((option) => ({
        optionEntityId: Number(option),
        valueEntityId: Number(options[option]),
      }))
      .filter(
        (option) => !Number.isNaN(option.optionEntityId) && !Number.isNaN(option.valueEntityId),
      );

    const variables = {
      entityId: Number(productId),
      optionValueIds,
      useDefaultOptionSelections: true,
    };

    const product = await getStreamableProduct(variables, customerAccessToken);

    if (!product) {
      return notFound();
    }

    return product;
  });

  const streamableProductSku = Streamable.from(async () => (await streamableProduct).sku);

  const streamableProductPricingAndRelatedProducts = Streamable.from(async () => {
    const options = await props.searchParams;

    const optionValueIds = Object.keys(options)
      .map((option) => ({
        optionEntityId: Number(option),
        valueEntityId: Number(options[option]),
      }))
      .filter(
        (option) => !Number.isNaN(option.optionEntityId) && !Number.isNaN(option.valueEntityId),
      );

    const currencyCode = await getPreferredCurrencyCode();

    const variables = {
      entityId: Number(productId),
      optionValueIds,
      useDefaultOptionSelections: true,
      currencyCode,
    };

    return await getProductPricingAndRelatedProducts(variables, customerAccessToken);
  });

  const streamablePrices = Streamable.from(async () => {
    const product = await streamableProductPricingAndRelatedProducts;

    if (!product) {
      return null;
    }

    return pricesTransformer(product.prices, format) ?? null;
  });

  const streamableImages = Streamable.from(async () => {
    const product = await streamableProduct;

    const images = removeEdgesAndNodes(product.images)
      .filter((image) => image.url !== product.defaultImage?.url)
      .map((image) => ({
        src: image.url,
        alt: image.altText,
      }));

    return product.defaultImage
      ? [{ src: product.defaultImage.url, alt: product.defaultImage.altText }, ...images]
      : images;
  });

  const streameableCtaLabel = Streamable.from(async () => {
    const product = await streamableProduct;

    if (product.availabilityV2.status === 'Unavailable') {
      return t('ProductDetails.Submit.unavailable');
    }

    if (product.availabilityV2.status === 'Preorder') {
      return t('ProductDetails.Submit.preorder');
    }

    if (!product.inventory.isInStock) {
      return t('ProductDetails.Submit.outOfStock');
    }

    return t('ProductDetails.Submit.addToCart');
  });

  const streameableCtaDisabled = Streamable.from(async () => {
    const product = await streamableProduct;

    if (product.availabilityV2.status === 'Unavailable') {
      return true;
    }

    if (product.availabilityV2.status === 'Preorder') {
      return false;
    }

    if (!product.inventory.isInStock) {
      return true;
    }

    return false;
  });

  const streameableAccordions = Streamable.from(async () => {
    const product = await streamableProduct;
    const contentful = await getContentfulProductData(product.sku);

    const specifications = [
      {
        name: 'Width',
        value: formatDimension(
          contentful?.fields.outOfBoxWidth,
          contentful?.fields.outOfBoxSizeUom ?? 'IN',
        ),
      },
      {
        name: 'Height',
        value: formatDimension(
          contentful?.fields.outOfBoxHeight,
          contentful?.fields.outOfBoxSizeUom ?? 'IN',
        ),
      },
      {
        name: 'Depth',
        value: formatDimension(
          contentful?.fields.outOfBoxDepth,
          contentful?.fields.outOfBoxSizeUom ?? 'IN',
        ),
      },
      {
        name: 'Weight',
        value: formatWeight(
          contentful?.fields.outOfBoxNetWeight,
          contentful?.fields.outOfBoxWeightUom ?? 'LB',
        ),
      },
      {
        name: 'Wattage',
        value: contentful?.fields.wattage,
      },
    ].filter((it) => it.value);

    return [
      ...(contentful?.fields.webBullets
        ? [
            {
              title: t('ProductDetails.Accordions.details'),
              content: (
                <ul className="list-disc space-y-4 pl-4">
                  {contentful.fields.webBullets.map((bullet, index) => (
                    <li className="text-contrast-400 text-sm" key={index}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              ),
            },
          ]
        : []),
      ...(contentful?.fields.webWhatsIncluded
        ? [
            {
              title: t('ProductDetails.Accordions.included'),
              content: (
                <ul className="space-y-4">
                  {contentful.fields.webWhatsIncluded.map((item, index) => (
                    <li className="text-contrast-400 flex items-center gap-2 text-sm" key={index}>
                      <Check className="text-surface-foreground h-4 w-4" />
                      {item}
                    </li>
                  ))}
                </ul>
              ),
            },
          ]
        : []),
      ...(specifications.length
        ? [
            {
              title: t('ProductDetails.Accordions.specifications'),
              content: (
                <div className="@container">
                  <dl className="flex flex-col gap-4">
                    {specifications.map((field, index) => (
                      <div
                        className="text-contrast-400 grid grid-cols-1 gap-2 @lg:grid-cols-2"
                        key={index}
                      >
                        <dt className="font-medium">{field.name}</dt>
                        <dd>{field.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ),
            },
          ]
        : []),
      ...(contentful?.fields.docs
        ? [
            {
              title: t('ProductDetails.Accordions.docs'),
              content: (
                <div className="flex flex-col items-start gap-4">
                  {contentful.fields.docs.map((doc, index) => {
                    const { documentName, url } = supportDocumentSchema.parse(doc).fields;

                    return (
                      <Link
                        className="underline"
                        href={url}
                        key={`${doc.sys.id}-${index}`}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <h3>{documentName}</h3>
                      </Link>
                    );
                  })}
                </div>
              ),
            },
          ]
        : []),
      ...(product.warranty
        ? [
            {
              title: t('ProductDetails.Accordions.warranty'),
              content: (
                <div className="prose" dangerouslySetInnerHTML={{ __html: product.warranty }} />
              ),
            },
          ]
        : []),
    ];
  });

  const streamableContentful = Streamable.from(async () => {
    const product = await streamableProduct;

    return getContentfulProductData(product.sku);
  });

  return (
    <>
      <ProductDetail
        action={addToCart}
        additionalActions={
          <div className="flex items-center gap-2">
            <ProductShareButton
              closeLabel={wishlistT('Modal.close')}
              copiedMessage={wishlistT('shareCopied')}
              isMobileUser={Streamable.from(isMobileUser)}
              modalTitle={wishlistT('Modal.shareTitle', { name: baseProduct.name })}
              productName={baseProduct.name}
              productUrl={baseProduct.path}
              successMessage={wishlistT('shareSuccess')}
            />
            <WishlistButton
              formId={detachedWishlistFormId}
              productId={productId}
              productSku={streamableProductSku}
            />
          </div>
        }
        additionalInformationTitle={t('ProductDetails.additionalInformation')}
        contentful={streamableContentful}
        ctaDisabled={streameableCtaDisabled}
        ctaLabel={streameableCtaLabel}
        emptySelectPlaceholder={t('ProductDetails.emptySelectPlaceholder')}
        fields={productOptionsTransformer(baseProduct.productOptions)}
        prefetch={true}
        product={{
          id: baseProduct.entityId.toString(),
          sku: baseProduct.sku,
          title: baseProduct.name,
          href: baseProduct.path,
          images: streamableImages,
          price: streamablePrices,
          subtitle: baseProduct.brand?.name,
          rating: baseProduct.reviewSummary.averageRating,
          accordions: streameableAccordions,
        }}
      />

      <Stream fallback={null} value={Streamable.all([streamableContentful, props.searchParams])}>
        {([contentful, searchParams]) => {
          const pageContentEntries = contentful?.fields.pageContentEntries ?? [];

          const partsAccessories = contentful?.fields.partsAccessories?.map((part) =>
            productPartsAndAccessoriesSchema.parse(part),
          );

          return (
            <>
              <PageContentEntries pageContent={pageContentEntries} searchParams={searchParams} />
              {partsAccessories && (
                <ProductCarousel
                  carousel={{
                    fields: {
                      internalName: 'partsAccessories',
                      carouselTitle: 'Oven Accessories',
                      subtitle: 'Recommendations just for you',
                      products: partsAccessories,
                    },
                  }}
                />
              )}
            </>
          );
        }}
      </Stream>

      <Stream
        fallback={null}
        value={Streamable.from(async () =>
          Streamable.all([streamableProduct, streamableProductPricingAndRelatedProducts]),
        )}
      >
        {([extendedProduct, pricingProduct]) => (
          <>
            <ProductSchema
              product={{ ...extendedProduct, prices: pricingProduct?.prices ?? null }}
            />
            <ProductViewed
              product={{ ...extendedProduct, prices: pricingProduct?.prices ?? null }}
            />
          </>
        )}
      </Stream>

      <WishlistButtonForm
        formId={detachedWishlistFormId}
        productId={productId}
        productSku={streamableProductSku}
        searchParams={props.searchParams}
      />
    </>
  );
}

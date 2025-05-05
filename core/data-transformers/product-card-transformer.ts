import { ResultOf } from 'gql.tada';
import { getFormatter } from 'next-intl/server';

import { Product } from '@/vibes/soul/primitives/product-card';
import { ExistingResultType } from '~/client/util';
import { ProductCardFragment } from '~/components/product-card/fragment';
import {
  type carouselProduct,
  productFinishedGoodsSchema,
  productPartsAndAccessoriesSchema,
} from '~/contentful/schema';

import { pricesTransformer } from './prices-transformer';

export const singleProductCardTransformer = (
  product: ResultOf<typeof ProductCardFragment>,
  format: ExistingResultType<typeof getFormatter>,
): Product => {
  return {
    id: product.entityId.toString(),
    title: product.name,
    href: product.path,
    image: product.defaultImage
      ? { src: product.defaultImage.url, alt: product.defaultImage.altText }
      : undefined,
    price: pricesTransformer(product.prices, format),
    subtitle: product.brand?.name ?? undefined,
    rating: product.reviewSummary.averageRating,
    sku: product.sku,
  };
};

export const productCardTransformer = (
  products: Array<ResultOf<typeof ProductCardFragment>>,
  format: ExistingResultType<typeof getFormatter>,
): Product[] => {
  return products.map((product) => singleProductCardTransformer(product, format));
};

export function contentfulProductCardTransformer(
  entry: carouselProduct['fields']['products'][number],
): Product {
  const sysType = entry.sys.contentType.sys.id;

  if (sysType === 'productPartsAndAccessories') {
    const product = productPartsAndAccessoriesSchema.parse(entry);
    const fields = product.fields;
    const featuredImage = fields.featuredImage;
    const file = featuredImage.fields.file;
    const image = {
      src: file.url.startsWith('http') ? file.url : `https:${file.url}`,
      alt: featuredImage.fields.description ?? fields.productName,
    };
    const price = fields.salePrice
      ? {
          type: 'sale' as const,
          previousValue: fields.price ?? '0.00',
          currentValue: fields.salePrice,
        }
      : (fields.price ?? '0.00');

    return {
      id: product.sys.id,
      title: fields.productName,
      href: fields.pageSlug ? `/${fields.pageSlug}` : '#',
      image,
      price,
      badge: fields.productBadge ?? undefined,
      sku: fields.bcProductReference,
    };
  } else if (sysType === 'productFinishedGoods') {
    const product = productFinishedGoodsSchema.parse(entry);
    const fields = product.fields;
    const featuredImage = fields.featuredImage;
    const file = featuredImage?.fields.file;
    const image = file
      ? {
          src: file.url.startsWith('http') ? file.url : `https:${file.url}`,
          alt: featuredImage.fields.description ?? fields.productName,
        }
      : undefined;
    const price = fields.salePrice
      ? {
          type: 'sale' as const,
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
      sku: fields.bcProductReference,
    };
  }

  return {
    id: entry.sys.id,
    title: '',
    href: '',
  };
}

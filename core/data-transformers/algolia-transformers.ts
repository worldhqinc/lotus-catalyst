import { ensureImageUrl } from '~/lib/utils';

export type Localized<T> = Record<string, T>;

export interface ProductGridHit {
  objectID: string;
  fields?: {
    webProductName?: Localized<string>;
    shortDescription?: Localized<string>;
    pageSlug?: Localized<string>;
    featuredImage?: Localized<{ fields?: { file?: { url: string } } }>;
    price?: Localized<string>;
    salePrice?: Localized<string>;
    badge?: Localized<string>;
    rating?: Localized<number>;
    webProductLine?: Localized<string[]>;
    bcProductReference?: Localized<string>;
    inventoryQuantity?: Localized<number>;
  };
}

export interface PostGridHit {
  objectID: string;
  fields?: {
    // Feature fields
    featuredImage?: Localized<{
      sys?: {
        type?: string;
        linkType?: string;
        id?: string;
      };
      fields?: {
        file?: {
          url: string;
        };
      };
    }>;
    categories?: Localized<string[]>;
    title?: Localized<string>;
    subtitle?: Localized<string>;
    story?: Localized<{
      data?: unknown;
      content?: unknown[];
      nodeType?: string;
    }>;
    productCarousel?: Localized<{
      sys?: {
        type?: string;
        linkType?: string;
        id?: string;
      };
    }>;
    // Recipe fields
    recipeName?: Localized<string>;
    metaTitle?: Localized<string>;
    metaDescription?: Localized<string>;
    pageSlug?: Localized<string>;
    mealTypeCategory?: Localized<string[]>;
    // Common fields
    pageName?: Localized<string>;
    shortDescription?: Localized<string>;
    pageImage?: Localized<string>;
    webProductLine?: Localized<string[]>;
    webCategory?: Localized<string[]>;
  };
}

export function transformProductHit(hit: ProductGridHit) {
  const f = hit.fields ?? {};
  const sku = f.bcProductReference?.['en-US'] || '';
  const title = f.webProductName?.['en-US'] || '';
  const description = f.shortDescription?.['en-US'] || '';
  const slug = f.pageSlug?.['en-US'] || '';
  const imgField = f.featuredImage?.['en-US']?.fields?.file?.url || null;
  const imgUrl = imgField ? ensureImageUrl(imgField) : null;
  const price = f.price?.['en-US'];
  const priceData = f.salePrice?.['en-US']
    ? {
        type: 'sale' as const,
        previousValue: `$${f.salePrice['en-US']}`,
        currentValue: `$${price}`,
      }
    : `$${price}`;
  const badge = f.badge?.['en-US'];
  const inStock = Boolean(f.inventoryQuantity?.['en-US'] ?? 0);

  return {
    id: hit.objectID,
    sku,
    title,
    subtitle: description,
    href: `/${slug}`,
    image: imgUrl ? { src: imgUrl, alt: title } : undefined,
    price: priceData,
    badge,
    inStock,
  };
}

export function transformPostHit(hit: PostGridHit) {
  const f = hit.fields ?? {};

  return {
    image: f.featuredImage?.['en-US']?.fields?.file?.url
      ? ensureImageUrl(f.featuredImage['en-US'].fields.file.url)
      : null,
    title: f.title?.['en-US'] || f.recipeName?.['en-US'] || '',
    subtitle: f.subtitle?.['en-US'] || f.metaDescription?.['en-US'] || '',
    categories: f.categories?.['en-US'] || f.mealTypeCategory?.['en-US'] || [],
    slug: f.pageSlug?.['en-US'] || '',
  };
}

export function transformFeatureHit(hit: PostGridHit) {
  const f = hit.fields ?? {};

  return {
    image: f.featuredImage?.['en-US']?.fields?.file?.url
      ? ensureImageUrl(f.featuredImage['en-US'].fields.file.url)
      : null,
    title: f.title?.['en-US'] || '',
    subtitle: f.subtitle?.['en-US'] || '',
    categories: f.categories?.['en-US'] || [],
    slug: f.pageSlug?.['en-US'] || '',
  };
}

export function transformRecipeHit(hit: PostGridHit) {
  const f = hit.fields ?? {};

  return {
    image: f.featuredImage?.['en-US']?.fields?.file?.url
      ? ensureImageUrl(f.featuredImage['en-US'].fields.file.url)
      : null,
    title: f.recipeName?.['en-US'] || '',
    subtitle: f.metaDescription?.['en-US'] || '',
    categories: f.mealTypeCategory?.['en-US'] || [],
    slug: f.pageSlug?.['en-US'] || '',
  };
}

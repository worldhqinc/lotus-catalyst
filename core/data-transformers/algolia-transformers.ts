import { Price } from '@/vibes/soul/primitives/price-label';

export interface ProductGridHit {
  objectID: string;
  contentType: string;
  href: string;
  sku: string;
  title: string;
  subtitle: string;
  price: Price;
  badge: string;
  newFlag: boolean;
  inStock: boolean;
  image: { src: string; alt: string };
}

export interface PostGridHit {
  objectID: string;
  contentType: string;
  href: string;
  title: string;
  subtitle: string;
  categories: string[];
  image: { src: string; alt: string };
}

export function transformProductHit(hit: ProductGridHit) {
  return {
    id: hit.objectID,
    sku: hit.sku,
    title: hit.title,
    subtitle: hit.subtitle,
    href: hit.href,
    price: hit.price,
    badge: hit.badge,
    newFlag: hit.newFlag,
    inStock: hit.inStock,
    image: hit.image,
  };
}

export function transformPostHit(hit: PostGridHit) {
  return {
    id: hit.objectID,
    href: hit.href,
    image: hit.image,
    title: hit.title,
    subtitle: hit.subtitle,
    categories: hit.categories,
  };
}

export function transformFeatureHit(hit: PostGridHit) {
  return {
    id: hit.objectID,
    href: hit.href,
    title: hit.title,
    subtitle: hit.subtitle,
    categories: hit.categories,
    image: hit.image,
  };
}

export function transformRecipeHit(hit: PostGridHit) {
  return {
    id: hit.objectID,
    href: hit.href,
    title: hit.title,
    subtitle: hit.subtitle,
    categories: hit.categories,
    image: hit.image,
  };
}

'use client';

import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { useState } from 'react';
import { Configure, InstantSearch, useInfiniteHits, useInstantSearch } from 'react-instantsearch';

import { Select } from '@/vibes/soul/form/select';
import { Button } from '@/vibes/soul/primitives/button';
import { Price } from '@/vibes/soul/primitives/price-label';
import { ProductCard } from '@/vibes/soul/primitives/product-card';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { ensureImageUrl } from '~/lib/utils';

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? '',
  process.env.NEXT_PUBLIC_ALGOLIA_API_KEY ?? '',
);

interface ProductGridProps {
  title: string;
  subtitle?: string | null;
  type: string;
}

type Localized<T> = Record<string, T>;

interface ProductGridHit {
  objectID: string;
  fields?: {
    productName?: Localized<string>;
    shortDescription?: Localized<string>;
    pageSlug?: Localized<string>;
    featuredImage?: Localized<{ fields?: { file?: { url: string } } }>;
    price?: Localized<string>;
    defaultPrice?: Localized<string>;
    salePrice?: Localized<string>;
    badge?: Localized<string>;
    rating?: Localized<number>;
    productLine?: Localized<string[]>;
  };
}

function InfiniteHits() {
  const { items, showMore, isLastPage, results } = useInfiniteHits<ProductGridHit>();
  const hasMore = !isLastPage;
  const totalCount = results?.nbHits ?? 0;
  const progressPercent = totalCount > 0 ? (items.length / totalCount) * 100 : 0;

  return (
    <>
      <div className="mt-8 grid w-full gap-8 md:grid-cols-2 lg:grid-cols-4">
        {items.map((hit, index) => {
          const f = hit.fields ?? {};
          const title = f.productName?.['en-US'] || '';
          const description = f.shortDescription?.['en-US'] || '';
          const slug = f.pageSlug?.['en-US'] || '';
          const imgField = f.featuredImage?.['en-US']?.fields?.file?.url || null;
          const imgUrl = imgField ? ensureImageUrl(imgField) : null;
          const defaultPrice = f.defaultPrice?.['en-US'] ?? f.price?.['en-US'];
          const price: Price = f.salePrice?.['en-US']
            ? {
                type: 'sale',
                previousValue: `$${f.salePrice['en-US']}`,
                currentValue: `$${defaultPrice}`,
              }
            : `$${defaultPrice}`;
          const badge = f.badge?.['en-US'];
          const rating = f.rating?.['en-US'];

          return (
            <ProductCard
              key={`${hit.objectID}-${index}`}
              product={{
                id: hit.objectID,
                title,
                subtitle: description,
                href: `/${slug}`,
                image: imgUrl ? { src: imgUrl, alt: title } : undefined,
                price,
                badge,
                rating,
              }}
            />
          );
        })}
      </div>
      <div className="flex w-full flex-col items-center gap-8 py-12">
        <div className="w-full max-w-xs px-4">
          <div className="text-foreground mb-2 flex justify-center text-xl font-medium">
            {items.length}/{totalCount}
          </div>
          <div className="bg-disabled h-1 w-full rounded-full">
            <div
              className="bg-foreground h-full rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        {hasMore && (
          <Button onClick={() => showMore()} variant="tertiary">
            Load more
          </Button>
        )}
      </div>
    </>
  );
}

function ResultCount() {
  const { results } = useInstantSearch();
  const hitCount = results.nbHits;

  return <span className="text-contrast-400">{hitCount} items</span>;
}

export function ProductGrid({ title, subtitle, type }: ProductGridProps) {
  const [sortOption, setSortOption] = useState('relevance');

  const getSortBy = () => {
    const baseIndex = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME ?? '';

    switch (sortOption) {
      case 'price_asc':
        return `${baseIndex}_price_asc`;

      case 'price_desc':
        return `${baseIndex}_price_desc`;

      case 'relevance':
      default:
        return baseIndex;
    }
  };

  const sortOptions = [
    { label: 'Relevance', value: 'relevance' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
  ];

  return (
    <SectionLayout containerSize="2xl">
      <div className="flex flex-col items-center gap-4">
        <h1 className="font-heading max-w-xl text-center text-4xl uppercase @2xl:text-5xl @4xl:text-6xl">
          {title}
        </h1>
        {subtitle ? <p className="text-contrast-400 max-w-3xl text-center">{subtitle}</p> : null}
      </div>
      <InstantSearch indexName={getSortBy()} searchClient={searchClient}>
        <div className="flex w-full items-center justify-between gap-4 pt-12">
          <div>
            <Select
              name="sort"
              onValueChange={(value) => setSortOption(value)}
              options={sortOptions}
              value={sortOption}
              variant="rectangle"
            />
          </div>
          <ResultCount />
        </div>
        <Configure
          filters={
            type === 'accessories'
              ? 'sys.contentType.sys.id:productPartsAndAccessories'
              : 'sys.contentType.sys.id:productFinishedGoods OR sys.contentType.sys.id:productPartsAndAccessories'
          }
          hitsPerPage={20}
        />
        <InfiniteHits />
      </InstantSearch>
    </SectionLayout>
  );
}

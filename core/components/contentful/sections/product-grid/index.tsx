'use client';

import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { useState } from 'react';
import { Configure, InstantSearch, useInfiniteHits, useInstantSearch } from 'react-instantsearch';

import { Select } from '@/vibes/soul/form/select';
import { Button } from '@/vibes/soul/primitives/button';
import { ProductCard, ProductCardSkeleton } from '@/vibes/soul/primitives/product-card';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { ProductGridHit, transformProductHit } from '~/data-transformers/algolia-transformers';

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? '',
  process.env.NEXT_PUBLIC_ALGOLIA_API_KEY ?? '',
);

interface ProductGridProps {
  title: string;
  subtitle?: string | null;
  type: string;
}

function InfiniteHits() {
  const { items, showMore, isLastPage, results, sendEvent } = useInfiniteHits<ProductGridHit>();
  const { status } = useInstantSearch();
  const hasMore = !isLastPage;
  const totalCount = results?.nbHits ?? 0;
  const progressPercent = totalCount > 0 ? (items.length / totalCount) * 100 : 0;

  if (status === 'loading' || status === 'stalled') {
    return (
      <div className="mt-8 grid w-full gap-8 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton aspectRatio="1:1" key={index} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="mt-8 grid w-full gap-8 md:grid-cols-2 lg:grid-cols-4">
        {items.map((hit, index) => (
          <ProductCard
            aspectRatio="1:1"
            key={`${hit.objectID}-${index}`}
            onClick={() => sendEvent('click', hit, 'Product Clicked')}
            product={transformProductHit(hit)}
          />
        ))}
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

const baseIndex = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME ?? '';

export function ProductGrid({ title, subtitle, type }: ProductGridProps) {
  const [sortOption, setSortOption] = useState('relevance');
  const [filterOption, setFilterOption] = useState('all');
  const [searchKey, setSearchKey] = useState(0);

  const getSortBy = () => {
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

  const getFilterString = () => {
    switch (filterOption) {
      case 'accessory':
        return 'sys.contentType.sys.id:productPartsAndAccessories';

      case 'product':
        return 'sys.contentType.sys.id:productFinishedGoods';

      case 'all':
      default:
        if (type === 'accessories') {
          return 'sys.contentType.sys.id:productPartsAndAccessories';
        }

        return 'sys.contentType.sys.id:productFinishedGoods OR sys.contentType.sys.id:productPartsAndAccessories';
    }
  };

  const sortOptions = [
    { label: 'Relevance', value: 'relevance' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
  ];

  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Products', value: 'product' },
    { label: 'Accessories', value: 'accessory' },
  ];

  return (
    <SectionLayout containerSize="2xl">
      <div className="flex flex-col items-center gap-4">
        <h1 className="font-heading max-w-xl text-center text-4xl uppercase @2xl:text-5xl @4xl:text-6xl">
          {title}
        </h1>
        {subtitle ? <p className="text-contrast-400 max-w-3xl text-center">{subtitle}</p> : null}
      </div>
      <InstantSearch
        future={{
          preserveSharedStateOnUnmount: true,
        }}
        indexName={getSortBy()}
        key={searchKey}
        searchClient={searchClient}
      >
        <div className="flex w-full justify-between gap-4 pt-12 @2xl:flex-row @2xl:items-center">
          <div className="flex flex-col gap-4 @2xl:flex-row">
            <div className="flex flex-col items-start">
              <Select
                name="sort"
                onValueChange={(value) => setSortOption(value)}
                options={sortOptions}
                value={sortOption}
                variant="rectangle"
              />
            </div>
            {type !== 'accessories' && (
              <div className="flex max-w-max flex-col items-start @2xl:max-w-none">
                <Select
                  name="filter"
                  onValueChange={(value) => {
                    setFilterOption(value);
                    setSearchKey((prev) => prev + 1);
                  }}
                  options={filterOptions}
                  value={filterOption}
                  variant="rectangle"
                />
              </div>
            )}
          </div>
          <ResultCount />
        </div>
        <Configure filters={getFilterString()} hitsPerPage={20} />
        <InfiniteHits />
      </InstantSearch>
    </SectionLayout>
  );
}

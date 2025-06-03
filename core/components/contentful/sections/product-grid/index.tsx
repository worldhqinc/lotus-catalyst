'use client';

import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { useState, useRef } from 'react';
import {
  Configure,
  InstantSearch,
  useInfiniteHits,
  useInstantSearch,
  useRefinementList,
} from 'react-instantsearch';

import { SelectField } from '@/vibes/soul/form/select-field';
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
  const newProductsRef = useRef<HTMLDivElement>(null);

  if ((status === 'loading' || status === 'stalled') && items.length === 0) {
    return (
      <div className="mt-8 grid w-full grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton aspectRatio="1:1" key={index} />
        ))}
      </div>
    );
  }

  const handleShowMore = () => {
    showMore();
    setTimeout(() => {
      if (newProductsRef.current) {
        newProductsRef.current.focus();
      }
    }, 0);
  };

  return (
    <>
      <div className="mt-8 grid w-full grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        {items.map((hit, index) => (
          <div
            key={`${hit.objectID}-${index}`}
            ref={index === items.length - 1 ? newProductsRef : null}
            tabIndex={-1}
          >
            <ProductCard
              aspectRatio="1:1"
              onClick={() => sendEvent('click', hit, 'Product Clicked')}
              product={transformProductHit(hit)}
            />
          </div>
        ))}
      </div>
      <div className="flex w-full flex-col items-center gap-8 py-12">
        <div className="pagination-bar w-full max-w-xs px-4">
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
          <Button className="[overflow-anchor:none]" onClick={handleShowMore} variant="tertiary">
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

interface DropdownRefinementFilterProps {
  attribute: string;
  label?: string;
}

function DropdownRefinementFilter({ attribute, label }: DropdownRefinementFilterProps) {
  const { items, refine } = useRefinementList({ attribute });
  const { indexUiState } = useInstantSearch();
  const refinements = indexUiState.refinementList?.[attribute] ?? [];

  // Determine the selected value based on actual refinements
  const selectedValue = refinements.length === 0 ? 'all' : refinements[0];

  function transformLabel(itemLabel: string) {
    if (itemLabel === 'productPartsAndAccessories') {
      return 'Accessories';
    }

    if (itemLabel === 'productFinishedGoods') {
      return 'Products';
    }

    return itemLabel;
  }

  const options = [
    {
      label: items.some((item) => item.isRefined) ? 'View all' : (label ?? attribute),
      value: 'all',
    },
    ...items.map((item) => ({
      label: transformLabel(item.label),
      value: item.value,
    })),
  ];

  const handleValueChange = (value: string) => {
    items.forEach((item) => {
      if (item.isRefined) {
        refine(item.value);
      }
    });

    if (value !== 'all') {
      refine(value);
    }
  };

  return (
    <div className="flex w-full flex-col items-start @2xl:max-w-none">
      <SelectField
        hideLabel
        label={label ?? ''}
        name={attribute}
        onValueChange={handleValueChange}
        options={options}
        value={selectedValue ?? ''}
        variant="rectangle"
      />
    </div>
  );
}

interface ClearProps {
  onResetSort: () => void;
  sortOption: string;
}

function Clear({ onResetSort, sortOption }: ClearProps) {
  const { setIndexUiState, indexUiState } = useInstantSearch();
  const hasRefinements = Object.keys(indexUiState.refinementList ?? {}).length > 0;
  const hasSorts = sortOption !== 'relevance';

  if (!hasRefinements && !hasSorts) {
    return null;
  }

  const handleClear = () => {
    setIndexUiState((uiState) => ({
      ...uiState,
      refinementList: {},
    }));
    onResetSort();
  };

  return (
    <Button className="text-contrast-400 text-sm" onClick={handleClear} size="small" variant="link">
      Clear
    </Button>
  );
}

const baseIndex = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME ?? '';

export function ProductGrid({ title, subtitle, type }: ProductGridProps) {
  const [sortOption, setSortOption] = useState('relevance');
  const [filterOption] = useState('all');
  const [searchKey] = useState(0);

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
        return 'contentType:productPartsAndAccessories';

      case 'product':
        return 'contentType:productFinishedGoods';

      case 'all':
      default:
        if (type === 'accessories') {
          return 'contentType:productPartsAndAccessories';
        }

        if (type === 'products') {
          return 'contentType:productFinishedGoods';
        }

        return 'contentType:productFinishedGoods OR contentType:productPartsAndAccessories';
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
        <h1 className="font-heading max-w-2xl text-center text-4xl uppercase @2xl:text-5xl @4xl:text-6xl">
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
          <div className="flex flex-col gap-4 @2xl:min-w-[268px] @2xl:flex-row">
            <div className="flex min-w-[200px] flex-1 shrink-0 flex-col items-start">
              <SelectField
                hideLabel
                label="Sort by"
                name="sort"
                onValueChange={(value) => setSortOption(value)}
                options={sortOptions}
                value={sortOption}
                variant="rectangle"
              />
            </div>
            {type === 'all' && (
              <div className="flex min-w-[200px] flex-1 shrink-0 flex-col items-start">
                <DropdownRefinementFilter attribute="contentType" label="Product Type" />
              </div>
            )}
            {type === 'accessories' && (
              <div className="flex min-w-[200px] flex-1 shrink-0 flex-col items-start">
                <DropdownRefinementFilter attribute="categories" label="Categories" />
              </div>
            )}
            <Clear onResetSort={() => setSortOption('relevance')} sortOption={sortOption} />
          </div>
          <ResultCount />
        </div>
        <Configure filters={getFilterString()} hitsPerPage={20} />
        <InfiniteHits />
      </InstantSearch>
    </SectionLayout>
  );
}

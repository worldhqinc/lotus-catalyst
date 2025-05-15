'use client';

import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { clsx } from 'clsx';
import { ArrowRight, Search, X } from 'lucide-react';
import { Configure, Hits, Index, InstantSearch, SearchBox, useHits } from 'react-instantsearch';

import { Button } from '@/vibes/soul/primitives/button';
import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { ProductCard } from '@/vibes/soul/primitives/product-card';
import Tabs from '@/vibes/soul/primitives/tabs';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';

import {
  PostGridHit,
  ProductGridHit,
  transformPostHit,
  transformProductHit,
} from '../../data-transformers/algolia-transformers';
import { PostCard as PostGridPostCard } from '../contentful/sections/post-grid';

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? '',
  process.env.NEXT_PUBLIC_ALGOLIA_API_KEY ?? '',
);

interface SearchComponentProps {
  closeSearch?: () => void;
}

interface HitProps {
  hit: unknown;
  sendEvent: (eventType: string, hit: unknown, eventName: string) => void;
}

interface GroupConfig {
  key: string;
  label: string;
  href: string;
  filter: string;
  card: (props: HitProps) => JSX.Element;
}

function hasRequiredProductFields(hit: object): hit is ProductGridHit {
  if (!('contentType' in hit)) return false;

  const contentType = hit.contentType;

  return 'sku' in hit && typeof contentType === 'string' && contentType.includes('product');
}

function hasRequiredPostFields(hit: object): hit is PostGridHit {
  return 'fields' in hit && !('sku' in hit);
}

const isProductGridHit = (hit: unknown): hit is ProductGridHit => {
  return typeof hit === 'object' && hit !== null && hasRequiredProductFields(hit);
};

const isPostGridHit = (hit: unknown): hit is PostGridHit => {
  return typeof hit === 'object' && hit !== null && hasRequiredPostFields(hit);
};

const GROUP_CONFIG: GroupConfig[] = [
  {
    key: 'products',
    label: 'Products',
    href: '/shop/all',
    filter: 'contentType:productFinishedGoods',
    card: ({ hit, sendEvent }) => {
      if (!isProductGridHit(hit)) return <div />;

      return (
        <ProductCard
          aspectRatio="1:1"
          key={hit.objectID}
          onClick={() => sendEvent('click', hit, 'Product Clicked')}
          product={transformProductHit(hit)}
        />
      );
    },
  },
  {
    key: 'accessories',
    label: 'Accessories',
    href: '/shop/accessories',
    filter: 'contentType:productPartsAndAccessories',
    card: ({ hit, sendEvent }) => {
      if (!isProductGridHit(hit)) return <div />;

      return (
        <ProductCard
          aspectRatio="1:1"
          key={hit.objectID}
          onClick={() => sendEvent('click', hit, 'Accessory Clicked')}
          product={transformProductHit(hit)}
        />
      );
    },
  },
  {
    key: 'recipes',
    label: 'Recipes',
    href: '/recipes',
    filter: 'contentType:recipe',
    card: ({ hit, sendEvent }) => {
      if (!isPostGridHit(hit)) return <div />;

      return (
        <PostGridPostCard
          key={hit.objectID}
          {...transformPostHit(hit)}
          onClick={() => sendEvent('click', hit, 'Recipe Clicked')}
        />
      );
    },
  },
  {
    key: 'features',
    label: 'Features',
    href: '/features',
    filter: 'contentType:feature',
    card: ({ hit, sendEvent }) => {
      if (!isPostGridHit(hit)) return <div />;

      return (
        <PostGridPostCard
          key={hit.objectID}
          {...transformPostHit(hit)}
          onClick={() => sendEvent('click', hit, 'Feature Clicked')}
        />
      );
    },
  },
];

function GroupTabContent({ group }: { group: GroupConfig }) {
  const { items } = useHits();

  if (items.length === 0) return null;

  return (
    <div className="py-12 first:mt-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h2 className="text-lg font-medium tracking-[1.8px] uppercase lg:text-2xl lg:tracking-[2.4px]">
          {group.label}
        </h2>
        <ButtonLink href={group.href} shape="link" size="link" variant="link">
          <span className="flex items-center gap-2 text-base font-normal">
            View more <ArrowRight size={20} strokeWidth={1.5} />
          </span>
        </ButtonLink>
      </div>
      <Hits
        classNames={{ list: 'grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-8' }}
        hitComponent={(props) => group.card(props)}
      />
    </div>
  );
}

function GroupTabs() {
  const triggers: Array<{ value: string; label: string }> = [];
  const content: Array<{ value: string; children: React.ReactNode }> = [];

  GROUP_CONFIG.forEach((group) => {
    content.push({
      value: group.key,
      children: (
        <Index indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME ?? ''} key={group.key}>
          <Configure filters={group.filter} hitsPerPage={4} />
          <GroupTabContent group={group} />
        </Index>
      ),
    });
    triggers.push({ value: group.key, label: group.label });
  });

  return <Tabs className="mt-8" content={content} showAll={true} triggers={triggers} />;
}

function SearchComponent({ closeSearch }: SearchComponentProps) {
  const formStyles =
    '[&_form]:flex [&_form]:gap-4 [&_form_button.ais-SearchBox-submit]:hidden [&_form_button.ais-SearchBox-reset]:hidden';
  const inputStyles =
    '[&_input]:flex-1 [&_input]:min-h-12 text-icon-primary text-lg [&_input]:focus-within:outline-0 [&_input::-webkit-search-cancel-button]:appearance-none';

  return (
    <SectionLayout className="overflow-y-auto" containerClassName="!py-8" containerSize="2xl">
      <div className="flex items-center gap-3">
        <span className="text-icon-primary">
          <Search size={20} strokeWidth={1.5} />
        </span>
        <SearchBox
          className={clsx('flex-1', formStyles, inputStyles)}
          placeholder="Search Products"
        />
        <Button
          className="border-none md:border-solid"
          onClick={closeSearch}
          shape="circle"
          size="small"
          variant="tertiary"
        >
          <X size={20} strokeWidth={1.5} />
        </Button>
      </div>
      <GroupTabs />
    </SectionLayout>
  );
}

export default function AlgoliaSearch({ closeSearch }: SearchComponentProps) {
  return (
    <InstantSearch
      future={{ preserveSharedStateOnUnmount: true }}
      indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME}
      searchClient={searchClient}
    >
      <SearchComponent closeSearch={closeSearch} />
    </InstantSearch>
  );
}

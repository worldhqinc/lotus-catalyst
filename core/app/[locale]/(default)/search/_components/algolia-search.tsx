'use client';

import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { clsx } from 'clsx';
import { ArrowRight, Search, X } from 'lucide-react';
import { Configure, Hits, Index, InstantSearch, SearchBox, useHits } from 'react-instantsearch';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { ProductCard } from '@/vibes/soul/primitives/product-card';
import Tabs from '@/vibes/soul/primitives/tabs';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { useSearch } from '~/context/search-context';
import { usePathname } from '~/i18n/routing';

import { PostCard as PostGridPostCard } from '../../../../../components/contentful/sections/post-grid';
import {
  PostGridHit,
  ProductGridHit,
  transformPostHit,
  transformProductHit,
} from '../../../../../data-transformers/algolia-transformers';

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? '',
  process.env.NEXT_PUBLIC_ALGOLIA_API_KEY ?? '',
);

interface HitProps {
  hit: ProductGridHit | PostGridHit;
  sendEvent: (eventType: string, hit: { contentType: string }, eventName: string) => void;
  onItemClick?: (path: string) => void;
}

interface GroupConfig {
  key: string;
  label: string;
  href: string;
  filter: string;
  card: (props: HitProps) => JSX.Element;
}

const GROUP_CONFIG: GroupConfig[] = [
  {
    key: 'products',
    label: 'Products',
    href: '/shop/all',
    filter: 'contentType:productFinishedGoods',
    card: ({ hit, sendEvent, onItemClick }) => {
      return (
        <ProductCard
          aspectRatio="1:1"
          key={hit.objectID}
          onClick={() => {
            sendEvent('click', hit, 'Product Clicked');
            onItemClick?.(hit.href);
          }}
          // @ts-expect-error - hit is a ProductGridHit
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
    card: ({ hit, sendEvent, onItemClick }) => (
      <ProductCard
        aspectRatio="1:1"
        key={hit.objectID}
        onClick={() => {
          sendEvent('click', hit, 'Accessory Clicked');
          onItemClick?.(hit.href);
        }}
        // @ts-expect-error - hit is a ProductGridHit
        product={transformProductHit(hit)}
      />
    ),
  },
  {
    key: 'recipes',
    label: 'Recipes',
    href: '/recipes',
    filter: 'contentType:recipe',
    card: ({ hit, sendEvent, onItemClick }) => (
      <PostGridPostCard
        key={hit.objectID}
        // @ts-expect-error - hit is a PostGridHit
        {...transformPostHit(hit)}
        onClick={() => {
          sendEvent('click', hit, 'Recipe Clicked');
          onItemClick?.(hit.href);
        }}
      />
    ),
  },
  {
    key: 'features',
    label: 'Features',
    href: '/features',
    filter: 'contentType:feature',
    card: ({ hit, sendEvent, onItemClick }) => (
      <PostGridPostCard
        key={hit.objectID}
        // @ts-expect-error - hit is a PostGridHit
        {...transformPostHit(hit)}
        onClick={() => {
          sendEvent('click', hit, 'Feature Clicked');
          onItemClick?.(hit.href);
        }}
      />
    ),
  },
];

function GroupTabContent({ group }: { group: GroupConfig }) {
  const { items } = useHits();
  const { setIsSearchOpen } = useSearch();
  const currentPath = usePathname();

  if (items.length === 0) return null;

  const handleClick = (path: string) => {
    // Remove trailing slashes and normalize paths for comparison
    const normalizedCurrentPath = currentPath.replace(/\/$/, '');
    const normalizedPath = path.replace(/\/$/, '');

    if (normalizedPath === normalizedCurrentPath) {
      setIsSearchOpen(false);
    }
  };

  return (
    <div className="py-12 first:mt-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h2 className="text-lg font-medium tracking-[1.8px] uppercase lg:text-2xl lg:tracking-[2.4px]">
          {group.label}
        </h2>
        <ButtonLink
          href={group.href}
          onClick={() => handleClick(group.href)}
          shape="link"
          size="link"
          variant="link"
        >
          <span className="flex items-center gap-2 text-base font-normal">
            View more <ArrowRight size={20} strokeWidth={1.5} />
          </span>
        </ButtonLink>
      </div>
      <Hits
        classNames={{ list: 'grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6 lg:gap-8' }}
        // @ts-expect-error - hit is a ProductGridHit | PostGridHit
        hitComponent={(props) => group.card({ ...props, onItemClick: handleClick })}
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
          <Configure filters={group.filter} hitsPerPage={6} />
          <GroupTabContent group={group} />
        </Index>
      ),
    });
    triggers.push({ value: group.key, label: group.label });
  });

  return <Tabs className="mt-8" content={content} showAll={true} triggers={triggers} />;
}

function SearchComponent() {
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
      </div>
      <GroupTabs />
    </SectionLayout>
  );
}

export default function AlgoliaSearch() {
  return (
    <InstantSearch
      future={{ preserveSharedStateOnUnmount: true }}
      indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME}
      searchClient={searchClient}
    >
      <SearchComponent />
    </InstantSearch>
  );
}

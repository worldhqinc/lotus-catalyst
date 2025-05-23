'use client';

import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { clsx } from 'clsx';
import { ArrowRight, Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import { Configure, Hits, Index, InstantSearch, SearchBox, useHits } from 'react-instantsearch';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { ProductCard } from '@/vibes/soul/primitives/product-card';
import Tabs from '@/vibes/soul/primitives/tabs';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { useRouter } from '~/i18n/routing';

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

  if (items.length === 0) {
    return (
      <div className="py-10 text-xl">
        <p>No results found.</p>
      </div>
    );
  }

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
        classNames={{ list: 'grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6 lg:gap-6' }}
        // @ts-expect-error - hit is a ProductGridHit | PostGridHit
        hitComponent={(props) => group.card({ ...props })}
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

function SearchComponent({ initialSearchTerm }: { initialSearchTerm?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const formStyles =
    '[&_form]:flex [&_form]:gap-4 [&_form_button.ais-SearchBox-submit]:hidden [&_form_button.ais-SearchBox-reset]:hidden';
  const inputStyles =
    '[&_input]:flex-1 [&_input]:min-h-10 pl-2 text-icon-primary text-lg [&_input]:focus-within:pl-6 [&_input]:focus-within:outline-0 [&_input::-webkit-search-cancel-button]:appearance-none';

  const updateSearchParams = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set('term', value);
      } else {
        params.delete('term');
      }

      router.push(`/search?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const handleSearchChange = useCallback(
    (event: React.FormEvent<HTMLDivElement>) => {
      const input = event.currentTarget.querySelector('input');

      if (!input) return;

      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        updateSearchParams(input.value);
      }, 300);
    },
    [updateSearchParams],
  );

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <SectionLayout className="overflow-y-auto" containerClassName="!py-8" containerSize="2xl">
      <div className="flex items-center gap-3">
        <span className="text-icon-primary">
          <Search size={20} strokeWidth={1.5} />
        </span>
        <SearchBox
          className={clsx('flex-1', formStyles, inputStyles)}
          defaultValue={initialSearchTerm}
          onInput={handleSearchChange}
          placeholder="Search Products"
          translations={{
            submitButtonTitle: 'Submit your search query',
            resetButtonTitle: 'Clear your search query',
          }}
        />
      </div>
      <GroupTabs />
    </SectionLayout>
  );
}

export default function AlgoliaSearch({ initialSearchTerm }: { initialSearchTerm?: string }) {
  return (
    <InstantSearch
      future={{ preserveSharedStateOnUnmount: true }}
      indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME}
      initialUiState={{
        [process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME ?? '']: {
          query: initialSearchTerm,
        },
      }}
      searchClient={searchClient}
    >
      <SearchComponent initialSearchTerm={initialSearchTerm} />
    </InstantSearch>
  );
}

'use client';

import { Hit } from 'algoliasearch';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { clsx } from 'clsx';
import { Search, X } from 'lucide-react';
import { Hits, InstantSearch, SearchBox, useHits, useSearchBox } from 'react-instantsearch';

import { Button } from '@/vibes/soul/primitives/button';
import Tabs from '@/vibes/soul/primitives/tabs';
import { Image } from '~/components/image';
import { Link } from '~/components/link';

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? '',
  process.env.NEXT_PUBLIC_ALGOLIA_API_KEY ?? '',
);

interface HitFields {
  fields: {
    pageImage: { 'en-US': string } | null;
    pageName: { 'en-US': string } | null;
    productName: { 'en-US': string } | null;
    pageSlug: { 'en-US': string } | null;
    pageDescription: { 'en-US': string } | null;
    shortDescription: { 'en-US': string } | null;
  };
}

const Groups = [
  {
    name: 'Products',
    slug: 'search_tag:Products',
  },
  {
    name: 'Inspirations',
    slug: 'search_tag:Inspirations',
  },
  {
    name: 'Support',
    slug: 'search_tag:Support',
  },
  {
    name: 'Documents',
    slug: 'search_tag:Documents',
  },
];

function Result({ hit }: { hit: Hit<HitFields> }) {
  const fields = hit.fields;

  const pageImage = fields.pageImage ? fields.pageImage['en-US'] : null;
  const pageName = fields.pageName ? fields.pageName['en-US'] : null;
  const productName = fields.productName ? fields.productName['en-US'] : null;
  const pageSlug = fields.pageSlug ? fields.pageSlug['en-US'] : null;
  const pageDescription = fields.pageDescription ? fields.pageDescription['en-US'] : null;
  const shortDescription = fields.shortDescription ? fields.shortDescription['en-US'] : null;

  const hitHeadingStyles =
    'font-body text-lg font-medium transition-colors duration-200 ease-quad lg:text-xl group-hover:text-primary after:absolute after:inset-0';

  return (
    <article className="group relative">
      {pageImage ? (
        <figure className="aspect-square h-auto w-full rounded-lg bg-surface-image">
          <Image
            alt={pageName ? `Image for ${pageName}` : 'Search result image'}
            className="object-cover"
            src={pageImage}
          />
        </figure>
      ) : (
        <figure className="aspect-square h-auto w-full rounded-lg bg-surface-image" />
      )}
      <div className="space-y-1 py-2">
        {(() => {
          if (pageName && pageSlug) {
            return (
              <Link className={hitHeadingStyles} href={`/${pageSlug}`} prefetch="hover">
                <h3>{pageName}</h3>
              </Link>
            );
          }

          if (pageName) {
            return <h3>{pageName}</h3>;
          }

          return null;
        })()}
        {(() => {
          if (productName && pageSlug) {
            return (
              <Link className={hitHeadingStyles} href={`/${pageSlug}`} prefetch="hover">
                <h3>{productName}</h3>
              </Link>
            );
          }

          if (productName) {
            return <h3>{productName}</h3>;
          }

          return null;
        })()}
        {pageDescription ? <p className="text-neutral-500">{pageDescription}</p> : null}
        {shortDescription ? <p className="text-neutral-500">{shortDescription}</p> : null}
      </div>
    </article>
  );
}

function GroupTabs() {
  const triggers = Groups.map((group) => ({
    value: group.slug,
    label: group.name,
  }));

  const content = Groups.map((group) => ({
    value: group.slug,
    children: (
      <div className="mt-4">
        <p>Content for {group.name}</p>
      </div>
    ),
  }));

  return (
    <Tabs
      className="mt-8"
      content={content}
      triggers={triggers}
      showAll={true}
      allLabel="All"
    />
  );
}

interface SearchComponentProps {
  closeSearch?: () => void;
}

function SearchComponent({ closeSearch }: SearchComponentProps) {
  const { query } = useSearchBox();
  const { items } = useHits();

  const formStyles =
    '[&_form]:flex [&_form]:gap-4 [&_form_button.ais-SearchBox-submit]:hidden [&_form_button.ais-SearchBox-reset]:hidden';
  const inputStyles =
    '[&_input]:flex-1 [&_input]:min-h-12 [&_input]:focus-within:outline-0 [&_input::-webkit-search-cancel-button]:appearance-none';
  const searchHitsStyles = 'grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-8';

  return (
    <>
      <div className="flex items-center gap-2 border-b border-border transition-colors duration-200 ease-quad focus-within:border-primary">
        <Button onClick={closeSearch} shape="link" size="link" variant="link">
          <X size={24} strokeWidth={1} />
        </Button>
        <Search size={24} strokeWidth={1} />
        <SearchBox
          className={clsx('flex-1', formStyles, inputStyles)}
          placeholder="Search Lotus for products, guides, or resources…"
        />
      </div>
      <GroupTabs />
      {query && items.length > 0 ? (
        <Hits classNames={{ root: 'mt-16', list: clsx(searchHitsStyles) }} hitComponent={Result} />
      ) : null}
    </>
  );
}

export default function AlgoliaSearch({ closeSearch }: SearchComponentProps) {
  return (
    <div className="container overflow-y-auto py-8">
      <InstantSearch
        indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME}
        searchClient={searchClient}
      >
        <SearchComponent closeSearch={closeSearch} />
      </InstantSearch>
    </div>
  );
}

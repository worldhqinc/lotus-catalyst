'use client';

import { Hit } from 'algoliasearch';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { clsx } from 'clsx';
import { Search, X } from 'lucide-react';
import { Hits, InstantSearch, SearchBox, useHits, useSearchBox } from 'react-instantsearch';

import { Button } from '@/vibes/soul/primitives/button';
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

function Result({ hit }: { hit: Hit<HitFields> }) {
  const fields = hit.fields;

  const pageImage = fields.pageImage ? fields.pageImage['en-US'] : null;
  const pageName = fields.pageName ? fields.pageName['en-US'] : null;
  const productName = fields.productName ? fields.productName['en-US'] : null;
  const pageSlug = fields.pageSlug ? fields.pageSlug['en-US'] : null;
  const pageDescription = fields.pageDescription ? fields.pageDescription['en-US'] : null;
  const shortDescription = fields.shortDescription ? fields.shortDescription['en-US'] : null;

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
      <div className="py-2">
        {pageName ? <p className="text-xl font-medium">{pageName}</p> : null}
        {productName ? <p className="text-sm font-bold">{productName}</p> : null}
        {pageSlug ? (
          <p className="text-sm">
            <Link
              className="transition-colors duration-200 ease-quad after:absolute after:inset-0 group-hover:text-primary"
              href={`/${pageSlug}`}
              prefetch="hover"
            >
              {pageSlug}
            </Link>
          </p>
        ) : null}
        {pageDescription ? <p className="text-sm">Page Description: {pageDescription}</p> : null}
        {shortDescription ? <p className="text-sm">Short Description: {shortDescription}</p> : null}
      </div>
    </article>
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
  const searchHitsStyles = 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4';

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

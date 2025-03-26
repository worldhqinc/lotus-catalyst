'use client';

import { Hit } from 'algoliasearch';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { Hits, InstantSearch, SearchBox, useHits, useSearchBox } from 'react-instantsearch';

import { Link } from '~/components/link';

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? '',
  process.env.NEXT_PUBLIC_ALGOLIA_API_KEY ?? '',
);

interface HitFields {
  fields: {
    pageName: { 'en-US': string } | null;
    productName: { 'en-US': string } | null;
    pageSlug: { 'en-US': string } | null;
    pageDescription: { 'en-US': string } | null;
    shortDescription: { 'en-US': string } | null;
  };
}

function Result({ hit }: { hit: Hit<HitFields> }) {
  const fields = hit.fields;

  const pageName = fields.pageName ? fields.pageName['en-US'] : null;
  const productName = fields.productName ? fields.productName['en-US'] : null;
  const pageSlug = fields.pageSlug ? fields.pageSlug['en-US'] : null;
  const pageDescription = fields.pageDescription ? fields.pageDescription['en-US'] : null;
  const shortDescription = fields.shortDescription ? fields.shortDescription['en-US'] : null;

  return (
    <div className="mb-6 flex flex-col gap-2">
      {pageName ? <p className="text-sm font-bold">Page Name: {pageName}</p> : null}
      {productName ? <p className="text-sm font-bold">Product Name: {productName}</p> : null}
      {pageSlug ? (
        <p className="text-sm">
          Page Slug:{' '}
          <Link className="text-blue-500" href={`/${pageSlug}`} prefetch="hover">
            {pageSlug}
          </Link>
        </p>
      ) : null}
      {pageDescription ? <p className="text-sm">Page Description: {pageDescription}</p> : null}
      {shortDescription ? <p className="text-sm">Short Description: {shortDescription}</p> : null}
    </div>
  );
}

function SearchComponent() {
  const { query } = useSearchBox();
  const { items } = useHits();

  return (
    <>
      <SearchBox />
      {query && items.length > 0 ? <Hits hitComponent={Result} /> : null}
    </>
  );
}

export default function AlgoliaSearch() {
  return (
    <div className="flex items-center gap-3 px-3 py-3 @4xl:px-5 @4xl:py-4">
      <InstantSearch
        indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME}
        searchClient={searchClient}
      >
        <SearchComponent />
      </InstantSearch>
    </div>
  );
}

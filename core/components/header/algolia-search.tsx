'use client';

import Link from 'next/link';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { Hits, InstantSearch, SearchBox } from 'react-instantsearch';

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? '',
  process.env.NEXT_PUBLIC_ALGOLIA_API_KEY ?? '',
);

function Hit({ hit }: { hit: any }) {
  const fields = hit?.fields;

  return (
    <div className="mb-6 flex flex-col gap-2">
      {fields?.pageName && (
        <p className="text-sm font-bold">
          Page Name: {fields?.pageName ? fields?.pageName['en-US'] : ''}
        </p>
      )}
      {fields?.productName && (
        <p className="text-sm font-bold">
          Product Name: {fields?.productName ? fields?.productName['en-US'] : ''}
        </p>
      )}
      {fields?.pageSlug && (
        <p className="text-sm">
          Page Slug:{' '}
          <Link
            href={`/${fields?.pageSlug ? fields?.pageSlug['en-US'] : ''}`}
            prefetch={true}
            className="text-blue-500"
          >
            {fields?.pageSlug ? fields?.pageSlug['en-US'] : ''}
          </Link>
        </p>
      )}
      {fields?.pageDescription && (
        <p className="text-sm">
          Page Description: {fields?.pageDescription ? fields?.pageDescription['en-US'] : ''}
        </p>
      )}
      {fields?.shortDescription && (
        <p className="text-sm">
          Short Description: {fields?.shortDescription ? fields?.shortDescription['en-US'] : ''}
        </p>
      )}
    </div>
  );
}

export default function AlgoliaSearch() {
  return (
    <div className="flex items-center gap-3 px-3 py-3 @4xl:px-5 @4xl:py-4">
      <InstantSearch
        indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME}
        searchClient={searchClient}
      >
        <SearchBox />
        <Hits hitComponent={Hit} />
      </InstantSearch>
    </div>
  );
}

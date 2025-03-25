'use client';

import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { Hits, InstantSearch, SearchBox } from 'react-instantsearch';

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? '',
  process.env.NEXT_PUBLIC_ALGOLIA_API_KEY ?? '',
);

function Hit({ hit }: { hit: any }) {
  const fields = hit?.fields;

  return (
    <div>
      <p className="text-sm font-bold">{fields?.pageName ? fields?.pageName['en-US'] : ''}</p>
      <p className="text-sm">{fields?.pageSlug ? fields?.pageSlug['en-US'] : ''}</p>
    </div>
  );
}

export default function AlgoliaSearch() {
  return (
    <div className="flex items-center gap-3 px-3 py-3 @4xl:px-5 @4xl:py-4">
      <InstantSearch indexName="prod_search" searchClient={searchClient}>
        <SearchBox />
        <Hits hitComponent={Hit} />
      </InstantSearch>
    </div>
  );
}

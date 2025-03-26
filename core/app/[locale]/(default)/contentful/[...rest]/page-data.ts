import { EntryFieldTypes } from 'contentful';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import { contentfulClient } from '~/lib/contentful';

interface PageStandardEntrySkeleton {
  contentTypeId: 'pageStandard';
  fields: {
    pageName: EntryFieldTypes.Text;
    pageSlug: EntryFieldTypes.Text;
    metaTitleSeo: EntryFieldTypes.Text;
    metaDescription: EntryFieldTypes.Text;
    metaKeywordsSeo: EntryFieldTypes.Text;
    optionalPageDescription: EntryFieldTypes.RichText;
  };
}

export const getPageBySlug = cache(async (rest: string[]) => {
  const response = await contentfulClient.getEntries<PageStandardEntrySkeleton>({
    content_type: 'pageStandard',
    'fields.pageSlug': rest.join('/'),
    limit: 1,
  });

  const page = response.items[0];

  if (!page) {
    return notFound();
  }

  return page;
});

export async function getPages() {
  const response = await contentfulClient.getEntries({
    content_type: 'pageStandard',
  });

  return response.items;
}

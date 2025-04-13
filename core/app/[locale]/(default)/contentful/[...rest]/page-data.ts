import { notFound } from 'next/navigation';
import { cache } from 'react';

import { contentfulClient } from '~/lib/contentful';

type ContentType = 'pageStandard' | 'recipe';

export const getPageBySlug = cache(async (contentType: ContentType, rest: string[]) => {
  const response = await contentfulClient.getEntries({
    content_type: contentType,
    'fields.pageSlug': rest.join('/'),
    limit: 1,
    include: 4,
  });

  const pageData = response.items[0];

  if (!pageData) {
    return notFound();
  }

  return pageData;
});

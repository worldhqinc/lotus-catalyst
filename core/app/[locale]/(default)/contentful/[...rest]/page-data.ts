import type { EntrySkeletonType } from 'contentful';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import { contentfulClient } from '~/lib/contentful';
import type { CONTENT_TYPE, IPageStandard, IRecipe } from '~/types/generated/contentful';

type PageEntry = IPageStandard | IRecipe;

export const getPageBySlug = cache(
  async (contentType: Extract<CONTENT_TYPE, 'pageStandard' | 'recipe'>, rest: string[]) => {
    const response = await contentfulClient.getEntries<EntrySkeletonType>({
      content_type: contentType,
      'fields.pageSlug': rest.join('/'),
      limit: 1,
      include: 4,
    });

    const page = response.items[0] as PageEntry;

    if (!page) {
      return notFound();
    }

    return page;
  },
);

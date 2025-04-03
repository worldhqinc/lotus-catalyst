import { notFound } from 'next/navigation';
import { cache } from 'react';

import { contentfulClient } from '~/lib/contentful';

interface ContentfulEntrySkeleton {
  contentTypeId: 'pageStandard' | 'recipe';
  fields: {
    metaTitleSeo: string | null;
    metaDescription: string | null;
    metaKeywordsSeo: string | null;
    pageSlug: string;
    pageName: string;
    optionalPageDescription: string | null;
    pageContent: PageStandardPageContentField[] | null;
  };
}

export interface PageStandardFields {
  pageName: string;
  optionalPageDescription: string;
  pageContent: PageStandardPageContentField[] | null;
}

export interface PageStandardPageContentField {
  sys: {
    id: string;
    contentType: {
      sys: {
        id: string;
      };
    };
  };
}

export interface RecipeFields {
  recipeName: string;
}

export const getPageBySlug = cache(
  async (contentType: 'pageStandard' | 'recipe', rest: string[]) => {
    const response = await contentfulClient.getEntries<ContentfulEntrySkeleton>({
      content_type: contentType,
      'fields.pageSlug': rest.join('/'),
      limit: 1,
    });

    const page = response.items[0];

    if (!page) {
      return notFound();
    }

    return page;
  },
);

import { notFound } from 'next/navigation';
import { cache } from 'react';
import { z } from 'zod';

import { pageStandardSchema, recipeSchema } from '~/contentful/schema';
import { contentfulClient } from '~/lib/contentful';

type ContentType = 'pageStandard' | 'recipe';

const schemaMap = {
  pageStandard: pageStandardSchema,
  recipe: recipeSchema,
};

type ParsedPageData<T extends ContentType> = z.infer<(typeof schemaMap)[T]>;

export const getPageBySlug = cache(
  async <T extends ContentType>(contentType: T, rest: string[]): Promise<ParsedPageData<T>> => {
    const response = await contentfulClient.getEntries({
      content_type: contentType,
      'fields.pageSlug': rest.join('/'),
      limit: 1,
      include: 4,
    });

    const pageData = response.items[0];

    if (!pageData) {
      notFound();
    }

    const schema = schemaMap[contentType];

    return schema.parse(pageData);
  },
);

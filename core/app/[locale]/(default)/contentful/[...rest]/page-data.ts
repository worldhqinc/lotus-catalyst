import { unstable_cacheTag as cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { z } from 'zod';

import {
  featureSchema,
  pageStandardSchema,
  recipeSchema,
  tutorialSchema,
} from '~/contentful/schema';
import { contentfulClient } from '~/lib/contentful';

type ContentType = 'pageStandard' | 'recipe' | 'feature' | 'tutorial';

const schemaMap = {
  pageStandard: pageStandardSchema,
  recipe: recipeSchema,
  feature: featureSchema,
  tutorial: tutorialSchema,
};

type ParsedPageData<T extends ContentType> = z.infer<(typeof schemaMap)[T]>;

export const getPageBySlug = cache(
  async <T extends ContentType>(contentType: T, rest: string[]): Promise<ParsedPageData<T>> => {
    'use cache';

    cacheTag(`contentful:${contentType}:${rest.join('/')}`);

    const response = await contentfulClient.getEntries({
      content_type: contentType,
      'fields.pageSlug': rest.join('/'),
      limit: 1,
      include: 5,
    });

    const pageData = response.items[0];

    if (!pageData) {
      notFound();
    }

    const schema = schemaMap[contentType];

    return schema.parse(pageData);
  },
);

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
  fields: {
    heading: string;
    video: string;
    cta?: {
      sys: {
        id: string;
        type: string;
      };
      fields: {
        text: string;
        internalReference?: {
          sys: {
            id: string;
            type: string;
          };
          fields?: {
            pageSlug?: string;
          };
        };
        externalLink?: string;
      };
    };
    inspirationCards?: Array<{
      sys: {
        id: string;
        type: string;
      };
      fields: {
        contentReference: {
          sys: {
            id: string;
            type: string;
          };
          fields: {
            featuredImage: {
              fields: {
                file: {
                  url: string;
                  details: {
                    image: {
                      height: number;
                      width: number;
                    };
                  };
                };
              };
            };
            pageSlug: string;
            recipeName: string;
            shortDescription: string;
            mealTypeCategory: string[];
          };
        };
      };
    }>;
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
      include: 4,
    } as any);

    const page = response.items[0];

    if (!page) {
      return notFound();
    }

    return page;
  },
);

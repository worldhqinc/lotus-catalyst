import { notFound } from 'next/navigation';
import { cache } from 'react';
import { z } from 'zod';

import { contentfulClient } from '~/lib/contentful';

export const PageContentFieldSchema = z.object({
  fields: z.object({
    metaTitleSeo: z.string().nullable().optional(),
    metaDescription: z.string().nullable().optional(),
    metaKeywordsSeo: z.string().nullable().optional(),
    pageSlug: z.string().nullable().optional(),
    pageName: z.string().nullable().optional(),
    recipeName: z.string().nullable().optional(),
    optionalPageDescription: z.any().nullable().optional(),
    pageContent: z
      .array(
        z.object({
          sys: z.object({
            id: z.string(),
            contentType: z.object({
              sys: z.object({
                id: z.string(),
              }),
            }),
          }),
          fields: z.object({
            cta: z
              .object({
                fields: z.object({
                  text: z.string(),
                  internalReference: z.object({
                    fields: z.object({
                      pageSlug: z.string(),
                    }),
                  }),
                }),
              })
              .nullable()
              .optional(),
            heading: z.string().nullable().optional(),
            inspirationCards: z.array(z.any()).nullable().optional(),
            video: z.string().nullable().optional(),
          }),
        }),
      )
      .nullable()
      .optional(),
  }),
});

export const ContentfulEntrySchema = z.object({
  sys: z.object({
    type: z.string(),
  }),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
  items: z.array(PageContentFieldSchema),
});

export const getPageBySlug = cache(
  async (contentType: 'pageStandard' | 'recipe', rest: string[]) => {
    const response = ContentfulEntrySchema.parse(
      await contentfulClient.getEntries({
        content_type: contentType,
        'fields.pageSlug': rest.join('/'),
        limit: 1,
        include: 4,
      }),
    );

    const page = response.items[0];

    if (!page) {
      return notFound();
    }

    return page;
  },
);

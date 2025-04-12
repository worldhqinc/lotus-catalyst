import { notFound } from 'next/navigation';
import { cache } from 'react';
import { z } from 'zod';

import { contentfulClient } from '~/lib/contentful';

const ContentfulSysSchema = z.object({
  id: z.string(),
  type: z.string(),
  contentType: z
    .object({
      sys: z.object({
        id: z.string(),
      }),
    })
    .optional(),
});

const ContentfulImageSchema = z.object({
  fields: z.object({
    file: z.object({
      url: z.string(),
      details: z.object({
        size: z.number(),
        image: z.object({
          width: z.number(),
          height: z.number(),
        }),
      }),
      fileName: z.string(),
      contentType: z.string(),
    }),
  }),
});

const ContentfulRecipeSchema = z.object({
  fields: z.object({
    pageSlug: z.string().nullable().optional(),
    recipeName: z.string().nullable().optional(),
    shortDescription: z.string().nullable().optional(),
    mealTypeCategory: z.array(z.string()).nullable().optional(),
    featuredImage: ContentfulImageSchema.nullable().optional(),
  }),
});

const ContentfulTutorialSchema = z.object({
  fields: z.object({
    pageSlug: z.string().nullable().optional(),
    title: z.string(),
    shortDescription: z.string().nullable().optional(),
    featuredImage: ContentfulImageSchema.nullable().optional(),
  }),
});

const ContentfulInspirationCardSchema = z.object({
  sys: ContentfulSysSchema,
  fields: z.object({
    title: z.string(),
    contentReference: z.union([ContentfulRecipeSchema, ContentfulTutorialSchema]),
  }),
});

const ContentfulHeroSlideSchema = z.object({
  sys: ContentfulSysSchema,
  fields: z.object({
    image: ContentfulImageSchema.nullable().optional(),
    headline: z.string(),
    subhead: z.string().nullable().optional(),
    ctaLabel: z.string().nullable().optional(),
    ctaLink: z
      .object({
        fields: z.object({
          pageSlug: z.string(),
        }),
      })
      .nullable()
      .optional(),
  }),
});

const ContentfulCTASchema = z.object({
  fields: z.object({
    text: z.string(),
    internalReference: z
      .object({
        fields: z.object({
          pageSlug: z.string(),
        }),
      })
      .nullable()
      .optional(),
    externalLink: z.string().nullable().optional(),
  }),
});

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
            cta: ContentfulCTASchema.nullable().optional(),
            heading: z.string().nullable().optional(),
            heroSlides: z.array(ContentfulHeroSlideSchema).nullable().optional(),
            inspirationCards: z.array(ContentfulInspirationCardSchema).nullable().optional(),
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

export type ContentfulRecipe = z.infer<typeof ContentfulRecipeSchema>;
export type ContentfulTutorial = z.infer<typeof ContentfulTutorialSchema>;
export type ContentfulInspirationCard = z.infer<typeof ContentfulInspirationCardSchema>;
export type ContentfulCTA = z.infer<typeof ContentfulCTASchema>;

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

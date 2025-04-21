import { z } from 'zod';
import { BLOCKS } from '@contentful/rich-text-types';

// ========================================
// Base Schemas
// ========================================

const metadataSchema = z.object({
  tags: z.array(z.unknown()),
  concepts: z.array(z.unknown()),
});

const sysBaseSchema = z.object({
  space: z.object({
    sys: z.object({
      type: z.literal('Link'),
      linkType: z.literal('Space'),
      id: z.string(),
    }),
  }),
  id: z.string(),
  type: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  environment: z.object({
    sys: z.object({
      id: z.string(),
      type: z.literal('Link'),
      linkType: z.literal('Environment'),
    }),
  }),
  revision: z.number(),
  locale: z.string().optional(),
});

const sysEntrySchema = sysBaseSchema.extend({
  type: z.literal('Entry'),
  publishedVersion: z.number().optional(),
  contentType: z.object({
    sys: z.object({
      type: z.literal('Link'),
      linkType: z.literal('ContentType'),
      id: z.string(),
    }),
  }),
});

const sysAssetSchema = sysBaseSchema.extend({
  type: z.literal('Asset'),
  publishedVersion: z.number().optional(),
});

const assetFieldsSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  file: z.object({
    url: z.string(),
    details: z.object({
      size: z.number(),
      image: z
        .object({
          width: z.number(),
          height: z.number(),
        })
        .optional(),
    }),
    fileName: z.string(),
    contentType: z.string(),
  }),
});

export const assetSchema = z.object({
  metadata: metadataSchema,
  sys: sysAssetSchema,
  fields: assetFieldsSchema,
});
export type Asset = z.infer<typeof assetSchema>;

// ========================================
// Recursive Schemas (Defined First)
// ========================================

// Define the recursive RichTextNodeSchema using z.lazy
const RichTextNodeSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    nodeType: z.string(),
    data: z.record(z.unknown()),
    // Leaf node approximation for the union, ensure it aligns with your actual leaf structure
    content: z
      .array(
        z.union([
          RichTextNodeSchema,
          z.object({
            nodeType: z.literal('text'),
            data: z.record(z.unknown()),
            marks: z.array(z.any()),
            value: z.string(),
          }),
        ]),
      )
      .optional(),
    marks: z.array(z.any()).optional(), // Adjust marks as needed
    value: z.string().optional(),
  }),
);
// Optional: Define a type alias for convenience
export type RichTextNode = z.infer<typeof RichTextNodeSchema>;

// ========================================
// Content Type Specific Schemas
// ========================================

// Schema for productFinishedGoods
export const productFinishedGoodsFieldsSchema = z.object({
  productName: z.string(),
  bcProductReference: z.string(),
  pageSlug: z.string().optional(),
  shortDescription: z.string().optional(),
  defaultPrice: z.string(),
  salePrice: z.string().optional(),
  couponCodesalesDates: z.string().optional(),
  details: z
    .object({
      nodeType: z.literal(BLOCKS.DOCUMENT),
      data: z.record(z.string(), z.unknown()),
      content: z.array(RichTextNodeSchema),
    })
    .optional(),
  faqs: z
    .array(
      z.object({
        metadata: z.object({
          tags: z.array(z.unknown()),
          concepts: z.array(z.unknown()),
        }),
        sys: z.object({
          space: z.object({
            sys: z.object({
              type: z.literal('Link'),
              linkType: z.literal('Space'),
              id: z.string(),
            }),
          }),
          id: z.string(),
          type: z.literal('Entry'),
          createdAt: z.string().datetime(),
          updatedAt: z.string().datetime(),
          environment: z.object({
            sys: z.object({
              id: z.string(),
              type: z.literal('Link'),
              linkType: z.literal('Environment'),
            }),
          }),
          publishedVersion: z.number().optional(),
          revision: z.number(),
          locale: z.string().optional(),
          contentType: z.object({
            sys: z.object({
              type: z.literal('Link'),
              linkType: z.literal('ContentType'),
              id: z.string(),
            }),
          }),
        }),
        fields: z.record(z.string(), z.unknown()),
      }),
    )
    .optional(),
  featuredImage: z
    .object({
      metadata: z.object({
        tags: z.array(z.unknown()),
        concepts: z.array(z.unknown()),
      }),
      sys: z.object({
        space: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('Space'),
            id: z.string(),
          }),
        }),
        id: z.string(),
        type: z.literal('Asset'),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().optional(),
        revision: z.number(),
        locale: z.string().optional(),
        contentType: z.undefined().optional(),
      }),
      fields: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .optional(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .optional(),
  additionalImages: z
    .array(
      z.object({
        metadata: z.object({
          tags: z.array(z.unknown()),
          concepts: z.array(z.unknown()),
        }),
        sys: z.object({
          space: z.object({
            sys: z.object({
              type: z.literal('Link'),
              linkType: z.literal('Space'),
              id: z.string(),
            }),
          }),
          id: z.string(),
          type: z.literal('Asset'),
          createdAt: z.string().datetime(),
          updatedAt: z.string().datetime(),
          environment: z.object({
            sys: z.object({
              id: z.string(),
              type: z.literal('Link'),
              linkType: z.literal('Environment'),
            }),
          }),
          publishedVersion: z.number().optional(),
          revision: z.number(),
          locale: z.string().optional(),
          contentType: z.undefined().optional(),
        }),
        fields: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          file: z.object({
            url: z.string(),
            details: z.object({
              size: z.number(),
              image: z
                .object({
                  width: z.number(),
                  height: z.number(),
                })
                .optional(),
            }),
            fileName: z.string(),
            contentType: z.string(),
          }),
        }),
      }),
    )
    .optional(),
  partsAccessories: z
    .array(
      z.object({
        metadata: z.object({
          tags: z.array(z.unknown()),
          concepts: z.array(z.unknown()),
        }),
        sys: z.object({
          space: z.object({
            sys: z.object({
              type: z.literal('Link'),
              linkType: z.literal('Space'),
              id: z.string(),
            }),
          }),
          id: z.string(),
          type: z.literal('Entry'),
          createdAt: z.string().datetime(),
          updatedAt: z.string().datetime(),
          environment: z.object({
            sys: z.object({
              id: z.string(),
              type: z.literal('Link'),
              linkType: z.literal('Environment'),
            }),
          }),
          publishedVersion: z.number().optional(),
          revision: z.number(),
          locale: z.string().optional(),
          contentType: z.object({
            sys: z.object({
              type: z.literal('Link'),
              linkType: z.literal('ContentType'),
              id: z.string(),
            }),
          }),
        }),
        fields: z.record(z.string(), z.unknown()),
      }),
    )
    .optional(),
  productCarousel: z
    .array(
      z.object({
        metadata: z.object({
          tags: z.array(z.unknown()),
          concepts: z.array(z.unknown()),
        }),
        sys: z.object({
          space: z.object({
            sys: z.object({
              type: z.literal('Link'),
              linkType: z.literal('Space'),
              id: z.string(),
            }),
          }),
          id: z.string(),
          type: z.literal('Entry'),
          createdAt: z.string().datetime(),
          updatedAt: z.string().datetime(),
          environment: z.object({
            sys: z.object({
              id: z.string(),
              type: z.literal('Link'),
              linkType: z.literal('Environment'),
            }),
          }),
          publishedVersion: z.number().optional(),
          revision: z.number(),
          locale: z.string().optional(),
          contentType: z.object({
            sys: z.object({
              type: z.literal('Link'),
              linkType: z.literal('ContentType'),
              id: z.string(),
            }),
          }),
        }),
        fields: z.record(z.string(), z.unknown()),
      }),
    )
    .optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  productLine: z.array(z.string()).optional(),
  parentCategory: z.array(z.string()).optional(),
  subCategory: z.array(z.string()).optional(),
  webSubCategory: z.string().optional(),
  productFormulationInformation: z.record(z.string(), z.unknown()).optional(),
  feature: z.array(z.string()).optional(),
  finish: z.array(z.string()).optional(),
  size: z.string().optional(),
  supportDocumentation: z
    .array(
      z.object({
        metadata: z.object({
          tags: z.array(z.unknown()),
          concepts: z.array(z.unknown()),
        }),
        sys: z.object({
          space: z.object({
            sys: z.object({
              type: z.literal('Link'),
              linkType: z.literal('Space'),
              id: z.string(),
            }),
          }),
          id: z.string(),
          type: z.literal('Entry'),
          createdAt: z.string().datetime(),
          updatedAt: z.string().datetime(),
          environment: z.object({
            sys: z.object({
              id: z.string(),
              type: z.literal('Link'),
              linkType: z.literal('Environment'),
            }),
          }),
          publishedVersion: z.number().optional(),
          revision: z.number(),
          locale: z.string().optional(),
          contentType: z.object({
            sys: z.object({
              type: z.literal('Link'),
              linkType: z.literal('ContentType'),
              id: z.string(),
            }),
          }),
        }),
        fields: z.record(z.string(), z.unknown()),
      }),
    )
    .optional(),
  factoryRecertifiedProduct: z.boolean().optional(),
  modelNumber: z.string(),
  wattage: z.string().optional(),
  warranty: z.string().optional(),
  spotlightVideo: z
    .object({
      metadata: z.object({
        tags: z.array(z.unknown()),
        concepts: z.array(z.unknown()),
      }),
      sys: z.object({
        space: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('Space'),
            id: z.string(),
          }),
        }),
        id: z.string(),
        type: z.literal('Entry'),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().optional(),
        revision: z.number(),
        locale: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('ContentType'),
            id: z.string(),
          }),
        }),
      }),
      fields: z.record(z.string(), z.unknown()),
    })
    .optional(),
  outOfBoxNetWeight: z.string().optional(),
  outOfBoxDepth: z.string().optional(),
  outOfBoxWidth: z.string().optional(),
  outOfBoxHeight: z.string().optional(),
  outOfBoxSizeUom: z.string().optional(),
  outOfBoxWeightUom: z.string().optional(),
  archive: z.boolean().optional(),
  productBadge: z.string().optional(),
  isShipsFree: z.boolean().optional(),
  inventoryQuantity: z.number().int().optional(),
  recipes: z
    .object({
      metadata: z.object({
        tags: z.array(z.unknown()),
        concepts: z.array(z.unknown()),
      }),
      sys: z.object({
        space: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('Space'),
            id: z.string(),
          }),
        }),
        id: z.string(),
        type: z.literal('Entry'),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().optional(),
        revision: z.number(),
        locale: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('ContentType'),
            id: z.string(),
          }),
        }),
      }),
      fields: z.record(z.string(), z.unknown()),
    })
    .optional(),
  pageContentEntries: z
    .array(
      z.object({
        metadata: z.object({
          tags: z.array(z.unknown()),
          concepts: z.array(z.unknown()),
        }),
        sys: z.object({
          space: z.object({
            sys: z.object({
              type: z.literal('Link'),
              linkType: z.literal('Space'),
              id: z.string(),
            }),
          }),
          id: z.string(),
          type: z.literal('Entry'),
          createdAt: z.string().datetime(),
          updatedAt: z.string().datetime(),
          environment: z.object({
            sys: z.object({
              id: z.string(),
              type: z.literal('Link'),
              linkType: z.literal('Environment'),
            }),
          }),
          publishedVersion: z.number().optional(),
          revision: z.number(),
          locale: z.string().optional(),
          contentType: z.object({
            sys: z.object({
              type: z.literal('Link'),
              linkType: z.literal('ContentType'),
              id: z.string(),
            }),
          }),
        }),
        fields: z.record(z.string(), z.unknown()),
      }),
    )
    .optional(),
});

export const productFinishedGoodsSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('productFinishedGoods'),
      }),
    }),
  }),
  fields: productFinishedGoodsFieldsSchema,
});

export type productFinishedGoods = z.infer<typeof productFinishedGoodsSchema>;

// Schema for faq
export const faqFieldsSchema = z.object({
  question: z.string(),
  answer: z.object({
    nodeType: z.literal(BLOCKS.DOCUMENT),
    data: z.record(z.string(), z.unknown()),
    content: z.array(RichTextNodeSchema),
  }),
  faqCategory: z.array(
    z.object({
      metadata: z.object({
        tags: z.array(z.unknown()),
        concepts: z.array(z.unknown()),
      }),
      sys: z.object({
        space: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('Space'),
            id: z.string(),
          }),
        }),
        id: z.string(),
        type: z.literal('Entry'),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().optional(),
        revision: z.number(),
        locale: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('ContentType'),
            id: z.string(),
          }),
        }),
      }),
      fields: z.record(z.string(), z.unknown()),
    }),
  ),
  faqFilterCategory: z.string().optional(),
});

export const faqSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('faq'),
      }),
    }),
  }),
  fields: faqFieldsSchema,
});

export type faq = z.infer<typeof faqSchema>;

// Schema for carouselRecipe
export const carouselRecipeFieldsSchema = z.object({
  internalName: z.string(),
  carouselTitle: z.string(),
  recipes: z.array(
    z.object({
      metadata: z.object({
        tags: z.array(z.unknown()),
        concepts: z.array(z.unknown()),
      }),
      sys: z.object({
        space: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('Space'),
            id: z.string(),
          }),
        }),
        id: z.string(),
        type: z.literal('Entry'),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().optional(),
        revision: z.number(),
        locale: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('ContentType'),
            id: z.string(),
          }),
        }),
      }),
      fields: z.record(z.string(), z.unknown()),
    }),
  ),
  cta: z
    .object({
      metadata: z.object({
        tags: z.array(z.unknown()),
        concepts: z.array(z.unknown()),
      }),
      sys: z.object({
        space: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('Space'),
            id: z.string(),
          }),
        }),
        id: z.string(),
        type: z.literal('Entry'),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().optional(),
        revision: z.number(),
        locale: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('ContentType'),
            id: z.string(),
          }),
        }),
      }),
      fields: z.record(z.string(), z.unknown()),
    })
    .optional(),
});

export const carouselRecipeSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('carouselRecipe'),
      }),
    }),
  }),
  fields: carouselRecipeFieldsSchema,
});

export type carouselRecipe = z.infer<typeof carouselRecipeSchema>;

// Schema for categoryFaq
export const categoryFaqFieldsSchema = z.object({
  faqCategoryName: z.string(),
  parentCategory: z
    .object({
      metadata: z.object({
        tags: z.array(z.unknown()),
        concepts: z.array(z.unknown()),
      }),
      sys: z.object({
        space: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('Space'),
            id: z.string(),
          }),
        }),
        id: z.string(),
        type: z.literal('Entry'),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().optional(),
        revision: z.number(),
        locale: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('ContentType'),
            id: z.string(),
          }),
        }),
      }),
      fields: z.record(z.string(), z.unknown()),
    })
    .optional(),
});

export const categoryFaqSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('categoryFaq'),
      }),
    }),
  }),
  fields: categoryFaqFieldsSchema,
});

export type categoryFaq = z.infer<typeof categoryFaqSchema>;

// Schema for categoryProduct
export const categoryProductFieldsSchema = z.object({
  productCategoryName: z.string(),
  productParentCategoryName: z
    .object({
      metadata: z.object({
        tags: z.array(z.unknown()),
        concepts: z.array(z.unknown()),
      }),
      sys: z.object({
        space: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('Space'),
            id: z.string(),
          }),
        }),
        id: z.string(),
        type: z.literal('Entry'),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().optional(),
        revision: z.number(),
        locale: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('ContentType'),
            id: z.string(),
          }),
        }),
      }),
      fields: z.record(z.string(), z.unknown()),
    })
    .optional(),
  categoryDescription: z.string().optional(),
  categoryPencilBanner: z
    .object({
      metadata: z.object({
        tags: z.array(z.unknown()),
        concepts: z.array(z.unknown()),
      }),
      sys: z.object({
        space: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('Space'),
            id: z.string(),
          }),
        }),
        id: z.string(),
        type: z.literal('Asset'),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().optional(),
        revision: z.number(),
        locale: z.string().optional(),
        contentType: z.undefined().optional(),
      }),
      fields: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .optional(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .optional(),
  categoryThumbnailImage: z.object({
    metadata: z.object({
      tags: z.array(z.unknown()),
      concepts: z.array(z.unknown()),
    }),
    sys: z.object({
      space: z.object({
        sys: z.object({
          type: z.literal('Link'),
          linkType: z.literal('Space'),
          id: z.string(),
        }),
      }),
      id: z.string(),
      type: z.literal('Asset'),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
      environment: z.object({
        sys: z.object({
          id: z.string(),
          type: z.literal('Link'),
          linkType: z.literal('Environment'),
        }),
      }),
      publishedVersion: z.number().optional(),
      revision: z.number(),
      locale: z.string().optional(),
      contentType: z.undefined().optional(),
    }),
    fields: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      file: z.object({
        url: z.string(),
        details: z.object({
          size: z.number(),
          image: z
            .object({
              width: z.number(),
              height: z.number(),
            })
            .optional(),
        }),
        fileName: z.string(),
        contentType: z.string(),
      }),
    }),
  }),
  categoryLifestyleImage: z
    .object({
      metadata: z.object({
        tags: z.array(z.unknown()),
        concepts: z.array(z.unknown()),
      }),
      sys: z.object({
        space: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('Space'),
            id: z.string(),
          }),
        }),
        id: z.string(),
        type: z.literal('Asset'),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().optional(),
        revision: z.number(),
        locale: z.string().optional(),
        contentType: z.undefined().optional(),
      }),
      fields: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .optional(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .optional(),
  categoryLink: z.string().optional(),
  categoryCallToActionLabel: z.string().optional(),
  mainProduct: z.string().optional(),
});

export const categoryProductSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('categoryProduct'),
      }),
    }),
  }),
  fields: categoryProductFieldsSchema,
});

export type categoryProduct = z.infer<typeof categoryProductSchema>;

// Schema for carouselProduct
export const carouselProductFieldsSchema = z.object({
  internalName: z.string(),
  carouselTitle: z.string(),
  subtitle: z.string().optional(),
  products: z.array(
    z.object({
      metadata: z.object({
        tags: z.array(z.unknown()),
        concepts: z.array(z.unknown()),
      }),
      sys: z.object({
        space: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('Space'),
            id: z.string(),
          }),
        }),
        id: z.string(),
        type: z.literal('Entry'),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().optional(),
        revision: z.number(),
        locale: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('ContentType'),
            id: z.string(),
          }),
        }),
      }),
      fields: z.record(z.string(), z.unknown()),
    }),
  ),
});

export const carouselProductSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('carouselProduct'),
      }),
    }),
  }),
  fields: carouselProductFieldsSchema,
});

export type carouselProduct = z.infer<typeof carouselProductSchema>;

// Schema for recipe
export const recipeFieldsSchema = z.object({
  recipeName: z.string(),
  metaTitle: z.string(),
  metaDescription: z.string(),
  pageSlug: z.string(),
  shortDescription: z.string().optional(),
  mealTypeCategory: z.array(z.string()).optional(),
  occasionCategory: z.array(z.string()).optional(),
  ingredientsCategory: z.array(z.string()).optional(),
  applianceTypeCategory: z.array(z.string()).optional(),
  author: z
    .object({
      metadata: z.object({
        tags: z.array(z.unknown()),
        concepts: z.array(z.unknown()),
      }),
      sys: z.object({
        space: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('Space'),
            id: z.string(),
          }),
        }),
        id: z.string(),
        type: z.literal('Entry'),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().optional(),
        revision: z.number(),
        locale: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('ContentType'),
            id: z.string(),
          }),
        }),
      }),
      fields: z.record(z.string(), z.unknown()),
    })
    .optional(),
  cookTime: z.string().optional(),
  numberOfIngredients: z.string().optional(),
  numberOfServings: z.string().optional(),
  ingredientsLists: z
    .array(
      z.object({
        metadata: z.object({
          tags: z.array(z.unknown()),
          concepts: z.array(z.unknown()),
        }),
        sys: z.object({
          space: z.object({
            sys: z.object({
              type: z.literal('Link'),
              linkType: z.literal('Space'),
              id: z.string(),
            }),
          }),
          id: z.string(),
          type: z.literal('Entry'),
          createdAt: z.string().datetime(),
          updatedAt: z.string().datetime(),
          environment: z.object({
            sys: z.object({
              id: z.string(),
              type: z.literal('Link'),
              linkType: z.literal('Environment'),
            }),
          }),
          publishedVersion: z.number().optional(),
          revision: z.number(),
          locale: z.string().optional(),
          contentType: z.object({
            sys: z.object({
              type: z.literal('Link'),
              linkType: z.literal('ContentType'),
              id: z.string(),
            }),
          }),
        }),
        fields: z.record(z.string(), z.unknown()),
      }),
    )
    .optional(),
  recipeDirections: z
    .object({
      nodeType: z.literal(BLOCKS.DOCUMENT),
      data: z.record(z.string(), z.unknown()),
      content: z.array(RichTextNodeSchema),
    })
    .optional(),
  testKitchenTips: z
    .object({
      nodeType: z.literal(BLOCKS.DOCUMENT),
      data: z.record(z.string(), z.unknown()),
      content: z.array(RichTextNodeSchema),
    })
    .optional(),
  featuredImage: z.object({
    metadata: z.object({
      tags: z.array(z.unknown()),
      concepts: z.array(z.unknown()),
    }),
    sys: z.object({
      space: z.object({
        sys: z.object({
          type: z.literal('Link'),
          linkType: z.literal('Space'),
          id: z.string(),
        }),
      }),
      id: z.string(),
      type: z.literal('Asset'),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
      environment: z.object({
        sys: z.object({
          id: z.string(),
          type: z.literal('Link'),
          linkType: z.literal('Environment'),
        }),
      }),
      publishedVersion: z.number().optional(),
      revision: z.number(),
      locale: z.string().optional(),
      contentType: z.undefined().optional(),
    }),
    fields: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      file: z.object({
        url: z.string(),
        details: z.object({
          size: z.number(),
          image: z
            .object({
              width: z.number(),
              height: z.number(),
            })
            .optional(),
        }),
        fileName: z.string(),
        contentType: z.string(),
      }),
    }),
  }),
  additionalImages: z
    .array(
      z.object({
        metadata: z.object({
          tags: z.array(z.unknown()),
          concepts: z.array(z.unknown()),
        }),
        sys: z.object({
          space: z.object({
            sys: z.object({
              type: z.literal('Link'),
              linkType: z.literal('Space'),
              id: z.string(),
            }),
          }),
          id: z.string(),
          type: z.literal('Asset'),
          createdAt: z.string().datetime(),
          updatedAt: z.string().datetime(),
          environment: z.object({
            sys: z.object({
              id: z.string(),
              type: z.literal('Link'),
              linkType: z.literal('Environment'),
            }),
          }),
          publishedVersion: z.number().optional(),
          revision: z.number(),
          locale: z.string().optional(),
          contentType: z.undefined().optional(),
        }),
        fields: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          file: z.object({
            url: z.string(),
            details: z.object({
              size: z.number(),
              image: z
                .object({
                  width: z.number(),
                  height: z.number(),
                })
                .optional(),
            }),
            fileName: z.string(),
            contentType: z.string(),
          }),
        }),
      }),
    )
    .optional(),
  videoFeature: z
    .object({
      metadata: z.object({
        tags: z.array(z.unknown()),
        concepts: z.array(z.unknown()),
      }),
      sys: z.object({
        space: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('Space'),
            id: z.string(),
          }),
        }),
        id: z.string(),
        type: z.literal('Entry'),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().optional(),
        revision: z.number(),
        locale: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('ContentType'),
            id: z.string(),
          }),
        }),
      }),
      fields: z.record(z.string(), z.unknown()),
    })
    .optional(),
  productCarousel: z
    .object({
      metadata: z.object({
        tags: z.array(z.unknown()),
        concepts: z.array(z.unknown()),
      }),
      sys: z.object({
        space: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('Space'),
            id: z.string(),
          }),
        }),
        id: z.string(),
        type: z.literal('Entry'),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().optional(),
        revision: z.number(),
        locale: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('ContentType'),
            id: z.string(),
          }),
        }),
      }),
      fields: z.record(z.string(), z.unknown()),
    })
    .optional(),
  recipeCarousel: z
    .object({
      metadata: z.object({
        tags: z.array(z.unknown()),
        concepts: z.array(z.unknown()),
      }),
      sys: z.object({
        space: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('Space'),
            id: z.string(),
          }),
        }),
        id: z.string(),
        type: z.literal('Entry'),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().optional(),
        revision: z.number(),
        locale: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('ContentType'),
            id: z.string(),
          }),
        }),
      }),
      fields: z.record(z.string(), z.unknown()),
    })
    .optional(),
});

export const recipeSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('recipe'),
      }),
    }),
  }),
  fields: recipeFieldsSchema,
});

export type recipe = z.infer<typeof recipeSchema>;

// Schema for productPartsAndAccessories
export const productPartsAndAccessoriesFieldsSchema = z.object({
  productName: z.string(),
  bcProductReference: z.string(),
  pageSlug: z.string(),
  associatedFinishedGoods: z
    .array(
      z.object({
        metadata: z.object({
          tags: z.array(z.unknown()),
          concepts: z.array(z.unknown()),
        }),
        sys: z.object({
          space: z.object({
            sys: z.object({
              type: z.literal('Link'),
              linkType: z.literal('Space'),
              id: z.string(),
            }),
          }),
          id: z.string(),
          type: z.literal('Entry'),
          createdAt: z.string().datetime(),
          updatedAt: z.string().datetime(),
          environment: z.object({
            sys: z.object({
              id: z.string(),
              type: z.literal('Link'),
              linkType: z.literal('Environment'),
            }),
          }),
          publishedVersion: z.number().optional(),
          revision: z.number(),
          locale: z.string().optional(),
          contentType: z.object({
            sys: z.object({
              type: z.literal('Link'),
              linkType: z.literal('ContentType'),
              id: z.string(),
            }),
          }),
        }),
        fields: z.record(z.string(), z.unknown()),
      }),
    )
    .optional(),
  relatedPartsAndAccessories: z
    .array(
      z.object({
        metadata: z.object({
          tags: z.array(z.unknown()),
          concepts: z.array(z.unknown()),
        }),
        sys: z.object({
          space: z.object({
            sys: z.object({
              type: z.literal('Link'),
              linkType: z.literal('Space'),
              id: z.string(),
            }),
          }),
          id: z.string(),
          type: z.literal('Entry'),
          createdAt: z.string().datetime(),
          updatedAt: z.string().datetime(),
          environment: z.object({
            sys: z.object({
              id: z.string(),
              type: z.literal('Link'),
              linkType: z.literal('Environment'),
            }),
          }),
          publishedVersion: z.number().optional(),
          revision: z.number(),
          locale: z.string().optional(),
          contentType: z.object({
            sys: z.object({
              type: z.literal('Link'),
              linkType: z.literal('ContentType'),
              id: z.string(),
            }),
          }),
        }),
        fields: z.record(z.string(), z.unknown()),
      }),
    )
    .optional(),
  subCategory: z.array(z.string()).optional(),
  productLine: z.array(z.string()).optional(),
  feature: z.array(z.string()).optional(),
  size: z.array(z.string()).optional(),
  finish: z.array(z.string()).optional(),
  featuredImage: z.object({
    metadata: z.object({
      tags: z.array(z.unknown()),
      concepts: z.array(z.unknown()),
    }),
    sys: z.object({
      space: z.object({
        sys: z.object({
          type: z.literal('Link'),
          linkType: z.literal('Space'),
          id: z.string(),
        }),
      }),
      id: z.string(),
      type: z.literal('Asset'),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
      environment: z.object({
        sys: z.object({
          id: z.string(),
          type: z.literal('Link'),
          linkType: z.literal('Environment'),
        }),
      }),
      publishedVersion: z.number().optional(),
      revision: z.number(),
      locale: z.string().optional(),
      contentType: z.undefined().optional(),
    }),
    fields: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      file: z.object({
        url: z.string(),
        details: z.object({
          size: z.number(),
          image: z
            .object({
              width: z.number(),
              height: z.number(),
            })
            .optional(),
        }),
        fileName: z.string(),
        contentType: z.string(),
      }),
    }),
  }),
  additionalImages: z
    .array(
      z.object({
        metadata: z.object({
          tags: z.array(z.unknown()),
          concepts: z.array(z.unknown()),
        }),
        sys: z.object({
          space: z.object({
            sys: z.object({
              type: z.literal('Link'),
              linkType: z.literal('Space'),
              id: z.string(),
            }),
          }),
          id: z.string(),
          type: z.literal('Asset'),
          createdAt: z.string().datetime(),
          updatedAt: z.string().datetime(),
          environment: z.object({
            sys: z.object({
              id: z.string(),
              type: z.literal('Link'),
              linkType: z.literal('Environment'),
            }),
          }),
          publishedVersion: z.number().optional(),
          revision: z.number(),
          locale: z.string().optional(),
          contentType: z.undefined().optional(),
        }),
        fields: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          file: z.object({
            url: z.string(),
            details: z.object({
              size: z.number(),
              image: z
                .object({
                  width: z.number(),
                  height: z.number(),
                })
                .optional(),
            }),
            fileName: z.string(),
            contentType: z.string(),
          }),
        }),
      }),
    )
    .optional(),
  productCarousel: z
    .object({
      metadata: z.object({
        tags: z.array(z.unknown()),
        concepts: z.array(z.unknown()),
      }),
      sys: z.object({
        space: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('Space'),
            id: z.string(),
          }),
        }),
        id: z.string(),
        type: z.literal('Entry'),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().optional(),
        revision: z.number(),
        locale: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('ContentType'),
            id: z.string(),
          }),
        }),
      }),
      fields: z.record(z.string(), z.unknown()),
    })
    .optional(),
  metaTitle: z.string(),
  metaDescription: z.string().optional(),
  parentCategory: z.record(z.string(), z.unknown()).optional(),
  productFormulationInformation: z.record(z.string(), z.unknown()).optional(),
  details: z
    .object({
      nodeType: z.literal(BLOCKS.DOCUMENT),
      data: z.record(z.string(), z.unknown()),
      content: z.array(RichTextNodeSchema),
    })
    .optional(),
  factoryRecertifiedProduct: z.boolean(),
  modelNumber: z.string().optional(),
  outOfBoxNetWeight: z.string().optional(),
  outOfBoxDepth: z.string().optional(),
  outOfBoxWidth: z.string().optional(),
  outOfBoxHeight: z.string().optional(),
  outOfBoxUnitVolume: z.string().optional(),
  outOfBoxSizeUom: z.string().optional(),
  outOfBoxWeightUom: z.string().optional(),
  archived: z.boolean().optional(),
  price: z.string().optional(),
  couponCodesalesDates: z.string().optional(),
  salePrice: z.string().optional(),
  productBadge: z.string().optional(),
  isShipsFree: z.boolean().optional(),
  inventoryQuantity: z.number().int().optional(),
  pageContentEntries: z
    .array(
      z.object({
        metadata: z.object({
          tags: z.array(z.unknown()),
          concepts: z.array(z.unknown()),
        }),
        sys: z.object({
          space: z.object({
            sys: z.object({
              type: z.literal('Link'),
              linkType: z.literal('Space'),
              id: z.string(),
            }),
          }),
          id: z.string(),
          type: z.literal('Entry'),
          createdAt: z.string().datetime(),
          updatedAt: z.string().datetime(),
          environment: z.object({
            sys: z.object({
              id: z.string(),
              type: z.literal('Link'),
              linkType: z.literal('Environment'),
            }),
          }),
          publishedVersion: z.number().optional(),
          revision: z.number(),
          locale: z.string().optional(),
          contentType: z.object({
            sys: z.object({
              type: z.literal('Link'),
              linkType: z.literal('ContentType'),
              id: z.string(),
            }),
          }),
        }),
        fields: z.record(z.string(), z.unknown()),
      }),
    )
    .optional(),
});

export const productPartsAndAccessoriesSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('productPartsAndAccessories'),
      }),
    }),
  }),
  fields: productPartsAndAccessoriesFieldsSchema,
});

export type productPartsAndAccessories = z.infer<typeof productPartsAndAccessoriesSchema>;

// Schema for ingredientsList
export const ingredientsListFieldsSchema = z.object({
  ingredientsListName: z.string(),
  sectionTitle: z.string().optional(),
  listOfIngredients: z.array(z.string()).optional(),
});

export const ingredientsListSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('ingredientsList'),
      }),
    }),
  }),
  fields: ingredientsListFieldsSchema,
});

export type ingredientsList = z.infer<typeof ingredientsListSchema>;

// Schema for author
export const authorFieldsSchema = z.object({
  authorName: z.string(),
  authorImage: z
    .object({
      metadata: z.object({
        tags: z.array(z.unknown()),
        concepts: z.array(z.unknown()),
      }),
      sys: z.object({
        space: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('Space'),
            id: z.string(),
          }),
        }),
        id: z.string(),
        type: z.literal('Asset'),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().optional(),
        revision: z.number(),
        locale: z.string().optional(),
        contentType: z.undefined().optional(),
      }),
      fields: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .optional(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .optional(),
});

export const authorSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('author'),
      }),
    }),
  }),
  fields: authorFieldsSchema,
});

export type author = z.infer<typeof authorSchema>;

// Schema for supportDocument
export const supportDocumentFieldsSchema = z.object({
  documentName: z.string(),
  productImage: z
    .object({
      metadata: z.object({
        tags: z.array(z.unknown()),
        concepts: z.array(z.unknown()),
      }),
      sys: z.object({
        space: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('Space'),
            id: z.string(),
          }),
        }),
        id: z.string(),
        type: z.literal('Asset'),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().optional(),
        revision: z.number(),
        locale: z.string().optional(),
        contentType: z.undefined().optional(),
      }),
      fields: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .optional(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .optional(),
  documentType: z.string().optional(),
  url: z.string(),
  modelNumber: z.string().optional(),
});

export const supportDocumentSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('supportDocument'),
      }),
    }),
  }),
  fields: supportDocumentFieldsSchema,
});

export type supportDocument = z.infer<typeof supportDocumentSchema>;

// Schema for pageStandard
export const pageStandardFieldsSchema = z.object({
  pageName: z.string(),
  metaTitleSeo: z.string(),
  metaDescription: z.string().optional(),
  metaKeywordsSeo: z.string().optional(),
  pageSlug: z.string(),
  optionalPageDescription: z
    .object({
      nodeType: z.literal(BLOCKS.DOCUMENT),
      data: z.record(z.string(), z.unknown()),
      content: z.array(RichTextNodeSchema),
    })
    .optional(),
  pageContent: z
    .array(
      z.object({
        metadata: z.object({
          tags: z.array(z.unknown()),
          concepts: z.array(z.unknown()),
        }),
        sys: z.object({
          space: z.object({
            sys: z.object({
              type: z.literal('Link'),
              linkType: z.literal('Space'),
              id: z.string(),
            }),
          }),
          id: z.string(),
          type: z.literal('Entry'),
          createdAt: z.string().datetime(),
          updatedAt: z.string().datetime(),
          environment: z.object({
            sys: z.object({
              id: z.string(),
              type: z.literal('Link'),
              linkType: z.literal('Environment'),
            }),
          }),
          publishedVersion: z.number().optional(),
          revision: z.number(),
          locale: z.string().optional(),
          contentType: z.object({
            sys: z.object({
              type: z.literal('Link'),
              linkType: z.literal('ContentType'),
              id: z.string(),
            }),
          }),
        }),
        fields: z.record(z.string(), z.unknown()),
      }),
    )
    .optional(),
});

export const pageStandardSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('pageStandard'),
      }),
    }),
  }),
  fields: pageStandardFieldsSchema,
});

export type pageStandard = z.infer<typeof pageStandardSchema>;

// Schema for megaMenu
export const megaMenuFieldsSchema = z.object({
  menuName: z.string(),
  menuReference: z.array(
    z.object({
      metadata: z.object({
        tags: z.array(z.unknown()),
        concepts: z.array(z.unknown()),
      }),
      sys: z.object({
        space: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('Space'),
            id: z.string(),
          }),
        }),
        id: z.string(),
        type: z.literal('Entry'),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().optional(),
        revision: z.number(),
        locale: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('ContentType'),
            id: z.string(),
          }),
        }),
      }),
      fields: z.record(z.string(), z.unknown()),
    }),
  ),
});

export const megaMenuSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('megaMenu'),
      }),
    }),
  }),
  fields: megaMenuFieldsSchema,
});

export type megaMenu = z.infer<typeof megaMenuSchema>;

// Schema for carouselProductSimple
export const carouselProductSimpleFieldsSchema = z.object({
  internalName: z.string(),
  carouselTitle: z.string(),
  productReference: z.array(
    z.object({
      metadata: z.object({
        tags: z.array(z.unknown()),
        concepts: z.array(z.unknown()),
      }),
      sys: z.object({
        space: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('Space'),
            id: z.string(),
          }),
        }),
        id: z.string(),
        type: z.literal('Entry'),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().optional(),
        revision: z.number(),
        locale: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('ContentType'),
            id: z.string(),
          }),
        }),
      }),
      fields: z.record(z.string(), z.unknown()),
    }),
  ),
});

export const carouselProductSimpleSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('carouselProductSimple'),
      }),
    }),
  }),
  fields: carouselProductSimpleFieldsSchema,
});

export type carouselProductSimple = z.infer<typeof carouselProductSimpleSchema>;

// Schema for faqList
export const faqListFieldsSchema = z.object({
  faqParentCategory: z.string(),
  faqReference: z.array(
    z.object({
      metadata: z.object({
        tags: z.array(z.unknown()),
        concepts: z.array(z.unknown()),
      }),
      sys: z.object({
        space: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('Space'),
            id: z.string(),
          }),
        }),
        id: z.string(),
        type: z.literal('Entry'),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().optional(),
        revision: z.number(),
        locale: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('ContentType'),
            id: z.string(),
          }),
        }),
      }),
      fields: z.record(z.string(), z.unknown()),
    }),
  ),
});

export const faqListSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('faqList'),
      }),
    }),
  }),
  fields: faqListFieldsSchema,
});

export type faqList = z.infer<typeof faqListSchema>;

// Schema for blockProductFeatures
export const blockProductFeaturesFieldsSchema = z.object({
  heading: z.string(),
});

export const blockProductFeaturesSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('blockProductFeatures'),
      }),
    }),
  }),
  fields: blockProductFeaturesFieldsSchema,
});

export type blockProductFeatures = z.infer<typeof blockProductFeaturesSchema>;

// Schema for blockProductFeaturesAccordion
export const blockProductFeaturesAccordionFieldsSchema = z.object({
  heading: z.string(),
});

export const blockProductFeaturesAccordionSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('blockProductFeaturesAccordion'),
      }),
    }),
  }),
  fields: blockProductFeaturesAccordionFieldsSchema,
});

export type blockProductFeaturesAccordion = z.infer<typeof blockProductFeaturesAccordionSchema>;

// Schema for cta
export const ctaFieldsSchema = z.object({
  text: z.string(),
  internalReference: z
    .object({
      metadata: z.object({
        tags: z.array(z.unknown()),
        concepts: z.array(z.unknown()),
      }),
      sys: z.object({
        space: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('Space'),
            id: z.string(),
          }),
        }),
        id: z.string(),
        type: z.literal('Entry'),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().optional(),
        revision: z.number(),
        locale: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('ContentType'),
            id: z.string(),
          }),
        }),
      }),
      fields: z.record(z.string(), z.unknown()),
    })
    .optional(),
  externalLink: z.string().optional(),
});

export const ctaSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('cta'),
      }),
    }),
  }),
  fields: ctaFieldsSchema,
});

export type cta = z.infer<typeof ctaSchema>;

// Schema for inspirationBento
export const inspirationBentoFieldsSchema = z.object({
  heading: z.string().optional(),
  cta: z
    .object({
      metadata: z.object({
        tags: z.array(z.unknown()),
        concepts: z.array(z.unknown()),
      }),
      sys: z.object({
        space: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('Space'),
            id: z.string(),
          }),
        }),
        id: z.string(),
        type: z.literal('Entry'),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().optional(),
        revision: z.number(),
        locale: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('ContentType'),
            id: z.string(),
          }),
        }),
      }),
      fields: z.record(z.string(), z.unknown()),
    })
    .optional(),
  video: z.string().optional(),
  inspirationCards: z
    .array(
      z.object({
        metadata: z.object({
          tags: z.array(z.unknown()),
          concepts: z.array(z.unknown()),
        }),
        sys: z.object({
          space: z.object({
            sys: z.object({
              type: z.literal('Link'),
              linkType: z.literal('Space'),
              id: z.string(),
            }),
          }),
          id: z.string(),
          type: z.literal('Entry'),
          createdAt: z.string().datetime(),
          updatedAt: z.string().datetime(),
          environment: z.object({
            sys: z.object({
              id: z.string(),
              type: z.literal('Link'),
              linkType: z.literal('Environment'),
            }),
          }),
          publishedVersion: z.number().optional(),
          revision: z.number(),
          locale: z.string().optional(),
          contentType: z.object({
            sys: z.object({
              type: z.literal('Link'),
              linkType: z.literal('ContentType'),
              id: z.string(),
            }),
          }),
        }),
        fields: z.record(z.string(), z.unknown()),
      }),
    )
    .optional(),
});

export const inspirationBentoSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('inspirationBento'),
      }),
    }),
  }),
  fields: inspirationBentoFieldsSchema,
});

export type inspirationBento = z.infer<typeof inspirationBentoSchema>;

// Schema for inspirationCard
export const inspirationCardFieldsSchema = z.object({
  title: z.string(),
  contentReference: z.object({
    metadata: z.object({
      tags: z.array(z.unknown()),
      concepts: z.array(z.unknown()),
    }),
    sys: z.object({
      space: z.object({
        sys: z.object({
          type: z.literal('Link'),
          linkType: z.literal('Space'),
          id: z.string(),
        }),
      }),
      id: z.string(),
      type: z.literal('Entry'),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
      environment: z.object({
        sys: z.object({
          id: z.string(),
          type: z.literal('Link'),
          linkType: z.literal('Environment'),
        }),
      }),
      publishedVersion: z.number().optional(),
      revision: z.number(),
      locale: z.string().optional(),
      contentType: z.object({
        sys: z.object({
          type: z.literal('Link'),
          linkType: z.literal('ContentType'),
          id: z.string(),
        }),
      }),
    }),
    fields: z.record(z.string(), z.unknown()),
  }),
});

export const inspirationCardSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('inspirationCard'),
      }),
    }),
  }),
  fields: inspirationCardFieldsSchema,
});

export type inspirationCard = z.infer<typeof inspirationCardSchema>;

// Schema for tutorial
export const tutorialFieldsSchema = z.object({
  title: z.string(),
});

export const tutorialSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('tutorial'),
      }),
    }),
  }),
  fields: tutorialFieldsSchema,
});

export type tutorial = z.infer<typeof tutorialSchema>;

// Schema for heroCarousel
export const heroCarouselFieldsSchema = z.object({
  heroSlides: z
    .array(
      z.object({
        metadata: z.object({
          tags: z.array(z.unknown()),
          concepts: z.array(z.unknown()),
        }),
        sys: z.object({
          space: z.object({
            sys: z.object({
              type: z.literal('Link'),
              linkType: z.literal('Space'),
              id: z.string(),
            }),
          }),
          id: z.string(),
          type: z.literal('Entry'),
          createdAt: z.string().datetime(),
          updatedAt: z.string().datetime(),
          environment: z.object({
            sys: z.object({
              id: z.string(),
              type: z.literal('Link'),
              linkType: z.literal('Environment'),
            }),
          }),
          publishedVersion: z.number().optional(),
          revision: z.number(),
          locale: z.string().optional(),
          contentType: z.object({
            sys: z.object({
              type: z.literal('Link'),
              linkType: z.literal('ContentType'),
              id: z.string(),
            }),
          }),
        }),
        fields: z.record(z.string(), z.unknown()),
      }),
    )
    .optional(),
});

export const heroCarouselSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('heroCarousel'),
      }),
    }),
  }),
  fields: heroCarouselFieldsSchema,
});

export type heroCarousel = z.infer<typeof heroCarouselSchema>;

// Schema for heroSlide
export const heroSlideFieldsSchema = z.object({
  image: z
    .object({
      metadata: z.object({
        tags: z.array(z.unknown()),
        concepts: z.array(z.unknown()),
      }),
      sys: z.object({
        space: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('Space'),
            id: z.string(),
          }),
        }),
        id: z.string(),
        type: z.literal('Asset'),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().optional(),
        revision: z.number(),
        locale: z.string().optional(),
        contentType: z.undefined().optional(),
      }),
      fields: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .optional(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .optional(),
  headline: z.string(),
  subhead: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaLink: z
    .object({
      metadata: z.object({
        tags: z.array(z.unknown()),
        concepts: z.array(z.unknown()),
      }),
      sys: z.object({
        space: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('Space'),
            id: z.string(),
          }),
        }),
        id: z.string(),
        type: z.literal('Entry'),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().optional(),
        revision: z.number(),
        locale: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('ContentType'),
            id: z.string(),
          }),
        }),
      }),
      fields: z.record(z.string(), z.unknown()),
    })
    .optional(),
});

export const heroSlideSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('heroSlide'),
      }),
    }),
  }),
  fields: heroSlideFieldsSchema,
});

export type heroSlide = z.infer<typeof heroSlideSchema>;

// Schema for featureVideoBanner
export const featureVideoBannerFieldsSchema = z.object({
  internalName: z.string(),
  sectionTitle: z.string().optional(),
  subTitle: z.string().optional(),
  descriptiveBodyCopy: z.string().optional(),
  video: z.object({
    metadata: z.object({
      tags: z.array(z.unknown()),
      concepts: z.array(z.unknown()),
    }),
    sys: z.object({
      space: z.object({
        sys: z.object({
          type: z.literal('Link'),
          linkType: z.literal('Space'),
          id: z.string(),
        }),
      }),
      id: z.string(),
      type: z.literal('Asset'),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
      environment: z.object({
        sys: z.object({
          id: z.string(),
          type: z.literal('Link'),
          linkType: z.literal('Environment'),
        }),
      }),
      publishedVersion: z.number().optional(),
      revision: z.number(),
      locale: z.string().optional(),
      contentType: z.undefined().optional(),
    }),
    fields: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      file: z.object({
        url: z.string(),
        details: z.object({
          size: z.number(),
          image: z
            .object({
              width: z.number(),
              height: z.number(),
            })
            .optional(),
        }),
        fileName: z.string(),
        contentType: z.string(),
      }),
    }),
  }),
  registrationCookieMessage: z.string().optional(),
});

export const featureVideoBannerSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('featureVideoBanner'),
      }),
    }),
  }),
  fields: featureVideoBannerFieldsSchema,
});

export type featureVideoBanner = z.infer<typeof featureVideoBannerSchema>;

// Schema for newsletterForm
export const newsletterFormFieldsSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  inputPlaceholder: z.string().optional(),
});

export const newsletterFormSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('newsletterForm'),
      }),
    }),
  }),
  fields: newsletterFormFieldsSchema,
});

export type newsletterForm = z.infer<typeof newsletterFormSchema>;

// Schema for story
export const storyFieldsSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
});

export const storySchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('story'),
      }),
    }),
  }),
  fields: storyFieldsSchema,
});

export type story = z.infer<typeof storySchema>;

// Schema for postGrid
export const postGridFieldsSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  type: z.string(),
});

export const postGridSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('postGrid'),
      }),
    }),
  }),
  fields: postGridFieldsSchema,
});

export type postGrid = z.infer<typeof postGridSchema>;

// ========================================
// Union Schema and Helper Object
// ========================================

export const contentfulEntrySchemaUnion = z.union([
  productFinishedGoodsSchema,
  faqSchema,
  carouselRecipeSchema,
  categoryFaqSchema,
  categoryProductSchema,
  carouselProductSchema,
  recipeSchema,
  productPartsAndAccessoriesSchema,
  ingredientsListSchema,
  authorSchema,
  supportDocumentSchema,
  pageStandardSchema,
  megaMenuSchema,
  carouselProductSimpleSchema,
  faqListSchema,
  blockProductFeaturesSchema,
  blockProductFeaturesAccordionSchema,
  ctaSchema,
  inspirationBentoSchema,
  inspirationCardSchema,
  tutorialSchema,
  heroCarouselSchema,
  heroSlideSchema,
  featureVideoBannerSchema,
  newsletterFormSchema,
  storySchema,
  postGridSchema,
]);
export type ContentfulEntry = z.infer<typeof contentfulEntrySchemaUnion>;

export const genericEntrySchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema,
  fields: z.record(z.unknown()),
});
export type GenericEntry = z.infer<typeof genericEntrySchema>;

export const contentfulSchemas = {
  asset: assetSchema,
  productFinishedGoods: productFinishedGoodsSchema,
  faq: faqSchema,
  carouselRecipe: carouselRecipeSchema,
  categoryFaq: categoryFaqSchema,
  categoryProduct: categoryProductSchema,
  carouselProduct: carouselProductSchema,
  recipe: recipeSchema,
  productPartsAndAccessories: productPartsAndAccessoriesSchema,
  ingredientsList: ingredientsListSchema,
  author: authorSchema,
  supportDocument: supportDocumentSchema,
  pageStandard: pageStandardSchema,
  megaMenu: megaMenuSchema,
  carouselProductSimple: carouselProductSimpleSchema,
  faqList: faqListSchema,
  blockProductFeatures: blockProductFeaturesSchema,
  blockProductFeaturesAccordion: blockProductFeaturesAccordionSchema,
  cta: ctaSchema,
  inspirationBento: inspirationBentoSchema,
  inspirationCard: inspirationCardSchema,
  tutorial: tutorialSchema,
  heroCarousel: heroCarouselSchema,
  heroSlide: heroSlideSchema,
  featureVideoBanner: featureVideoBannerSchema,
  newsletterForm: newsletterFormSchema,
  story: storySchema,
  postGrid: postGridSchema,
};

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
  locale: z.string().optional().nullable(),
});

const sysEntrySchema = sysBaseSchema.extend({
  type: z.literal('Entry'),
  publishedVersion: z.number().optional().nullable(),
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
  publishedVersion: z.number().optional().nullable(),
});

const assetFieldsSchema = z.object({
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  file: z.object({
    url: z.string(),
    details: z.object({
      size: z.number(),
      image: z
        .object({
          width: z.number(),
          height: z.number(),
        })
        .optional()
        .nullable(),
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
      .optional()
      .nullable(),
    marks: z.array(z.any()).optional().nullable(), // Adjust marks as needed
    value: z.string().optional().nullable(),
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
  pageSlug: z.string().optional().nullable(),
  shortDescription: z.string().optional().nullable(),
  defaultPrice: z.string(),
  defaultPriceFloat: z.number().optional().nullable(),
  salePrice: z.string().optional().nullable(),
  salePriceFloat: z.number().optional().nullable(),
  couponCodesalesDates: z.string().optional().nullable(),
  details: z
    .object({
      nodeType: z.literal(BLOCKS.DOCUMENT),
      data: z.record(z.string(), z.unknown()),
      content: z.array(RichTextNodeSchema),
    })
    .optional()
    .nullable(),
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
          publishedVersion: z.number().optional().nullable(),
          revision: z.number(),
          locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
        contentType: z.undefined().optional().nullable(),
      }),
      fields: z.object({
        title: z.string().optional().nullable(),
        description: z.string().optional().nullable(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .optional()
              .nullable(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .optional()
    .nullable(),
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
          publishedVersion: z.number().optional().nullable(),
          revision: z.number(),
          locale: z.string().optional().nullable(),
          contentType: z.undefined().optional().nullable(),
        }),
        fields: z.object({
          title: z.string().optional().nullable(),
          description: z.string().optional().nullable(),
          file: z.object({
            url: z.string(),
            details: z.object({
              size: z.number(),
              image: z
                .object({
                  width: z.number(),
                  height: z.number(),
                })
                .optional()
                .nullable(),
            }),
            fileName: z.string(),
            contentType: z.string(),
          }),
        }),
      }),
    )
    .optional()
    .nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  productLine: z.array(z.string()).optional().nullable(),
  parentCategory: z.array(z.string()).optional().nullable(),
  subCategory: z.array(z.string()).optional().nullable(),
  webProductName: z.string().optional().nullable(),
  webProductNameDescriptor: z.string().optional().nullable(),
  webSubCategory: z.string().optional().nullable(),
  productFormulationInformation: z.record(z.string(), z.unknown()).optional().nullable(),
  feature: z.array(z.string()).optional().nullable(),
  finish: z.array(z.string()).optional().nullable(),
  size: z.string().optional().nullable(),
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
          publishedVersion: z.number().optional().nullable(),
          revision: z.number(),
          locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
  factoryRecertifiedProduct: z.boolean().optional().nullable(),
  modelNumber: z.string(),
  wattage: z.string().optional().nullable(),
  warranty: z.string().optional().nullable(),
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
  outOfBoxNetWeight: z.string().optional().nullable(),
  outOfBoxDepth: z.string().optional().nullable(),
  outOfBoxWidth: z.string().optional().nullable(),
  outOfBoxHeight: z.string().optional().nullable(),
  outOfBoxSizeUom: z.string().optional().nullable(),
  outOfBoxWeightUom: z.string().optional().nullable(),
  archive: z.boolean().optional().nullable(),
  productBadge: z.string().optional().nullable(),
  isShipsFree: z.boolean().optional().nullable(),
  inventoryQuantity: z.number().int().optional().nullable(),
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
          publishedVersion: z.number().optional().nullable(),
          revision: z.number(),
          locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
  isNew: z.boolean().optional().nullable(),
  featureCallout: z
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
  featureTiles: z
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
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
          publishedVersion: z.number().optional().nullable(),
          revision: z.number(),
          locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
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
  faqFilterCategory: z.string().optional().nullable(),
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
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

// Schema for carouselProduct
export const carouselProductFieldsSchema = z.object({
  internalName: z.string(),
  carouselTitle: z.string(),
  subtitle: z.string().optional().nullable(),
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
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
  shortDescription: z.string().optional().nullable(),
  mealTypeCategory: z.array(z.string()).optional().nullable(),
  occasionCategory: z.array(z.string()).optional().nullable(),
  ingredientsCategory: z.array(z.string()).optional().nullable(),
  applianceTypeCategory: z.array(z.string()).optional().nullable(),
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
  cookTime: z.string().optional().nullable(),
  numberOfIngredients: z.string().optional().nullable(),
  numberOfServings: z.string().optional().nullable(),
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
          publishedVersion: z.number().optional().nullable(),
          revision: z.number(),
          locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
  recipeDirections: z
    .object({
      nodeType: z.literal(BLOCKS.DOCUMENT),
      data: z.record(z.string(), z.unknown()),
      content: z.array(RichTextNodeSchema),
    })
    .optional()
    .nullable(),
  testKitchenTips: z
    .object({
      nodeType: z.literal(BLOCKS.DOCUMENT),
      data: z.record(z.string(), z.unknown()),
      content: z.array(RichTextNodeSchema),
    })
    .optional()
    .nullable(),
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
      publishedVersion: z.number().optional().nullable(),
      revision: z.number(),
      locale: z.string().optional().nullable(),
      contentType: z.undefined().optional().nullable(),
    }),
    fields: z.object({
      title: z.string().optional().nullable(),
      description: z.string().optional().nullable(),
      file: z.object({
        url: z.string(),
        details: z.object({
          size: z.number(),
          image: z
            .object({
              width: z.number(),
              height: z.number(),
            })
            .optional()
            .nullable(),
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
          publishedVersion: z.number().optional().nullable(),
          revision: z.number(),
          locale: z.string().optional().nullable(),
          contentType: z.undefined().optional().nullable(),
        }),
        fields: z.object({
          title: z.string().optional().nullable(),
          description: z.string().optional().nullable(),
          file: z.object({
            url: z.string(),
            details: z.object({
              size: z.number(),
              image: z
                .object({
                  width: z.number(),
                  height: z.number(),
                })
                .optional()
                .nullable(),
            }),
            fileName: z.string(),
            contentType: z.string(),
          }),
        }),
      }),
    )
    .optional()
    .nullable(),
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
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
          publishedVersion: z.number().optional().nullable(),
          revision: z.number(),
          locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
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
          publishedVersion: z.number().optional().nullable(),
          revision: z.number(),
          locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
  subCategory: z.array(z.string()).optional().nullable(),
  productLine: z.array(z.string()).optional().nullable(),
  feature: z.array(z.string()).optional().nullable(),
  size: z.array(z.string()).optional().nullable(),
  finish: z.array(z.string()).optional().nullable(),
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
      publishedVersion: z.number().optional().nullable(),
      revision: z.number(),
      locale: z.string().optional().nullable(),
      contentType: z.undefined().optional().nullable(),
    }),
    fields: z.object({
      title: z.string().optional().nullable(),
      description: z.string().optional().nullable(),
      file: z.object({
        url: z.string(),
        details: z.object({
          size: z.number(),
          image: z
            .object({
              width: z.number(),
              height: z.number(),
            })
            .optional()
            .nullable(),
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
          publishedVersion: z.number().optional().nullable(),
          revision: z.number(),
          locale: z.string().optional().nullable(),
          contentType: z.undefined().optional().nullable(),
        }),
        fields: z.object({
          title: z.string().optional().nullable(),
          description: z.string().optional().nullable(),
          file: z.object({
            url: z.string(),
            details: z.object({
              size: z.number(),
              image: z
                .object({
                  width: z.number(),
                  height: z.number(),
                })
                .optional()
                .nullable(),
            }),
            fileName: z.string(),
            contentType: z.string(),
          }),
        }),
      }),
    )
    .optional()
    .nullable(),
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
  metaTitle: z.string(),
  metaDescription: z.string().optional().nullable(),
  parentCategory: z.record(z.string(), z.unknown()).optional().nullable(),
  productFormulationInformation: z.record(z.string(), z.unknown()).optional().nullable(),
  details: z
    .object({
      nodeType: z.literal(BLOCKS.DOCUMENT),
      data: z.record(z.string(), z.unknown()),
      content: z.array(RichTextNodeSchema),
    })
    .optional()
    .nullable(),
  factoryRecertifiedProduct: z.boolean(),
  modelNumber: z.string().optional().nullable(),
  outOfBoxNetWeight: z.string().optional().nullable(),
  outOfBoxDepth: z.string().optional().nullable(),
  outOfBoxWidth: z.string().optional().nullable(),
  outOfBoxHeight: z.string().optional().nullable(),
  outOfBoxUnitVolume: z.string().optional().nullable(),
  outOfBoxSizeUom: z.string().optional().nullable(),
  outOfBoxWeightUom: z.string().optional().nullable(),
  archived: z.boolean().optional().nullable(),
  price: z.string().optional().nullable(),
  priceFloat: z.number().optional().nullable(),
  couponCodesalesDates: z.string().optional().nullable(),
  salePrice: z.string().optional().nullable(),
  salePriceFloat: z.number().optional().nullable(),
  productBadge: z.string().optional().nullable(),
  isShipsFree: z.boolean().optional().nullable(),
  inventoryQuantity: z.number().int().optional().nullable(),
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
          publishedVersion: z.number().optional().nullable(),
          revision: z.number(),
          locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
  isNew: z.boolean().optional().nullable(),
  webProductName: z.string().optional().nullable(),
  webProductNameDescriptor: z.string().optional().nullable(),
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
  sectionTitle: z.string().optional().nullable(),
  listOfIngredients: z.array(z.string()).optional().nullable(),
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
        contentType: z.undefined().optional().nullable(),
      }),
      fields: z.object({
        title: z.string().optional().nullable(),
        description: z.string().optional().nullable(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .optional()
              .nullable(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .optional()
    .nullable(),
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
        contentType: z.undefined().optional().nullable(),
      }),
      fields: z.object({
        title: z.string().optional().nullable(),
        description: z.string().optional().nullable(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .optional()
              .nullable(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .optional()
    .nullable(),
  documentType: z.string().optional().nullable(),
  url: z.string(),
  modelNumber: z.string().optional().nullable(),
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
  metaDescription: z.string().optional().nullable(),
  metaKeywordsSeo: z.string().optional().nullable(),
  pageSlug: z.string(),
  optionalPageDescription: z
    .object({
      nodeType: z.literal(BLOCKS.DOCUMENT),
      data: z.record(z.string(), z.unknown()),
      content: z.array(RichTextNodeSchema),
    })
    .optional()
    .nullable(),
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
          publishedVersion: z.number().optional().nullable(),
          revision: z.number(),
          locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
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
  items: z
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
          publishedVersion: z.number().optional().nullable(),
          revision: z.number(),
          locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
  alternate: z.boolean().optional().nullable(),
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
  items: z
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
          publishedVersion: z.number().optional().nullable(),
          revision: z.number(),
          locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
  media: z
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
          publishedVersion: z.number().optional().nullable(),
          revision: z.number(),
          locale: z.string().optional().nullable(),
          contentType: z.undefined().optional().nullable(),
        }),
        fields: z.object({
          title: z.string().optional().nullable(),
          description: z.string().optional().nullable(),
          file: z.object({
            url: z.string(),
            details: z.object({
              size: z.number(),
              image: z
                .object({
                  width: z.number(),
                  height: z.number(),
                })
                .optional()
                .nullable(),
            }),
            fileName: z.string(),
            contentType: z.string(),
          }),
        }),
      }),
    )
    .optional()
    .nullable(),
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
  externalLink: z.string().optional().nullable(),
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
  heading: z.string().optional().nullable(),
  subheading: z.string().optional().nullable(),
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
  video: z.string().optional().nullable(),
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
          publishedVersion: z.number().optional().nullable(),
          revision: z.number(),
          locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
  variant: z.string().optional().nullable(),
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
  subtitle: z.string().optional().nullable(),
  contentReference: z
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
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
  subtitle: z.string().optional().nullable(),
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
        contentType: z.undefined().optional().nullable(),
      }),
      fields: z.object({
        title: z.string().optional().nullable(),
        description: z.string().optional().nullable(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .optional()
              .nullable(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .optional()
    .nullable(),
  categories: z.array(z.string()).optional().nullable(),
  pageSlug: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
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
  internalName: z.string().optional().nullable(),
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
          publishedVersion: z.number().optional().nullable(),
          revision: z.number(),
          locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
  vertical: z.boolean().optional().nullable(),
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
        contentType: z.undefined().optional().nullable(),
      }),
      fields: z.object({
        title: z.string().optional().nullable(),
        description: z.string().optional().nullable(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .optional()
              .nullable(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .optional()
    .nullable(),
  headline: z.string(),
  subhead: z.string().optional().nullable(),
  ctaLabel: z.string().optional().nullable(),
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
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

// Schema for newsletterForm
export const newsletterFormFieldsSchema = z.object({
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  inputPlaceholder: z.string().optional().nullable(),
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

// Schema for postGrid
export const postGridFieldsSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional().nullable(),
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

// Schema for feature
export const featureFieldsSchema = z.object({
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
        contentType: z.undefined().optional().nullable(),
      }),
      fields: z.object({
        title: z.string().optional().nullable(),
        description: z.string().optional().nullable(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .optional()
              .nullable(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .optional()
    .nullable(),
  categories: z.array(z.string()).optional().nullable(),
  title: z.string(),
  subtitle: z.string().optional().nullable(),
  pageSlug: z.string(),
  story: z
    .object({
      nodeType: z.literal(BLOCKS.DOCUMENT),
      data: z.record(z.string(), z.unknown()),
      content: z.array(RichTextNodeSchema),
    })
    .optional()
    .nullable(),
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
});

export const featureSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('feature'),
      }),
    }),
  }),
  fields: featureFieldsSchema,
});

export type feature = z.infer<typeof featureSchema>;

// Schema for heroSection
export const heroSectionFieldsSchema = z.object({
  heroTitle: z.string(),
  heroTagline: z.string(),
  type: z.string().optional().nullable(),
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
});

export const heroSectionSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('heroSection'),
      }),
    }),
  }),
  fields: heroSectionFieldsSchema,
});

export type heroSection = z.infer<typeof heroSectionSchema>;

// Schema for guidingPrinciplesSection
export const guidingPrinciplesSectionFieldsSchema = z.object({
  sectionTitle: z.string(),
  sectionDescription: z.string().optional().nullable(),
  principles: z.array(
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
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

export const guidingPrinciplesSectionSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('guidingPrinciplesSection'),
      }),
    }),
  }),
  fields: guidingPrinciplesSectionFieldsSchema,
});

export type guidingPrinciplesSection = z.infer<typeof guidingPrinciplesSectionSchema>;

// Schema for culinaryPassionSection
export const culinaryPassionSectionFieldsSchema = z.object({
  sectionTitle: z.string(),
  sectionText: z.string(),
  sectionImage: z
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
        contentType: z.undefined().optional().nullable(),
      }),
      fields: z.object({
        title: z.string().optional().nullable(),
        description: z.string().optional().nullable(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .optional()
              .nullable(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .optional()
    .nullable(),
});

export const culinaryPassionSectionSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('culinaryPassionSection'),
      }),
    }),
  }),
  fields: culinaryPassionSectionFieldsSchema,
});

export type culinaryPassionSection = z.infer<typeof culinaryPassionSectionSchema>;

// Schema for guidingPrinciple
export const guidingPrincipleFieldsSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const guidingPrincipleSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('guidingPrinciple'),
      }),
    }),
  }),
  fields: guidingPrincipleFieldsSchema,
});

export type guidingPrinciple = z.infer<typeof guidingPrincipleSchema>;

// Schema for ctaSection
export const ctaSectionFieldsSchema = z.object({
  sectionTitle: z.string().optional().nullable(),
  sectionSubtitle: z.string().optional().nullable(),
  buttonText: z.string().optional().nullable(),
  buttonLink: z.string().optional().nullable(),
  ctaList: z
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
          publishedVersion: z.number().optional().nullable(),
          revision: z.number(),
          locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
  variant: z.string().optional().nullable(),
});

export const ctaSectionSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('ctaSection'),
      }),
    }),
  }),
  fields: ctaSectionFieldsSchema,
});

export type ctaSection = z.infer<typeof ctaSectionSchema>;

// Schema for communitySection
export const communitySectionFieldsSchema = z.object({
  sectionTitle: z.string(),
  sectionDescription: z.string().optional().nullable(),
  signUpLabel: z.string(),
  signUpDescription: z.string().optional().nullable(),
  signUpPlaceholder: z.string(),
  socialLabel: z.string().optional().nullable(),
  socialDescription: z.string().optional().nullable(),
  socialLinks: z.array(z.string()).optional().nullable(),
});

export const communitySectionSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('communitySection'),
      }),
    }),
  }),
  fields: communitySectionFieldsSchema,
});

export type communitySection = z.infer<typeof communitySectionSchema>;

// Schema for introSection
export const introSectionFieldsSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional().nullable(),
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
        contentType: z.undefined().optional().nullable(),
      }),
      fields: z.object({
        title: z.string().optional().nullable(),
        description: z.string().optional().nullable(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .optional()
              .nullable(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .optional()
    .nullable(),
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
});

export const introSectionSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('introSection'),
      }),
    }),
  }),
  fields: introSectionFieldsSchema,
});

export type introSection = z.infer<typeof introSectionSchema>;

// Schema for heroBanner
export const heroBannerFieldsSchema = z.object({
  title: z.string(),
  description: z.string().optional().nullable(),
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
        contentType: z.undefined().optional().nullable(),
      }),
      fields: z.object({
        title: z.string().optional().nullable(),
        description: z.string().optional().nullable(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .optional()
              .nullable(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .optional()
    .nullable(),
  video: z
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
        contentType: z.undefined().optional().nullable(),
      }),
      fields: z.object({
        title: z.string().optional().nullable(),
        description: z.string().optional().nullable(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .optional()
              .nullable(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .optional()
    .nullable(),
  primaryCta: z
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
  secondaryCta: z
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
  reviewQuote: z.string().optional().nullable(),
  reviewSource: z.string().optional().nullable(),
  reviewRating: z.number().int().optional().nullable(),
  variant: z.string().optional().nullable(),
  secondaryTitle: z.string().optional().nullable(),
  secondaryDescription: z.string().optional().nullable(),
});

export const heroBannerSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('heroBanner'),
      }),
    }),
  }),
  fields: heroBannerFieldsSchema,
});

export type heroBanner = z.infer<typeof heroBannerSchema>;

// Schema for carouselSection
export const carouselSectionFieldsSchema = z.object({
  heading: z.string(),
  subtitle: z.string().optional().nullable(),
  carousel: z.object({
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
      publishedVersion: z.number().optional().nullable(),
      revision: z.number(),
      locale: z.string().optional().nullable(),
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
});

export const carouselSectionSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('carouselSection'),
      }),
    }),
  }),
  fields: carouselSectionFieldsSchema,
});

export type carouselSection = z.infer<typeof carouselSectionSchema>;

// Schema for featureGrid
export const featureGridFieldsSchema = z.object({
  title: z.string().optional().nullable(),
  subheading: z.string().optional().nullable(),
  items: z
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
          publishedVersion: z.number().optional().nullable(),
          revision: z.number(),
          locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
});

export const featureGridSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('featureGrid'),
      }),
    }),
  }),
  fields: featureGridFieldsSchema,
});

export type featureGrid = z.infer<typeof featureGridSchema>;

// Schema for cardSection
export const cardSectionFieldsSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional().nullable(),
  featuresCard: z.object({
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
      publishedVersion: z.number().optional().nullable(),
      revision: z.number(),
      locale: z.string().optional().nullable(),
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
  recipesCard: z.object({
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
      publishedVersion: z.number().optional().nullable(),
      revision: z.number(),
      locale: z.string().optional().nullable(),
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
  variant: z.string().optional().nullable(),
});

export const cardSectionSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('cardSection'),
      }),
    }),
  }),
  fields: cardSectionFieldsSchema,
});

export type cardSection = z.infer<typeof cardSectionSchema>;

// Schema for testimonials
export const testimonialsFieldsSchema = z.object({
  quote: z.string(),
  logos: z
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
          publishedVersion: z.number().optional().nullable(),
          revision: z.number(),
          locale: z.string().optional().nullable(),
          contentType: z.undefined().optional().nullable(),
        }),
        fields: z.object({
          title: z.string().optional().nullable(),
          description: z.string().optional().nullable(),
          file: z.object({
            url: z.string(),
            details: z.object({
              size: z.number(),
              image: z
                .object({
                  width: z.number(),
                  height: z.number(),
                })
                .optional()
                .nullable(),
            }),
            fileName: z.string(),
            contentType: z.string(),
          }),
        }),
      }),
    )
    .optional()
    .nullable(),
});

export const testimonialsSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('testimonials'),
      }),
    }),
  }),
  fields: testimonialsFieldsSchema,
});

export type testimonials = z.infer<typeof testimonialsSchema>;

// Schema for featureItem
export const featureItemFieldsSchema = z.object({
  heading: z.string(),
  description: z.string().optional().nullable(),
  image: z.object({
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
      publishedVersion: z.number().optional().nullable(),
      revision: z.number(),
      locale: z.string().optional().nullable(),
      contentType: z.undefined().optional().nullable(),
    }),
    fields: z.object({
      title: z.string().optional().nullable(),
      description: z.string().optional().nullable(),
      file: z.object({
        url: z.string(),
        details: z.object({
          size: z.number(),
          image: z
            .object({
              width: z.number(),
              height: z.number(),
            })
            .optional()
            .nullable(),
        }),
        fileName: z.string(),
        contentType: z.string(),
      }),
    }),
  }),
  products: z
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
          publishedVersion: z.number().optional().nullable(),
          revision: z.number(),
          locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
});

export const featureItemSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('featureItem'),
      }),
    }),
  }),
  fields: featureItemFieldsSchema,
});

export type featureItem = z.infer<typeof featureItemSchema>;

// Schema for productBento
export const productBentoFieldsSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional().nullable(),
  products: z
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
          publishedVersion: z.number().optional().nullable(),
          revision: z.number(),
          locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
});

export const productBentoSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('productBento'),
      }),
    }),
  }),
  fields: productBentoFieldsSchema,
});

export type productBento = z.infer<typeof productBentoSchema>;

// Schema for highlights
export const highlightsFieldsSchema = z.object({
  title: z.string(),
  quoteText: z.string().optional().nullable(),
  quoteAuthorImage: z
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
        contentType: z.undefined().optional().nullable(),
      }),
      fields: z.object({
        title: z.string().optional().nullable(),
        description: z.string().optional().nullable(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .optional()
              .nullable(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .optional()
    .nullable(),
  quoteAuthorName: z.string().optional().nullable(),
  quoteAuthorTitle: z.string().optional().nullable(),
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
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
    .optional()
    .nullable(),
});

export const highlightsSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('highlights'),
      }),
    }),
  }),
  fields: highlightsFieldsSchema,
});

export type highlights = z.infer<typeof highlightsSchema>;

// Schema for accordionItem
export const accordionItemFieldsSchema = z.object({
  title: z.string(),
  detail: z.string(),
});

export const accordionItemSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('accordionItem'),
      }),
    }),
  }),
  fields: accordionItemFieldsSchema,
});

export type accordionItem = z.infer<typeof accordionItemSchema>;

// Schema for featureCallout
export const featureCalloutFieldsSchema = z.object({
  internalName: z.string(),
  label: z.string(),
  logo: z.object({
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
      publishedVersion: z.number().optional().nullable(),
      revision: z.number(),
      locale: z.string().optional().nullable(),
      contentType: z.undefined().optional().nullable(),
    }),
    fields: z.object({
      title: z.string().optional().nullable(),
      description: z.string().optional().nullable(),
      file: z.object({
        url: z.string(),
        details: z.object({
          size: z.number(),
          image: z
            .object({
              width: z.number(),
              height: z.number(),
            })
            .optional()
            .nullable(),
        }),
        fileName: z.string(),
        contentType: z.string(),
      }),
    }),
  }),
});

export const featureCalloutSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('featureCallout'),
      }),
    }),
  }),
  fields: featureCalloutFieldsSchema,
});

export type featureCallout = z.infer<typeof featureCalloutSchema>;

// Schema for featureTiles
export const featureTilesFieldsSchema = z.object({
  internalName: z.string(),
  items: z.array(
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
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

export const featureTilesSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('featureTiles'),
      }),
    }),
  }),
  fields: featureTilesFieldsSchema,
});

export type featureTiles = z.infer<typeof featureTilesSchema>;

// Schema for featureTile
export const featureTileFieldsSchema = z.object({
  internalName: z.string(),
  icon: z.string(),
  label: z.string(),
});

export const featureTileSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('featureTile'),
      }),
    }),
  }),
  fields: featureTileFieldsSchema,
});

export type featureTile = z.infer<typeof featureTileSchema>;

// Schema for productGrid
export const productGridFieldsSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional().nullable(),
  type: z.string(),
});

export const productGridSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('productGrid'),
      }),
    }),
  }),
  fields: productGridFieldsSchema,
});

export type productGrid = z.infer<typeof productGridSchema>;

// Schema for pageHeaderSupport
export const pageHeaderSupportFieldsSchema = z.object({
  title: z.string(),
  lead: z.string().optional().nullable(),
});

export const pageHeaderSupportSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('pageHeaderSupport'),
      }),
    }),
  }),
  fields: pageHeaderSupportFieldsSchema,
});

export type pageHeaderSupport = z.infer<typeof pageHeaderSupportSchema>;

// Schema for productSupportLinks
export const productSupportLinksFieldsSchema = z.object({
  title: z.string().optional().nullable(),
  links: z.array(
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
        publishedVersion: z.number().optional().nullable(),
        revision: z.number(),
        locale: z.string().optional().nullable(),
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

export const productSupportLinksSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('productSupportLinks'),
      }),
    }),
  }),
  fields: productSupportLinksFieldsSchema,
});

export type productSupportLinks = z.infer<typeof productSupportLinksSchema>;

// Schema for supportLink
export const supportLinkFieldsSchema = z.object({
  supportType: z.string().optional().nullable(),
  title: z.string(),
  supportPageLink: z.object({
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
      publishedVersion: z.number().optional().nullable(),
      revision: z.number(),
      locale: z.string().optional().nullable(),
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
  subHeading: z.string().optional().nullable(),
});

export const supportLinkSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('supportLink'),
      }),
    }),
  }),
  fields: supportLinkFieldsSchema,
});

export type supportLink = z.infer<typeof supportLinkSchema>;

// Schema for productFormulationLookup
export const productFormulationLookupFieldsSchema = z.object({
  title: z.string().optional().nullable(),
  disclaimer: z.string().optional().nullable(),
});

export const productFormulationLookupSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('productFormulationLookup'),
      }),
    }),
  }),
  fields: productFormulationLookupFieldsSchema,
});

export type productFormulationLookup = z.infer<typeof productFormulationLookupSchema>;

// ========================================
// Union Schema and Helper Object
// ========================================

export const contentfulEntrySchemaUnion = z.union([
  productFinishedGoodsSchema,
  faqSchema,
  carouselRecipeSchema,
  categoryFaqSchema,
  carouselProductSchema,
  recipeSchema,
  productPartsAndAccessoriesSchema,
  ingredientsListSchema,
  authorSchema,
  supportDocumentSchema,
  pageStandardSchema,
  megaMenuSchema,
  faqListSchema,
  blockProductFeaturesSchema,
  blockProductFeaturesAccordionSchema,
  ctaSchema,
  inspirationBentoSchema,
  inspirationCardSchema,
  tutorialSchema,
  heroCarouselSchema,
  heroSlideSchema,
  newsletterFormSchema,
  postGridSchema,
  featureSchema,
  heroSectionSchema,
  guidingPrinciplesSectionSchema,
  culinaryPassionSectionSchema,
  guidingPrincipleSchema,
  ctaSectionSchema,
  communitySectionSchema,
  introSectionSchema,
  heroBannerSchema,
  carouselSectionSchema,
  featureGridSchema,
  cardSectionSchema,
  testimonialsSchema,
  featureItemSchema,
  productBentoSchema,
  highlightsSchema,
  accordionItemSchema,
  featureCalloutSchema,
  featureTilesSchema,
  featureTileSchema,
  productGridSchema,
  pageHeaderSupportSchema,
  productSupportLinksSchema,
  supportLinkSchema,
  productFormulationLookupSchema,
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
  carouselProduct: carouselProductSchema,
  recipe: recipeSchema,
  productPartsAndAccessories: productPartsAndAccessoriesSchema,
  ingredientsList: ingredientsListSchema,
  author: authorSchema,
  supportDocument: supportDocumentSchema,
  pageStandard: pageStandardSchema,
  megaMenu: megaMenuSchema,
  faqList: faqListSchema,
  blockProductFeatures: blockProductFeaturesSchema,
  blockProductFeaturesAccordion: blockProductFeaturesAccordionSchema,
  cta: ctaSchema,
  inspirationBento: inspirationBentoSchema,
  inspirationCard: inspirationCardSchema,
  tutorial: tutorialSchema,
  heroCarousel: heroCarouselSchema,
  heroSlide: heroSlideSchema,
  newsletterForm: newsletterFormSchema,
  postGrid: postGridSchema,
  feature: featureSchema,
  heroSection: heroSectionSchema,
  guidingPrinciplesSection: guidingPrinciplesSectionSchema,
  culinaryPassionSection: culinaryPassionSectionSchema,
  guidingPrinciple: guidingPrincipleSchema,
  ctaSection: ctaSectionSchema,
  communitySection: communitySectionSchema,
  introSection: introSectionSchema,
  heroBanner: heroBannerSchema,
  carouselSection: carouselSectionSchema,
  featureGrid: featureGridSchema,
  cardSection: cardSectionSchema,
  testimonials: testimonialsSchema,
  featureItem: featureItemSchema,
  productBento: productBentoSchema,
  highlights: highlightsSchema,
  accordionItem: accordionItemSchema,
  featureCallout: featureCalloutSchema,
  featureTiles: featureTilesSchema,
  featureTile: featureTileSchema,
  productGrid: productGridSchema,
  pageHeaderSupport: pageHeaderSupportSchema,
  productSupportLinks: productSupportLinksSchema,
  supportLink: supportLinkSchema,
  productFormulationLookup: productFormulationLookupSchema,
};

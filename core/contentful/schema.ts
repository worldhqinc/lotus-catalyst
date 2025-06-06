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
  type: z.union([z.literal('Asset'), z.literal('Link')]),
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
  modelNumber: z.string(),
  bcProductReference: z.string(),
  pageSlug: z.string().nullish(),
  newFlag: z.boolean().nullish(),
  webProductName: z.string(),
  webProductNameDescriptor: z.string().nullish(),
  webCategory: z.array(z.string()),
  webProductLine: z.array(z.string()).nullish(),
  webFeature: z.array(z.string()).nullish(),
  webTemperature: z.string().nullish(),
  webSize: z.string().nullish(),
  webSizeLabel: z.string().nullish(),
  webFinish: z.array(z.string()).nullish(),
  webPower: z.string().nullish(),
  webBullets: z.array(z.string()).nullish(),
  webWhatsIncluded: z.array(z.string()).nullish(),
  shortDescription: z.string().nullish(),
  wattage: z.string().nullish(),
  warranty: z.string().nullish(),
  docs: z
    .array(
      z
        .object({
          metadata: z
            .object({
              tags: z.array(z.unknown()).nullish(),
              concepts: z.array(z.unknown()).nullish(),
            })
            .nullish(),
          sys: z
            .object({
              space: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Space').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              id: z.string().nullish(),
              type: z.union([z.literal('Entry'), z.literal('Link')]).nullish(),
              createdAt: z.string().datetime().nullish(),
              updatedAt: z.string().datetime().nullish(),
              environment: z
                .object({
                  sys: z
                    .object({
                      id: z.string().nullish(),
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Environment').nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              publishedVersion: z.number().nullish(),
              revision: z.number().nullish(),
              locale: z.string().nullish(),
              contentType: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('ContentType').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
            })
            .nullish(),
          fields: z.record(z.string(), z.unknown()).nullish(),
        })
        .nullish(),
    )
    .transform((arr) => arr.filter((item) => item?.sys?.publishedVersion))
    .pipe(
      z.array(
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
            type: z.union([z.literal('Entry'), z.literal('Link')]),
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime(),
            environment: z.object({
              sys: z.object({
                id: z.string(),
                type: z.literal('Link'),
                linkType: z.literal('Environment'),
              }),
            }),
            publishedVersion: z.number().nullish(),
            revision: z.number(),
            locale: z.string().nullish(),
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
    )
    .nullish(),
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
        type: z.union([z.literal('Asset'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
        contentType: z.undefined().nullish(),
      }),
      fields: z.object({
        title: z.string().nullish(),
        description: z.string().nullish(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .nullish(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .nullish(),
  price: z.string().nullish(),
  salePrice: z.string().nullish(),
  saleMessage: z.string().nullish(),
  inventoryQuantity: z.number().int().nullish(),
  partsAccessories: z
    .array(
      z
        .object({
          metadata: z
            .object({
              tags: z.array(z.unknown()).nullish(),
              concepts: z.array(z.unknown()).nullish(),
            })
            .nullish(),
          sys: z
            .object({
              space: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Space').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              id: z.string().nullish(),
              type: z.union([z.literal('Entry'), z.literal('Link')]).nullish(),
              createdAt: z.string().datetime().nullish(),
              updatedAt: z.string().datetime().nullish(),
              environment: z
                .object({
                  sys: z
                    .object({
                      id: z.string().nullish(),
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Environment').nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              publishedVersion: z.number().nullish(),
              revision: z.number().nullish(),
              locale: z.string().nullish(),
              contentType: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('ContentType').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
            })
            .nullish(),
          fields: z.record(z.string(), z.unknown()).nullish(),
        })
        .nullish(),
    )
    .transform((arr) => arr.filter((item) => item?.sys?.publishedVersion))
    .pipe(
      z.array(
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
            type: z.union([z.literal('Entry'), z.literal('Link')]),
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime(),
            environment: z.object({
              sys: z.object({
                id: z.string(),
                type: z.literal('Link'),
                linkType: z.literal('Environment'),
              }),
            }),
            publishedVersion: z.number().nullish(),
            revision: z.number(),
            locale: z.string().nullish(),
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
    )
    .nullish(),
  outOfBoxNetWeight: z.string().nullish(),
  outOfBoxDepth: z.string().nullish(),
  outOfBoxWidth: z.string().nullish(),
  outOfBoxHeight: z.string().nullish(),
  outOfBoxSizeUom: z.string().nullish(),
  outOfBoxWeightUom: z.string().nullish(),
  metaTitle: z.string().nullish(),
  metaDescription: z.string().nullish(),
  metaKeywords: z.string().nullish(),
  factoryRecertifiedProduct: z.boolean().nullish(),
  archive: z.boolean().nullish(),
  productFormulationInformation: z.record(z.string(), z.unknown()).nullish(),
  badge: z.string().nullish(),
  additionalImages: z
    .array(
      z
        .object({
          metadata: z
            .object({
              tags: z.array(z.unknown()).nullish(),
              concepts: z.array(z.unknown()).nullish(),
            })
            .nullish(),
          sys: z
            .object({
              space: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Space').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              id: z.string().nullish(),
              type: z.union([z.literal('Asset'), z.literal('Link')]).nullish(),
              createdAt: z.string().datetime().nullish(),
              updatedAt: z.string().datetime().nullish(),
              environment: z
                .object({
                  sys: z
                    .object({
                      id: z.string().nullish(),
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Environment').nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              publishedVersion: z.number().nullish(),
              revision: z.number().nullish(),
              locale: z.string().nullish(),
              contentType: z.undefined().nullish(),
            })
            .nullish(),
          fields: z
            .object({
              title: z.string().nullish(),
              description: z.string().nullish(),
              file: z
                .object({
                  url: z.string().nullish(),
                  details: z
                    .object({
                      size: z.number().nullish(),
                      image: z
                        .object({
                          width: z.number(),
                          height: z.number(),
                        })
                        .nullish(),
                    })
                    .nullish(),
                  fileName: z.string().nullish(),
                  contentType: z.string().nullish(),
                })
                .nullish(),
            })
            .nullish(),
        })
        .nullish(),
    )
    .transform((arr) => arr.filter((item) => item?.sys?.publishedVersion))
    .pipe(
      z.array(
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
            type: z.union([z.literal('Asset'), z.literal('Link')]),
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime(),
            environment: z.object({
              sys: z.object({
                id: z.string(),
                type: z.literal('Link'),
                linkType: z.literal('Environment'),
              }),
            }),
            publishedVersion: z.number().nullish(),
            revision: z.number(),
            locale: z.string().nullish(),
            contentType: z.undefined().nullish(),
          }),
          fields: z.object({
            title: z.string().nullish(),
            description: z.string().nullish(),
            file: z.object({
              url: z.string(),
              details: z.object({
                size: z.number(),
                image: z
                  .object({
                    width: z.number(),
                    height: z.number(),
                  })
                  .nullish(),
              }),
              fileName: z.string(),
              contentType: z.string(),
            }),
          }),
        }),
      ),
    )
    .nullish(),
  faqs: z
    .array(
      z
        .object({
          metadata: z
            .object({
              tags: z.array(z.unknown()).nullish(),
              concepts: z.array(z.unknown()).nullish(),
            })
            .nullish(),
          sys: z
            .object({
              space: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Space').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              id: z.string().nullish(),
              type: z.union([z.literal('Entry'), z.literal('Link')]).nullish(),
              createdAt: z.string().datetime().nullish(),
              updatedAt: z.string().datetime().nullish(),
              environment: z
                .object({
                  sys: z
                    .object({
                      id: z.string().nullish(),
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Environment').nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              publishedVersion: z.number().nullish(),
              revision: z.number().nullish(),
              locale: z.string().nullish(),
              contentType: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('ContentType').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
            })
            .nullish(),
          fields: z.record(z.string(), z.unknown()).nullish(),
        })
        .nullish(),
    )
    .transform((arr) => arr.filter((item) => item?.sys?.publishedVersion))
    .pipe(
      z.array(
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
            type: z.union([z.literal('Entry'), z.literal('Link')]),
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime(),
            environment: z.object({
              sys: z.object({
                id: z.string(),
                type: z.literal('Link'),
                linkType: z.literal('Environment'),
              }),
            }),
            publishedVersion: z.number().nullish(),
            revision: z.number(),
            locale: z.string().nullish(),
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
    )
    .nullish(),
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
        type: z.union([z.literal('Entry'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
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
    .nullish(),
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
        type: z.union([z.literal('Entry'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
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
    .nullish(),
  pageContentEntries: z
    .array(
      z
        .object({
          metadata: z
            .object({
              tags: z.array(z.unknown()).nullish(),
              concepts: z.array(z.unknown()).nullish(),
            })
            .nullish(),
          sys: z
            .object({
              space: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Space').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              id: z.string().nullish(),
              type: z.union([z.literal('Entry'), z.literal('Link')]).nullish(),
              createdAt: z.string().datetime().nullish(),
              updatedAt: z.string().datetime().nullish(),
              environment: z
                .object({
                  sys: z
                    .object({
                      id: z.string().nullish(),
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Environment').nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              publishedVersion: z.number().nullish(),
              revision: z.number().nullish(),
              locale: z.string().nullish(),
              contentType: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('ContentType').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
            })
            .nullish(),
          fields: z.record(z.string(), z.unknown()).nullish(),
        })
        .nullish(),
    )
    .transform((arr) => arr.filter((item) => item?.sys?.publishedVersion))
    .pipe(
      z.array(
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
            type: z.union([z.literal('Entry'), z.literal('Link')]),
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime(),
            environment: z.object({
              sys: z.object({
                id: z.string(),
                type: z.literal('Link'),
                linkType: z.literal('Environment'),
              }),
            }),
            publishedVersion: z.number().nullish(),
            revision: z.number(),
            locale: z.string().nullish(),
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
    )
    .nullish(),
  carouselImage: z
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
        type: z.union([z.literal('Asset'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
        contentType: z.undefined().nullish(),
      }),
      fields: z.object({
        title: z.string().nullish(),
        description: z.string().nullish(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .nullish(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .nullish(),
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
  faqFilterCategory: z.string().nullish(),
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
  recipes: z
    .array(
      z
        .object({
          metadata: z
            .object({
              tags: z.array(z.unknown()).nullish(),
              concepts: z.array(z.unknown()).nullish(),
            })
            .nullish(),
          sys: z
            .object({
              space: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Space').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              id: z.string().nullish(),
              type: z.union([z.literal('Entry'), z.literal('Link')]).nullish(),
              createdAt: z.string().datetime().nullish(),
              updatedAt: z.string().datetime().nullish(),
              environment: z
                .object({
                  sys: z
                    .object({
                      id: z.string().nullish(),
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Environment').nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              publishedVersion: z.number().nullish(),
              revision: z.number().nullish(),
              locale: z.string().nullish(),
              contentType: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('ContentType').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
            })
            .nullish(),
          fields: z.record(z.string(), z.unknown()).nullish(),
        })
        .nullish(),
    )
    .transform((arr) => arr.filter((item) => item?.sys?.publishedVersion))
    .pipe(
      z.array(
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
            type: z.union([z.literal('Entry'), z.literal('Link')]),
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime(),
            environment: z.object({
              sys: z.object({
                id: z.string(),
                type: z.literal('Link'),
                linkType: z.literal('Environment'),
              }),
            }),
            publishedVersion: z.number().nullish(),
            revision: z.number(),
            locale: z.string().nullish(),
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
        type: z.union([z.literal('Entry'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
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
    .nullish(),
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
        type: z.union([z.literal('Entry'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
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
    .nullish(),
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
  subtitle: z.string().nullish(),
  products: z
    .array(
      z
        .object({
          metadata: z
            .object({
              tags: z.array(z.unknown()).nullish(),
              concepts: z.array(z.unknown()).nullish(),
            })
            .nullish(),
          sys: z
            .object({
              space: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Space').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              id: z.string().nullish(),
              type: z.union([z.literal('Entry'), z.literal('Link')]).nullish(),
              createdAt: z.string().datetime().nullish(),
              updatedAt: z.string().datetime().nullish(),
              environment: z
                .object({
                  sys: z
                    .object({
                      id: z.string().nullish(),
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Environment').nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              publishedVersion: z.number().nullish(),
              revision: z.number().nullish(),
              locale: z.string().nullish(),
              contentType: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('ContentType').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
            })
            .nullish(),
          fields: z.record(z.string(), z.unknown()).nullish(),
        })
        .nullish(),
    )
    .transform((arr) => arr.filter((item) => item?.sys?.publishedVersion))
    .pipe(
      z.array(
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
            type: z.union([z.literal('Entry'), z.literal('Link')]),
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime(),
            environment: z.object({
              sys: z.object({
                id: z.string(),
                type: z.literal('Link'),
                linkType: z.literal('Environment'),
              }),
            }),
            publishedVersion: z.number().nullish(),
            revision: z.number(),
            locale: z.string().nullish(),
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
  pageSlug: z.string(),
  metaTitle: z.string().nullish(),
  metaDescription: z.string().nullish(),
  metaKeywords: z.string().nullish(),
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
        type: z.union([z.literal('Entry'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
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
    .nullish(),
  shortDescription: z.string().nullish(),
  cookTime: z.string().nullish(),
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
      type: z.union([z.literal('Asset'), z.literal('Link')]),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
      environment: z.object({
        sys: z.object({
          id: z.string(),
          type: z.literal('Link'),
          linkType: z.literal('Environment'),
        }),
      }),
      publishedVersion: z.number().nullish(),
      revision: z.number(),
      locale: z.string().nullish(),
      contentType: z.undefined().nullish(),
    }),
    fields: z.object({
      title: z.string().nullish(),
      description: z.string().nullish(),
      file: z.object({
        url: z.string(),
        details: z.object({
          size: z.number(),
          image: z
            .object({
              width: z.number(),
              height: z.number(),
            })
            .nullish(),
        }),
        fileName: z.string(),
        contentType: z.string(),
      }),
    }),
  }),
  intro: z.string().nullish(),
  mealTypeCategory: z.array(z.string()).nullish(),
  occasionCategory: z.array(z.string()).nullish(),
  ingredientsCategory: z.array(z.string()).nullish(),
  applianceTypeCategory: z.array(z.string()).nullish(),
  numberOfServings: z.string().nullish(),
  numberOfIngredients: z.string().nullish(),
  ingredientsLists: z
    .array(
      z
        .object({
          metadata: z
            .object({
              tags: z.array(z.unknown()).nullish(),
              concepts: z.array(z.unknown()).nullish(),
            })
            .nullish(),
          sys: z
            .object({
              space: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Space').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              id: z.string().nullish(),
              type: z.union([z.literal('Entry'), z.literal('Link')]).nullish(),
              createdAt: z.string().datetime().nullish(),
              updatedAt: z.string().datetime().nullish(),
              environment: z
                .object({
                  sys: z
                    .object({
                      id: z.string().nullish(),
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Environment').nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              publishedVersion: z.number().nullish(),
              revision: z.number().nullish(),
              locale: z.string().nullish(),
              contentType: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('ContentType').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
            })
            .nullish(),
          fields: z.record(z.string(), z.unknown()).nullish(),
        })
        .nullish(),
    )
    .transform((arr) => arr.filter((item) => item?.sys?.publishedVersion))
    .pipe(
      z.array(
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
            type: z.union([z.literal('Entry'), z.literal('Link')]),
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime(),
            environment: z.object({
              sys: z.object({
                id: z.string(),
                type: z.literal('Link'),
                linkType: z.literal('Environment'),
              }),
            }),
            publishedVersion: z.number().nullish(),
            revision: z.number(),
            locale: z.string().nullish(),
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
    )
    .nullish(),
  products: z
    .array(
      z
        .object({
          metadata: z
            .object({
              tags: z.array(z.unknown()).nullish(),
              concepts: z.array(z.unknown()).nullish(),
            })
            .nullish(),
          sys: z
            .object({
              space: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Space').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              id: z.string().nullish(),
              type: z.union([z.literal('Entry'), z.literal('Link')]).nullish(),
              createdAt: z.string().datetime().nullish(),
              updatedAt: z.string().datetime().nullish(),
              environment: z
                .object({
                  sys: z
                    .object({
                      id: z.string().nullish(),
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Environment').nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              publishedVersion: z.number().nullish(),
              revision: z.number().nullish(),
              locale: z.string().nullish(),
              contentType: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('ContentType').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
            })
            .nullish(),
          fields: z.record(z.string(), z.unknown()).nullish(),
        })
        .nullish(),
    )
    .transform((arr) => arr.filter((item) => item?.sys?.publishedVersion))
    .pipe(
      z.array(
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
            type: z.union([z.literal('Entry'), z.literal('Link')]),
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime(),
            environment: z.object({
              sys: z.object({
                id: z.string(),
                type: z.literal('Link'),
                linkType: z.literal('Environment'),
              }),
            }),
            publishedVersion: z.number().nullish(),
            revision: z.number(),
            locale: z.string().nullish(),
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
    )
    .nullish(),
  recipeDirections: z
    .object({
      nodeType: z.literal(BLOCKS.DOCUMENT),
      data: z.record(z.string(), z.unknown()),
      content: z.array(RichTextNodeSchema),
    })
    .nullish(),
  variations: z
    .object({
      nodeType: z.literal(BLOCKS.DOCUMENT),
      data: z.record(z.string(), z.unknown()),
      content: z.array(RichTextNodeSchema),
    })
    .nullish(),
  testKitchenTips: z
    .object({
      nodeType: z.literal(BLOCKS.DOCUMENT),
      data: z.record(z.string(), z.unknown()),
      content: z.array(RichTextNodeSchema),
    })
    .nullish(),
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
        type: z.union([z.literal('Entry'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
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
    .nullish(),
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
        type: z.union([z.literal('Entry'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
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
    .nullish(),
  additionalImages: z
    .array(
      z
        .object({
          metadata: z
            .object({
              tags: z.array(z.unknown()).nullish(),
              concepts: z.array(z.unknown()).nullish(),
            })
            .nullish(),
          sys: z
            .object({
              space: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Space').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              id: z.string().nullish(),
              type: z.union([z.literal('Asset'), z.literal('Link')]).nullish(),
              createdAt: z.string().datetime().nullish(),
              updatedAt: z.string().datetime().nullish(),
              environment: z
                .object({
                  sys: z
                    .object({
                      id: z.string().nullish(),
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Environment').nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              publishedVersion: z.number().nullish(),
              revision: z.number().nullish(),
              locale: z.string().nullish(),
              contentType: z.undefined().nullish(),
            })
            .nullish(),
          fields: z
            .object({
              title: z.string().nullish(),
              description: z.string().nullish(),
              file: z
                .object({
                  url: z.string().nullish(),
                  details: z
                    .object({
                      size: z.number().nullish(),
                      image: z
                        .object({
                          width: z.number(),
                          height: z.number(),
                        })
                        .nullish(),
                    })
                    .nullish(),
                  fileName: z.string().nullish(),
                  contentType: z.string().nullish(),
                })
                .nullish(),
            })
            .nullish(),
        })
        .nullish(),
    )
    .transform((arr) => arr.filter((item) => item?.sys?.publishedVersion))
    .pipe(
      z.array(
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
            type: z.union([z.literal('Asset'), z.literal('Link')]),
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime(),
            environment: z.object({
              sys: z.object({
                id: z.string(),
                type: z.literal('Link'),
                linkType: z.literal('Environment'),
              }),
            }),
            publishedVersion: z.number().nullish(),
            revision: z.number(),
            locale: z.string().nullish(),
            contentType: z.undefined().nullish(),
          }),
          fields: z.object({
            title: z.string().nullish(),
            description: z.string().nullish(),
            file: z.object({
              url: z.string(),
              details: z.object({
                size: z.number(),
                image: z
                  .object({
                    width: z.number(),
                    height: z.number(),
                  })
                  .nullish(),
              }),
              fileName: z.string(),
              contentType: z.string(),
            }),
          }),
        }),
      ),
    )
    .nullish(),
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
        type: z.union([z.literal('Entry'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
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
    .nullish(),
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
  pageSlug: z.string(),
  modelNumber: z.string().nullish(),
  bcProductReference: z.string(),
  newFlag: z.boolean().nullish(),
  webProductName: z.string(),
  webProductNameDescriptor: z.string().nullish(),
  webProductLine: z.array(z.string()).nullish(),
  webCategory: z.array(z.string()).nullish(),
  webFinish: z.array(z.string()).nullish(),
  associatedFinishedGoods: z
    .array(
      z
        .object({
          metadata: z
            .object({
              tags: z.array(z.unknown()).nullish(),
              concepts: z.array(z.unknown()).nullish(),
            })
            .nullish(),
          sys: z
            .object({
              space: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Space').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              id: z.string().nullish(),
              type: z.union([z.literal('Entry'), z.literal('Link')]).nullish(),
              createdAt: z.string().datetime().nullish(),
              updatedAt: z.string().datetime().nullish(),
              environment: z
                .object({
                  sys: z
                    .object({
                      id: z.string().nullish(),
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Environment').nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              publishedVersion: z.number().nullish(),
              revision: z.number().nullish(),
              locale: z.string().nullish(),
              contentType: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('ContentType').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
            })
            .nullish(),
          fields: z.record(z.string(), z.unknown()).nullish(),
        })
        .nullish(),
    )
    .transform((arr) => arr.filter((item) => item?.sys?.publishedVersion))
    .pipe(
      z.array(
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
            type: z.union([z.literal('Entry'), z.literal('Link')]),
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime(),
            environment: z.object({
              sys: z.object({
                id: z.string(),
                type: z.literal('Link'),
                linkType: z.literal('Environment'),
              }),
            }),
            publishedVersion: z.number().nullish(),
            revision: z.number(),
            locale: z.string().nullish(),
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
    )
    .nullish(),
  relatedPartsAndAccessories: z
    .array(
      z
        .object({
          metadata: z
            .object({
              tags: z.array(z.unknown()).nullish(),
              concepts: z.array(z.unknown()).nullish(),
            })
            .nullish(),
          sys: z
            .object({
              space: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Space').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              id: z.string().nullish(),
              type: z.union([z.literal('Entry'), z.literal('Link')]).nullish(),
              createdAt: z.string().datetime().nullish(),
              updatedAt: z.string().datetime().nullish(),
              environment: z
                .object({
                  sys: z
                    .object({
                      id: z.string().nullish(),
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Environment').nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              publishedVersion: z.number().nullish(),
              revision: z.number().nullish(),
              locale: z.string().nullish(),
              contentType: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('ContentType').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
            })
            .nullish(),
          fields: z.record(z.string(), z.unknown()).nullish(),
        })
        .nullish(),
    )
    .transform((arr) => arr.filter((item) => item?.sys?.publishedVersion))
    .pipe(
      z.array(
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
            type: z.union([z.literal('Entry'), z.literal('Link')]),
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime(),
            environment: z.object({
              sys: z.object({
                id: z.string(),
                type: z.literal('Link'),
                linkType: z.literal('Environment'),
              }),
            }),
            publishedVersion: z.number().nullish(),
            revision: z.number(),
            locale: z.string().nullish(),
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
    )
    .nullish(),
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
        type: z.union([z.literal('Asset'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
        contentType: z.undefined().nullish(),
      }),
      fields: z.object({
        title: z.string().nullish(),
        description: z.string().nullish(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .nullish(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .nullish(),
  productFormulationInformation: z.record(z.string(), z.unknown()).nullish(),
  price: z.string().nullish(),
  salePrice: z.string().nullish(),
  saleMessage: z.string().nullish(),
  inventoryQuantity: z.number().int().nullish(),
  outOfBoxNetWeight: z.string().nullish(),
  outOfBoxDepth: z.string().nullish(),
  outOfBoxWidth: z.string().nullish(),
  outOfBoxHeight: z.string().nullish(),
  outOfBoxSizeUom: z.string().nullish(),
  outOfBoxWeightUom: z.string().nullish(),
  metaTitle: z.string().nullish(),
  metaDescription: z.string().nullish(),
  metaKeywords: z.string().nullish(),
  archive: z.boolean().nullish(),
  factoryRecertifiedProduct: z.boolean(),
  badge: z.string().nullish(),
  additionalImages: z
    .array(
      z
        .object({
          metadata: z
            .object({
              tags: z.array(z.unknown()).nullish(),
              concepts: z.array(z.unknown()).nullish(),
            })
            .nullish(),
          sys: z
            .object({
              space: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Space').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              id: z.string().nullish(),
              type: z.union([z.literal('Asset'), z.literal('Link')]).nullish(),
              createdAt: z.string().datetime().nullish(),
              updatedAt: z.string().datetime().nullish(),
              environment: z
                .object({
                  sys: z
                    .object({
                      id: z.string().nullish(),
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Environment').nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              publishedVersion: z.number().nullish(),
              revision: z.number().nullish(),
              locale: z.string().nullish(),
              contentType: z.undefined().nullish(),
            })
            .nullish(),
          fields: z
            .object({
              title: z.string().nullish(),
              description: z.string().nullish(),
              file: z
                .object({
                  url: z.string().nullish(),
                  details: z
                    .object({
                      size: z.number().nullish(),
                      image: z
                        .object({
                          width: z.number(),
                          height: z.number(),
                        })
                        .nullish(),
                    })
                    .nullish(),
                  fileName: z.string().nullish(),
                  contentType: z.string().nullish(),
                })
                .nullish(),
            })
            .nullish(),
        })
        .nullish(),
    )
    .transform((arr) => arr.filter((item) => item?.sys?.publishedVersion))
    .pipe(
      z.array(
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
            type: z.union([z.literal('Asset'), z.literal('Link')]),
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime(),
            environment: z.object({
              sys: z.object({
                id: z.string(),
                type: z.literal('Link'),
                linkType: z.literal('Environment'),
              }),
            }),
            publishedVersion: z.number().nullish(),
            revision: z.number(),
            locale: z.string().nullish(),
            contentType: z.undefined().nullish(),
          }),
          fields: z.object({
            title: z.string().nullish(),
            description: z.string().nullish(),
            file: z.object({
              url: z.string(),
              details: z.object({
                size: z.number(),
                image: z
                  .object({
                    width: z.number(),
                    height: z.number(),
                  })
                  .nullish(),
              }),
              fileName: z.string(),
              contentType: z.string(),
            }),
          }),
        }),
      ),
    )
    .nullish(),
  pageContentEntries: z
    .array(
      z
        .object({
          metadata: z
            .object({
              tags: z.array(z.unknown()).nullish(),
              concepts: z.array(z.unknown()).nullish(),
            })
            .nullish(),
          sys: z
            .object({
              space: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Space').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              id: z.string().nullish(),
              type: z.union([z.literal('Entry'), z.literal('Link')]).nullish(),
              createdAt: z.string().datetime().nullish(),
              updatedAt: z.string().datetime().nullish(),
              environment: z
                .object({
                  sys: z
                    .object({
                      id: z.string().nullish(),
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Environment').nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              publishedVersion: z.number().nullish(),
              revision: z.number().nullish(),
              locale: z.string().nullish(),
              contentType: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('ContentType').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
            })
            .nullish(),
          fields: z.record(z.string(), z.unknown()).nullish(),
        })
        .nullish(),
    )
    .transform((arr) => arr.filter((item) => item?.sys?.publishedVersion))
    .pipe(
      z.array(
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
            type: z.union([z.literal('Entry'), z.literal('Link')]),
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime(),
            environment: z.object({
              sys: z.object({
                id: z.string(),
                type: z.literal('Link'),
                linkType: z.literal('Environment'),
              }),
            }),
            publishedVersion: z.number().nullish(),
            revision: z.number(),
            locale: z.string().nullish(),
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
    )
    .nullish(),
  shortDescription: z.string().nullish(),
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
  sectionTitle: z.string().nullish(),
  listOfIngredients: z.array(z.string()).nullish(),
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
        type: z.union([z.literal('Asset'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
        contentType: z.undefined().nullish(),
      }),
      fields: z.object({
        title: z.string().nullish(),
        description: z.string().nullish(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .nullish(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .nullish(),
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
        type: z.union([z.literal('Asset'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
        contentType: z.undefined().nullish(),
      }),
      fields: z.object({
        title: z.string().nullish(),
        description: z.string().nullish(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .nullish(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .nullish(),
  documentType: z.string().nullish(),
  url: z.string(),
  modelNumber: z.string().nullish(),
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
  pageSlug: z.string(),
  metaTitle: z.string().nullish(),
  metaDescription: z.string().nullish(),
  metaKeywords: z.string().nullish(),
  optionalPageDescription: z
    .object({
      nodeType: z.literal(BLOCKS.DOCUMENT),
      data: z.record(z.string(), z.unknown()),
      content: z.array(RichTextNodeSchema),
    })
    .nullish(),
  pageContent: z
    .array(
      z
        .object({
          metadata: z
            .object({
              tags: z.array(z.unknown()).nullish(),
              concepts: z.array(z.unknown()).nullish(),
            })
            .nullish(),
          sys: z
            .object({
              space: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Space').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              id: z.string().nullish(),
              type: z.union([z.literal('Entry'), z.literal('Link')]).nullish(),
              createdAt: z.string().datetime().nullish(),
              updatedAt: z.string().datetime().nullish(),
              environment: z
                .object({
                  sys: z
                    .object({
                      id: z.string().nullish(),
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Environment').nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              publishedVersion: z.number().nullish(),
              revision: z.number().nullish(),
              locale: z.string().nullish(),
              contentType: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('ContentType').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
            })
            .nullish(),
          fields: z.record(z.string(), z.unknown()).nullish(),
        })
        .nullish(),
    )
    .transform((arr) => arr.filter((item) => item?.sys?.publishedVersion))
    .pipe(
      z.array(
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
            type: z.union([z.literal('Entry'), z.literal('Link')]),
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime(),
            environment: z.object({
              sys: z.object({
                id: z.string(),
                type: z.literal('Link'),
                linkType: z.literal('Environment'),
              }),
            }),
            publishedVersion: z.number().nullish(),
            revision: z.number(),
            locale: z.string().nullish(),
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
    )
    .nullish(),
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
  menuReference: z
    .array(
      z
        .object({
          metadata: z
            .object({
              tags: z.array(z.unknown()).nullish(),
              concepts: z.array(z.unknown()).nullish(),
            })
            .nullish(),
          sys: z
            .object({
              space: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Space').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              id: z.string().nullish(),
              type: z.union([z.literal('Entry'), z.literal('Link')]).nullish(),
              createdAt: z.string().datetime().nullish(),
              updatedAt: z.string().datetime().nullish(),
              environment: z
                .object({
                  sys: z
                    .object({
                      id: z.string().nullish(),
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Environment').nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              publishedVersion: z.number().nullish(),
              revision: z.number().nullish(),
              locale: z.string().nullish(),
              contentType: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('ContentType').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
            })
            .nullish(),
          fields: z.record(z.string(), z.unknown()).nullish(),
        })
        .nullish(),
    )
    .transform((arr) => arr.filter((item) => item?.sys?.publishedVersion))
    .pipe(
      z.array(
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
            type: z.union([z.literal('Entry'), z.literal('Link')]),
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime(),
            environment: z.object({
              sys: z.object({
                id: z.string(),
                type: z.literal('Link'),
                linkType: z.literal('Environment'),
              }),
            }),
            publishedVersion: z.number().nullish(),
            revision: z.number(),
            locale: z.string().nullish(),
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
  faqCategory: z.object({
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
      type: z.union([z.literal('Entry'), z.literal('Link')]),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
      environment: z.object({
        sys: z.object({
          id: z.string(),
          type: z.literal('Link'),
          linkType: z.literal('Environment'),
        }),
      }),
      publishedVersion: z.number().nullish(),
      revision: z.number(),
      locale: z.string().nullish(),
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
  faqReference: z
    .array(
      z
        .object({
          metadata: z
            .object({
              tags: z.array(z.unknown()).nullish(),
              concepts: z.array(z.unknown()).nullish(),
            })
            .nullish(),
          sys: z
            .object({
              space: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Space').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              id: z.string().nullish(),
              type: z.union([z.literal('Entry'), z.literal('Link')]).nullish(),
              createdAt: z.string().datetime().nullish(),
              updatedAt: z.string().datetime().nullish(),
              environment: z
                .object({
                  sys: z
                    .object({
                      id: z.string().nullish(),
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Environment').nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              publishedVersion: z.number().nullish(),
              revision: z.number().nullish(),
              locale: z.string().nullish(),
              contentType: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('ContentType').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
            })
            .nullish(),
          fields: z.record(z.string(), z.unknown()).nullish(),
        })
        .nullish(),
    )
    .transform((arr) => arr.filter((item) => item?.sys?.publishedVersion))
    .pipe(
      z.array(
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
            type: z.union([z.literal('Entry'), z.literal('Link')]),
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime(),
            environment: z.object({
              sys: z.object({
                id: z.string(),
                type: z.literal('Link'),
                linkType: z.literal('Environment'),
              }),
            }),
            publishedVersion: z.number().nullish(),
            revision: z.number(),
            locale: z.string().nullish(),
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
      z
        .object({
          metadata: z
            .object({
              tags: z.array(z.unknown()).nullish(),
              concepts: z.array(z.unknown()).nullish(),
            })
            .nullish(),
          sys: z
            .object({
              space: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Space').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              id: z.string().nullish(),
              type: z.union([z.literal('Entry'), z.literal('Link')]).nullish(),
              createdAt: z.string().datetime().nullish(),
              updatedAt: z.string().datetime().nullish(),
              environment: z
                .object({
                  sys: z
                    .object({
                      id: z.string().nullish(),
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Environment').nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              publishedVersion: z.number().nullish(),
              revision: z.number().nullish(),
              locale: z.string().nullish(),
              contentType: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('ContentType').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
            })
            .nullish(),
          fields: z.record(z.string(), z.unknown()).nullish(),
        })
        .nullish(),
    )
    .transform((arr) => arr.filter((item) => item?.sys?.publishedVersion))
    .pipe(
      z.array(
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
            type: z.union([z.literal('Entry'), z.literal('Link')]),
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime(),
            environment: z.object({
              sys: z.object({
                id: z.string(),
                type: z.literal('Link'),
                linkType: z.literal('Environment'),
              }),
            }),
            publishedVersion: z.number().nullish(),
            revision: z.number(),
            locale: z.string().nullish(),
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
    )
    .nullish(),
  alternate: z.boolean().nullish(),
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
      z
        .object({
          metadata: z
            .object({
              tags: z.array(z.unknown()).nullish(),
              concepts: z.array(z.unknown()).nullish(),
            })
            .nullish(),
          sys: z
            .object({
              space: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Space').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              id: z.string().nullish(),
              type: z.union([z.literal('Entry'), z.literal('Link')]).nullish(),
              createdAt: z.string().datetime().nullish(),
              updatedAt: z.string().datetime().nullish(),
              environment: z
                .object({
                  sys: z
                    .object({
                      id: z.string().nullish(),
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Environment').nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              publishedVersion: z.number().nullish(),
              revision: z.number().nullish(),
              locale: z.string().nullish(),
              contentType: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('ContentType').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
            })
            .nullish(),
          fields: z.record(z.string(), z.unknown()).nullish(),
        })
        .nullish(),
    )
    .transform((arr) => arr.filter((item) => item?.sys?.publishedVersion))
    .pipe(
      z.array(
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
            type: z.union([z.literal('Entry'), z.literal('Link')]),
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime(),
            environment: z.object({
              sys: z.object({
                id: z.string(),
                type: z.literal('Link'),
                linkType: z.literal('Environment'),
              }),
            }),
            publishedVersion: z.number().nullish(),
            revision: z.number(),
            locale: z.string().nullish(),
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
    )
    .nullish(),
  media: z
    .array(
      z
        .object({
          metadata: z
            .object({
              tags: z.array(z.unknown()).nullish(),
              concepts: z.array(z.unknown()).nullish(),
            })
            .nullish(),
          sys: z
            .object({
              space: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Space').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              id: z.string().nullish(),
              type: z.union([z.literal('Asset'), z.literal('Link')]).nullish(),
              createdAt: z.string().datetime().nullish(),
              updatedAt: z.string().datetime().nullish(),
              environment: z
                .object({
                  sys: z
                    .object({
                      id: z.string().nullish(),
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Environment').nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              publishedVersion: z.number().nullish(),
              revision: z.number().nullish(),
              locale: z.string().nullish(),
              contentType: z.undefined().nullish(),
            })
            .nullish(),
          fields: z
            .object({
              title: z.string().nullish(),
              description: z.string().nullish(),
              file: z
                .object({
                  url: z.string().nullish(),
                  details: z
                    .object({
                      size: z.number().nullish(),
                      image: z
                        .object({
                          width: z.number(),
                          height: z.number(),
                        })
                        .nullish(),
                    })
                    .nullish(),
                  fileName: z.string().nullish(),
                  contentType: z.string().nullish(),
                })
                .nullish(),
            })
            .nullish(),
        })
        .nullish(),
    )
    .transform((arr) => arr.filter((item) => item?.sys?.publishedVersion))
    .pipe(
      z.array(
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
            type: z.union([z.literal('Asset'), z.literal('Link')]),
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime(),
            environment: z.object({
              sys: z.object({
                id: z.string(),
                type: z.literal('Link'),
                linkType: z.literal('Environment'),
              }),
            }),
            publishedVersion: z.number().nullish(),
            revision: z.number(),
            locale: z.string().nullish(),
            contentType: z.undefined().nullish(),
          }),
          fields: z.object({
            title: z.string().nullish(),
            description: z.string().nullish(),
            file: z.object({
              url: z.string(),
              details: z.object({
                size: z.number(),
                image: z
                  .object({
                    width: z.number(),
                    height: z.number(),
                  })
                  .nullish(),
              }),
              fileName: z.string(),
              contentType: z.string(),
            }),
          }),
        }),
      ),
    )
    .nullish(),
  wistiaMediaId: z.string().nullish(),
  wistiaMediaSegments: z.array(z.string()).nullish(),
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
        type: z.union([z.literal('Asset'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
        contentType: z.undefined().nullish(),
      }),
      fields: z.object({
        title: z.string().nullish(),
        description: z.string().nullish(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .nullish(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .nullish(),
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
        type: z.union([z.literal('Entry'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
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
    .nullish(),
  mediaReference: z
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
        type: z.union([z.literal('Asset'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
        contentType: z.undefined().nullish(),
      }),
      fields: z.object({
        title: z.string().nullish(),
        description: z.string().nullish(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .nullish(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .nullish(),
  externalLink: z.string().nullish(),
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
  heading: z.string().nullish(),
  subheading: z.string().nullish(),
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
        type: z.union([z.literal('Entry'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
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
    .nullish(),
  video: z.string().nullish(),
  inspirationCards: z
    .array(
      z
        .object({
          metadata: z
            .object({
              tags: z.array(z.unknown()).nullish(),
              concepts: z.array(z.unknown()).nullish(),
            })
            .nullish(),
          sys: z
            .object({
              space: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Space').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              id: z.string().nullish(),
              type: z.union([z.literal('Entry'), z.literal('Link')]).nullish(),
              createdAt: z.string().datetime().nullish(),
              updatedAt: z.string().datetime().nullish(),
              environment: z
                .object({
                  sys: z
                    .object({
                      id: z.string().nullish(),
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Environment').nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              publishedVersion: z.number().nullish(),
              revision: z.number().nullish(),
              locale: z.string().nullish(),
              contentType: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('ContentType').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
            })
            .nullish(),
          fields: z.record(z.string(), z.unknown()).nullish(),
        })
        .nullish(),
    )
    .transform((arr) => arr.filter((item) => item?.sys?.publishedVersion))
    .pipe(
      z.array(
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
            type: z.union([z.literal('Entry'), z.literal('Link')]),
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime(),
            environment: z.object({
              sys: z.object({
                id: z.string(),
                type: z.literal('Link'),
                linkType: z.literal('Environment'),
              }),
            }),
            publishedVersion: z.number().nullish(),
            revision: z.number(),
            locale: z.string().nullish(),
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
    )
    .nullish(),
  variant: z.string().nullish(),
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
  subtitle: z.string().nullish(),
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
        type: z.union([z.literal('Asset'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
        contentType: z.undefined().nullish(),
      }),
      fields: z.object({
        title: z.string().nullish(),
        description: z.string().nullish(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .nullish(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .nullish(),
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
        type: z.union([z.literal('Entry'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
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
    .nullish(),
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
        type: z.union([z.literal('Entry'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
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
    .nullish(),
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
  pageSlug: z.string().nullish(),
  metaTitle: z.string().nullish(),
  metaDescription: z.string().nullish(),
  metaKeywords: z.string().nullish(),
  subtitle: z.string().nullish(),
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
        type: z.union([z.literal('Asset'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
        contentType: z.undefined().nullish(),
      }),
      fields: z.object({
        title: z.string().nullish(),
        description: z.string().nullish(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .nullish(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .nullish(),
  categories: z.array(z.string()).nullish(),
  content: z.string().nullish(),
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
        type: z.union([z.literal('Entry'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
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
    .nullish(),
  wistiaMediaId: z.string().nullish(),
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
  internalName: z.string().nullish(),
  heroSlides: z
    .array(
      z
        .object({
          metadata: z
            .object({
              tags: z.array(z.unknown()).nullish(),
              concepts: z.array(z.unknown()).nullish(),
            })
            .nullish(),
          sys: z
            .object({
              space: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Space').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              id: z.string().nullish(),
              type: z.union([z.literal('Entry'), z.literal('Link')]).nullish(),
              createdAt: z.string().datetime().nullish(),
              updatedAt: z.string().datetime().nullish(),
              environment: z
                .object({
                  sys: z
                    .object({
                      id: z.string().nullish(),
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Environment').nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              publishedVersion: z.number().nullish(),
              revision: z.number().nullish(),
              locale: z.string().nullish(),
              contentType: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('ContentType').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
            })
            .nullish(),
          fields: z.record(z.string(), z.unknown()).nullish(),
        })
        .nullish(),
    )
    .transform((arr) => arr.filter((item) => item?.sys?.publishedVersion))
    .pipe(
      z.array(
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
            type: z.union([z.literal('Entry'), z.literal('Link')]),
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime(),
            environment: z.object({
              sys: z.object({
                id: z.string(),
                type: z.literal('Link'),
                linkType: z.literal('Environment'),
              }),
            }),
            publishedVersion: z.number().nullish(),
            revision: z.number(),
            locale: z.string().nullish(),
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
    )
    .nullish(),
  vertical: z.boolean().nullish(),
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
        type: z.union([z.literal('Asset'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
        contentType: z.undefined().nullish(),
      }),
      fields: z.object({
        title: z.string().nullish(),
        description: z.string().nullish(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .nullish(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .nullish(),
  wistiaId: z.string().nullish(),
  addLinearBackground: z.boolean().nullish(),
  headline: z.string(),
  subhead: z.string().nullish(),
  invertTextColor: z.boolean().nullish(),
  ctaLabel: z.string().nullish(),
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
        type: z.union([z.literal('Entry'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
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
    .nullish(),
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
  title: z.string().nullish(),
  description: z.string().nullish(),
  inputPlaceholder: z.string().nullish(),
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
  subtitle: z.string().nullish(),
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
  title: z.string(),
  pageSlug: z.string(),
  metaTitle: z.string().nullish(),
  metaDescription: z.string().nullish(),
  metaKeywords: z.string().nullish(),
  subtitle: z.string().nullish(),
  categories: z.array(z.string()).nullish(),
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
        type: z.union([z.literal('Asset'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
        contentType: z.undefined().nullish(),
      }),
      fields: z.object({
        title: z.string().nullish(),
        description: z.string().nullish(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .nullish(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .nullish(),
  story: z
    .object({
      nodeType: z.literal(BLOCKS.DOCUMENT),
      data: z.record(z.string(), z.unknown()),
      content: z.array(RichTextNodeSchema),
    })
    .nullish(),
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
        type: z.union([z.literal('Entry'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
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
    .nullish(),
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
  heroEyebrow: z.string().nullish(),
  heroTagline: z.string().nullish(),
  type: z.string().nullish(),
  invertTextColor: z.boolean().nullish(),
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
        type: z.union([z.literal('Entry'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
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
    .nullish(),
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
        type: z.union([z.literal('Asset'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
        contentType: z.undefined().nullish(),
      }),
      fields: z.object({
        title: z.string().nullish(),
        description: z.string().nullish(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .nullish(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .nullish(),
  wistiaId: z.string().nullish(),
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
  sectionDescription: z.string().nullish(),
  principles: z
    .array(
      z
        .object({
          metadata: z
            .object({
              tags: z.array(z.unknown()).nullish(),
              concepts: z.array(z.unknown()).nullish(),
            })
            .nullish(),
          sys: z
            .object({
              space: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Space').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              id: z.string().nullish(),
              type: z.union([z.literal('Entry'), z.literal('Link')]).nullish(),
              createdAt: z.string().datetime().nullish(),
              updatedAt: z.string().datetime().nullish(),
              environment: z
                .object({
                  sys: z
                    .object({
                      id: z.string().nullish(),
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Environment').nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              publishedVersion: z.number().nullish(),
              revision: z.number().nullish(),
              locale: z.string().nullish(),
              contentType: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('ContentType').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
            })
            .nullish(),
          fields: z.record(z.string(), z.unknown()).nullish(),
        })
        .nullish(),
    )
    .transform((arr) => arr.filter((item) => item?.sys?.publishedVersion))
    .pipe(
      z.array(
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
            type: z.union([z.literal('Entry'), z.literal('Link')]),
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime(),
            environment: z.object({
              sys: z.object({
                id: z.string(),
                type: z.literal('Link'),
                linkType: z.literal('Environment'),
              }),
            }),
            publishedVersion: z.number().nullish(),
            revision: z.number(),
            locale: z.string().nullish(),
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
        type: z.union([z.literal('Entry'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
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
    .nullish(),
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
        type: z.union([z.literal('Asset'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
        contentType: z.undefined().nullish(),
      }),
      fields: z.object({
        title: z.string().nullish(),
        description: z.string().nullish(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .nullish(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .nullish(),
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
  sectionTitle: z.string().nullish(),
  sectionSubtitle: z.string().nullish(),
  buttonText: z.string().nullish(),
  buttonLink: z.string().nullish(),
  ctaList: z
    .array(
      z
        .object({
          metadata: z
            .object({
              tags: z.array(z.unknown()).nullish(),
              concepts: z.array(z.unknown()).nullish(),
            })
            .nullish(),
          sys: z
            .object({
              space: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Space').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              id: z.string().nullish(),
              type: z.union([z.literal('Entry'), z.literal('Link')]).nullish(),
              createdAt: z.string().datetime().nullish(),
              updatedAt: z.string().datetime().nullish(),
              environment: z
                .object({
                  sys: z
                    .object({
                      id: z.string().nullish(),
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Environment').nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              publishedVersion: z.number().nullish(),
              revision: z.number().nullish(),
              locale: z.string().nullish(),
              contentType: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('ContentType').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
            })
            .nullish(),
          fields: z.record(z.string(), z.unknown()).nullish(),
        })
        .nullish(),
    )
    .transform((arr) => arr.filter((item) => item?.sys?.publishedVersion))
    .pipe(
      z.array(
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
            type: z.union([z.literal('Entry'), z.literal('Link')]),
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime(),
            environment: z.object({
              sys: z.object({
                id: z.string(),
                type: z.literal('Link'),
                linkType: z.literal('Environment'),
              }),
            }),
            publishedVersion: z.number().nullish(),
            revision: z.number(),
            locale: z.string().nullish(),
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
    )
    .nullish(),
  variant: z.string().nullish(),
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
  sectionDescription: z.string().nullish(),
  signUpLabel: z.string(),
  signUpDescription: z.string().nullish(),
  signUpPlaceholder: z.string(),
  socialLabel: z.string().nullish(),
  socialDescription: z.string().nullish(),
  socialLinks: z.array(z.string()).nullish(),
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
  subtitle: z.string().nullish(),
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
        type: z.union([z.literal('Asset'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
        contentType: z.undefined().nullish(),
      }),
      fields: z.object({
        title: z.string().nullish(),
        description: z.string().nullish(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .nullish(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .nullish(),
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
        type: z.union([z.literal('Entry'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
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
    .nullish(),
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
  variant: z.string().nullish(),
  isPageHeader: z.boolean().nullish(),
  title: z.string(),
  description: z.string().nullish(),
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
        type: z.union([z.literal('Asset'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
        contentType: z.undefined().nullish(),
      }),
      fields: z.object({
        title: z.string().nullish(),
        description: z.string().nullish(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .nullish(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .nullish(),
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
        type: z.union([z.literal('Asset'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
        contentType: z.undefined().nullish(),
      }),
      fields: z.object({
        title: z.string().nullish(),
        description: z.string().nullish(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .nullish(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .nullish(),
  wistiaId: z.string().nullish(),
  invertText: z.boolean().nullish(),
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
        type: z.union([z.literal('Entry'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
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
    .nullish(),
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
        type: z.union([z.literal('Entry'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
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
    .nullish(),
  reviewQuote: z.string().nullish(),
  reviewSource: z.string().nullish(),
  reviewRating: z.number().int().nullish(),
  secondaryTitle: z.string().nullish(),
  secondaryDescription: z.string().nullish(),
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
  subtitle: z.string().nullish(),
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
      type: z.union([z.literal('Entry'), z.literal('Link')]),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
      environment: z.object({
        sys: z.object({
          id: z.string(),
          type: z.literal('Link'),
          linkType: z.literal('Environment'),
        }),
      }),
      publishedVersion: z.number().nullish(),
      revision: z.number(),
      locale: z.string().nullish(),
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
        type: z.union([z.literal('Entry'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
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
    .nullish(),
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
  title: z.string().nullish(),
  subheading: z.string().nullish(),
  items: z
    .array(
      z
        .object({
          metadata: z
            .object({
              tags: z.array(z.unknown()).nullish(),
              concepts: z.array(z.unknown()).nullish(),
            })
            .nullish(),
          sys: z
            .object({
              space: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Space').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              id: z.string().nullish(),
              type: z.union([z.literal('Entry'), z.literal('Link')]).nullish(),
              createdAt: z.string().datetime().nullish(),
              updatedAt: z.string().datetime().nullish(),
              environment: z
                .object({
                  sys: z
                    .object({
                      id: z.string().nullish(),
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Environment').nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              publishedVersion: z.number().nullish(),
              revision: z.number().nullish(),
              locale: z.string().nullish(),
              contentType: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('ContentType').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
            })
            .nullish(),
          fields: z.record(z.string(), z.unknown()).nullish(),
        })
        .nullish(),
    )
    .transform((arr) => arr.filter((item) => item?.sys?.publishedVersion))
    .pipe(
      z.array(
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
            type: z.union([z.literal('Entry'), z.literal('Link')]),
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime(),
            environment: z.object({
              sys: z.object({
                id: z.string(),
                type: z.literal('Link'),
                linkType: z.literal('Environment'),
              }),
            }),
            publishedVersion: z.number().nullish(),
            revision: z.number(),
            locale: z.string().nullish(),
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
    )
    .nullish(),
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
  subtitle: z.string().nullish(),
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
      type: z.union([z.literal('Entry'), z.literal('Link')]),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
      environment: z.object({
        sys: z.object({
          id: z.string(),
          type: z.literal('Link'),
          linkType: z.literal('Environment'),
        }),
      }),
      publishedVersion: z.number().nullish(),
      revision: z.number(),
      locale: z.string().nullish(),
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
      type: z.union([z.literal('Entry'), z.literal('Link')]),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
      environment: z.object({
        sys: z.object({
          id: z.string(),
          type: z.literal('Link'),
          linkType: z.literal('Environment'),
        }),
      }),
      publishedVersion: z.number().nullish(),
      revision: z.number(),
      locale: z.string().nullish(),
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
  variant: z.string().nullish(),
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
      z
        .object({
          metadata: z
            .object({
              tags: z.array(z.unknown()).nullish(),
              concepts: z.array(z.unknown()).nullish(),
            })
            .nullish(),
          sys: z
            .object({
              space: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Space').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              id: z.string().nullish(),
              type: z.union([z.literal('Asset'), z.literal('Link')]).nullish(),
              createdAt: z.string().datetime().nullish(),
              updatedAt: z.string().datetime().nullish(),
              environment: z
                .object({
                  sys: z
                    .object({
                      id: z.string().nullish(),
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Environment').nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              publishedVersion: z.number().nullish(),
              revision: z.number().nullish(),
              locale: z.string().nullish(),
              contentType: z.undefined().nullish(),
            })
            .nullish(),
          fields: z
            .object({
              title: z.string().nullish(),
              description: z.string().nullish(),
              file: z
                .object({
                  url: z.string().nullish(),
                  details: z
                    .object({
                      size: z.number().nullish(),
                      image: z
                        .object({
                          width: z.number(),
                          height: z.number(),
                        })
                        .nullish(),
                    })
                    .nullish(),
                  fileName: z.string().nullish(),
                  contentType: z.string().nullish(),
                })
                .nullish(),
            })
            .nullish(),
        })
        .nullish(),
    )
    .transform((arr) => arr.filter((item) => item?.sys?.publishedVersion))
    .pipe(
      z.array(
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
            type: z.union([z.literal('Asset'), z.literal('Link')]),
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime(),
            environment: z.object({
              sys: z.object({
                id: z.string(),
                type: z.literal('Link'),
                linkType: z.literal('Environment'),
              }),
            }),
            publishedVersion: z.number().nullish(),
            revision: z.number(),
            locale: z.string().nullish(),
            contentType: z.undefined().nullish(),
          }),
          fields: z.object({
            title: z.string().nullish(),
            description: z.string().nullish(),
            file: z.object({
              url: z.string(),
              details: z.object({
                size: z.number(),
                image: z
                  .object({
                    width: z.number(),
                    height: z.number(),
                  })
                  .nullish(),
              }),
              fileName: z.string(),
              contentType: z.string(),
            }),
          }),
        }),
      ),
    )
    .nullish(),
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
  description: z.string().nullish(),
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
      type: z.union([z.literal('Asset'), z.literal('Link')]),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
      environment: z.object({
        sys: z.object({
          id: z.string(),
          type: z.literal('Link'),
          linkType: z.literal('Environment'),
        }),
      }),
      publishedVersion: z.number().nullish(),
      revision: z.number(),
      locale: z.string().nullish(),
      contentType: z.undefined().nullish(),
    }),
    fields: z.object({
      title: z.string().nullish(),
      description: z.string().nullish(),
      file: z.object({
        url: z.string(),
        details: z.object({
          size: z.number(),
          image: z
            .object({
              width: z.number(),
              height: z.number(),
            })
            .nullish(),
        }),
        fileName: z.string(),
        contentType: z.string(),
      }),
    }),
  }),
  wistiaId: z.string().nullish(),
  products: z
    .array(
      z
        .object({
          metadata: z
            .object({
              tags: z.array(z.unknown()).nullish(),
              concepts: z.array(z.unknown()).nullish(),
            })
            .nullish(),
          sys: z
            .object({
              space: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Space').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              id: z.string().nullish(),
              type: z.union([z.literal('Entry'), z.literal('Link')]).nullish(),
              createdAt: z.string().datetime().nullish(),
              updatedAt: z.string().datetime().nullish(),
              environment: z
                .object({
                  sys: z
                    .object({
                      id: z.string().nullish(),
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Environment').nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              publishedVersion: z.number().nullish(),
              revision: z.number().nullish(),
              locale: z.string().nullish(),
              contentType: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('ContentType').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
            })
            .nullish(),
          fields: z.record(z.string(), z.unknown()).nullish(),
        })
        .nullish(),
    )
    .transform((arr) => arr.filter((item) => item?.sys?.publishedVersion))
    .pipe(
      z.array(
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
            type: z.union([z.literal('Entry'), z.literal('Link')]),
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime(),
            environment: z.object({
              sys: z.object({
                id: z.string(),
                type: z.literal('Link'),
                linkType: z.literal('Environment'),
              }),
            }),
            publishedVersion: z.number().nullish(),
            revision: z.number(),
            locale: z.string().nullish(),
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
    )
    .nullish(),
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
  subtitle: z.string().nullish(),
  pageAnchor: z.string().nullish(),
  products: z
    .array(
      z
        .object({
          metadata: z
            .object({
              tags: z.array(z.unknown()).nullish(),
              concepts: z.array(z.unknown()).nullish(),
            })
            .nullish(),
          sys: z
            .object({
              space: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Space').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              id: z.string().nullish(),
              type: z.union([z.literal('Entry'), z.literal('Link')]).nullish(),
              createdAt: z.string().datetime().nullish(),
              updatedAt: z.string().datetime().nullish(),
              environment: z
                .object({
                  sys: z
                    .object({
                      id: z.string().nullish(),
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Environment').nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              publishedVersion: z.number().nullish(),
              revision: z.number().nullish(),
              locale: z.string().nullish(),
              contentType: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('ContentType').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
            })
            .nullish(),
          fields: z.record(z.string(), z.unknown()).nullish(),
        })
        .nullish(),
    )
    .transform((arr) => arr.filter((item) => item?.sys?.publishedVersion))
    .pipe(
      z.array(
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
            type: z.union([z.literal('Entry'), z.literal('Link')]),
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime(),
            environment: z.object({
              sys: z.object({
                id: z.string(),
                type: z.literal('Link'),
                linkType: z.literal('Environment'),
              }),
            }),
            publishedVersion: z.number().nullish(),
            revision: z.number(),
            locale: z.string().nullish(),
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
    )
    .nullish(),
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
  pageAnchor: z.string().nullish(),
  quoteText: z.string().nullish(),
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
        type: z.union([z.literal('Asset'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
        contentType: z.undefined().nullish(),
      }),
      fields: z.object({
        title: z.string().nullish(),
        description: z.string().nullish(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .nullish(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .nullish(),
  quoteAuthorName: z.string().nullish(),
  quoteAuthorTitle: z.string().nullish(),
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
        type: z.union([z.literal('Asset'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
        contentType: z.undefined().nullish(),
      }),
      fields: z.object({
        title: z.string().nullish(),
        description: z.string().nullish(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .nullish(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .nullish(),
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
        type: z.union([z.literal('Entry'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
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
    .nullish(),
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
  logo: z
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
        type: z.union([z.literal('Asset'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
        contentType: z.undefined().nullish(),
      }),
      fields: z.object({
        title: z.string().nullish(),
        description: z.string().nullish(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .nullish(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .nullish(),
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
  items: z
    .array(
      z
        .object({
          metadata: z
            .object({
              tags: z.array(z.unknown()).nullish(),
              concepts: z.array(z.unknown()).nullish(),
            })
            .nullish(),
          sys: z
            .object({
              space: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Space').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              id: z.string().nullish(),
              type: z.union([z.literal('Entry'), z.literal('Link')]).nullish(),
              createdAt: z.string().datetime().nullish(),
              updatedAt: z.string().datetime().nullish(),
              environment: z
                .object({
                  sys: z
                    .object({
                      id: z.string().nullish(),
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Environment').nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              publishedVersion: z.number().nullish(),
              revision: z.number().nullish(),
              locale: z.string().nullish(),
              contentType: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('ContentType').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
            })
            .nullish(),
          fields: z.record(z.string(), z.unknown()).nullish(),
        })
        .nullish(),
    )
    .transform((arr) => arr.filter((item) => item?.sys?.publishedVersion))
    .pipe(
      z.array(
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
            type: z.union([z.literal('Entry'), z.literal('Link')]),
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime(),
            environment: z.object({
              sys: z.object({
                id: z.string(),
                type: z.literal('Link'),
                linkType: z.literal('Environment'),
              }),
            }),
            publishedVersion: z.number().nullish(),
            revision: z.number(),
            locale: z.string().nullish(),
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
  subtitle: z.string().nullish(),
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
  lead: z.string().nullish(),
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
  title: z.string().nullish(),
  links: z
    .array(
      z
        .object({
          metadata: z
            .object({
              tags: z.array(z.unknown()).nullish(),
              concepts: z.array(z.unknown()).nullish(),
            })
            .nullish(),
          sys: z
            .object({
              space: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Space').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              id: z.string().nullish(),
              type: z.union([z.literal('Entry'), z.literal('Link')]).nullish(),
              createdAt: z.string().datetime().nullish(),
              updatedAt: z.string().datetime().nullish(),
              environment: z
                .object({
                  sys: z
                    .object({
                      id: z.string().nullish(),
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('Environment').nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
              publishedVersion: z.number().nullish(),
              revision: z.number().nullish(),
              locale: z.string().nullish(),
              contentType: z
                .object({
                  sys: z
                    .object({
                      type: z.literal('Link').nullish(),
                      linkType: z.literal('ContentType').nullish(),
                      id: z.string().nullish(),
                    })
                    .nullish(),
                })
                .nullish(),
            })
            .nullish(),
          fields: z.record(z.string(), z.unknown()).nullish(),
        })
        .nullish(),
    )
    .transform((arr) => arr.filter((item) => item?.sys?.publishedVersion))
    .pipe(
      z.array(
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
            type: z.union([z.literal('Entry'), z.literal('Link')]),
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime(),
            environment: z.object({
              sys: z.object({
                id: z.string(),
                type: z.literal('Link'),
                linkType: z.literal('Environment'),
              }),
            }),
            publishedVersion: z.number().nullish(),
            revision: z.number(),
            locale: z.string().nullish(),
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
  supportType: z.string().nullish(),
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
      type: z.union([z.literal('Entry'), z.literal('Link')]),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
      environment: z.object({
        sys: z.object({
          id: z.string(),
          type: z.literal('Link'),
          linkType: z.literal('Environment'),
        }),
      }),
      publishedVersion: z.number().nullish(),
      revision: z.number(),
      locale: z.string().nullish(),
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
  subHeading: z.string().nullish(),
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
  title: z.string().nullish(),
  disclaimer: z.string().nullish(),
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

// Schema for mediaBanner
export const mediaBannerFieldsSchema = z.object({
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
        type: z.union([z.literal('Asset'), z.literal('Link')]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        environment: z.object({
          sys: z.object({
            id: z.string(),
            type: z.literal('Link'),
            linkType: z.literal('Environment'),
          }),
        }),
        publishedVersion: z.number().nullish(),
        revision: z.number(),
        locale: z.string().nullish(),
        contentType: z.undefined().nullish(),
      }),
      fields: z.object({
        title: z.string().nullish(),
        description: z.string().nullish(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .nullish(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    })
    .nullish(),
  wistiaId: z.string().nullish(),
});

export const mediaBannerSchema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('mediaBanner'),
      }),
    }),
  }),
  fields: mediaBannerFieldsSchema,
});

export type mediaBanner = z.infer<typeof mediaBannerSchema>;

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
  mediaBannerSchema,
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
  mediaBanner: mediaBannerSchema,
};

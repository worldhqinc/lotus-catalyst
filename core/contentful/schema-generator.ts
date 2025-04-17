import { z } from 'zod';

// Types for Contentful content type definitions
interface ContentfulField {
  id: string;
  name: string;
  type: string;
  localized: boolean;
  required: boolean;
  validations: any[];
  items?: {
    type: string;
    validations: any[];
    linkType?: string;
  };
  linkType?: string;
}

interface ContentfulContentType {
  sys: {
    id: string;
  };
  name: string;
  fields: ContentfulField[];
}

interface ContentfulSchema {
  contentTypes: ContentfulContentType[];
}

// Helper to create base field schema based on Contentful field type
function createBaseFieldSchema(field: Partial<ContentfulField>): z.ZodTypeAny {
  switch (field.type) {
    case 'Symbol':
    case 'Text':
      return z.string();
    case 'Integer':
      return z.number().int();
    case 'Number':
      return z.number();
    case 'Boolean':
      return z.boolean();
    case 'Date':
      return z.string().datetime();
    case 'Object':
      return z.record(z.unknown());
    case 'RichText':
      return z
        .object({
          nodeType: z.string(),
          content: z.array(z.unknown()),
          data: z.record(z.unknown()).optional(),
        })
        .array();
    case 'Array':
      if (field.items) {
        const itemSchema =
          field.items.type === 'Link'
            ? createLinkSchema(field.items.linkType)
            : createBaseFieldSchema({ type: field.items.type });
        return z.array(itemSchema);
      }
      return z.array(z.unknown());
    case 'Link':
      return createLinkSchema(field.linkType);
    default:
      return z.unknown();
  }
}

// Helper to create link schema
function createLinkSchema(linkType?: string): z.ZodTypeAny {
  // Base Sys schema for Links
  const baseLinkSysSchema = z.object({
    type: z.literal('Link'),
    linkType: z.string(), // 'Entry' or 'Asset'
    id: z.string(),
  });

  // Detailed Sys schema for Entries/Assets when they are linked *or* included
  const detailedSysSchema = z.object({
    space: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('Space'),
        id: z.string(),
      }),
    }),
    id: z.string(),
    type: z.union([z.literal('Entry'), z.literal('Asset')]), // Could be Entry or Asset
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    environment: z.object({
      sys: z.object({
        id: z.string(),
        type: z.literal('Link'),
        linkType: z.literal('Environment'),
      }),
    }),
    publishedVersion: z.number().optional(), // Optional for non-published links
    revision: z.number(),
    locale: z.string().optional(), // Locale might not be present on all sys objects? Check payload. Seems present.
    contentType: z
      .object({
        sys: z.object({
          type: z.literal('Link'),
          linkType: z.literal('ContentType'),
          id: z.string(),
        }),
      })
      .optional(), // Only present for Entries
  });

  // Metadata schema
  const metadataSchema = z.object({
    tags: z.array(z.unknown()), // Define tag structure if known, otherwise unknown
    concepts: z.array(z.unknown()), // Define concept structure if known, otherwise unknown
  });

  // Schema for Asset fields when linked/included
  const assetFieldsSchema = z.object({
    title: z.string().optional(), // Title might be optional depending on locale? Check payload. Yes, seems optional if not localized. Adjust based on actual schema def if needed.
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
          .optional(), // Only present for images
      }),
      fileName: z.string(),
      contentType: z.string(),
    }),
  });

  // Base structure for a linked item
  const linkedItemBaseSchema = z.object({
    metadata: metadataSchema,
    sys: detailedSysSchema,
  });

  // Depending on the linkType specified in the *content type definition*,
  // we might expect an Entry or an Asset.
  if (linkType === 'Asset') {
    return linkedItemBaseSchema.extend({
      sys: detailedSysSchema.extend({
        type: z.literal('Asset'), // Type must be Asset
        contentType: z.undefined().optional(), // Assets don't have contentType
      }),
      fields: assetFieldsSchema,
    });
  } else if (linkType === 'Entry') {
    // For entries, we don't know the specific fields here, they depend on the linked entry's content type.
    // The consuming generator script will handle wrapping this with specific fields.
    return linkedItemBaseSchema.extend({
      sys: detailedSysSchema.extend({
        type: z.literal('Entry'), // Type must be Entry
        contentType: z.object({
          // contentType is required for Entries
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('ContentType'),
            id: z.string(),
          }),
        }),
      }),
      fields: z.record(z.unknown()), // Generic fields for Entries
    });
  } else {
    // If linkType is unknown or not specified (e.g., for a base field check),
    // return a union or a more generic schema. Let's use a union covering both possibilities.
    return z.union([
      linkedItemBaseSchema.extend({
        sys: detailedSysSchema.extend({
          type: z.literal('Asset'),
          contentType: z.undefined().optional(),
        }),
        fields: assetFieldsSchema,
      }),
      linkedItemBaseSchema.extend({
        sys: detailedSysSchema.extend({
          type: z.literal('Entry'),
          contentType: z
            .object({
              sys: z.object({
                type: z.literal('Link'),
                linkType: z.literal('ContentType'),
                id: z.string(),
              }),
            })
            .optional(), // Make optional here for the generic case
        }),
        fields: z.record(z.unknown()),
      }),
    ]);
  }
}

// Create schema for a single content type
function createContentTypeSchema(contentType: ContentfulContentType): Record<string, z.ZodTypeAny> {
  const fieldSchemas: Record<string, z.ZodTypeAny> = {};

  for (const field of contentType.fields) {
    let fieldSchema = createBaseFieldSchema(field);

    if (!field.required) {
      fieldSchema = fieldSchema.optional();
    }

    fieldSchemas[field.id] = fieldSchema;
  }

  return fieldSchemas;
}

// Main function to generate schemas for all content types
export function generateContentfulSchemas(
  contentfulSchema: ContentfulSchema,
): Record<string, Record<string, z.ZodTypeAny>> {
  const schemas: Record<string, Record<string, z.ZodTypeAny>> = {};

  for (const contentType of contentfulSchema.contentTypes) {
    schemas[contentType.sys.id] = createContentTypeSchema(contentType);
  }

  return schemas;
}

// Example usage:
// const contentfulSchema = require('./schema.json');
// const schemas = generateContentfulSchemas(contentfulSchema);
//
// // Validate a specific content type
// const productSchema = schemas.productFinishedGoods;
// const validationResult = productSchema.safeParse(entryData);
//
// // Validate any entry
// const entrySchema = schemas.entry;
// const genericValidationResult = entrySchema.safeParse(entryData);

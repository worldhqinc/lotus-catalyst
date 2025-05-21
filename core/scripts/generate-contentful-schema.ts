/* eslint-disable */
import { BLOCKS } from '@contentful/rich-text-types';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { z } from 'zod';

// ================= Contentful Schema Types & Generators =================

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

// Helper functions for unpublished reference filtering
function filterUnpublished<T extends { sys?: { publishedVersion?: number | null } }>(
  arr: T[],
): T[] {
  return arr.filter((item) => item?.sys?.publishedVersion);
}
function singleReferenceOrNull<T extends { sys?: { publishedVersion?: number | null } }>(
  val: T | null | undefined,
): T | null {
  return val?.sys?.publishedVersion ? val : null;
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
    case 'RichText': {
      const simplifiedRichTextNode: z.ZodType<any> = z.lazy(() =>
        z.object({
          nodeType: z.string(),
          data: z.record(z.unknown()),
          content: z.array(z.any()).optional(),
          marks: z.array(z.any()).optional(),
          value: z.string().optional(),
        }),
      );
      const simplifiedRichTextSchema = z.object({
        nodeType: z.literal(BLOCKS.DOCUMENT),
        data: z.record(z.unknown()),
        content: z.array(simplifiedRichTextNode),
      });
      return simplifiedRichTextSchema;
    }
    case 'Array':
      if (field.items) {
        const itemSchema =
          field.items.type === 'Link'
            ? createLinkSchema(field.items.linkType)
            : createBaseFieldSchema({ type: field.items.type });
        // If this is an array of references, add the transform
        if (field.items.type === 'Link') {
          return z.array(itemSchema).transform(filterUnpublished);
        }
        return z.array(itemSchema);
      }
      return z.array(z.unknown());
    case 'Link': {
      // For single references, return null if unpublished
      const linkSchema = createLinkSchema(field.linkType);
      return linkSchema.transform(singleReferenceOrNull);
    }
    default:
      return z.unknown();
  }
}

// Helper to create link schema
function createLinkSchema(linkType?: string): z.ZodTypeAny {
  const detailedSysSchema = z.object({
    space: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('Space'),
        id: z.string(),
      }),
    }),
    id: z.string(),
    type: z.union([z.literal('Entry'), z.literal('Asset')]),
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
    contentType: z
      .object({
        sys: z.object({
          type: z.literal('Link'),
          linkType: z.literal('ContentType'),
          id: z.string(),
        }),
      })
      .optional(),
  });
  const metadataSchema = z.object({
    tags: z.array(z.unknown()),
    concepts: z.array(z.unknown()),
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
  const linkedItemBaseSchema = z.object({
    metadata: metadataSchema,
    sys: detailedSysSchema,
  });
  if (linkType === 'Asset') {
    return linkedItemBaseSchema.extend({
      sys: detailedSysSchema.extend({
        type: z.literal('Asset'),
        contentType: z.undefined().optional(),
      }),
      fields: assetFieldsSchema,
    });
  } else if (linkType === 'Entry') {
    return linkedItemBaseSchema.extend({
      sys: detailedSysSchema.extend({
        type: z.literal('Entry'),
        contentType: z.object({
          sys: z.object({
            type: z.literal('Link'),
            linkType: z.literal('ContentType'),
            id: z.string(),
          }),
        }),
      }),
      fields: z.record(z.unknown()),
    });
  } else {
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
            .optional(),
        }),
        fields: z.record(z.unknown()),
      }),
    ]);
  }
}

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

function generateContentfulSchemas(
  contentfulSchema: ContentfulSchema,
): Record<string, Record<string, z.ZodTypeAny>> {
  const schemas: Record<string, Record<string, z.ZodTypeAny>> = {};
  for (const contentType of contentfulSchema.contentTypes) {
    schemas[contentType.sys.id] = createContentTypeSchema(contentType);
  }
  return schemas;
}

// Read the schema.json file
const contentfulJsonPath = resolve(__dirname, '../contentful/schema.json');
const contentfulSchema = JSON.parse(readFileSync(contentfulJsonPath, 'utf-8'));

// Generate schemas for the 'fields' part only
const fieldSchemasMap = generateContentfulSchemas(contentfulSchema);

// Name for the known recursive Rich Text schema
const RICH_TEXT_SCHEMA_NAME = 'RichTextNodeSchema';

// ========================================
// Helper functions for transforms
// ========================================
const filterUnpublishedHelper = `// Utility to filter unpublished references in arrays\nfunction filterUnpublished<T extends { sys?: { publishedVersion?: number | null } }>(arr: T[]): T[] {\n  return arr.filter((item) => item?.sys?.publishedVersion);\n}`;
const singleReferenceTransformHelper = `// Utility to return null for unpublished single references\nfunction singleReferenceOrNull<T extends { sys?: { publishedVersion?: number | null } }>(val: T | null | undefined): T | null {\n  return val?.sys?.publishedVersion ? val : null;\n}`;

// --- Trackers for helper emission ---
let usesFilterUnpublished = false;
let usesSingleReferenceTransform = false;

// Helper to convert a field schema to a string representation (Simplified for recursion)
function zodToString(schema: any, indentationLevel = 0): string {
  if (!schema?._def) return 'z.unknown()';

  const indent = '  '.repeat(indentationLevel);
  const nextIndent = '  '.repeat(indentationLevel + 1);

  switch (schema._def.typeName) {
    case 'ZodLazy':
      return RICH_TEXT_SCHEMA_NAME;
    case 'ZodEffects': {
      const effect = schema._def.effect;
      if (effect && effect.type === 'transform') {
        const fnStr = effect.transform.toString();
        if (
          fnStr.includes('filterUnpublished') ||
          (fnStr.includes('publishedVersion') && fnStr.includes('filter'))
        ) {
          usesFilterUnpublished = true;
          return `${zodToString(schema._def.schema, indentationLevel)}.transform(filterUnpublished)`;
        }
        if (fnStr.includes('publishedVersion') && fnStr.includes('val ?')) {
          usesSingleReferenceTransform = true;
          return `${zodToString(schema._def.schema, indentationLevel)}.transform(singleReferenceOrNull)`;
        }
      }
      return zodToString(schema._def.schema, indentationLevel);
    }
    case 'ZodString':
      return schema._def.checks?.some((c: any) => c.kind === 'datetime')
        ? 'z.string().datetime()'
        : 'z.string()';
    case 'ZodNumber':
      return schema._def.checks?.some((c: any) => c.kind === 'int')
        ? 'z.number().int()'
        : 'z.number()';
    case 'ZodBoolean':
      return 'z.boolean()';
    case 'ZodArray': {
      const itemTypeString = schema._def.type
        ? zodToString(schema._def.type, indentationLevel)
        : 'z.unknown()';
      return `z.array(${itemTypeString})`;
    }
    case 'ZodObject': {
      const shape = schema._def.shape();
      const fields = Object.entries(shape)
        .map(([key, value]) =>
          value instanceof z.ZodType
            ? `${nextIndent}${key}: ${zodToString(value, indentationLevel + 1)}`
            : `${nextIndent}${key}: z.unknown() /* Non-Zod value encountered */`,
        )
        .join(',\n');
      return `z.object({\n${fields}${fields ? '\n' : ''}${indent}})`;
    }
    case 'ZodOptional': {
      const optionalTypeString = schema._def.innerType
        ? zodToString(schema._def.innerType, indentationLevel)
        : 'z.unknown()';
      return `${optionalTypeString}.optional().nullable()`;
    }
    case 'ZodRecord': {
      const keyTypeString =
        schema._def.keyType instanceof z.ZodType
          ? zodToString(schema._def.keyType, indentationLevel)
          : 'z.unknown()';
      const valueTypeString =
        schema._def.valueType instanceof z.ZodType
          ? zodToString(schema._def.valueType, indentationLevel + 1)
          : 'z.unknown()';
      return `z.record(${keyTypeString}, ${valueTypeString})`;
    }
    case 'ZodLiteral':
      if (schema._def.value === BLOCKS.DOCUMENT) {
        return `z.literal(BLOCKS.DOCUMENT)`;
      }
      return `z.literal(${JSON.stringify(schema._def.value)})`;
    case 'ZodUnion': {
      const unionOptions = Array.isArray(schema._def.options)
        ? schema._def.options
            .map((opt: any) =>
              opt instanceof z.ZodType ? zodToString(opt, indentationLevel) : 'z.unknown()',
            )
            .join(', ')
        : '';
      return `z.union([${unionOptions}])`;
    }
    case 'ZodUnknown':
      return 'z.unknown()';
    case 'ZodNever':
      return 'z.never()';
    case 'ZodUndefined':
      return 'z.undefined()';
    default:
      console.warn(`Unhandled Zod type: ${schema._def.typeName}`);
      return 'z.unknown()';
  }
}

// Generate the string for all content type schemas and set tracker flags
const contentTypeSchemasString = Object.entries(fieldSchemasMap)
  .map(([key, fields]) => {
    const fieldsSchemaString = zodToString(z.object(fields), 1);
    return `
// Schema for ${key}
export const ${key}FieldsSchema = ${fieldsSchemaString};

export const ${key}Schema = z.object({
  metadata: metadataSchema,
  sys: sysEntrySchema.extend({
    contentType: z.object({
      sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('ContentType'),
        id: z.literal('${key}'),
      }),
    }),
  }),
  fields: ${key}FieldsSchema,
});

export type ${key} = z.infer<typeof ${key}Schema>;`;
  })
  .join('\n\n');

// Convert schemas to TypeScript code
const schemaCode = `import { z } from 'zod';
import { BLOCKS } from '@contentful/rich-text-types';

${usesFilterUnpublished ? filterUnpublishedHelper + '\n\n' : ''}${usesSingleReferenceTransform ? singleReferenceTransformHelper + '\n\n' : ''}
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
      image: z.object({
        width: z.number(),
        height: z.number(),
      }).optional().nullable(),
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

// Define the recursive ${RICH_TEXT_SCHEMA_NAME} using z.lazy
const ${RICH_TEXT_SCHEMA_NAME}: z.ZodType<any> = z.lazy(() => z.object({
  nodeType: z.string(),
  data: z.record(z.unknown()),
  // Leaf node approximation for the union, ensure it aligns with your actual leaf structure
  content: z.array(z.union([${RICH_TEXT_SCHEMA_NAME}, z.object({ nodeType: z.literal('text'), data: z.record(z.unknown()), marks: z.array(z.any()), value: z.string() })])).optional().nullable(),
  marks: z.array(z.any()).optional().nullable(), // Adjust marks as needed
  value: z.string().optional().nullable()
}));
// Optional: Define a type alias for convenience
export type RichTextNode = z.infer<typeof ${RICH_TEXT_SCHEMA_NAME}>;

// ========================================
// Content Type Specific Schemas
// ========================================

${contentTypeSchemasString}

// ========================================
// Union Schema and Helper Object
// ========================================

export const contentfulEntrySchemaUnion = z.union([
  ${Object.keys(fieldSchemasMap)
    .map((key) => `${key}Schema`)
    .join(',\n  ')}
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
  ${Object.keys(fieldSchemasMap)
    .map((key) => `${key}: ${key}Schema`)
    .join(',\n  ')}
};
`;

// Write the output
const outputPath = resolve(__dirname, '../contentful/schema.ts');

writeFileSync(outputPath, schemaCode);

console.log('Successfully generated Contentful schemas!');

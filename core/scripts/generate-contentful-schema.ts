/* eslint-disable */
import { BLOCKS } from '@contentful/rich-text-types';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { z } from 'zod';

import { generateContentfulSchemas } from '../contentful/schema-generator';

// Read the schema.json file
const contentfulJsonPath = resolve(__dirname, '../contentful/schema.json');
const contentfulSchema = JSON.parse(readFileSync(contentfulJsonPath, 'utf-8'));

// Generate schemas for the 'fields' part only
const fieldSchemasMap = generateContentfulSchemas(contentfulSchema);

// Name for the known recursive Rich Text schema
const RICH_TEXT_SCHEMA_NAME = 'RichTextNodeSchema';

// Helper to convert a field schema to a string representation (Simplified for recursion)
function zodToString(schema: any, indentationLevel = 0): string {
  if (!schema?._def) return 'z.unknown()';

  const indent = '  '.repeat(indentationLevel);
  const nextIndent = '  '.repeat(indentationLevel + 1);

  // --- Type Handling (Simplified Lazy Handling) ---
  switch (schema._def.typeName) {
    case 'ZodLazy':
      // Directly return the predefined name. Assumes this is the Rich Text schema.
      // This prevents recursion during string generation.
      return RICH_TEXT_SCHEMA_NAME;
    case 'ZodEffects':
      return zodToString(schema._def.schema, indentationLevel);
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
      return `${optionalTypeString}.optional()`;
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

// Convert schemas to TypeScript code
const schemaCode = `import { z } from 'zod';
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
      image: z.object({
        width: z.number(),
        height: z.number(),
      }).optional(),
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
  content: z.array(z.union([${RICH_TEXT_SCHEMA_NAME}, z.object({ nodeType: z.literal('text'), data: z.record(z.unknown()), marks: z.array(z.any()), value: z.string() })])).optional(),
  marks: z.array(z.any()).optional(), // Adjust marks as needed
  value: z.string().optional()
}));
// Optional: Define a type alias for convenience
export type RichTextNode = z.infer<typeof ${RICH_TEXT_SCHEMA_NAME}>;

// ========================================
// Content Type Specific Schemas
// ========================================

${Object.entries(fieldSchemasMap)
  .map(([key, fields]) => {
    // Generate the string for the fields object schema using the simplified zodToString
    const fieldsSchemaString = zodToString(z.object(fields), 1);

    // Construct the full schema definition string for the content type
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
  .join('\n\n')}

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

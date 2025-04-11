/** @type {import('contentful-to-zod').ContentfulToZodConfig} */
export default {
  // Generate flat schemas without references
  flat: false,

  // Allow unknown keys in objects for flexibility
  passthrough: true,

  // Don't throw error for unsupported types
  abortOnUnknown: false,

  // Custom naming functions to match your codebase style
  // toTypeName: (entity) => `${entity}Type`,
  // toSchemaName: (entity) => `${entity}Schema`,
};

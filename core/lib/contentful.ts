import { createClient } from 'contentful';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID ?? '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN ?? '',
  environment: process.env.CONTENTFUL_ENVIRONMENT ?? '',
});

export async function getPages() {
  const response = await client.getEntries({
    content_type: 'pageStandard',
  });

  return response.items;
}

export async function getPageBySlug(slug: string) {
  const response = await client.getEntries({
    content_type: 'pageStandard',
    'fields.pageSlug': slug,
    limit: 1,
  });

  return response.items[0];
}

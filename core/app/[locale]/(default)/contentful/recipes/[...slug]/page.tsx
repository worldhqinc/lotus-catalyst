import { Metadata } from 'next';
import { SearchParams } from 'nuqs';

import { recipeSchema } from '~/contentful/schema';

import { getPageBySlug } from '../../[...rest]/page-data';

interface Props {
  params: Promise<{ locale: string; slug: string[] }>;
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug('recipe', ['recipes', ...slug]);
  const result = recipeSchema.safeParse(page);

  if (!result.success) {
    return {};
  }

  const { fields } = result.data;

  return {
    title: fields.metaTitle || fields.recipeName,
    description: fields.metaDescription,
  };
}

export default async function RecipePage({ params }: Props) {
  const { slug } = await params;
  const page = await getPageBySlug('recipe', ['recipes', ...slug]);
  const result = recipeSchema.safeParse(page);

  if (!result.success) {
    return null;
  }

  const { fields } = result.data;
  const pageName = fields.recipeName;

  return (
    <div>
      <h1>{pageName}</h1>
    </div>
  );
}

import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import type { Metadata } from 'next';
import { SearchParams } from 'nuqs';

import { getPageBySlug } from './page-data';

interface Props {
  params: Promise<{ locale: string; rest: string[] }>;
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { rest } = await params;
  const page = await getPageBySlug(rest);
  const fields = page.fields;

  return {
    title: fields.metaTitleSeo || fields.pageName,
    description: fields.metaDescription,
    keywords: fields.metaKeywordsSeo,
  };
}

export default async function ContentfulPage({ params }: Props) {
  const { rest } = await params;
  const page = await getPageBySlug(rest);

  const fields = page.fields;
  const pageName = fields.pageName;
  const pageDescription = documentToHtmlString(fields.optionalPageDescription);

  return (
    <div>
      <h1>{pageName}</h1>
      <div dangerouslySetInnerHTML={{ __html: pageDescription }} />
    </div>
  );
}

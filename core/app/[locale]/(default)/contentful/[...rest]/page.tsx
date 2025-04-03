import type { Metadata } from 'next';
import { SearchParams } from 'nuqs';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

import { getPageBySlug } from './page-data';
import PageContentEntries from '../_components/page-content-entries';

interface Props {
  params: Promise<{ locale: string; rest: string[] }>;
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { rest } = await params;
  const page = await getPageBySlug('pageStandard', rest);
  const fields = page.fields;

  return {
    title: fields.metaTitleSeo || fields.pageName,
    description: fields.metaDescription,
    keywords: fields.metaKeywordsSeo,
  };
}

export default async function ContentfulPage({ params }: Props) {
  const { rest } = await params;
  const page = await getPageBySlug('pageStandard', rest);
  const fields = page.fields;
  const pageName = fields.pageName;
  const pageDescription = documentToHtmlString(fields.optionalPageDescription);
  const pageContent = fields.pageContent;

  return (
    <div>
      <h1>{pageName}</h1>
      {pageDescription ? <div dangerouslySetInnerHTML={{ __html: pageDescription }} /> : null}
      <PageContentEntries pageContent={pageContent} />
    </div>
  );
}

import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import type { Metadata } from 'next';
import { SearchParams } from 'nuqs';

import PageContentEntries from '../_components/page-content-entries';

import { getPageBySlug } from './page-data';

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
  // eslint-disable-next-line
  const pageDescription = documentToHtmlString(fields.optionalPageDescription);
  const pageContent = fields.pageContent;

  return (
    <div className="@container">
      <div className="container py-8 @2xl:py-16 @4xl:py-24">
        <h1 className="m-0 max-w-xl font-[family-name:var(--slideshow-title-font-family,var(--font-family-heading))] text-4xl leading-none font-medium @2xl:text-5xl @2xl:leading-[.9] @4xl:text-6xl">
          {pageName}
        </h1>
      </div>
      {pageDescription ? <div dangerouslySetInnerHTML={{ __html: pageDescription }} /> : null}
      <PageContentEntries pageContent={pageContent} />
    </div>
  );
}

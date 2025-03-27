import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import type { Metadata } from 'next';
import { SearchParams } from 'nuqs';

import { getPageBySlug, type PageContentField } from './page-data';

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
  const pageContent = fields.pageContent ? fields.pageContent : [];

  return (
    <div>
      <h1>{pageName}</h1>
      {pageDescription ? <div dangerouslySetInnerHTML={{ __html: pageDescription }} /> : null}
      {Array.isArray(pageContent) &&
        pageContent.map((field: PageContentField) => (
          <div key={field.sys.id}>
            {field.sys.contentType.sys.id === 'button' ? (
              <div key={field.sys.id}>Button Display Component</div>
            ) : null}
            {field.sys.contentType.sys.id === 'faq' ? (
              <div key={field.sys.id}>FAQ Display Component</div>
            ) : null}
          </div>
        ))}
    </div>
  );
}

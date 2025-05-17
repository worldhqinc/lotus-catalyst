import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import type { Metadata } from 'next';
import { SearchParams } from 'nuqs';

import { PageContentEntries } from '~/components/contentful/page-content-entries';

import { routing } from '~/i18n/routing';
import { getPageBySlug } from './page-data';

const SPECIAL_LAYOUT_PAGES = ['returns', 'warranty', 'free-shipping'] as const;

function shouldShowSpecialLayout(rest: string[]): boolean {
  return SPECIAL_LAYOUT_PAGES.some((page) => rest.includes(page));
}

interface Props {
  params: Promise<{ locale: string; rest: string[] }>;
  searchParams: Promise<SearchParams>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { rest } = await params;
  const page = await getPageBySlug('pageStandard', rest);

  const { fields } = page;

  return {
    title: fields.metaTitleSeo || fields.pageName,
    description: fields.metaDescription,
    keywords: fields.metaKeywordsSeo,
  };
}

export default async function ContentfulPage({ params, searchParams }: Props) {
  const [{ rest }, queryParams] = await Promise.all([params, searchParams]);
  const page = await getPageBySlug('pageStandard', rest);

  return shouldShowSpecialLayout(rest) ? (
    <div>
      <section className="space-y-16 py-8 lg:space-y-24 lg:py-16">
        <div className="container max-w-2xl text-center">
          <h1 className="font-heading text-4xl leading-[100%] uppercase md:text-6xl">
            {page.fields.pageName}
          </h1>
        </div>
        {page.fields.optionalPageDescription && (
          <div
            className="prose container max-w-2xl"
            dangerouslySetInnerHTML={{
              __html: documentToHtmlString(page.fields.optionalPageDescription),
            }}
          />
        )}
      </section>
      <PageContentEntries pageContent={page.fields.pageContent} searchParams={queryParams} />
    </div>
  ) : (
    <PageContentEntries pageContent={page.fields.pageContent} searchParams={queryParams} />
  );
}

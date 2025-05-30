import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { SearchParams } from 'nuqs';

import { NotFound as NotFoundSection } from '@/vibes/soul/sections/not-found';
import { PageContentEntries } from '~/components/contentful/page-content-entries';
import { routing } from '~/i18n/routing';
import { generateHtmlFromRichText } from '~/lib/utils';

import { getPageBySlug } from './page-data';

const SPECIAL_LAYOUT_PAGES = ['returns', 'warranty', 'free-shipping'] as const;

function shouldShowSpecialLayout(rest: string[]): boolean {
  return SPECIAL_LAYOUT_PAGES.some((page) => rest.includes(page));
}

interface Props {
  params: Promise<{ locale: string; rest: string[] }>;
  searchParams: Promise<SearchParams>;
}

export async function generateStaticParams() {
  return Promise.resolve(routing.locales.map((locale) => ({ locale })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { rest } = await params;
  const page = await getPageBySlug('pageStandard', rest);

  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  const { fields } = page;

  return {
    title: fields.metaTitle || fields.pageName,
    description: fields.metaDescription,
    keywords: fields.metaKeywords,
  };
}

export default async function ContentfulPage({ params, searchParams }: Props) {
  const [{ rest }, queryParams] = await Promise.all([params, searchParams]);
  const page = await getPageBySlug('pageStandard', rest);

  if (!page) {
    const t = await getTranslations('NotFound');

    try {
      const notFoundPage = await getPageBySlug('pageStandard', ['not-found']);

      if (!notFoundPage) {
        throw new Error('404 page not found');
      }

      return (
        <PageContentEntries
          pageContent={notFoundPage.fields.pageContent}
          searchParams={queryParams}
        />
      );
    } catch {
      return (
        <NotFoundSection
          className="flex-1 place-content-center"
          subtitle={t('subtitle')}
          title={t('title')}
        />
      );
    }
  }

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
              __html: generateHtmlFromRichText(page.fields.optionalPageDescription),
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

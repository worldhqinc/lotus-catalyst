import { getTranslations } from 'next-intl/server';
import type { SearchParams } from 'nuqs/server';

import { NotFound as NotFoundSection } from '@/vibes/soul/sections/not-found';
import { PageContentEntries } from '~/components/contentful/page-content-entries';
import { Footer } from '~/components/footer';
import { Header } from '~/components/header';

import { getPageBySlug } from './(default)/contentful/[...rest]/page-data';

export default async function NotFound({ searchParams }: { searchParams: SearchParams }) {
  const t = await getTranslations('NotFound');

  try {
    const page = await getPageBySlug('pageStandard', ['not-found']);

    return (
      <>
        <Header />
        <PageContentEntries pageContent={page.fields.pageContent} searchParams={searchParams} />
        <Footer />
      </>
    );
  } catch {
    return (
      <>
        <Header />

        <NotFoundSection
          className="flex-1 place-content-center"
          subtitle={t('subtitle')}
          title={t('title')}
        />

        <Footer />
      </>
    );
  }
}

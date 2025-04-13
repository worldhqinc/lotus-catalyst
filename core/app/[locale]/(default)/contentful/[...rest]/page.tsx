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

  const { fields } = page;

  return {
    title: fields.metaTitleSeo || fields.pageName,
    description: fields.metaDescription,
    keywords: fields.metaKeywordsSeo,
  };
}

export default async function ContentfulPage({ params }: Props) {
  const { rest } = await params;
  const page = await getPageBySlug('pageStandard', rest);

  return <PageContentEntries page={page} />;
}

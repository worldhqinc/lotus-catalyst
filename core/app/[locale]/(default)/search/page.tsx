import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import AlgoliaSearch from '~/app/[locale]/(default)/search/_components/algolia-search';
import { getHreflangAlternates } from '~/lib/utils';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const alternates = getHreflangAlternates(['search'], locale);

  const t = await getTranslations({ locale, namespace: 'Faceted.Search' });

  return {
    title: t('title'),
    description:
      'Search for everything Lotus has to offer, from our full series of professional countertop appliances and accessories to recipes and helpful tutorials to get you started. ',
    alternates,
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const searchTerm = typeof params.term === 'string' ? params.term : undefined;

  return (
    <div className="min-h-screen">
      <AlgoliaSearch initialSearchTerm={searchTerm} />
    </div>
  );
}

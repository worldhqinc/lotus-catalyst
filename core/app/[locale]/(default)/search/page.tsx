import AlgoliaSearch from '~/app/[locale]/(default)/search/_components/algolia-search';

export default function SearchPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const searchTerm = typeof searchParams.term === 'string' ? searchParams.term : undefined;

  return <AlgoliaSearch initialSearchTerm={searchTerm} />;
}

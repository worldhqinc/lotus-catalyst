import AlgoliaSearch from '~/app/[locale]/(default)/search/_components/algolia-search';

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

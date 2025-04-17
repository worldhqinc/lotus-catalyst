'use client';

import { Button } from '@/vibes/soul/primitives/button';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { Configure, InstantSearch, RefinementList, useInfiniteHits } from 'react-instantsearch';
import { Image } from '~/components/image';
import { Link } from '~/components/link';

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? '',
  process.env.NEXT_PUBLIC_ALGOLIA_API_KEY ?? '',
);

interface PostGridProps {
  title: string;
  subtitle?: string | null;
  type: string;
}

function InfiniteHits({ hits, hasMore, refineNext }: any) {
  return (
    <>
      <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {hits.map((hit: any) => {
          const f = hit.fields ?? {};
          const title =
            f.productName?.['en-US'] || f.pageName?.['en-US'] || f.recipeName?.['en-US'] || '';
          const description = f.shortDescription?.['en-US'] || '';
          const slug = f.pageSlug?.['en-US'] || '';
          const imgField =
            f.featuredImage?.['en-US']?.fields?.file?.url || f.pageImage?.['en-US'] || null;
          const imgUrl = imgField
            ? imgField.startsWith('http')
              ? imgField
              : `https:${imgField}`
            : null;
          const categories =
            f.mealTypeCategory?.['en-US'] ||
            f.productLine?.['en-US'] ||
            f.parentCategory?.['en-US'] ||
            [];
          return (
            <article key={hit.objectID} className="group relative">
              {imgUrl ? (
                <figure className="bg-surface-image aspect-square w-full rounded-lg">
                  <Image alt={title} src={imgUrl} className="object-cover" />
                </figure>
              ) : (
                <figure className="bg-surface-image aspect-square w-full rounded-lg" />
              )}
              <div className="space-y-1 py-2">
                {slug ? (
                  <Link href={`/${slug}`} className="font-body text-lg font-medium">
                    <h3>{title}</h3>
                  </Link>
                ) : (
                  <h3 className="font-body text-lg font-medium">{title}</h3>
                )}
                {description && <p className="text-neutral-500">{description}</p>}
              </div>
              {categories.length ? (
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat: string) => (
                    <span key={cat} className="rounded border px-2 py-1 text-xs">
                      {cat}
                    </span>
                  ))}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
      <div className="flex w-full flex-col items-center">
        {hasMore && (
          <Button size="small" variant="tertiary" onClick={() => refineNext()}>
            Load more
          </Button>
        )}
      </div>
    </>
  );
}

function InfiniteHitsWrapper() {
  const { items, showMore, isLastPage } = useInfiniteHits();
  const hasMore = !isLastPage;

  return <InfiniteHits hits={items} hasMore={hasMore} refineNext={showMore} />;
}

export default function PostGrid({ title, subtitle, type }: PostGridProps) {
  return (
    <section className="@container">
      <div className="mx-auto flex flex-col items-start gap-4 px-4 py-10 @xl:px-6 @xl:py-14">
        <div className="mx-auto flex w-full max-w-(--breakpoint-2xl) flex-col items-center px-4 pt-12 pb-16 text-balance @xl:px-6 @xl:pt-16 @xl:pb-20 @4xl:px-8 @4xl:pt-20">
          <h1 className="m-0 max-w-xl text-center font-[family-name:var(--slideshow-title-font-family,var(--font-family-heading))] text-4xl leading-none font-medium uppercase @2xl:text-5xl @2xl:leading-[.9] @4xl:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 max-w-3xl text-center text-base leading-normal text-neutral-500 @xl:mt-3 @xl:text-lg">
              {subtitle}
            </p>
          )}
        </div>
        <InstantSearch
          indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME ?? ''}
          searchClient={searchClient}
        >
          <RefinementList
            attribute={type}
            classNames={{ list: 'flex flex-wrap gap-2', item: 'px-2 py-1 border rounded text-sm' }}
          />
          <Configure hitsPerPage={9} />
          <InfiniteHitsWrapper />
        </InstantSearch>
      </div>
    </section>
  );
}

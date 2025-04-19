'use client';

import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { clsx } from 'clsx';
import { Configure, InstantSearch, RefinementList, useInfiniteHits } from 'react-instantsearch';

import { Badge } from '@/vibes/soul/primitives/badge';
import { Button } from '@/vibes/soul/primitives/button';
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

type Localized<T> = Record<string, T>;

interface PostGridHit {
  objectID: string;
  fields?: {
    productName?: Localized<string>;
    pageName?: Localized<string>;
    recipeName?: Localized<string>;
    shortDescription?: Localized<string>;
    pageSlug?: Localized<string>;
    featuredImage?: Localized<{ fields?: { file?: { url: string } } }>;
    pageImage?: Localized<string>;
    mealTypeCategory?: Localized<string[]>;
    productLine?: Localized<string[]>;
    parentCategory?: Localized<string[]>;
  };
}

function InfiniteHits() {
  const { items, showMore, isLastPage, results } = useInfiniteHits<PostGridHit>();
  const hasMore = !isLastPage;
  const totalCount = results?.nbHits ?? 0;
  const progressPercent = totalCount > 0 ? (items.length / totalCount) * 100 : 0;

  return (
    <>
      <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {items.map((hit: PostGridHit) => {
          const f = hit.fields ?? {};
          const title =
            f.productName?.['en-US'] || f.pageName?.['en-US'] || f.recipeName?.['en-US'] || '';
          const description = f.shortDescription?.['en-US'] || '';
          const slug = f.pageSlug?.['en-US'] || '';
          const imgField =
            f.featuredImage?.['en-US']?.fields?.file?.url || f.pageImage?.['en-US'] || null;
          let imgUrl: string | null = null;

          if (imgField) {
            if (imgField.startsWith('http')) {
              imgUrl = imgField;
            } else {
              imgUrl = `https:${imgField}`;
            }
          }

          const categories =
            f.mealTypeCategory?.['en-US'] ||
            f.productLine?.['en-US'] ||
            f.parentCategory?.['en-US'] ||
            [];

          return (
            <article className="group relative" key={hit.objectID}>
              {imgUrl ? (
                <figure className="bg-surface-image aspect-square w-full rounded-lg">
                  <Image alt={title} className="object-cover" src={imgUrl} />
                </figure>
              ) : (
                <figure className="bg-surface-image aspect-square w-full rounded-lg" />
              )}
              <div className="space-y-1 py-2">
                {slug ? (
                  <Link className="font-body text-lg font-medium" href={`/${slug}`}>
                    <h3>{title}</h3>
                  </Link>
                ) : (
                  <h3 className="font-body text-lg font-medium">{title}</h3>
                )}
                {description ? <p className="text-neutral-500">{description}</p> : null}
              </div>
              {categories.length ? (
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat: string) => (
                    <Badge key={cat}>{cat}</Badge>
                  ))}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
      <div className="flex w-full flex-col items-center gap-8 py-12">
        <div className="w-full max-w-xs px-4">
          <div className="text-foreground mb-2 flex justify-center text-xl font-medium">
            {items.length}/{totalCount}
          </div>
          <div className="bg-disabled h-1 w-full rounded-full">
            <div
              className="bg-foreground h-full rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        {hasMore && (
          <Button onClick={() => showMore()} variant="tertiary">
            Load more
          </Button>
        )}
      </div>
    </>
  );
}

export default function PostGrid({ title, subtitle, type }: PostGridProps) {
  const categories = ['Category 1', 'Category 2', 'Category 3'];

  return (
    <section className="@container">
      <div className="mx-auto flex flex-col items-start gap-4 px-4 py-10 @xl:px-6 @xl:py-14">
        <div className="mx-auto flex w-full max-w-(--breakpoint-2xl) flex-col items-center px-4 py-12 text-balance @xl:px-6 @xl:pt-16 @xl:pb-20 @4xl:px-8 @4xl:pt-20">
          <h1 className="m-0 max-w-xl text-center font-[family-name:var(--slideshow-title-font-family,var(--font-family-heading))] text-4xl leading-none font-medium uppercase @2xl:text-5xl @2xl:leading-[.9] @4xl:text-6xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 max-w-3xl text-center text-base leading-normal text-neutral-500 @xl:mt-3 @xl:text-lg">
              {subtitle}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2 pt-12">
            {categories.length ? (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat, index) => (
                  <Button
                    className={clsx('!font-normal uppercase', index > 0 && 'text-neutral-500')}
                    key={cat}
                    size="small"
                    variant={index === 0 ? 'secondary' : 'tertiary'}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            ) : null}
          </div>
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
          <InfiniteHits />
        </InstantSearch>
      </div>
    </section>
  );
}

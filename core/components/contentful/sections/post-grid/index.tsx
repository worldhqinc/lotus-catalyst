'use client';

import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { Configure, InstantSearch, useInfiniteHits, useRefinementList } from 'react-instantsearch';

import { Badge } from '@/vibes/soul/primitives/badge';
import { Button } from '@/vibes/soul/primitives/button';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { Image } from '~/components/image';
import { Link } from '~/components/link';
import { ensureImageUrl } from '~/lib/utils';

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
    // Feature fields
    featuredImage?: Localized<{
      sys?: {
        type?: string;
        linkType?: string;
        id?: string;
      };
      fields?: {
        file?: {
          url: string;
        };
      };
    }>;
    categories?: Localized<string[]>;
    title?: Localized<string>;
    subtitle?: Localized<string>;
    story?: Localized<{
      data?: unknown;
      content?: unknown[];
      nodeType?: string;
    }>;
    productCarousel?: Localized<{
      sys?: {
        type?: string;
        linkType?: string;
        id?: string;
      };
    }>;
    // Recipe fields
    recipeName?: Localized<string>;
    metaTitle?: Localized<string>;
    metaDescription?: Localized<string>;
    pageSlug?: Localized<string>;
    mealTypeCategory?: Localized<string[]>;
    // Common fields
    pageName?: Localized<string>;
    shortDescription?: Localized<string>;
    pageImage?: Localized<string>;
    productLine?: Localized<string[]>;
    parentCategory?: Localized<string[]>;
  };
}

function transformFeatureHit(hit: PostGridHit) {
  const f = hit.fields ?? {};

  return {
    image: f.featuredImage?.['en-US']?.fields?.file?.url
      ? ensureImageUrl(f.featuredImage['en-US'].fields.file.url)
      : null,
    title: f.title?.['en-US'] || '',
    subtitle: f.subtitle?.['en-US'] || '',
    categories: f.categories?.['en-US'] || [],
    slug: f.pageSlug?.['en-US'] || '',
  };
}

function transformRecipeHit(hit: PostGridHit) {
  const f = hit.fields ?? {};

  return {
    image: f.featuredImage?.['en-US']?.fields?.file?.url
      ? ensureImageUrl(f.featuredImage['en-US'].fields.file.url)
      : null,
    title: f.recipeName?.['en-US'] || '',
    subtitle: f.metaDescription?.['en-US'] || '',
    categories: f.mealTypeCategory?.['en-US'] || [],
    slug: f.pageSlug?.['en-US'] || '',
  };
}

function InfiniteHits({ type }: { type: string }) {
  const { items, showMore, isLastPage, results } = useInfiniteHits<PostGridHit>();
  const hasMore = !isLastPage;
  const totalCount = results?.nbHits ?? 0;
  const progressPercent = totalCount > 0 ? (items.length / totalCount) * 100 : 0;

  const transformer = type === 'feature' ? transformFeatureHit : transformRecipeHit;

  return (
    <>
      <div className="mt-8 grid w-full gap-8 md:grid-cols-2 lg:grid-cols-3">
        {items.map((hit: PostGridHit) => {
          const { image, title, subtitle, categories, slug } = transformer(hit);

          return (
            <article className="group relative flex flex-col" key={hit.objectID}>
              {image ? (
                <figure className="bg-surface-image aspect-square w-full overflow-hidden rounded-lg">
                  <Image alt={title} className="h-full w-full object-cover" src={image} />
                </figure>
              ) : (
                <figure className="bg-surface-image aspect-square w-full rounded-lg" />
              )}
              <div className="flex flex-1 flex-col gap-2 py-4">
                {slug ? (
                  <Link className="font-heading text-3xl" href={`/${slug}`}>
                    {title}
                  </Link>
                ) : (
                  <h3 className="font-heading text-3xl">{title}</h3>
                )}
                {subtitle ? <p className="text-contrast-400 text-sm">{subtitle}</p> : null}
              </div>
              {categories.length ? (
                <div className="flex flex-wrap gap-2 pb-2">
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

function getCategoryAttribute(type: string) {
  if (type === 'feature') return 'fields.categories.en-US';
  if (type === 'recipe') return 'fields.mealTypeCategory.en-US';

  return '';
}

function CategoryFilter({ attribute }: { attribute: string }) {
  const { items, refine } = useRefinementList({ attribute });

  return (
    <div className="flex flex-wrap justify-center gap-2 py-12">
      {items.map((item) => (
        <Button
          className="!font-normal uppercase"
          key={item.value}
          onClick={() => refine(item.value)}
          size="small"
          variant={item.isRefined ? 'secondary' : 'tertiary'}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
}

export function PostGrid({ title, subtitle, type }: PostGridProps) {
  return (
    <SectionLayout containerSize="2xl">
      <div className="flex flex-col items-center gap-4">
        <h1 className="font-heading max-w-xl text-center text-4xl uppercase @2xl:text-5xl @4xl:text-6xl">
          {title}
        </h1>
        {subtitle ? <p className="text-contrast-400 max-w-3xl text-center">{subtitle}</p> : null}
      </div>
      <InstantSearch
        future={{
          preserveSharedStateOnUnmount: true,
        }}
        indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME ?? ''}
        searchClient={searchClient}
      >
        <CategoryFilter attribute={getCategoryAttribute(type)} />
        <Configure filters={`sys.contentType.sys.id:${type}`} hitsPerPage={9} />
        <InfiniteHits type={type} />
      </InstantSearch>
    </SectionLayout>
  );
}

'use client';

import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { useRef } from 'react';
import { Configure, InstantSearch, useInfiniteHits, useRefinementList } from 'react-instantsearch';

import { Badge } from '@/vibes/soul/primitives/badge';
import { Button } from '@/vibes/soul/primitives/button';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { Image } from '~/components/image';
import { Link } from '~/components/link';
import {
  PostGridHit,
  transformFeatureHit,
  transformRecipeHit,
} from '~/data-transformers/algolia-transformers';
import { Spinner } from '~/vibes/soul/primitives/spinner';

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? '',
  process.env.NEXT_PUBLIC_ALGOLIA_API_KEY ?? '',
);

interface PostGridProps {
  title: string;
  subtitle?: string | null;
  type: string;
}

function InfiniteHits({ type }: { type: string }) {
  const { items, showMore, isLastPage, results, sendEvent } = useInfiniteHits<PostGridHit>();
  const hasMore = !isLastPage;
  const totalCount = results?.nbHits ?? 0;
  const progressPercent = totalCount > 0 ? (items.length / totalCount) * 100 : 0;
  const newPostsRef = useRef<HTMLDivElement>(null);

  if (items.length === 0) {
    return (
      <div className="flex justify-center py-16">
        <Spinner loadingAriaLabel="Loading posts..." size="lg" />
      </div>
    );
  }

  const transformer = type === 'feature' ? transformFeatureHit : transformRecipeHit;

  const handleShowMore = () => {
    showMore();
    setTimeout(() => {
      if (newPostsRef.current) {
        newPostsRef.current.focus();
      }
    }, 0);
  };

  return (
    <>
      <div className="grid w-full gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-6">
        {items.map((hit, index) => (
          <div
            key={hit.objectID}
            ref={index === items.length - 1 ? newPostsRef : null}
            tabIndex={-1}
          >
            <PostCard
              {...transformer(hit)}
              onClick={() => sendEvent('click', hit, 'Post Clicked')}
            />
          </div>
        ))}
      </div>
      <div className="flex w-full flex-col items-center gap-8 py-12">
        <div className="pagination-bar w-full max-w-xs px-4">
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
          <Button onClick={handleShowMore} size="medium" variant="tertiary">
            Load more
          </Button>
        )}
      </div>
    </>
  );
}

function CategoryFilter({ attribute }: { attribute: string }) {
  const { items, refine } = useRefinementList({
    attribute,
    sortBy: ['name:asc'],
  });

  return (
    <div className="flex flex-wrap justify-center gap-2 py-8 lg:py-16">
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
        <h1 className="font-heading max-w-2xl text-center text-4xl uppercase @2xl:text-5xl @4xl:text-6xl">
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
        <CategoryFilter attribute="categories" />
        <Configure filters={`contentType:${type}`} hitsPerPage={9} />
        <InfiniteHits type={type} />
      </InstantSearch>
    </SectionLayout>
  );
}

export function PostCard({
  image,
  title,
  subtitle,
  categories,
  href,
  onClick,
}: {
  image: { src: string; alt: string };
  title: string;
  subtitle: string | null;
  categories: string[];
  href: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <article className="group relative flex flex-col">
      {image.src ? (
        <figure className="bg-surface-image aspect-4/3 w-full overflow-hidden rounded-lg">
          <Image
            alt={image.alt}
            className="ease-quad h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            height={1000}
            src={image.src}
            width={1000}
          />
        </figure>
      ) : (
        <figure className="bg-surface-image aspect-4/3 w-full rounded-lg" />
      )}
      <div className="flex flex-1 flex-col gap-2 py-4">
        <h3 className="font-heading text-xl lg:text-3xl">{title}</h3>
        {subtitle ? <p className="text-contrast-400 line-clamp-2 text-sm">{subtitle}</p> : null}
      </div>
      <div className="flex flex-wrap gap-2 pb-2">
        {categories.map((cat) => (
          <Badge key={cat}>{cat}</Badge>
        ))}
      </div>
      {!!href && (
        <Link aria-label={title} className="absolute inset-0" href={href} onClick={onClick}>
          <span className="sr-only">View {title}</span>
        </Link>
      )}
    </article>
  );
}

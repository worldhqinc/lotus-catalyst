import { clsx } from 'clsx';
import { ArrowRight, Pause } from 'lucide-react';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';

import Card from '../../primitives/card';

interface InspirationBentoProps {
  heading?: string | null;
  video?: string | null;
  // eslint-disable-next-line
  cta?: any | null;
  // eslint-disable-next-line
  inspirationCards?: any[] | null;
}

export default function InspirationBento({
  heading,
  video,
  cta,
  inspirationCards,
}: InspirationBentoProps) {
  return (
    <section className="py-24 @container">
      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-4xl">{heading}</h2>
          {cta && (
            <ButtonLink
              className="[&_span]:flex [&_span]:items-center [&_span]:gap-2 [&_span]:font-medium"
              href={
                // eslint-disable-next-line
                cta.fields.internalReference.fields.pageSlug
                  ? // eslint-disable-next-line
                    `/${cta.fields.internalReference.fields.pageSlug}`
                  : // eslint-disable-next-line
                    cta.fields.externalLink || ''
              }
              shape="link"
              size="link"
              variant="link"
            >
              {
                // eslint-disable-next-line
                cta.fields.text
              }
              <ArrowRight size={24} strokeWidth={1} />
            </ButtonLink>
          )}
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {video && video !== '' ? (
            <figure className="relative aspect-[3/4] h-full w-full rounded-lg bg-surface-image lg:aspect-auto">
              <video
                autoPlay
                className="h-full w-full"
                loop
                muted
                playsInline
                src={`http://fast.wistia.net/embed/iframe/${video}`}
              />
              {/* TODO: Add play button and pause button logic */}
              {/* <button className="absolute bottom-0 right-0">
              <Play className="h-10 w-10" />
            </button> */}
              <button className="absolute bottom-4 right-4">
                <Pause size={24} strokeWidth={1} />
              </button>
            </figure>
          ) : null}
          {inspirationCards && (
            <div
              className={clsx(
                'grid grid-cols-1 gap-8 md:grid-cols-2',
                video ? 'lg:col-start-2' : 'lg:col-span-2',
              )}
            >
              {inspirationCards.map((card) => (
                <Card
                  // eslint-disable-next-line
                  categories={card.fields.contentReference.fields.mealTypeCategory}
                  // eslint-disable-next-line
                  image={card.fields.contentReference.fields.featuredImage}
                  // eslint-disable-next-line
                  key={card.sys.id}
                  // eslint-disable-next-line
                  pageSlug={card.fields.contentReference.fields.pageSlug}
                  // eslint-disable-next-line
                  recipeName={card.fields.contentReference.fields.recipeName}
                  // eslint-disable-next-line
                  shortDescription={card.fields.contentReference.fields.shortDescription}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

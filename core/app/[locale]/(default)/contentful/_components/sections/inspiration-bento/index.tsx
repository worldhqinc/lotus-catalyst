import { clsx } from 'clsx';
import { ArrowRight, Pause } from 'lucide-react';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';

import { PageStandardPageContentField } from '../../../[...rest]/page-data';
import Card from '../../primitives/card';

interface InspirationBentoProps {
  heading: string;
  video: string;
  cta?: PageStandardPageContentField['fields']['cta'];
  inspirationCards?: PageStandardPageContentField['fields']['inspirationCards'];
}

export default function InspirationBento({
  heading,
  video,
  cta,
  inspirationCards,
}: InspirationBentoProps) {
  return (
    <section className="py-6 @container @2xl:py-8 @4xl:py-14">
      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2>{heading}</h2>
          {cta && (
            <ButtonLink
              className="[&_span]:flex [&_span]:items-center [&_span]:gap-2 [&_span]:font-medium"
              href={
                cta.fields.internalReference?.fields?.pageSlug
                  ? `/${cta.fields.internalReference.fields.pageSlug}`
                  : cta.fields.externalLink || ''
              }
              shape="link"
              size="link"
              variant="link"
            >
              {cta.fields.text}
              <ArrowRight size={24} strokeWidth={1} />
            </ButtonLink>
          )}
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {video && video !== '' ? (
            <figure className="relative aspect-[4/5] h-full w-full rounded-lg bg-surface-image">
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
                'grid grid-cols-1 gap-4 lg:grid-cols-2',
                video ? 'lg:col-start-2' : '',
              )}
            >
              {inspirationCards.map(
                (
                  card: NonNullable<
                    PageStandardPageContentField['fields']['inspirationCards']
                  >[number],
                ) => (
                  <Card
                    categories={card.fields.contentReference.fields.mealTypeCategory}
                    image={card.fields.contentReference.fields.featuredImage}
                    key={card.sys.id}
                    pageSlug={card.fields.contentReference.fields.pageSlug}
                    recipeName={card.fields.contentReference.fields.recipeName}
                    shortDescription={card.fields.contentReference.fields.shortDescription}
                  />
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

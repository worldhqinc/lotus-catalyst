import { clsx } from 'clsx';
import { ArrowRight, Pause } from 'lucide-react';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';

import type {
  ContentfulCTA,
  ContentfulInspirationCard,
  ContentfulInspirationSlide,
  ContentfulRecipe,
  ContentfulTutorial,
} from '~/app/[locale]/(default)/contentful/[...rest]/page-data';
import Card from '../../primitives/card';
import InspirationHero from '../inspiration-hero';

interface InspirationBentoProps {
  heading?: string | null;
  video?: string | null;
  cta?: ContentfulCTA | null;
  inspirationCards?: ContentfulInspirationCard[] | null;
  inspirationSlides?: ContentfulInspirationSlide[] | null;
}

const isRecipe = (content: ContentfulRecipe | ContentfulTutorial): content is ContentfulRecipe => {
  return 'recipeName' in content.fields;
};

export default function InspirationBento({
  heading,
  video,
  cta,
  inspirationCards,
  inspirationSlides,
}: InspirationBentoProps) {
  const validCards = inspirationCards?.filter((card) => {
    const { contentReference } = card.fields;

    if (isRecipe(contentReference)) {
      const { mealTypeCategory, featuredImage, pageSlug, recipeName, shortDescription } =
        contentReference.fields;
      return (
        mealTypeCategory && featuredImage?.fields.file && pageSlug && recipeName && shortDescription
      );
    }

    const { featuredImage, pageSlug, title, shortDescription } = contentReference.fields;
    return featuredImage?.fields.file && pageSlug && title && shortDescription;
  });

  return (
    <>
      <section className="@container py-24">
        <div className="container">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-4xl">{heading}</h2>
            <InspirationHero slides={inspirationSlides} />
            {cta && (
              <ButtonLink
                className="[&_span]:flex [&_span]:items-center [&_span]:gap-2 [&_span]:font-medium"
                href={
                  cta.fields.internalReference?.fields.pageSlug
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
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            {video && video !== '' ? (
              <figure className="bg-surface-image relative aspect-[3/4] h-full w-full rounded-lg lg:aspect-auto">
                <video
                  autoPlay
                  className="h-full w-full"
                  loop
                  muted
                  playsInline
                  src={`http://fast.wistia.net/embed/iframe/${video}`}
                />
                <button className="absolute right-4 bottom-4">
                  <Pause size={24} strokeWidth={1} />
                </button>
              </figure>
            ) : null}
            {validCards && validCards.length > 0 && (
              <div
                className={clsx(
                  'grid grid-cols-1 gap-8 md:grid-cols-2',
                  video ? 'lg:col-start-2' : 'lg:col-span-2',
                )}
              >
                {validCards.map((card) => {
                  const { contentReference } = card.fields;

                  if (isRecipe(contentReference)) {
                    const {
                      mealTypeCategory,
                      featuredImage,
                      pageSlug,
                      recipeName,
                      shortDescription,
                    } = contentReference.fields;

                    return (
                      <Card
                        categories={mealTypeCategory!}
                        image={featuredImage!}
                        key={card.sys.id}
                        pageSlug={pageSlug}
                        recipeName={recipeName}
                        shortDescription={shortDescription!}
                      />
                    );
                  }

                  const { featuredImage, pageSlug, title, shortDescription } =
                    contentReference.fields;

                  return (
                    <Card
                      categories={[]}
                      image={featuredImage!}
                      key={card.sys.id}
                      pageSlug={pageSlug}
                      recipeName={title}
                      shortDescription={shortDescription!}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

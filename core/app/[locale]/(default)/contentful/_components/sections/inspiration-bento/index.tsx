import { clsx } from 'clsx';
import { ArrowRight, Pause } from 'lucide-react';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import type {
  ContentfulCTA,
  ContentfulInspirationCard,
  ContentfulRecipe,
  ContentfulTutorial,
} from '~/app/[locale]/(default)/contentful/[...rest]/page-data';

import Card from '../../primitives/card';

interface InspirationBentoProps {
  heading?: string | null;
  video?: string | null;
  cta?: ContentfulCTA | null;
  inspirationCards?: ContentfulInspirationCard[] | null;
}

const isRecipe = (content: ContentfulRecipe | ContentfulTutorial): content is ContentfulRecipe => {
  return 'recipeName' in content.fields;
};

export default function InspirationBento({
  heading,
  video,
  cta,
  inspirationCards,
}: InspirationBentoProps) {
  const validCards = inspirationCards?.filter((card) => {
    const { contentReference } = card.fields;

    if (isRecipe(contentReference)) {
      const {
        mealTypeCategory,
        featuredImage: recipeImage,
        pageSlug: recipeSlug,
        recipeName,
        shortDescription: recipeDescription,
      } = contentReference.fields;

      return (
        mealTypeCategory &&
        recipeImage?.fields.file &&
        recipeSlug &&
        recipeName &&
        recipeDescription
      );
    }

    const {
      featuredImage: tutorialImage,
      pageSlug: tutorialSlug,
      title,
      shortDescription: tutorialDescription,
    } = contentReference.fields;

    return tutorialImage?.fields.file && tutorialSlug && title && tutorialDescription;
  });

  return (
    <section className="@container">
      <div className="mx-auto flex flex-col items-stretch gap-x-16 gap-y-10 px-4 py-10 @xl:px-6 @xl:py-14 @4xl:px-8 @4xl:py-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-4xl">{heading}</h2>
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
              <ArrowRight size={24} strokeWidth={1.5} />
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
                    featuredImage: recipeImage,
                    pageSlug: recipeSlug,
                    recipeName,
                    shortDescription: recipeDescription,
                  } = contentReference.fields;

                  if (
                    !mealTypeCategory ||
                    !recipeImage ||
                    !recipeSlug ||
                    !recipeName ||
                    !recipeDescription
                  ) {
                    return null;
                  }

                  return (
                    <Card
                      categories={mealTypeCategory}
                      image={recipeImage}
                      key={card.sys.id}
                      pageSlug={recipeSlug}
                      recipeName={recipeName}
                      shortDescription={recipeDescription}
                    />
                  );
                }

                const {
                  featuredImage: tutorialImage,
                  pageSlug: tutorialSlug,
                  title,
                  shortDescription: tutorialDescription,
                } = contentReference.fields;

                if (!tutorialImage || !tutorialSlug || !title || !tutorialDescription) {
                  return null;
                }

                return (
                  <Card
                    categories={[]}
                    image={tutorialImage}
                    key={card.sys.id}
                    pageSlug={tutorialSlug}
                    recipeName={title}
                    shortDescription={tutorialDescription}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

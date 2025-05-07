import { clsx } from 'clsx';
import { z } from 'zod';

import ContentfulCta from '~/components/contentful/cta';
import {
  Asset,
  ctaSchema,
  featureSchema,
  inspirationCardSchema,
  recipeSchema,
  tutorialSchema,
} from '~/contentful/schema';
import { ensureImageUrl } from '~/lib/utils';

import { Card } from '../../primitives/card';

interface InspirationBentoProps {
  heading?: string | null;
  video?: string | null;
  cta?: z.infer<typeof ctaSchema> | null;
  inspirationCards?: Array<z.infer<typeof inspirationCardSchema>> | null;
}

interface CardImageProp {
  fields: {
    file: {
      url: string;
      details: {
        image: { height: number; width: number };
      };
    };
    title?: string;
  };
}

interface MappedCardData {
  id: string;
  type: 'recipe' | 'tutorial' | 'feature';
  categories: string[];
  originalImage?: Asset | null;
  pageSlug: string;
  recipeName: string;
  shortDescription: string;
}

export function InspirationBento({ heading, video, cta, inspirationCards }: InspirationBentoProps) {
  const validCardsData = inspirationCards
    ?.map((card): MappedCardData | null => {
      const { contentReference } = card.fields;
      const cardId = card.sys.id;

      const contentType = contentReference.sys.contentType.sys.id;

      if (contentType === 'recipe') {
        const recipeData = recipeSchema.parse(contentReference);
        const { mealTypeCategory, featuredImage, pageSlug, recipeName, shortDescription } =
          recipeData.fields;

        if (mealTypeCategory && pageSlug && recipeName && shortDescription) {
          return {
            id: cardId,
            type: 'recipe',
            categories: mealTypeCategory,
            originalImage: featuredImage,
            pageSlug,
            recipeName,
            shortDescription,
          };
        }
      }

      if (contentType === 'tutorial') {
        const tutorialData = tutorialSchema.parse(contentReference);
        const { title } = tutorialData.fields;

        if (title) {
          return {
            id: cardId,
            type: 'tutorial',
            categories: [],
            originalImage: null,
            pageSlug: 'tutorials',
            recipeName: title,
            shortDescription: 'View this tutorial',
          };
        }
      }

      if (contentType === 'feature') {
        const featureData = featureSchema.parse(contentReference);
        const { title, subtitle, categories, featuredImage, pageSlug } = featureData.fields;

        if (title) {
          return {
            id: cardId,
            type: 'feature',
            categories: categories ?? [],
            originalImage: featuredImage,
            pageSlug,
            recipeName: title,
            shortDescription: subtitle ?? '',
          };
        }
      }

      return null;
    })
    .filter((item): item is MappedCardData => item !== null);

  return (
    <section className="@container">
      <div className="mx-auto flex flex-col items-stretch gap-x-16 gap-y-10 px-4 py-10 @xl:px-6 @xl:py-14 @4xl:px-8 @4xl:py-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {heading ? <h2 className="text-4xl">{heading}</h2> : null}
          <ContentfulCta cta={cta} />
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {video ? (
            <figure className="bg-surface-image relative aspect-[3/4] h-full w-full overflow-hidden rounded-lg lg:aspect-auto">
              <iframe
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
                src={`//fast.wistia.net/embed/iframe/${video}?videoFoam=true`}
                title={`${heading || 'Inspiration'} Video`}
              />
            </figure>
          ) : null}
          {validCardsData?.length ? (
            <div
              className={clsx(
                'grid grid-cols-1 gap-8 md:grid-cols-2',
                video ? 'lg:col-start-2' : 'lg:col-span-2',
              )}
            >
              {validCardsData.map((cardData) => {
                let imagePropForCard: CardImageProp | undefined;

                if (cardData.originalImage?.fields) {
                  const imageFile = cardData.originalImage.fields.file;
                  const imageDetails = imageFile.details.image;

                  if (imageDetails) {
                    imagePropForCard = {
                      fields: {
                        file: {
                          url: imageFile.url ? ensureImageUrl(imageFile.url) : '/placeholder.jpg',
                          details: {
                            image: {
                              height: imageDetails.height,
                              width: imageDetails.width,
                            },
                          },
                        },
                        title: cardData.originalImage.fields.title ?? cardData.recipeName,
                      },
                    };
                  }
                }

                return (
                  <Card
                    categories={cardData.categories}
                    image={imagePropForCard}
                    key={cardData.id}
                    pageSlug={cardData.pageSlug}
                    recipeName={cardData.recipeName}
                    shortDescription={cardData.shortDescription}
                  />
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

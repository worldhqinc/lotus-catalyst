import { clsx } from 'clsx';
import { ArrowRight } from 'lucide-react';
import { z } from 'zod';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import {
  assetSchema,
  ctaSchema,
  inspirationCardSchema,
  pageStandardSchema,
  recipeSchema,
  tutorialSchema,
} from '~/contentful/schema';

import Card from '../../primitives/card';

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
  type: 'recipe' | 'tutorial';
  categories: string[];
  originalImage?: z.infer<typeof assetSchema> | null;
  pageSlug: string;
  recipeName: string;
  shortDescription: string;
}

interface ContentfulEntry {
  sys: {
    contentType?: {
      sys: {
        id: string;
      };
    };
    id: string;
  };
}

function getEntryContentType(entry: ContentfulEntry | null) {
  return entry?.sys.contentType?.sys.id ?? null;
}

export default function InspirationBento({
  heading,
  video,
  cta,
  inspirationCards,
}: InspirationBentoProps) {
  const validCardsData = inspirationCards
    ?.map((card): MappedCardData | null => {
      const { contentReference } = card.fields;
      const cardId = card.sys.id;

      const contentType = getEntryContentType(contentReference);

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

      return null;
    })
    .filter((item): item is MappedCardData => item !== null);

  let ctaHref = '#';

  if (cta?.fields) {
    const { internalReference, externalLink } = cta.fields;

    if (internalReference) {
      const refContentType = getEntryContentType(internalReference);

      if (refContentType === 'pageStandard') {
        const pageData = pageStandardSchema.parse(internalReference);

        if (pageData.fields.pageSlug) {
          ctaHref = `/${pageData.fields.pageSlug}`;
        }
      } else {
        ctaHref = '/not-implemented';
      }
    } else if (externalLink) {
      ctaHref = externalLink;
    }
  }

  return (
    <section className="@container">
      <div className="mx-auto flex flex-col items-stretch gap-x-16 gap-y-10 px-4 py-10 @xl:px-6 @xl:py-14 @4xl:px-8 @4xl:py-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {heading ? <h2 className="text-4xl">{heading}</h2> : null}
          {cta?.fields.text ? (
            <ButtonLink
              className="[&_span]:flex [&_span]:items-center [&_span]:gap-2 [&_span]:font-medium"
              href={ctaHref}
              shape="link"
              size="link"
              variant="link"
            >
              {cta.fields.text}
              <ArrowRight size={24} strokeWidth={1.5} />
            </ButtonLink>
          ) : null}
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
                          url: imageFile.url ? `https:${imageFile.url}` : '/placeholder.jpg',
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

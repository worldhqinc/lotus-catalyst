import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown';
import { clsx } from 'clsx';

import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import ContentfulCta from '~/components/contentful/cta';
import { WistiaPlayer } from '~/components/wistia-player';
import {
  Asset,
  ctaSchema,
  featureSchema,
  inspirationBento,
  inspirationCardSchema,
  recipeSchema,
  tutorialSchema,
} from '~/contentful/schema';
import { ensureImageUrl, generateHtmlFromRichText } from '~/lib/utils';

import { Card } from '../../primitives/card';

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

export async function InspirationBento({
  heading,
  subheading,
  video,
  cta,
  inspirationCards,
  variant,
}: inspirationBento['fields']) {
  const validCardsData = inspirationCards
    ?.map((data): MappedCardData | null => {
      const card = inspirationCardSchema.parse(data);
      const { contentReference } = card.fields;
      const cardId = card.sys.id;

      if (!contentReference) return null;

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
        const { pageSlug, categories, featuredImage } = tutorialData.fields;
        const { title, subtitle } = card.fields;

        if (title) {
          return {
            id: cardId,
            type: 'tutorial',
            categories: categories ?? [],
            originalImage: featuredImage,
            pageSlug: pageSlug ?? 'tutorials',
            recipeName: title,
            shortDescription: subtitle ?? '',
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

  const validCta = cta ? ctaSchema.parse(cta) : null;

  const subheadingRichText = await richTextFromMarkdown(subheading ?? '');
  const subheadingHtml = generateHtmlFromRichText(subheadingRichText);

  return (
    <SectionLayout>
      {variant === 'hero' ? (
        <section className="space-y-4 py-4 lg:py-8">
          <div className="container max-w-2xl text-center">
            <h1 className="font-heading text-4xl leading-[100%] uppercase md:text-6xl">
              {heading}
            </h1>
          </div>
          {!!subheading && (
            <div
              className="prose container max-w-xl text-center"
              dangerouslySetInnerHTML={{
                __html: subheadingHtml,
              }}
            />
          )}
        </section>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-4">
          {heading ? (
            <h2 className="text-lg font-medium tracking-[1.8px] uppercase lg:text-2xl lg:tracking-[2.4px]">
              {heading}
            </h2>
          ) : null}
          {validCta ? <ContentfulCta cta={validCta} /> : null}
        </div>
      )}
      <div className="mt-8 grid gap-x-4 gap-y-8 lg:mt-16 lg:grid-cols-2 lg:gap-6">
        {video ? (
          <figure className="bg-surface-image relative aspect-3/4 h-full w-full overflow-hidden rounded-lg lg:aspect-auto max-lg:landscape:aspect-video">
            <WistiaPlayer anchorIds={[]} pageType="page" wistiaMediaId={video} />
          </figure>
        ) : null}
        {validCardsData?.length ? (
          <div
            className={clsx(
              'grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:gap-x-6',
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
    </SectionLayout>
  );
}

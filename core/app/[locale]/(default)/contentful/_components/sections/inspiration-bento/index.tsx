import { clsx } from 'clsx';
import type { Asset } from 'contentful';
import { ArrowRight, Pause } from 'lucide-react';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import type {
  ICta,
  ICtaFields,
  IInspirationCard,
  IInspirationCardFields,
  IRecipe,
  IRecipeFields,
  ITutorial,
  ITutorialFields,
} from '~/types/generated/contentful';

import Card from '../../primitives/card';

interface InspirationBentoProps {
  heading?: string | null;
  video?: string | null;
  cta?: ICta | null;
  inspirationCards?: IInspirationCard[] | null;
}

interface CardImage {
  fields: {
    file: {
      url: string;
      details: {
        image: {
          height: number;
          width: number;
        };
      };
    };
  };
}

const isRecipe = (content: IRecipe | ITutorial): content is IRecipe => {
  return 'recipeName' in (content.fields as IRecipeFields | ITutorialFields);
};

// Transform Contentful Asset to Card image prop type
const transformAssetToCardImage = (asset: Asset): CardImage => {
  const file = asset.fields?.file;

  return {
    fields: {
      file: {
        url: (file?.url as string) || '',
        details: {
          image: {
            height: ((file?.details as any)?.height as number) || 0,
            width: ((file?.details as any)?.width as number) || 0,
          },
        },
      },
    },
  };
};

// Placeholder image for tutorials
const TUTORIAL_PLACEHOLDER_IMAGE: CardImage = {
  fields: {
    file: {
      url: '/images/tutorial-placeholder.jpg',
      details: {
        image: {
          height: 400,
          width: 600,
        },
      },
    },
  },
};

export default function InspirationBento({
  heading,
  video,
  cta,
  inspirationCards,
}: InspirationBentoProps) {
  const validCards = inspirationCards?.filter((card) => {
    const { contentReference } = card.fields as IInspirationCardFields;

    if (isRecipe(contentReference)) {
      const {
        mealTypeCategory,
        featuredImage: recipeImage,
        pageSlug: recipeSlug,
        recipeName,
        shortDescription: recipeDescription,
      } = contentReference.fields as IRecipeFields;

      return (
        mealTypeCategory &&
        recipeImage?.fields.file &&
        recipeSlug &&
        recipeName &&
        recipeDescription
      );
    }

    // For tutorials, we only have the title field available
    const { title } = contentReference.fields as ITutorialFields;

    return Boolean(title);
  });

  return (
    <section className="@container">
      <div className="mx-auto flex flex-col items-stretch gap-x-16 gap-y-10 px-4 py-10 @xl:px-6 @xl:py-14 @4xl:px-8 @4xl:py-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-4xl">{heading}</h2>
          {cta && (
            <ButtonLink
              className="[&_span]:flex [&_span]:items-center [&_span]:gap-2 [&_span]:font-medium"
              href={(cta.fields as ICtaFields).externalLink || ''}
              shape="link"
              size="link"
              variant="link"
            >
              {(cta.fields as ICtaFields).text}
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
                const { contentReference } = card.fields as IInspirationCardFields;

                if (isRecipe(contentReference)) {
                  const {
                    mealTypeCategory,
                    featuredImage: recipeImage,
                    pageSlug: recipeSlug,
                    recipeName,
                    shortDescription: recipeDescription,
                  } = contentReference.fields as IRecipeFields;

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
                      image={transformAssetToCardImage(recipeImage)}
                      key={card.sys.id}
                      pageSlug={recipeSlug}
                      recipeName={recipeName}
                      shortDescription={recipeDescription}
                    />
                  );
                }

                const { title } = contentReference.fields as ITutorialFields;

                if (!title) {
                  return null;
                }

                // For tutorials, we only show the title since that's all we have
                return (
                  <Card
                    categories={[]}
                    image={TUTORIAL_PLACEHOLDER_IMAGE}
                    key={card.sys.id}
                    pageSlug="tutorials"
                    recipeName={title}
                    shortDescription="View this tutorial"
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

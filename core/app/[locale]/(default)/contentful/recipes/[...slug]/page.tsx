/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { Metadata } from 'next';
import { SearchParams } from 'nuqs';
import { z } from 'zod';

import { Badge } from '@/vibes/soul/primitives/badge';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { ProductCarousel } from '~/components/contentful/carousels/product-carousel';
import { RecipeCarousel } from '~/components/contentful/carousels/recipe-carousel';
import { Image } from '~/components/image';
import {
  authorSchema,
  carouselProductSchema,
  carouselRecipeSchema,
  ingredientsListSchema,
} from '~/contentful/schema';
import { ensureImageUrl } from '~/lib/utils';

import { getPageBySlug } from '../../[...rest]/page-data';
import { RecipeActions } from '../_components/recipe-actions';

interface Props {
  params: Promise<{ locale: string; slug: string[] }>;
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug('recipe', ['recipes', ...slug]);

  const { fields } = page;

  return {
    title: fields.metaTitle || fields.recipeName,
    description: fields.metaDescription,
  };
}

type IngredientsListEntry = z.infer<typeof ingredientsListSchema>;

const renderIngredientsList = (lists: IngredientsListEntry[] = []) => {
  return lists.map((list) => {
    const sectionTitle = list.fields.sectionTitle || list.fields.ingredientsListName || '';
    const items = list.fields.listOfIngredients || [];

    return (
      <div key={list.sys.id}>
        <h3 className="mt-8 text-base font-semibold">{sectionTitle}</h3>
        <ul className="mt-8 grid grid-cols-2 gap-x-8 gap-y-8">
          {items.map((item) => (
            <li className="text-contrast-500 text-sm" key={item}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  });
};

const renderMetaInfo = (
  authorEntry: { fields: { authorName: string } } | null,
  cookTime: string | null | undefined,
) => {
  return (
    <div className="text-icon-secondary mt-6 flex items-center gap-2 text-sm">
      {authorEntry ? (
        <span>
          <span className="text-icon-primary font-medium">Recipe by</span>{' '}
          {authorEntry.fields.authorName}
        </span>
      ) : null}
      {authorEntry && cookTime ? <span>•</span> : null}
      {cookTime ? (
        <span>
          <span className="text-icon-primary font-medium">Total Time</span> {cookTime}
        </span>
      ) : null}
    </div>
  );
};

export default async function RecipePage({ params }: Props) {
  const { slug } = await params;
  const page = await getPageBySlug('recipe', ['recipes', ...slug]);
  const { fields } = page;

  const authorEntry = fields.author ? authorSchema.parse(fields.author) : null;

  const shortDescDoc = fields.shortDescription
    ? await richTextFromMarkdown(fields.shortDescription)
    : null;
  const shortDescHtml = shortDescDoc ? documentToHtmlString(shortDescDoc) : '';

  const directionsHtml = fields.recipeDirections
    ? documentToHtmlString(fields.recipeDirections)
    : '';

  const variationsHtml = fields.variations ? documentToHtmlString(fields.variations) : '';

  const proTipHtml = fields.testKitchenTips ? documentToHtmlString(fields.testKitchenTips) : '';

  const recipeCarousel = fields.recipeCarousel
    ? carouselRecipeSchema.parse(fields.recipeCarousel)
    : null;

  const productCarousel = fields.productCarousel
    ? carouselProductSchema.parse(fields.productCarousel)
    : null;

  // Parse the ingredients list using the schema
  const ingredientsListsData = fields.ingredientsLists
    ? z.array(ingredientsListSchema).parse(fields.ingredientsLists)
    : [];

  return (
    <article>
      {/* Hero Section */}
      <div className="bg-primary relative pb-18">
        <div className="bg-background absolute inset-0 bottom-1/2 lg:hidden" />
        <div className="bg-background top-0 right-0 left-0 lg:absolute">
          <SectionLayout className="relative" containerSize="xl">
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
              <div className="max-w-xl">
                {/* Category Pill */}
                {fields.mealTypeCategory?.[0] ? (
                  <Badge className="uppercase">{fields.mealTypeCategory[0]}</Badge>
                ) : null}

                {/* Title */}
                <h1 className="text-icon-primary font-heading mt-6 text-4xl leading-tight font-medium uppercase md:text-5xl">
                  {fields.recipeName}
                </h1>

                {/* Meta Info */}
                {renderMetaInfo(authorEntry, fields.cookTime)}

                {/* Description */}
                {shortDescHtml ? (
                  <div
                    className="prose [&_p]:text-icon-secondary mt-6 max-w-none"
                    dangerouslySetInnerHTML={{ __html: shortDescHtml }}
                  />
                ) : null}

                {fields.applianceTypeCategory?.length ? (
                  <>
                    <div className="text-icon-secondary mt-6">—</div>
                    <p className="text-icon-secondary mt-6 text-sm">
                      Ideal for: {fields.applianceTypeCategory.join(', ')}
                    </p>
                  </>
                ) : null}
              </div>
            </div>
          </SectionLayout>
        </div>
        <SectionLayout containerClassName="pt-0" containerSize="xl">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
            <div />
            {/* Hero Image */}
            {fields.featuredImage ? (
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg shadow-lg">
                <Image
                  alt={fields.featuredImage.fields.title || ''}
                  className="object-cover"
                  fill
                  priority
                  sizes="(min-width: 1280px) 50vw, 100vw"
                  src={ensureImageUrl(fields.featuredImage.fields.file.url)}
                />
              </div>
            ) : null}
          </div>
        </SectionLayout>
      </div>

      {/* Intro Section */}
      <SectionLayout containerSize="md">
        <p className="font-heading text-3xl">{fields.intro}</p>
      </SectionLayout>

      {/* Social Share Section */}
      <SectionLayout containerClassName="!pb-0" containerSize="md">
        <RecipeActions recipeName={fields.recipeName} />
        <hr className="border-border" />
      </SectionLayout>

      {/* Ingredients Section */}
      <SectionLayout containerSize="md">
        <h2 className="text-2xl font-medium uppercase">Ingredients</h2>
        {fields.numberOfServings ? (
          <p className="text-primary mt-8 text-2xl font-medium uppercase">
            {fields.numberOfServings}
          </p>
        ) : null}
        <div className="mt-8">{renderIngredientsList(ingredientsListsData)}</div>
      </SectionLayout>

      {/* Directions Section */}
      <SectionLayout containerSize="md">
        <h2 className="text-2xl font-medium uppercase">Directions</h2>
        <div
          className="prose text-contrast-500 mt-4 max-w-none"
          dangerouslySetInnerHTML={{ __html: directionsHtml }}
        />
      </SectionLayout>

      {/* Variations Section */}
      <SectionLayout containerSize="md">
        <h2 className="text-primary text-2xl font-medium uppercase">Variations</h2>
        <div
          className="prose text-contrast-500 mt-4 max-w-none"
          dangerouslySetInnerHTML={{ __html: variationsHtml }}
        />
      </SectionLayout>

      {/* Pro Tip Section */}
      <SectionLayout containerSize="md">
        <h2 className="text-primary text-2xl font-medium uppercase">Pro Tip</h2>
        <div
          className="prose text-contrast-500 mt-4 max-w-none"
          dangerouslySetInnerHTML={{ __html: proTipHtml }}
        />
      </SectionLayout>

      {/* Recipe Carousel Section */}
      {recipeCarousel ? <RecipeCarousel carousel={recipeCarousel} /> : null}

      {/* Product Carousel Section */}
      {productCarousel ? <ProductCarousel carousel={productCarousel} /> : null}
    </article>
  );
}

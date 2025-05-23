/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { SearchParams } from 'nuqs';
import { z } from 'zod';

import { Badge } from '@/vibes/soul/primitives/badge';
import { ProductCard } from '@/vibes/soul/primitives/product-card';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { ProductCarousel } from '~/components/contentful/carousels/product-carousel';
import { RecipeCarousel } from '~/components/contentful/carousels/recipe-carousel';
import SocialShare from '~/components/contentful/sections/social-share';
import { Image } from '~/components/image';
import {
  authorSchema,
  carouselProductSchema,
  carouselRecipeSchema,
  ingredientsListSchema,
  productFinishedGoodsSchema,
  productPartsAndAccessoriesSchema,
} from '~/contentful/schema';
import { contentfulProductCardTransformer } from '~/data-transformers/product-card-transformer';
import { ensureImageUrl, generateHtmlFromRichText } from '~/lib/utils';
import BrandArtwork from '~/public/images/Lotus-Pattern.svg';

import { getPageBySlug } from '../../[...rest]/page-data';

interface Props {
  params: Promise<{ locale: string; slug: string[] }>;
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug('recipe', ['recipes', ...slug]);
  const { fields } = page;

  return {
    title: fields.metaTitleSeo || fields.recipeName,
    description: fields.metaDescription,
    keywords: fields.metaKeywordsSeo,
    openGraph: {
      images: [
        {
          url: ensureImageUrl(
            fields.featuredImage.fields.file.url ?? '/images/lotus-social-share.jpg',
          ),
          alt: fields.metaTitleSeo || fields.recipeName,
        },
      ],
    },
  };
}

type IngredientsListEntry = z.infer<typeof ingredientsListSchema>;

const renderIngredientsList = (lists: IngredientsListEntry[] = []) => {
  return lists.map((list) => {
    const sectionTitle = list.fields.sectionTitle || list.fields.ingredientsListName || '';
    const items = list.fields.listOfIngredients || [];

    return (
      <div key={list.sys.id}>
        <h3 className="mt-8 text-xl font-medium">{sectionTitle}</h3>
        <ul className="mt-8 space-y-6 gap-x-8 md:columns-2">
          {items.map((item) => (
            <li className="text-contrast-400 text-xl" key={item}>
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

function getGridColumnsClass(productCount: number): string {
  if (productCount === 1) return 'grid-cols-1';
  if (productCount === 2) return 'grid-cols-2';
  if (productCount === 3) return 'grid-cols-2 md:grid-cols-3';

  return 'grid-cols-2 md:grid-cols-4';
}

// eslint-disable-next-line complexity
export default async function RecipePage({ params }: Props) {
  const { slug } = await params;
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const fullUrl = `${protocol}://${host}/recipes/${slug.join('/')}`;
  const page = await getPageBySlug('recipe', ['recipes', ...slug]);
  const { fields } = page;

  const authorEntry = fields.author ? authorSchema.parse(fields.author) : null;

  const shortDescDoc = fields.shortDescription
    ? await richTextFromMarkdown(fields.shortDescription)
    : null;
  const shortDescHtml = shortDescDoc ? generateHtmlFromRichText(shortDescDoc) : '';

  const directionsHtml = fields.recipeDirections
    ? generateHtmlFromRichText(fields.recipeDirections)
    : '';

  const variationsHtml = fields.variations ? generateHtmlFromRichText(fields.variations) : '';

  const proTipHtml = fields.testKitchenTips ? generateHtmlFromRichText(fields.testKitchenTips) : '';

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
      <div className="bg-primary relative isolate overflow-hidden pb-18">
        <Image
          alt="Lotus Pattern"
          className="absolute inset-0 h-full w-full object-cover"
          fill
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          src={BrandArtwork}
        />
        <div className="bg-background absolute inset-0 bottom-1/2 lg:hidden" />
        <div className="bg-background top-0 right-0 left-0 lg:absolute">
          <SectionLayout className="relative" containerSize="xl">
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
              <div className="max-w-xl">
                {/* Category Pills */}
                <div className="flex flex-wrap gap-2">
                  {fields.mealTypeCategory?.map((category) => (
                    <Badge className="uppercase" key={category}>
                      {category}
                    </Badge>
                  ))}
                </div>

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
                      Ideal for:{' '}
                      <span className="text-surface-foreground font-medium">
                        {fields.applianceTypeCategory.join(', ')}
                      </span>
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
      <div className="py-8 lg:py-16">
        <SectionLayout className="mx-auto max-w-2xl [&_>div]:pb-0">
          <h2 className="font-heading text-2xl leading-[120%] lg:text-3xl lg:leading-[120%]">
            {fields.intro}
          </h2>
          <div className="mt-12">
            {/* Social Share Section */}
            <SocialShare
              align="left"
              media={fields.featuredImage?.fields.file.url}
              title={fields.recipeName}
              url={fullUrl}
            />
            <hr className="border-border mt-12" />
          </div>
        </SectionLayout>
        {/* Ingredients Section */}
        <SectionLayout className="mx-auto max-w-2xl [&_>div]:pb-0">
          <h2 className="text-2xl font-medium uppercase">Ingredients</h2>
          {fields.numberOfServings ? (
            <p className="text-primary mt-8 text-2xl font-medium uppercase">
              {fields.numberOfServings}
            </p>
          ) : null}
          <div className="mt-8">{renderIngredientsList(ingredientsListsData)}</div>
        </SectionLayout>

        {fields.products?.length ? (
          <SectionLayout className="mx-auto max-w-2xl [&_>div]:pb-0">
            <hr className="border-border mb-12" />
            <h2 className="text-surface-foreground text-2xl font-medium uppercase">
              What You'll Need
            </h2>
            <div className={`mt-6 grid gap-4 ${getGridColumnsClass(fields.products.length)}`}>
              {fields.products.map((product) => {
                const parsed =
                  product.sys.contentType.sys.id === 'productFinishedGoods'
                    ? productFinishedGoodsSchema.parse(product)
                    : productPartsAndAccessoriesSchema.parse(product);
                const cardData = contentfulProductCardTransformer(parsed);

                return (
                  <ProductCard
                    aspectRatio="1:1"
                    className="w-full !max-w-none"
                    key={product.sys.id}
                    product={cardData}
                  />
                );
              })}
            </div>
            <hr className="border-border mt-12" />
          </SectionLayout>
        ) : null}

        {/* Directions Section */}
        {directionsHtml ? (
          <SectionLayout className="mx-auto max-w-2xl [&_>div]:pb-0">
            <h2 className="text-2xl font-medium uppercase">Directions</h2>
            <div
              className="prose text-contrast-400 mt-4 max-w-none"
              dangerouslySetInnerHTML={{ __html: directionsHtml }}
            />
          </SectionLayout>
        ) : null}

        {/* Variations Section */}
        {variationsHtml ? (
          <SectionLayout className="mx-auto max-w-2xl [&_>div]:pb-0">
            <h2 className="text-primary text-2xl font-medium uppercase">Variations</h2>
            <div
              className="prose text-contrast-400 mt-4 max-w-none"
              dangerouslySetInnerHTML={{ __html: variationsHtml }}
            />
          </SectionLayout>
        ) : null}

        {/* Pro Tip Section */}
        {proTipHtml ? (
          <SectionLayout className="mx-auto max-w-2xl [&_>div]:pb-0">
            <h2 className="text-primary text-2xl font-medium uppercase">Pro Tip</h2>
            <div
              className="prose text-contrast-400 mt-4 max-w-none"
              dangerouslySetInnerHTML={{ __html: proTipHtml }}
            />
            <hr className="border-border mt-12" />
          </SectionLayout>
        ) : null}
      </div>

      {/* Recipe Carousel Section */}
      {recipeCarousel ? <RecipeCarousel carousel={recipeCarousel} /> : null}

      {/* Product Carousel Section */}
      {productCarousel ? <ProductCarousel carousel={productCarousel} /> : null}
    </article>
  );
}

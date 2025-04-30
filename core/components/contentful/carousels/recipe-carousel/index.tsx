import { Badge } from '@/vibes/soul/primitives/badge';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import ContentfulCta from '~/components/contentful/cta';
import { Image } from '~/components/image';
import { Link } from '~/components/link';
import { assetSchema, carouselRecipe, ctaSchema, recipeSchema } from '~/contentful/schema';
import { ensureImageUrl } from '~/lib/utils';

export function RecipeCarousel({ carousel }: { carousel: carouselRecipe }) {
  const recipeItems = carousel.fields.recipes.map((recipe) => recipeSchema.parse(recipe));
  const heading = carousel.fields.carouselTitle;
  const cta = carousel.fields.cta ? ctaSchema.parse(carousel.fields.cta) : null;

  return (
    <SectionLayout containerSize="2xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {heading ? <h2 className="text-4xl">{heading}</h2> : null}
        <ContentfulCta cta={cta} />
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {recipeItems.map((recipe, index) => {
          const imageAsset = recipe.fields.featuredImage;
          const file = assetSchema.parse(imageAsset).fields.file;

          return (
            <article className="group relative max-h-max" key={index}>
              <figure className="bg-surface-image relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  alt={recipe.fields.recipeName}
                  className="h-full w-full object-cover"
                  height={file.details.image?.height}
                  src={ensureImageUrl(file.url)}
                  width={file.details.image?.width}
                />
              </figure>
              <div className="mt-2 flex flex-col gap-1">
                <h3 className="ease-quad group-hover:text-primary text-3xl transition-colors duration-200">
                  {recipe.fields.recipeName}
                </h3>
                <p className="text-contrast-400">{recipe.fields.shortDescription}</p>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {recipe.fields.mealTypeCategory?.map((category) => (
                  <Badge key={category}>{category}</Badge>
                ))}
              </div>
              <Link className="absolute inset-0" href={`/${recipe.fields.pageSlug}`}>
                <span className="sr-only">View {recipe.fields.recipeName}</span>
              </Link>
            </article>
          );
        })}
      </div>
    </SectionLayout>
  );
}

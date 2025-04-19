import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { Badge } from '@/vibes/soul/primitives/badge';
import ContentfulCta from '~/components/contentful/cta';
import { Image } from '~/components/image';
import { Link } from '~/components/link';
import {
  assetSchema,
  carouselRecipeSchema,
  ctaSchema,
  productFinishedGoods,
  recipeSchema,
} from '~/contentful/schema';

interface RecipeCarouselProps {
  contentful: Streamable<productFinishedGoods | null | undefined>;
}

export default function RecipeCarousel({ contentful }: RecipeCarouselProps) {
  return (
    <Stream fallback={null} value={contentful}>
      {(product) => {
        if (!product?.fields.recipes) return null;

        const carouselData = carouselRecipeSchema.parse(product.fields.recipes);
        const recipeItems = carouselData.fields.recipes.map((recipe) => recipeSchema.parse(recipe));
        const heading = carouselData.fields.carouselTitle;
        const cta = carouselData.fields.cta ? ctaSchema.parse(carouselData.fields.cta) : null;

        return (
          <section className="@container">
            <div className="mx-auto flex flex-col items-stretch gap-x-16 gap-y-10 px-4 py-10 @xl:px-6 @xl:py-14 @4xl:px-8 @4xl:py-20">
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
                          src={`https:${file.url}`}
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
            </div>
          </section>
        );
      }}
    </Stream>
  );
}

import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { type cardSection, inspirationCardSchema } from '~/contentful/schema';

export default function CardSection({
  title,
  subtitle,
  featuresCard,
  recipesCard,
}: cardSection['fields']) {
  const features = inspirationCardSchema.parse(featuresCard);
  const recipes = inspirationCardSchema.parse(recipesCard);

  return (
    <SectionLayout containerClassName="bg-white py-16" containerSize="xl">
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <h2 className="font-heading text-icon-primary text-4xl uppercase md:text-6xl">{title}</h2>
        {subtitle ? <p className="text-icon-secondary mt-4 text-lg">{subtitle}</p> : null}
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="bg-surface-image rounded-lg p-8">
          <div className="flex flex-col justify-between gap-8">
            <div className="pb-40">
              <h3 className="text-icon-primary mb-4 text-4xl">{features.fields.title}</h3>
              <p className="text-icon-secondary mt-4 max-w-md">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
              </p>
            </div>
            <ButtonLink href={`/${features.fields.contentReference.sys.id}`}>
              {features.fields.title}
            </ButtonLink>
          </div>
        </div>
        <div className="bg-surface-image rounded-lg p-8">
          <div className="flex flex-col justify-between gap-8">
            <div className="pb-40">
              <h3 className="text-icon-primary mb-4 text-4xl">{recipes.fields.title}</h3>
              <p className="text-icon-secondary mt-4 max-w-md">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
              </p>
            </div>
            <ButtonLink href={`/${recipes.fields.contentReference.sys.id}`}>
              {recipes.fields.title}
            </ButtonLink>
          </div>
        </div>
      </div>
    </SectionLayout>
  );
}

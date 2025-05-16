import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { type cardSection, ctaSchema, inspirationCardSchema } from '~/contentful/schema';
import { getLinkHref } from '~/lib/utils';

export function CardSection({
  title,
  subtitle,
  featuresCard,
  recipesCard,
  variant,
}: cardSection['fields']) {
  const cards = [featuresCard, recipesCard].map((card) => inspirationCardSchema.parse(card));

  if (variant === 'outline') {
    return (
      <SectionLayout containerClassName="py-16">
        <div className="border-contrast-200 divide-contrast-200 divide-y rounded-lg border p-4 lg:grid lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))] lg:divide-x lg:divide-y-0 lg:p-8">
          {cards.map((card, index) => {
            const validCta = card.fields.cta ? ctaSchema.parse(card.fields.cta) : null;

            return (
              <div
                className="flex flex-col items-center justify-between gap-8 text-center first-of-type:pb-4 last-of-type:pt-4 lg:first-of-type:pb-0 lg:last-of-type:pt-0"
                key={`${card.sys.id}-${index}`}
              >
                <div>
                  <h2 className="text-lg font-medium tracking-[1.8px] uppercase md:text-2xl lg:leading-[120%]">
                    {card.fields.title}
                  </h2>
                  <p className="text-contrast-400 mt-4 max-w-xs">{card.fields.subtitle}</p>
                </div>
                {validCta ? (
                  <ButtonLink href={getLinkHref(validCta.fields)}>
                    {validCta.fields.text}
                  </ButtonLink>
                ) : null}
              </div>
            );
          })}
        </div>
      </SectionLayout>
    );
  }

  if (variant === 'simple') {
    return (
      <SectionLayout containerClassName="py-16">
        <div className="grid gap-8 text-white md:grid-cols-2">
          {cards.map((card, index) => (
            <div
              className="bg-surface-image relative flex aspect-square flex-col justify-end overflow-hidden rounded-lg p-8"
              key={`${card.sys.id}-${index}`}
            >
              <div className="top absolute inset-0 bg-gradient-to-b from-black/0 from-70% to-black/50" />
              <div className="relative flex flex-col">
                <h3 className="font-medium">{card.fields.title}</h3>
                <p className="max-w-md">{card.fields.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionLayout>
    );
  }

  return (
    <SectionLayout containerClassName="py-16">
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <h2 className="font-heading text-icon-primary text-4xl uppercase md:text-6xl">{title}</h2>
        {subtitle ? <p className="text-icon-secondary mt-4 text-lg">{subtitle}</p> : null}
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        {cards.map((card, index) => {
          const validCta = card.fields.cta ? ctaSchema.parse(card.fields.cta) : null;

          return (
            <div
              className="bg-contrast-200 aspect-square rounded-lg p-8"
              key={`${card.sys.id}-${index}`}
            >
              <div className="flex size-full flex-col justify-between gap-8">
                <div className="flex flex-col gap-4">
                  <h3 className="text-surface-foreground text-4xl">{card.fields.title}</h3>
                  <p className="text-contrast-400 max-w-xs">{card.fields.subtitle}</p>
                </div>
                <div>
                  {validCta ? (
                    <ButtonLink href={getLinkHref(validCta.fields)}>
                      {validCta.fields.text}
                    </ButtonLink>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SectionLayout>
  );
}

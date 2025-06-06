import { ArrowRight } from 'lucide-react';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { Image } from '~/components/image';
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
        <div className="grid gap-4 text-white md:grid-cols-2 lg:gap-6">
          {cards.map((card, index) => {
            const validCta = card.fields.cta ? ctaSchema.parse(card.fields.cta) : null;
            const mediaUrl = card.fields.image?.fields.file.url;
            const absoluteMediaUrl = mediaUrl?.startsWith('//') ? `https:${mediaUrl}` : mediaUrl;

            return (
              <div
                className="bg-surface-image relative isolate flex aspect-square flex-col justify-end overflow-hidden rounded-lg p-4 lg:aspect-4/3 lg:p-8"
                key={`${card.sys.id}-${index}`}
              >
                {card.fields.image && (
                  <figure className="absolute inset-0 -z-10 after:absolute after:inset-0 after:bg-gradient-to-b after:from-transparent after:to-black/60 lg:after:from-40%">
                    <Image
                      alt={card.fields.image.fields.description ?? card.fields.title}
                      className="h-full w-full object-cover object-center"
                      fill
                      src={absoluteMediaUrl ?? ''}
                    />
                  </figure>
                )}
                <div className="relative flex items-end justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <h3 className="text-xl">{card.fields.title}</h3>
                    <p className="max-w-xs">{card.fields.subtitle}</p>
                  </div>
                  {validCta ? (
                    <ButtonLink
                      className="hover:text-foreground aspect-square !h-12 !w-12 bg-transparent text-white"
                      href={getLinkHref(validCta.fields)}
                      shape="circle"
                      size="medium"
                      variant="tertiary"
                    >
                      <ArrowRight size={20} />
                      <span className="sr-only">{validCta.fields.text}</span>
                    </ButtonLink>
                  ) : null}
                </div>
              </div>
            );
          })}
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
      <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
        {cards.map((card, index) => {
          const validCta = card.fields.cta ? ctaSchema.parse(card.fields.cta) : null;
          const mediaUrl = card.fields.image?.fields.file.url;
          const absoluteMediaUrl = mediaUrl?.startsWith('//') ? `https:${mediaUrl}` : mediaUrl;

          return (
            <div
              className="bg-contrast-200 relative isolate aspect-square overflow-hidden rounded-lg p-8"
              key={`${card.sys.id}-${index}`}
            >
              {card.fields.image && (
                <figure className="absolute inset-0 -z-10 after:absolute after:inset-0 after:bg-black after:opacity-30">
                  <Image
                    alt={card.fields.image.fields.description ?? card.fields.title}
                    className="h-full w-full object-cover object-center"
                    fill
                    src={absoluteMediaUrl ?? ''}
                  />
                </figure>
              )}
              <div className="flex size-full flex-col justify-between gap-8">
                <div className="flex flex-col gap-4">
                  <h3 className="text-4xl text-white">{card.fields.title}</h3>
                  <p className="max-w-xs text-white">{card.fields.subtitle}</p>
                </div>
                <div>
                  {validCta ? (
                    <ButtonLink href={getLinkHref(validCta.fields)} size="medium">
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

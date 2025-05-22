import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { AltProductCarousel } from '~/components/contentful/carousels/alt-product-carousel';
import { carouselProductSchema, type carouselSection, ctaSchema } from '~/contentful/schema';

export function CarouselSection({ heading, subtitle, carousel, cta }: carouselSection['fields']) {
  const validCta = cta ? ctaSchema.parse(cta) : null;
  const validCarousel = carouselProductSchema.parse(carousel);

  const getHref = (ctaData: NonNullable<typeof validCta>) => {
    if (typeof ctaData.fields.externalLink === 'string') {
      return ctaData.fields.externalLink;
    }

    if (typeof ctaData.fields.internalReference?.fields.pageSlug === 'string') {
      return ctaData.fields.internalReference.fields.pageSlug;
    }

    return '/';
  };

  return (
    <SectionLayout containerClassName="py-16">
      <div className="mb-8 flex flex-col items-center">
        <h2 className="font-heading text-icon-primary max-w-4xl text-center text-4xl uppercase md:text-6xl">
          {heading}
        </h2>
        {subtitle ? (
          <p className="text-icon-secondary mt-8 max-w-xl text-center text-xl">{subtitle}</p>
        ) : null}
      </div>
      <AltProductCarousel
        carousel={validCarousel}
        cta={
          validCta && (
            <div className="mt-8 text-center">
              <ButtonLink href={getHref(validCta)}>{validCta.fields.text}</ButtonLink>
            </div>
          )
        }
      />
    </SectionLayout>
  );
}

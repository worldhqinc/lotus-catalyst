import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { AltProductCarousel } from '~/components/contentful/carousels/alt-product-carousel';
import { carouselProductSchema, type carouselSection, ctaSchema } from '~/contentful/schema';
import { getLinkHref } from '~/lib/utils';

export function CarouselSection({ heading, subtitle, carousel, cta }: carouselSection['fields']) {
  const validCta = cta ? ctaSchema.parse(cta) : null;
  const validCarousel = carouselProductSchema.parse(carousel);

  return (
    <SectionLayout>
      <div className="mb-8 flex flex-col items-center">
        <h2 className="font-heading text-icon-primary max-w-4xl text-center text-4xl uppercase md:text-6xl">
          {heading}
        </h2>
        {subtitle ? (
          <p className="text-icon-secondary mt-4 max-w-xl text-center text-xl">{subtitle}</p>
        ) : null}
      </div>
      <AltProductCarousel
        carousel={validCarousel}
        cta={
          validCta && (
            <div className="text-center">
              <ButtonLink href={getLinkHref(validCta.fields)}>{validCta.fields.text}</ButtonLink>
            </div>
          )
        }
      />
    </SectionLayout>
  );
}

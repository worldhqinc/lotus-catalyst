import { Button } from '@/vibes/soul/primitives/button';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { ProductCarousel } from '~/components/contentful/carousels/alt-product-carousel';
import { Link } from '~/components/link';
import { carouselProductSchema, type carouselSection, ctaSchema } from '~/contentful/schema';

export default function CarouselSection({
  heading,
  subtitle,
  carousel,
  cta,
}: carouselSection['fields']) {
  const validCta = cta ? ctaSchema.parse(cta) : null;
  const validCarousel = carouselProductSchema.parse(carousel);

  return (
    <SectionLayout containerClassName="bg-gray-50 py-16" containerSize="full">
      <div className="mb-8 flex flex-col items-center">
        <h2 className="font-heading text-icon-primary max-w-4xl text-center text-4xl uppercase md:text-6xl">
          {heading}
        </h2>
        {subtitle ? (
          <p className="text-icon-secondary mt-8 max-w-xl text-center">{subtitle}</p>
        ) : null}
      </div>
      <ProductCarousel carousel={validCarousel} />
      {validCta && (
        <div className="mt-8 text-center">
          <Link href={validCta.fields.externalLink || ''} passHref>
            <Button>{validCta.fields.text}</Button>
          </Link>
        </div>
      )}
    </SectionLayout>
  );
}

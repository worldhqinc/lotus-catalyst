import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { ctaSection } from '~/contentful/schema';

export function CtaSection({ sectionTitle, buttonText, buttonLink }: ctaSection['fields']) {
  return (
    <SectionLayout className="bg-surface-image py-24 text-center" containerSize="lg">
      {sectionTitle ? (
        <h2 className="text-icon-primary font-heading mb-14 text-6xl uppercase">{sectionTitle}</h2>
      ) : null}
      <ButtonLink href={buttonLink} variant="primary">
        {buttonText}
      </ButtonLink>
    </SectionLayout>
  );
}

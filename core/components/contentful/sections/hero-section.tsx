import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { ctaSchema, heroSection } from '~/contentful/schema';
import { getLinkHref } from '~/lib/utils';

export function HeroSection({ type, heroTitle, heroTagline, cta }: heroSection['fields']) {
  if (type === 'basic') {
    const validCta = cta ? ctaSchema.parse(cta) : null;
    const linkHref = validCta ? getLinkHref(validCta.fields) : '#';

    return (
      <SectionLayout className="text-center" containerSize="xl">
        <h1 className="text-surface-foreground font-heading mx-auto mb-6 max-w-2xl text-center text-4xl uppercase sm:text-6xl">
          {heroTitle}
        </h1>
        <p className="text-contrast-400 mx-auto mb-16 max-w-2xl text-center">{heroTagline}</p>
        {validCta && <ButtonLink href={linkHref}>{validCta.fields.text}</ButtonLink>}
      </SectionLayout>
    );
  }

  return (
    <SectionLayout className="bg-surface-image py-20 text-center" containerSize="xl">
      <h1 className="text-icon-primary tracking-widest uppercase">{heroTitle}</h1>
      <p className="text-icon-primary font-heading mt-4 text-3xl leading-tight md:text-5xl">
        {heroTagline}
      </p>
    </SectionLayout>
  );
}

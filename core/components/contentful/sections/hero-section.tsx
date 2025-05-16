import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { Image } from '~/components/image';
import { ctaSchema, heroSection } from '~/contentful/schema';
import { getLinkHref } from '~/lib/utils';

export function HeroSection({ type, heroTitle, heroTagline, cta, image }: heroSection['fields']) {
  const imageUrl = image?.fields.file.url;
  const absoluteMediaUrl = imageUrl?.startsWith('//') ? `https:${imageUrl}` : imageUrl;
  const imageComponent = absoluteMediaUrl ? (
    <figure className="absolute inset-0 -z-10 h-full w-full overflow-hidden after:absolute after:inset-0 after:bg-black after:opacity-30">
      <Image
        alt={image?.fields.title || ''}
        className="h-full w-full object-cover"
        fill
        src={absoluteMediaUrl}
      />
    </figure>
  ) : null;

  if (type === 'white') {
    return (
      <SectionLayout className="bg-contrast-200 relative isolate overflow-hidden text-center">
        {imageComponent}
        <div className="mx-auto max-w-2xl py-40">
          <h1 className="font-heading mb-6 text-center text-6xl text-white uppercase sm:text-8xl">
            {heroTitle}
          </h1>
          {heroTagline ? (
            <p className="mx-auto mb-16 max-w-2xl text-center text-white">{heroTagline}</p>
          ) : null}
        </div>
      </SectionLayout>
    );
  }

  if (type === 'basic') {
    const validCta = cta ? ctaSchema.parse(cta) : null;
    const linkHref = validCta ? getLinkHref(validCta.fields) : '#';

    return (
      <SectionLayout className="relative isolate overflow-hidden text-center">
        {imageComponent}
        <h1 className="text-surface-foreground font-heading mx-auto mb-6 max-w-2xl text-center text-4xl uppercase sm:text-6xl">
          {heroTitle}
        </h1>
        <p className="text-contrast-400 mx-auto mb-16 max-w-2xl text-center">{heroTagline}</p>
        {validCta && <ButtonLink href={linkHref}>{validCta.fields.text}</ButtonLink>}
      </SectionLayout>
    );
  }

  return (
    <SectionLayout className="bg-surface-image relative isolate overflow-hidden py-20 text-center">
      {imageComponent}
      <h1 className="text-icon-primary tracking-widest uppercase">{heroTitle}</h1>
      <p className="text-icon-primary font-heading mt-4 text-3xl leading-tight md:text-5xl">
        {heroTagline}
      </p>
    </SectionLayout>
  );
}

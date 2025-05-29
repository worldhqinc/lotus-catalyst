import { clsx } from 'clsx';

import { ElementFade } from '@/vibes/soul/lib/element-fade';
import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { Image } from '~/components/image';
import { WistiaPlayer } from '~/components/wistia-player';
import { ctaSchema, heroSection } from '~/contentful/schema';
import { ensureImageUrl, getLinkHref } from '~/lib/utils';

export function HeroSection({
  type,
  heroEyebrow,
  heroTitle,
  heroTagline,
  cta,
  image,
  invertTextColor,
  wistiaId,
}: heroSection['fields']) {
  const imageUrl = image?.fields.file.url ?? '';
  const wistiaVideo = wistiaId ?? '';
  const mediaElement = wistiaVideo ? (
    <figure className="bg-surface-image absolute inset-0 -z-20 h-full w-full after:absolute after:inset-0 after:bg-black after:opacity-30">
      <WistiaPlayer buttonPosition="left" pageType="page" wistiaMediaId={wistiaVideo} />
    </figure>
  ) : (
    <figure className="absolute inset-0 -z-10 h-full w-full overflow-hidden after:absolute after:inset-0 after:bg-black after:opacity-30">
      <Image
        alt={image?.fields.title || ''}
        className="h-full w-full object-cover"
        fill
        src={ensureImageUrl(imageUrl)}
      />
    </figure>
  );

  const validCta = cta ? ctaSchema.parse(cta) : null;
  const linkHref = validCta ? getLinkHref(validCta.fields) : '#';

  return (
    <SectionLayout className="bg-surface-image relative isolate flex aspect-[3/4] w-full items-center overflow-hidden py-20 text-center lg:aspect-video xl:max-h-[calc(100svh-101px)] landscape:aspect-video">
      {mediaElement}
      <ElementFade>
        <div
          className={clsx(
            'mx-auto space-y-4',
            invertTextColor && 'text-white',
            type === 'hero_two' ? 'max-w-6xl' : 'max-w-4xl',
          )}
        >
          <span className="tracking-widest uppercase">{heroEyebrow}</span>
          <h1
            className={clsx(
              type === 'hero_two'
                ? 'font-heading mt-4 text-3xl leading-tight md:text-5xl'
                : 'font-heading mt-4 text-4xl leading-tight uppercase md:text-6xl',
            )}
          >
            {heroTitle}
          </h1>
          <p className="text-lg leading-8 lg:text-xl lg:leading-8">{heroTagline}</p>
          {validCta && <ButtonLink href={linkHref}>{validCta.fields.text}</ButtonLink>}
        </div>
      </ElementFade>
    </SectionLayout>
  );
}

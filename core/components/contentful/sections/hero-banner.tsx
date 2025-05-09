import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { clsx } from 'clsx';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { Image } from '~/components/image';
import { cta, ctaSchema, type heroBanner } from '~/contentful/schema';

export async function HeroBanner({
  title,
  description,
  image,
  video,
  primaryCta,
  secondaryCta,
  variant,
  secondaryTitle,
  secondaryDescription,
}: heroBanner['fields']) {
  const mediaUrl = video?.fields.file.url || image?.fields.file.url;
  const primary = primaryCta ? ctaSchema.parse(primaryCta) : null;
  const secondary = secondaryCta ? ctaSchema.parse(secondaryCta) : null;

  const descriptionRichText = await richTextFromMarkdown(description ?? '');
  const descriptionHtml = documentToHtmlString(descriptionRichText);

  let mediaElement: React.ReactNode = null;

  if (video) {
    mediaElement = (
      <video
        autoPlay
        className="absolute inset-0 h-full w-full object-cover"
        loop
        muted
        src={mediaUrl}
      />
    );
  } else if (image) {
    mediaElement = (
      <Image
        alt={title}
        className="absolute inset-0 h-full w-full object-cover"
        fill
        src={mediaUrl ?? ''}
      />
    );
  }

  if (variant === 'simple') {
    return (
      <SectionLayout>
        <div className="container max-w-2xl text-center">
          <h1 className="font-heading text-4xl leading-[100%] uppercase md:text-6xl">{title}</h1>
          {!!description && (
            <div
              className="prose container mt-8 max-w-2xl"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          )}
        </div>
      </SectionLayout>
    );
  }

  if (variant === 'left-aligned' || variant === 'left-aligned-lowercase') {
    return (
      <SectionLayout className="bg-contrast-200 relative">
        {mediaElement}
        <div
          className={clsx(
            'flex w-full flex-col gap-8 py-20',
            variant === 'left-aligned' ? '' : 'lg:py-40',
          )}
        >
          <h1
            className={clsx(
              'text-surface-foreground font-heading max-w-xl text-4xl md:text-6xl',
              variant === 'left-aligned' && 'uppercase',
            )}
          >
            {title}
          </h1>
          {description ? <p className="text-contrast-400 max-w-lg text-xl">{description}</p> : null}
          <HeroBannerCTAs primary={primary} secondary={secondary} variant={variant} />
          <HeroBannerSecondary
            secondaryDescription={secondaryDescription}
            secondaryTitle={secondaryTitle}
          />
        </div>
      </SectionLayout>
    );
  }

  return (
    <SectionLayout className="bg-contrast-200 relative">
      {mediaElement}
      <div className="flex w-full flex-col items-center justify-center gap-8 py-20">
        <h1 className="text-surface-foreground font-heading max-w-4xl text-center text-4xl uppercase md:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="text-contrast-400 max-w-lg text-center text-xl">{description}</p>
        ) : null}
        <HeroBannerCTAs primary={primary} secondary={secondary} variant={variant} />
      </div>
    </SectionLayout>
  );
}

function HeroBannerCTAs({
  primary,
  secondary,
  variant,
}: {
  primary: cta | null;
  secondary: cta | null;
  variant?: string | null;
}) {
  return (
    <div
      className={clsx(
        'mt-4 flex flex-col gap-4 md:flex-row',
        variant?.startsWith('left-aligned') ? 'items-start' : 'items-center',
      )}
    >
      {primary && (
        <ButtonLink href={primary.fields.externalLink ?? ''}>{primary.fields.text}</ButtonLink>
      )}
      {secondary && (
        <ButtonLink href={secondary.fields.externalLink ?? ''} variant="tertiary">
          {secondary.fields.text}
        </ButtonLink>
      )}
    </div>
  );
}

function HeroBannerSecondary({
  secondaryTitle,
  secondaryDescription,
}: {
  secondaryTitle?: string | null;
  secondaryDescription?: string | null;
}) {
  if (!secondaryTitle && !secondaryDescription) return null;

  return (
    <div className="flex flex-col items-start gap-4 pt-20">
      {!!secondaryTitle && (
        <h2 className="text-surface-foreground text-xl font-medium">{secondaryTitle}</h2>
      )}
      {!!secondaryDescription && <p className="text-contrast-400">{secondaryDescription}</p>}
    </div>
  );
}

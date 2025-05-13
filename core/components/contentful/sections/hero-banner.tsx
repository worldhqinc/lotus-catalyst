import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { clsx } from 'clsx';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { Image } from '~/components/image';
import { cta, ctaSchema, type heroBanner } from '~/contentful/schema';

function SimpleHeroBanner({ descriptionHtml, title }: { descriptionHtml: string; title: string }) {
  return (
    <SectionLayout>
      <div className="container max-w-2xl text-center">
        <h1 className="font-heading text-4xl leading-[100%] uppercase md:text-6xl">{title}</h1>
        {!!descriptionHtml && (
          <div
            className="prose container mt-8 max-w-2xl"
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />
        )}
      </div>
    </SectionLayout>
  );
}

function LeftAlignedHeroBanner({
  description,
  invertText,
  mediaElement,
  primary,
  secondary,
  secondaryDescription,
  secondaryTitle,
  title,
  variant,
}: {
  description?: string | null;
  invertText?: boolean | null;
  mediaElement: React.ReactNode;
  primary: cta | null;
  secondary: cta | null;
  secondaryDescription?: string | null;
  secondaryTitle?: string | null;
  title: string;
  variant: string;
}) {
  return (
    <SectionLayout className="bg-contrast-200 relative isolate">
      {mediaElement}
      <div
        className={clsx(
          'flex w-full flex-col gap-8 py-20',
          variant === 'left-aligned' ? '' : 'lg:py-40',
        )}
      >
        <h1
          className={clsx(
            'font-heading max-w-xl text-4xl md:text-6xl',
            invertText ? 'text-white' : 'text-surface-foreground',
            variant === 'left-aligned' && 'uppercase',
          )}
        >
          {title}
        </h1>
        {description ? (
          <p className={clsx('max-w-lg text-xl', invertText ? 'text-white' : 'text-contrast-400')}>
            {description}
          </p>
        ) : null}
        <HeroBannerCTAs primary={primary} secondary={secondary} variant={variant} />
        <HeroBannerSecondary
          invertText={invertText}
          secondaryDescription={secondaryDescription}
          secondaryTitle={secondaryTitle}
        />
      </div>
    </SectionLayout>
  );
}

function CenteredHeroBanner({
  description,
  invertText,
  mediaElement,
  primary,
  secondary,
  title,
}: {
  description?: string | null;
  invertText?: boolean | null;
  mediaElement: React.ReactNode;
  primary: cta | null;
  secondary: cta | null;
  title: string;
}) {
  return (
    <SectionLayout className="bg-contrast-200 relative">
      {mediaElement}
      <div className="flex w-full flex-col items-center justify-center gap-8 py-20">
        <h1
          className={clsx(
            'font-heading max-w-4xl text-center text-4xl uppercase md:text-6xl',
            invertText ? 'text-white' : 'text-surface-foreground',
          )}
        >
          {title}
        </h1>
        {description ? (
          <p
            className={clsx(
              'max-w-lg text-center text-xl',
              invertText ? 'text-white' : 'text-contrast-400',
            )}
          >
            {description}
          </p>
        ) : null}
        <HeroBannerCTAs primary={primary} secondary={secondary} />
      </div>
    </SectionLayout>
  );
}

export async function HeroBanner({
  description,
  image,
  invertText,
  primaryCta,
  secondaryCta,
  secondaryDescription,
  secondaryTitle,
  title,
  variant,
  video,
}: heroBanner['fields']) {
  const mediaUrl = video?.fields.file.url || image?.fields.file.url;
  const absoluteMediaUrl = mediaUrl?.startsWith('//') ? `https:${mediaUrl}` : mediaUrl;
  const primary = primaryCta ? ctaSchema.parse(primaryCta) : null;
  const secondary = secondaryCta ? ctaSchema.parse(secondaryCta) : null;

  const descriptionRichText = await richTextFromMarkdown(description ?? '');
  const descriptionHtml = documentToHtmlString(descriptionRichText);

  let mediaElement: React.ReactNode = null;

  if (video) {
    mediaElement = (
      <video
        autoPlay
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        loop
        muted
        src={absoluteMediaUrl}
      />
    );
  } else if (image) {
    mediaElement = (
      <Image
        alt={title}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        fill
        src={absoluteMediaUrl ?? ''}
      />
    );
  }

  if (variant === 'simple') {
    return <SimpleHeroBanner descriptionHtml={descriptionHtml} title={title} />;
  }

  if (variant === 'left-aligned' || variant === 'left-aligned-lowercase') {
    return (
      <LeftAlignedHeroBanner
        description={description}
        invertText={invertText}
        mediaElement={mediaElement}
        primary={primary}
        secondary={secondary}
        secondaryDescription={secondaryDescription}
        secondaryTitle={secondaryTitle}
        title={title}
        variant={variant}
      />
    );
  }

  return (
    <CenteredHeroBanner
      description={description}
      invertText={invertText}
      mediaElement={mediaElement}
      primary={primary}
      secondary={secondary}
      title={title}
    />
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
  invertText,
  secondaryDescription,
  secondaryTitle,
}: {
  invertText?: boolean | null;
  secondaryDescription?: string | null;
  secondaryTitle?: string | null;
}) {
  if (!secondaryTitle && !secondaryDescription) return null;

  return (
    <div className="flex flex-col items-start gap-4 pt-20">
      {!!secondaryTitle && (
        <h2 className={clsx('text-3xl', invertText ? 'text-white' : 'text-surface-foreground')}>
          {secondaryTitle}
        </h2>
      )}
      {!!secondaryDescription && (
        <p className={clsx(invertText ? 'text-white' : 'text-contrast-400')}>
          {secondaryDescription}
        </p>
      )}
    </div>
  );
}

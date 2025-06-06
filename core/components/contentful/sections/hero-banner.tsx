import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown';
import { clsx } from 'clsx';

import { ElementFade } from '@/vibes/soul/lib/element-fade';
import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { Image } from '~/components/image';
import { WistiaPlayer } from '~/components/wistia-player';
import { cta, ctaSchema, type heroBanner } from '~/contentful/schema';
import { generateHtmlFromRichText } from '~/lib/utils';

function SimpleHeroBanner({
  descriptionHtml,
  title,
  isPageHeader,
}: {
  descriptionHtml: string;
  title: string;
  isPageHeader?: boolean | null;
}) {
  return (
    <SectionLayout>
      <div className="container max-w-2xl text-center">
        {isPageHeader ? (
          <h1 className="font-heading text-4xl leading-[100%] uppercase md:text-6xl">{title}</h1>
        ) : (
          <h2 className="font-heading text-4xl leading-[100%] uppercase md:text-6xl">{title}</h2>
        )}
        {!!descriptionHtml && (
          <div
            className="prose container mt-6 max-w-2xl"
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />
        )}
      </div>
    </SectionLayout>
  );
}

function StackedHeroBanner({
  description,
  invertText,
  isPageHeader,
  mediaElement,
  primary,
  secondary,
  secondaryDescription,
  secondaryTitle,
  title,
}: {
  description?: string | null;
  invertText?: boolean | null;
  isPageHeader?: boolean | null;
  mediaElement: React.ReactNode;
  primary: cta | null;
  secondary: cta | null;
  secondaryDescription?: string | null;
  secondaryTitle?: string | null;
  title: string;
}) {
  return (
    <section className="relative isolate h-auto w-full overflow-hidden bg-[hsla(26,28%,95%,1)] lg:aspect-video lg:xl:max-h-[calc(100svh-64px)]">
      <div className="grid h-full grid-cols-[minmax(var(--container-padding),1fr)_minmax(0,calc((var(--container-max-width)/2)))_minmax(0,calc((var(--container-max-width)/2)))_minmax(var(--container-padding),1fr)] gap-y-8 lg:gap-0">
        <div
          className={clsx(
            'justify-space-between col-span-2 col-start-2 flex h-full w-full flex-col gap-8 pt-8 lg:col-start-2 lg:col-end-3 lg:py-16',
          )}
        >
          <ElementFade>
            <div className="space-y-6">
              {isPageHeader ? (
                <h1
                  className={clsx(
                    'font-heading max-w-xl text-4xl uppercase md:text-6xl',
                    invertText ? 'text-white' : 'text-surface-foreground',
                  )}
                >
                  {title}
                </h1>
              ) : (
                <h2
                  className={clsx(
                    'font-heading max-w-xl text-4xl uppercase md:text-6xl',
                    invertText ? 'text-white' : 'text-surface-foreground',
                  )}
                >
                  {title}
                </h2>
              )}
              {description ? (
                <p
                  className={clsx(
                    'max-w-lg text-xl',
                    invertText ? 'text-white' : 'text-contrast-400',
                  )}
                >
                  {description}
                </p>
              ) : null}
            </div>
          </ElementFade>
          {primary || secondary ? <HeroBannerCTAs primary={primary} secondary={secondary} /> : null}
          <HeroBannerSecondary
            className="mt-auto"
            invertText={invertText}
            secondaryDescription={secondaryDescription}
            secondaryTitle={secondaryTitle}
          />
        </div>
        <div className="relative col-span-2 col-start-2 aspect-video lg:col-start-3 lg:col-end-4 lg:aspect-auto">
          {mediaElement}
        </div>
      </div>
    </section>
  );
}

function LeftAlignedHeroBanner({
  description,
  invertText,
  isPageHeader,
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
  isPageHeader?: boolean | null;
  mediaElement: React.ReactNode;
  primary: cta | null;
  secondary: cta | null;
  secondaryDescription?: string | null;
  secondaryTitle?: string | null;
  title: string;
  variant: string;
}) {
  return (
    <SectionLayout className="relative isolate aspect-[3/4] w-full lg:aspect-video xl:max-h-[calc(100svh-105px)] max-lg:landscape:aspect-video [&_>div]:h-full">
      <div className="absolute inset-0 -z-10 bg-linear-to-l from-transparent to-black/50" />
      {mediaElement}
      <div className={clsx('h-full w-full')}>
        {/* Note: If ElementFade is removed, apply the classes to the parent div instead. */}
        <ElementFade className="flex flex-col justify-center gap-6">
          {isPageHeader ? (
            <h1
              className={clsx(
                'font-heading max-w-xl text-4xl md:text-6xl',
                invertText ? 'text-white' : 'text-surface-foreground',
                variant === 'left-aligned' && 'uppercase',
              )}
            >
              {title}
            </h1>
          ) : (
            <h2
              className={clsx(
                'font-heading max-w-xl text-4xl md:text-6xl',
                invertText ? 'text-white' : 'text-surface-foreground',
                variant === 'left-aligned' && 'uppercase',
              )}
            >
              {title}
            </h2>
          )}
          {description ? (
            <p
              className={clsx('max-w-lg text-xl', invertText ? 'text-white' : 'text-contrast-400')}
            >
              {description}
            </p>
          ) : null}
          <HeroBannerCTAs primary={primary} secondary={secondary} variant={variant} />
        </ElementFade>
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
  isPageHeader,
  mediaElement,
  primary,
  secondary,
  title,
}: {
  description?: string | null;
  invertText?: boolean | null;
  isPageHeader?: boolean | null;
  mediaElement: React.ReactNode;
  primary: cta | null;
  secondary: cta | null;
  title: string;
}) {
  return (
    <SectionLayout className="bg-contrast-200 relative isolate aspect-[3/4] w-full lg:aspect-video xl:max-h-[calc(100svh-105px)] max-lg:landscape:aspect-video">
      {mediaElement}
      <div className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 px-4 py-20">
        {/* Note: If ElementFade is removed, apply the classes to the parent div instead. */}
        <ElementFade className="flex w-full flex-col items-center justify-center gap-6">
          {isPageHeader ? (
            <h1
              className={clsx(
                'font-heading max-w-4xl text-center text-4xl uppercase md:text-6xl',
                invertText ? 'text-white' : 'text-surface-foreground',
              )}
            >
              {title}
            </h1>
          ) : (
            <h2
              className={clsx(
                'font-heading max-w-4xl text-center text-4xl uppercase md:text-6xl',
                invertText ? 'text-white' : 'text-surface-foreground',
              )}
            >
              {title}
            </h2>
          )}
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
        </ElementFade>
      </div>
    </SectionLayout>
  );
}

export async function HeroBanner({
  description,
  image,
  invertText,
  isPageHeader,
  primaryCta,
  secondaryCta,
  secondaryDescription,
  secondaryTitle,
  title,
  variant,
  video,
  wistiaId,
}: heroBanner['fields']) {
  const mediaUrl = video?.fields.file.url || image?.fields.file.url;
  const absoluteMediaUrl = mediaUrl?.startsWith('//') ? `https:${mediaUrl}` : mediaUrl;
  const primary = primaryCta ? ctaSchema.parse(primaryCta) : null;
  const secondary = secondaryCta ? ctaSchema.parse(secondaryCta) : null;

  const descriptionRichText = await richTextFromMarkdown(description ?? '');
  const descriptionHtml = generateHtmlFromRichText(descriptionRichText);

  let mediaElement: React.ReactNode = null;

  if (video) {
    mediaElement = (
      <video
        autoPlay
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        loop
        muted
        src={absoluteMediaUrl}
      />
    );
  } else if (image) {
    mediaElement = (
      <Image
        alt={image.fields.description ?? title}
        className={clsx(
          'absolute inset-0 -z-20 h-full w-full',
          variant === 'stack'
            ? 'object-contain object-[bottom_left] lg:min-w-[2440px]'
            : 'object-cover',
        )}
        fill
        src={absoluteMediaUrl ?? ''}
      />
    );
  } else if (wistiaId) {
    mediaElement = (
      <figure className="bg-surface-image absolute inset-0 -z-20 h-full w-full after:absolute after:inset-0 after:bg-black after:opacity-30">
        <WistiaPlayer
          buttonPosition={isPageHeader ? 'left' : 'right'}
          pageType="page"
          wistiaMediaId={wistiaId}
        />
      </figure>
    );
  }

  if (variant === 'simple') {
    return (
      <SimpleHeroBanner
        descriptionHtml={descriptionHtml}
        isPageHeader={isPageHeader}
        title={title}
      />
    );
  }

  if (variant === 'left-aligned' || variant === 'left-aligned-lowercase') {
    return (
      <LeftAlignedHeroBanner
        description={description}
        invertText={invertText}
        isPageHeader={isPageHeader}
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

  if (variant === 'stack') {
    return (
      <StackedHeroBanner
        description={description}
        invertText={invertText}
        isPageHeader={isPageHeader}
        mediaElement={mediaElement}
        primary={primary}
        secondary={secondary}
        secondaryDescription={secondaryDescription}
        secondaryTitle={secondaryTitle}
        title={title}
      />
    );
  }

  return (
    <CenteredHeroBanner
      description={description}
      invertText={invertText}
      isPageHeader={isPageHeader}
      mediaElement={mediaElement}
      primary={primary}
      secondary={secondary}
      title={title}
    />
  );
}

function getUrl(fields: {
  externalLink?: unknown;
  internalReference?: {
    fields?: {
      pageSlug?: unknown;
    } | null;
  } | null;
}) {
  if (typeof fields.externalLink === 'string') {
    return fields.externalLink;
  }

  if (typeof fields.internalReference?.fields?.pageSlug === 'string') {
    return fields.internalReference.fields.pageSlug;
  }

  return '';
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
      {primary && <ButtonLink href={getUrl(primary.fields)}>{primary.fields.text}</ButtonLink>}
      {secondary && (
        <ButtonLink href={getUrl(secondary.fields)} variant="tertiary">
          {secondary.fields.text}
        </ButtonLink>
      )}
    </div>
  );
}

function HeroBannerSecondary({
  className,
  invertText,
  secondaryDescription,
  secondaryTitle,
}: {
  className?: string | null;
  invertText?: boolean | null;
  secondaryDescription?: string | null;
  secondaryTitle?: string | null;
}) {
  if (!secondaryTitle && !secondaryDescription) return null;

  return (
    <div className={clsx('flex flex-col items-start gap-4', className)}>
      {!!secondaryTitle && (
        <h2
          className={clsx(
            'text-xl font-medium',
            invertText ? 'text-white' : 'text-surface-foreground',
          )}
        >
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

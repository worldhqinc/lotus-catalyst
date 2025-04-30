import { StarIcon } from 'lucide-react';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { Image } from '~/components/image';
import { ctaSchema, type heroBanner } from '~/contentful/schema';

export function HeroBanner({
  title,
  description,
  image,
  video,
  primaryCta,
  secondaryCta,
  reviewQuote,
  reviewSource,
  reviewRating,
}: heroBanner['fields']) {
  const mediaUrl = video?.fields.file.url || image?.fields.file.url;
  const primary = ctaSchema.parse(primaryCta);
  const secondary = secondaryCta ? ctaSchema.parse(secondaryCta) : null;

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

  return (
    <div className="bg-surface-image relative flex items-end overflow-hidden p-8 text-white">
      {mediaElement}
      <div className="absolute inset-x-0 top-1/2 bottom-0 h-full w-full bg-gradient-to-b from-black/0 to-black" />
      <div className="relative flex w-full flex-col gap-8 pt-40 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <h1 className="font-heading mb-4 max-w-xl text-6xl uppercase md:text-8xl">{title}</h1>
          {description ? <p className="mb-8 text-lg">{description}</p> : null}
          <div className="flex gap-4">
            <ButtonLink className="w-full md:w-auto" href={primary.fields.externalLink ?? ''}>
              {primary.fields.text}
            </ButtonLink>
            {secondary && (
              <ButtonLink
                className="w-full md:w-auto"
                href={secondary.fields.externalLink ?? ''}
                variant="tertiary"
              >
                {secondary.fields.text}
              </ButtonLink>
            )}
          </div>
        </div>
        <div className="flex flex-col md:items-end">
          <div className="mb-2 flex gap-2">
            {reviewRating
              ? Array.from({ length: reviewRating }).map((_, index) => (
                  <StarIcon className="text-background h-4 w-4" fill="currentColor" key={index} />
                ))
              : null}
          </div>
          {reviewQuote ? (
            <blockquote className="mb-2 italic md:text-right">“{reviewQuote}”</blockquote>
          ) : null}
          {reviewSource ? <cite className="mb-4 block text-sm">— {reviewSource}</cite> : null}
        </div>
      </div>
    </div>
  );
}

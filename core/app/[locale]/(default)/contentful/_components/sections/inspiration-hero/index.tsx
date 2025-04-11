'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import type { ContentfulInspirationSlide } from '~/app/[locale]/(default)/contentful/[...rest]/page-data';
import { Image } from '~/components/image';

interface InspirationHeroProps {
  slides?: ContentfulInspirationSlide[] | null;
}

export default function InspirationHero({ slides }: InspirationHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const validSlides = slides?.filter((slide) => {
    const { headline: slideHeadline } = slide.fields;

    return Boolean(slideHeadline);
  });

  const goToSlide = useCallback(
    (index: number) => {
      if (!validSlides?.length) return;

      const newIndex = (index + validSlides.length) % validSlides.length;

      setCurrentIndex(newIndex);
    },
    [validSlides],
  );

  const goToNextSlide = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  const goToPrevSlide = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(goToNextSlide, 5000);

    return () => clearInterval(interval);
  }, [goToNextSlide, isAutoPlaying]);

  if (!validSlides?.length) return null;

  const currentSlide = validSlides[currentIndex];

  if (!currentSlide) return null;

  const { headline, subhead, image, ctaLabel, ctaLink } = currentSlide.fields;

  return (
    <section className="relative h-[calc(100vh-4rem)] min-h-[600px] w-full overflow-hidden">
      {image && (
        <Image
          alt={headline}
          className="absolute inset-0 h-full w-full object-cover"
          height={image.fields.file.details.image.height}
          src={image.fields.file.url}
          width={image.fields.file.details.image.width}
        />
      )}
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative container flex h-full flex-col items-start justify-center gap-4 text-white">
        <h1 className="max-w-2xl text-5xl font-light">{headline}</h1>
        {subhead ? <p className="max-w-xl text-xl">{subhead}</p> : null}
        {ctaLabel && ctaLink?.fields.pageSlug ? (
          <ButtonLink
            className="mt-4"
            href={`/${ctaLink.fields.pageSlug}`}
            shape="rounded"
            size="large"
            variant="primary"
          >
            {ctaLabel}
          </ButtonLink>
        ) : null}
      </div>
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {validSlides.map((_, index) => (
          <button
            className={`h-2 w-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            key={index}
            onClick={() => {
              setIsAutoPlaying(false);
              goToSlide(index);
            }}
          />
        ))}
      </div>
      <button
        className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/10 p-4 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        onClick={() => {
          setIsAutoPlaying(false);
          goToPrevSlide();
        }}
      >
        <ArrowLeft size={24} strokeWidth={1} />
      </button>
      <button
        className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/10 p-4 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        onClick={() => {
          setIsAutoPlaying(false);
          goToNextSlide();
        }}
      >
        <ArrowRight size={24} strokeWidth={1} />
      </button>
    </section>
  );
}

'use client';

import { Slideshow } from '@/vibes/soul/sections/slideshow';
import { PageStandard, type HeroSlide } from '~/contentful/schema';

interface HeroCarouselProps {
  slides: HeroSlide[];
}

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const validSlides = slides.filter((slide) => {
    const { headline: slideHeadline } = slide.fields;
    return Boolean(slideHeadline);
  });

  if (!validSlides.length) return null;

  return (
    <section className="@container">
      <Slideshow
        slides={validSlides.map((slide) => {
          const ctaLink = slide.fields.ctaLink as PageStandard | undefined;

          return {
            title: slide.fields.headline,
            description: slide.fields.subhead,
            showDescription: Boolean(slide.fields.subhead),
            image: slide.fields.image
              ? {
                  alt: slide.fields.headline,
                  src: `https:${slide.fields.image.fields.file.url}`,
                }
              : undefined,
            cta:
              slide.fields.ctaLabel && ctaLink?.fields.pageSlug
                ? {
                    label: slide.fields.ctaLabel,
                    href: `/${ctaLink.fields.pageSlug}`,
                  }
                : undefined,
            showCta: Boolean(slide.fields.ctaLabel && ctaLink?.fields.pageSlug),
          };
        })}
      />
    </section>
  );
}

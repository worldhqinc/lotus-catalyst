'use client';

import { Slideshow } from '@/vibes/soul/sections/slideshow';
import {
  IHeroSlide,
  IHeroSlideFields,
  IPageStandard,
  IPageStandardFields,
} from '~/types/generated/contentful';

interface Props {
  slides: IHeroSlide[];
}

export default function HeroCarousel({ slides }: Props) {
  return (
    <section className="@container">
      <Slideshow
        slides={slides.map((slide) => {
          const fields = slide.fields as IHeroSlideFields;
          const ctaLink = fields.ctaLink as IPageStandard;
          const ctaLinkFields = ctaLink?.fields as IPageStandardFields;

          return {
            title: fields.headline,
            description: fields.subhead,
            showDescription: Boolean(fields.subhead),
            image: fields.image?.fields?.file
              ? {
                  alt: fields.headline,
                  src: `https:${fields.image.fields.file.url}`,
                }
              : undefined,
            cta:
              fields.ctaLabel && ctaLinkFields?.pageSlug
                ? {
                    label: fields.ctaLabel,
                    href: `/${ctaLinkFields.pageSlug}`,
                  }
                : undefined,
            showCta: Boolean(fields.ctaLabel && ctaLinkFields?.pageSlug),
          };
        })}
      />
    </section>
  );
}

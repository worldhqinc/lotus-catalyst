'use client';

import { ComponentProps } from 'react';

import { Slideshow } from '@/vibes/soul/sections/slideshow';
import {
  assetSchema,
  heroCarousel,
  heroSlideSchema,
  pageStandardSchema,
} from '~/contentful/schema';
import { ensureImageUrl } from '~/lib/utils';

interface Props {
  data: heroCarousel;
}

type Slide = ComponentProps<typeof Slideshow>['slides'][number];

export function HeroCarousel({ data }: Props) {
  const slides =
    data.fields.heroSlides?.map((slide) => {
      return heroSlideSchema.parse(slide);
    }) ?? [];

  return (
    <section className="@container">
      <Slideshow
        slides={slides
          .map((slide) => {
            const fields = slide.fields;
            const ctaLink = fields.ctaLink;

            const ctaLinkFields = ctaLink ? pageStandardSchema.parse(ctaLink).fields : null;

            const title = fields.headline;
            const description = fields.subhead;

            const imageAsset = fields.image;

            const imageFile = imageAsset ? assetSchema.parse(imageAsset).fields.file : null;

            if (!title) return null;

            const slideData: Slide = {
              title,
              description,
              showDescription: Boolean(description),
              image: imageFile
                ? {
                    alt: title,
                    src: ensureImageUrl(imageFile.url),
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

            return slideData;
          })
          .filter((slide): slide is Slide => slide !== null)}
        vertical={data.fields.vertical}
      />
    </section>
  );
}

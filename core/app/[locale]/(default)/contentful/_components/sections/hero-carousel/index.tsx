'use client';

import { ComponentProps } from 'react';
import { z } from 'zod';

import { Slideshow } from '@/vibes/soul/sections/slideshow';
import { assetSchema, heroSlideSchema, pageStandardSchema } from '~/contentful/schema';

interface Props {
  slides: Array<z.infer<typeof heroSlideSchema>>;
}

type Slide = ComponentProps<typeof Slideshow>['slides'][number];

export default function HeroCarousel({ slides }: Props) {
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
                    src: `https:${imageFile.url}`,
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
      />
    </section>
  );
}

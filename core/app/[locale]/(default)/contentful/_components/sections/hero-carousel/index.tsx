'use client';

import { z } from 'zod';

import { Slideshow } from '@/vibes/soul/sections/slideshow';
import { assetSchema, heroSlideSchema, pageStandardSchema } from '~/contentful/schema';

interface Props {
  slides: Array<z.infer<typeof heroSlideSchema>>;
}

interface Slide {
  title: string;
  description?: string;
  showDescription?: boolean;
  image?: { alt: string; src: string };
  cta?: {
    label: string;
    href: string;
  };
  showCta?: boolean;
}

export default function HeroCarousel({ slides }: Props) {
  return (
    <section className="@container">
      <Slideshow
        slides={slides
          .map((slide) => {
            const fields = slide.fields;
            const ctaLink = fields.ctaLink;
            const ctaLinkFields = ctaLink
              ? pageStandardSchema.safeParse(ctaLink).data?.fields
              : null;

            const title = fields.headline;
            const description = fields.subhead;

            const imageAsset = fields.image;
            const imageResult = imageAsset ? assetSchema.safeParse(imageAsset) : null;
            const imageFile = imageResult?.success ? imageResult.data.fields.file : null;

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

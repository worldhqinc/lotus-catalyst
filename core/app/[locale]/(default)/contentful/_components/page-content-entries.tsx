import { z } from 'zod';

import {
  ctaSchema,
  heroCarouselSchema,
  heroSlideSchema,
  inspirationBentoSchema,
  inspirationCardSchema,
  pageStandardSchema,
} from '~/contentful/schema';

import HeroCarousel from './sections/hero-carousel';
import InspirationBento from './sections/inspiration-bento';

export default function PageContentEntries({ page }: { page: z.infer<typeof pageStandardSchema> }) {
  const pageContent = page.fields.pageContent;

  return (
    <div>
      {Array.isArray(pageContent) &&
        pageContent.map((contentEntry) => {
          const contentType = contentEntry.sys.contentType.sys.id;
          const entryId = contentEntry.sys.id;

          if (!contentType || !entryId) {
            return null;
          }

          switch (contentType) {
            case 'button':
              return <div key={entryId}>[Button Placeholder ID: {entryId}]</div>;

            case 'faq':
              return <div key={entryId}>[FAQ Placeholder ID: {entryId}]</div>;

            case 'heroCarousel': {
              const result = heroCarouselSchema.safeParse(contentEntry);

              if (!result.success) {
                return null;
              }

              const slides =
                result.data.fields.heroSlides
                  ?.map((slide) => {
                    const slideResult = heroSlideSchema.safeParse(slide);

                    return slideResult.success ? slideResult.data : null;
                  })
                  .filter((slide): slide is z.infer<typeof heroSlideSchema> => slide !== null) ??
                [];

              return <HeroCarousel key={entryId} slides={slides} />;
            }

            case 'inspirationBento': {
              const result = inspirationBentoSchema.safeParse(contentEntry);

              if (!result.success) {
                return null;
              }

              const { cta, heading, inspirationCards, video } = result.data.fields;

              // Validate CTA separately since it's optional
              let validCta = null;

              if (cta) {
                const ctaResult = ctaSchema.safeParse(cta);

                if (ctaResult.success) {
                  validCta = ctaResult.data;
                }
              }

              // Validate inspiration cards
              const validCards =
                inspirationCards
                  ?.map((card) => {
                    const cardResult = inspirationCardSchema.safeParse(card);

                    return cardResult.success ? cardResult.data : null;
                  })
                  .filter((card): card is z.infer<typeof inspirationCardSchema> => card !== null) ??
                [];

              return (
                <InspirationBento
                  cta={validCta}
                  heading={heading}
                  inspirationCards={validCards}
                  key={entryId}
                  video={video}
                />
              );
            }

            default: {
              return null;
            }
          }
        })}
    </div>
  );
}

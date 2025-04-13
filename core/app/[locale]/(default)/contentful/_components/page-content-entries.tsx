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
              const heroCarouselData = heroCarouselSchema.parse(contentEntry);

              const slides =
                heroCarouselData.fields.heroSlides?.map((slide) => {
                  return heroSlideSchema.parse(slide);
                }) ?? [];

              return <HeroCarousel key={entryId} slides={slides} />;
            }

            case 'inspirationBento': {
              const bentoData = inspirationBentoSchema.parse(contentEntry);
              const { cta, heading, inspirationCards, video } = bentoData.fields;

              const validCta = cta ? ctaSchema.parse(cta) : null;

              const validCards =
                inspirationCards?.map((card) => {
                  return inspirationCardSchema.parse(card);
                }) ?? [];

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

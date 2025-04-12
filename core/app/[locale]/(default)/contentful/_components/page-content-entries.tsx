import type { Entry, EntrySkeletonType } from 'contentful';
import type {
  IHeroCarousel,
  IHeroCarouselFields,
  IInspirationBento,
  IInspirationBentoFields,
  IPageStandard,
  IPageStandardFields,
} from '~/types/generated/contentful';

import HeroCarousel from './sections/hero-carousel';
import InspirationBento from './sections/inspiration-bento';

type ContentEntry = Entry<EntrySkeletonType>;

export default function PageContentEntries({ page }: { page: IPageStandard }) {
  const fields = page.fields as IPageStandardFields;
  const pageContent = fields.pageContent;

  return (
    <div>
      {Array.isArray(pageContent) &&
        pageContent.map((field: ContentEntry) => {
          const contentType = field.sys.contentType.sys.id;

          switch (contentType) {
            case 'button':
              return <div key={field.sys.id}>Button Display Component</div>;
            case 'faq':
              return <div key={field.sys.id}>FAQ Display Component</div>;
            case 'heroCarousel': {
              const heroCarousel = field as unknown as IHeroCarousel;
              const { heroSlides = [] } = heroCarousel.fields as IHeroCarouselFields;
              return <HeroCarousel key={field.sys.id} slides={heroSlides} />;
            }
            case 'inspirationBento': {
              const inspirationBento = field as unknown as IInspirationBento;
              const {
                cta,
                heading,
                inspirationCards = [],
                video,
              } = inspirationBento.fields as IInspirationBentoFields;
              return (
                <InspirationBento
                  cta={cta}
                  heading={heading}
                  inspirationCards={inspirationCards}
                  key={field.sys.id}
                  video={video}
                />
              );
            }
            default:
              return null;
          }
        })}
    </div>
  );
}

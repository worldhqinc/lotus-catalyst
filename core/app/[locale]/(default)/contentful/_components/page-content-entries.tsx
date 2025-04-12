import { getPageBySlug } from '../[...rest]/page-data';

import HeroCarousel from './sections/hero-carousel';
import InspirationBento from './sections/inspiration-bento';

export default function PageContentEntries({
  page,
}: {
  page: Awaited<ReturnType<typeof getPageBySlug>>;
}) {
  const fields = page.fields;
  const pageContent = fields.pageContent;

  return (
    <div>
      {Array.isArray(pageContent) &&
        pageContent.map((field) => (
          <div key={field.sys.id}>
            {field.sys.contentType.sys.id === 'button' ? (
              <div key={field.sys.id}>Button Display Component</div>
            ) : null}
            {field.sys.contentType.sys.id === 'faq' ? (
              <div key={field.sys.id}>FAQ Display Component</div>
            ) : null}
            {field.sys.contentType.sys.id === 'heroCarousel' ? (
              <HeroCarousel slides={field.fields.heroSlides ?? []} />
            ) : null}
            {field.sys.contentType.sys.id === 'inspirationBento' ? (
              <InspirationBento
                cta={field.fields.cta}
                heading={field.fields.heading}
                inspirationCards={field.fields.inspirationCards || []}
                key={field.sys.id}
                video={field.fields.video}
              />
            ) : null}
          </div>
        ))}
    </div>
  );
}

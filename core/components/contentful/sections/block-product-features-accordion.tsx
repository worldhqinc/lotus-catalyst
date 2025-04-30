import { Accordion, AccordionItem } from '@/vibes/soul/primitives/accordion';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { Slideshow } from '@/vibes/soul/sections/slideshow';
import { accordionItemSchema, blockProductFeaturesAccordion } from '~/contentful/schema';
import { ensureImageUrl } from '~/lib/utils';

export function BlockProductFeaturesAccordion({
  heading,
  items,
  media,
}: blockProductFeaturesAccordion['fields']) {
  const accordionItems = items?.map((item) => accordionItemSchema.parse(item)) ?? [];
  const slides = (media ?? []).map((asset) => ({
    title: asset.fields.title || '',
    image: { alt: asset.fields.title || '', src: ensureImageUrl(asset.fields.file.url) },
    showDescription: false,
  }));

  return (
    <SectionLayout containerClassName="bg-white py-24" containerSize="2xl">
      <div className="mb-17 flex flex-col items-center">
        <h2 className="text-surface-foreground max-w-4xl text-center text-2xl md:text-4xl">
          {heading}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-lg">
          <Slideshow interval={5000} playOnInit={false} slides={slides} />
        </div>
        <Accordion collapsible defaultValue={accordionItems[0]?.sys.id} type="single">
          {accordionItems.map((item) => (
            <AccordionItem
              className="border-contrast-200 border-t py-4"
              key={item.sys.id}
              title={item.fields.title}
              value={item.sys.id}
            >
              <p className="text-surface-foreground">{item.fields.detail}</p>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </SectionLayout>
  );
}

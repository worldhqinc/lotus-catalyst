'use client';

import { useState } from 'react';

import { Accordion, AccordionItem } from '@/vibes/soul/primitives/accordion';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { WistiaPlayer } from '~/components/wistia-player';
import { accordionItemSchema, blockProductFeaturesAccordion } from '~/contentful/schema';

export function BlockProductFeaturesAccordion({
  heading,
  items,
  wistiaMediaId,
  wistiaMediaSegments,
}: blockProductFeaturesAccordion['fields']) {
  const accordionItems = items?.map((item) => accordionItemSchema.parse(item)) ?? [];
  const [activeItem, setActiveItem] = useState<string | undefined>(accordionItems[0]?.sys.id);

  return (
    <SectionLayout containerClassName="bg-white py-24" containerSize="2xl">
      <div className="mb-17 flex flex-col items-center">
        <h2 className="text-surface-foreground max-w-4xl text-center text-2xl md:text-4xl">
          {heading}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <WistiaPlayer
          activeId={activeItem}
          anchorIds={accordionItems.map((item) => item.sys.id)}
          wistiaMediaId={wistiaMediaId}
          wistiaMediaSegments={wistiaMediaSegments}
        />
        <Accordion
          collapsible
          defaultValue={accordionItems[0]?.sys.id}
          onValueChange={(value) => {
            setActiveItem(value);
          }}
          type="single"
        >
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

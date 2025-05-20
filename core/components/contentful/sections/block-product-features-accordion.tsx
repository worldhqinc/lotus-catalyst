'use client';

import { useEffect, useMemo, useState } from 'react';

import { Accordion, AccordionItem } from '@/vibes/soul/primitives/accordion';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselScrollbar,
} from '@/vibes/soul/primitives/carousel';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { WistiaPlayer } from '~/components/wistia-player';
import { accordionItemSchema, blockProductFeaturesAccordion } from '~/contentful/schema';

export function BlockProductFeaturesAccordion({
  heading,
  items,
  wistiaMediaId,
  wistiaMediaSegments,
}: blockProductFeaturesAccordion['fields']) {
  const accordionItems = useMemo(
    () => items?.map((item) => accordionItemSchema.parse(item)) ?? [],
    [items],
  );
  const [activeItem, setActiveItem] = useState<string | undefined>(accordionItems[0]?.sys.id);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const index = api.selectedScrollSnap();
      const newActiveItem = accordionItems[index]?.sys.id;

      if (newActiveItem) {
        setActiveItem(newActiveItem);
      }
    };

    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api, accordionItems]);

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
        <Carousel className="md:hidden" setApi={setApi}>
          <CarouselContent>
            {accordionItems.map((item) => (
              <CarouselItem className="w-full space-y-6" key={item.sys.id}>
                <h3 className="text-xl leading-[120%] font-medium tracking-[1.8px] uppercase">
                  {item.fields.title}
                </h3>
                <p className="text-surface-foreground">{item.fields.detail}</p>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-8 flex w-full justify-end">
            <CarouselScrollbar colorScheme="light" label="Scroll" />
          </div>
        </Carousel>
        <Accordion
          className="hidden md:block"
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

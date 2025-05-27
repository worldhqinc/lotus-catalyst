import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import {
  type featureGrid,
  featureItemSchema,
  type productFinishedGoods,
} from '~/contentful/schema';

import { FeatureItem } from './feature-item';

export function FeatureGrid({ title, subheading, items }: featureGrid['fields']) {
  const parsedItems = items?.map((item) => featureItemSchema.parse(item)) ?? [];

  function isProductFinishedGoods(entry: {
    sys: { contentType: { sys: { id: string } } };
  }): entry is productFinishedGoods {
    return entry.sys.contentType.sys.id === 'productFinishedGoods';
  }

  return (
    <SectionLayout containerClassName="bg-white lg:py-24 space-y-16">
      <div className="flex flex-col items-center empty:hidden">
        {title ? (
          <h2 className="font-heading text-icon-primary max-w-4xl text-center text-4xl uppercase md:text-6xl">
            {title}
          </h2>
        ) : null}
        {subheading ? (
          <p className="text-icon-secondary mt-8 max-w-xl text-center">{subheading}</p>
        ) : null}
      </div>
      <div className="space-y-16">
        {parsedItems.map(({ sys, fields }, idx) => (
          <div className="grid items-center gap-8 md:grid-cols-2" key={sys.id}>
            <FeatureItem
              {...fields}
              isFinishedGoods={
                Array.isArray(fields.products)
                  ? fields.products.filter(isProductFinishedGoods).length > 0
                  : false
              }
              products={
                Array.isArray(fields.products)
                  ? fields.products.filter(isProductFinishedGoods)
                  : undefined
              }
              reverseOrder={idx % 2 === 1}
            />
          </div>
        ))}
      </div>
    </SectionLayout>
  );
}

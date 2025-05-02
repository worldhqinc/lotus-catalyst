'use client';

import { ProductCard } from '@/vibes/soul/primitives/product-card';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { productBento } from '~/contentful/schema';
import { contentfulProductCardTransformer } from '~/data-transformers/product-card-transformer';

export function ProductBento(props: productBento['fields']) {
  const items = props.products?.map(contentfulProductCardTransformer) ?? [];

  const getColSpan = (index: number): string => {
    const patternIndex = index % 8;

    if (patternIndex === 0 || patternIndex === 5 || patternIndex === 6 || patternIndex === 7) {
      return 'md:col-span-2';
    }

    return 'md:col-span-1';
  };

  const getAspectRatio = (index: number): '5:6' | '3:4' | '1:1' => {
    const patternIndex = index % 8;

    switch (patternIndex) {
      case 0:
      case 5:
      case 6:
      case 7:
        return '5:6';

      default:
        return '1:1';
    }
  };

  return (
    <SectionLayout>
      <div className="mb-8 flex flex-col items-center gap-4">
        <h2 className="text-icon-primary max-w-sm text-center text-4xl">{props.title}</h2>
        <p className="text-icon-secondary max-w-lg text-center">{props.subtitle}</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {items.map((product, index) => {
          const colSpanClass = getColSpan(index);
          const mobileRatioMap: Record<'5:6' | '3:4' | '1:1', string> = {
            '5:6': 'aspect-5/6',
            '3:4': 'aspect-3/4',
            '1:1': 'aspect-square',
          };
          const baseRatio = mobileRatioMap[getAspectRatio(index)];
          // mobile: enforce aspect ratio; on md+ use a fixed height (~512px) so all images match
          const ratioOverride = `${baseRatio} md:h-[512px] md:w-full`;

          return (
            <div className={colSpanClass} key={`${product.id}-${index}`}>
              <ProductCard fillContainer product={product} ratioOverride={ratioOverride} />
            </div>
          );
        })}
      </div>
    </SectionLayout>
  );
}

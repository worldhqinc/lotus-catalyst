'use client';

import type { Price } from '@/vibes/soul/primitives/price-label';
import { ProductCard } from '@/vibes/soul/primitives/product-card';
import { CarouselProduct } from '@/vibes/soul/sections/product-carousel';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { assetSchema, productBento, productFinishedGoodsSchema } from '~/contentful/schema';

export default function ProductBento(props: productBento['fields']) {
  const items: CarouselProduct[] =
    props.products?.map((entry) => {
      const parsedProduct = productFinishedGoodsSchema.parse(entry);
      const { id } = parsedProduct.sys;
      const fields = parsedProduct.fields;
      const imageAsset = fields.featuredImage;
      const file = imageAsset ? assetSchema.parse(imageAsset).fields.file : null;
      const image = file ? { src: `https:${file.url}`, alt: fields.productName } : undefined;

      const price: Price = fields.salePrice
        ? {
            type: 'sale',
            previousValue: fields.defaultPrice,
            currentValue: fields.salePrice,
          }
        : fields.defaultPrice;

      return {
        id,
        title: fields.productName,
        subtitle: fields.shortDescription ?? undefined,
        href: fields.pageSlug ? `/${fields.pageSlug}` : '#',
        image,
        price,
        badge: fields.productBadge ?? undefined,
      };
    }) ?? [];

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
        {items?.map((product, index) => {
          const colSpanClass = getColSpan(index);
          const mobileRatioMap: Record<'5:6' | '3:4' | '1:1', string> = {
            '5:6': 'aspect-5/6',
            '3:4': 'aspect-3/4',
            '1:1': 'aspect-square',
          };
          const baseRatio = mobileRatioMap[getAspectRatio(index)];
          const spanTwo = colSpanClass === 'md:col-span-2';
          const ratioOverride = `${baseRatio} ${spanTwo ? 'md:aspect-[5/3]' : 'md:aspect-5/6'}`;
          return (
            <div key={`${product.id}-${index}`} className={colSpanClass}>
              <ProductCard fillContainer ratioOverride={ratioOverride} product={product} />
            </div>
          );
        })}
      </div>
    </SectionLayout>
  );
}

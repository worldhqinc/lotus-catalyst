'use client';

import { Select } from '@/vibes/soul/form/select';
import { Image } from '~/components/image';
import type { featureItem, productFinishedGoods, supportDocument } from '~/contentful/schema';
import { ensureImageUrl } from '~/lib/utils';

type FeatureItemProps = Omit<featureItem['fields'], 'products'> & {
  products?: productFinishedGoods[];
  reverseOrder?: boolean;
};

export function FeatureItem({
  heading,
  description,
  image,
  products,
  reverseOrder = false,
}: FeatureItemProps) {
  const supportLinks =
    products?.map((product) => {
      const docs = product.fields.docs?.find(
        (doc): doc is supportDocument => doc.fields.documentType === 'Use and Care Guide',
      );

      return {
        label: product.fields.webProductName,
        value: docs?.fields.url ?? '',
      };
    }) ?? [];

  const handleSupportProductSelect = (value: string) => {
    window.open(value, '_blank');
  };

  return (
    <>
      <div className="flex flex-col items-start justify-start lg:px-12">
        <h3 className="text-4xl">{heading}</h3>
        {description ? <p className="text-contrast-400 mt-2">{description}</p> : null}
        <Select
          className="mt-12"
          name="support_product_select"
          onValueChange={handleSupportProductSelect}
          options={supportLinks}
        />
      </div>
      <div
        className={`bg-surface-image order-first aspect-[4/3] w-full overflow-hidden rounded-lg ${
          reverseOrder ? 'md:order-first' : 'md:order-last'
        }`}
      >
        <Image
          alt={image.fields.title || heading}
          className="h-full w-full object-cover"
          height={image.fields.file.details.image?.height || 300}
          src={ensureImageUrl(image.fields.file.url)}
          width={image.fields.file.details.image?.width || 400}
        />
      </div>
    </>
  );
}

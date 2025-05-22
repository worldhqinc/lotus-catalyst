'use client';

import { SelectField } from '@/vibes/soul/form/select-field';
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
    products
      ?.map((product) => {
        const docs = product.fields.docs?.find((doc): doc is supportDocument => {
          if (!doc.sys.publishedVersion) return false;

          return doc.fields.documentType === 'Use and Care Guide';
        });

        if (!docs) return null;

        return {
          label: product.fields.webProductName,
          value: `${product.fields.webProductName}|${docs.fields.url}`,
        };
      })
      .filter((link) => link !== null) ?? [];

  supportLinks.unshift({
    label: 'Select a product',
    value: '#',
  });

  const handleSupportProductSelect = (value: string) => {
    const [, url] = value.split('|');

    window.open(url, '_blank');
  };

  return (
    <>
      <div className="flex flex-col items-start justify-start lg:px-12">
        <h3 className="text-4xl">{heading}</h3>
        {description ? <p className="text-contrast-400 mt-2">{description}</p> : null}
        {supportLinks.length > 0 ? (
          <SelectField
            className="mt-12"
            hideLabel
            label="Select a product"
            name="support_product_select"
            onValueChange={handleSupportProductSelect}
            options={supportLinks}
            value={supportLinks[0]?.value ?? ''}
          />
        ) : null}
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

'use client';

import { Select } from '@/vibes/soul/form/select';
import { Image } from '~/components/image';
import type { featureItem } from '~/contentful/schema';
import { usePathname } from '~/i18n/routing';
import { ensureImageUrl } from '~/lib/utils';

type FeatureItemProps = featureItem['fields'] & {
  reverseOrder?: boolean;
};

export function FeatureItem({
  heading,
  description,
  image,
  reverseOrder = false,
}: FeatureItemProps) {
  const pathname = usePathname();
  const isSupportPage = pathname.includes('support');

  return (
    <>
      <div className="flex flex-col items-start justify-start lg:px-12">
        <h3 className="text-4xl">{heading}</h3>
        {description ? <p className="text-contrast-400 mt-2">{description}</p> : null}
        {/* TODO: Add support product select from Algolia */}
        {isSupportPage ? (
          <Select
            className="mt-12"
            name="support-product-select"
            options={[
              {
                label: 'The Perfectionist',
                value: 'the-perfectionist',
              },
              {
                label: 'The Specialist',
                value: 'the-specialist',
              },
            ]}
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

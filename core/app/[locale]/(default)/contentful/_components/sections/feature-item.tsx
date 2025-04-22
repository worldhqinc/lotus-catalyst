import { Image } from '~/components/image';
import type { featureItem } from '~/contentful/schema';
import { ensureImageUrl } from '~/lib/utils';

type FeatureItemProps = featureItem['fields'] & {
  reverseOrder?: boolean;
};

export default function FeatureItem({
  heading,
  description,
  image,
  reverseOrder = false,
}: FeatureItemProps) {
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-icon-primary text-center text-4xl">{heading}</h3>
        {description ? <p className="text-icon-secondary mt-2 text-center">{description}</p> : null}
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

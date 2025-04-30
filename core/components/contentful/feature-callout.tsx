import { Image } from '~/components/image';
import type { featureCallout } from '~/contentful/schema';
import { ensureImageUrl } from '~/lib/utils';

interface FeatureCalloutProps {
  metadata: featureCallout['metadata'];
  sys: featureCallout['sys'];
  fields: featureCallout['fields'];
}

export function FeatureCallout({ fields }: FeatureCalloutProps) {
  return (
    <div className="text-contrast-400 flex items-center gap-2 text-sm">
      {fields.label}{' '}
      <Image
        alt={fields.logo.fields.title || fields.label}
        className="h-7 w-auto"
        height={fields.logo.fields.file.details.image?.height || 28}
        src={ensureImageUrl(fields.logo.fields.file.url)}
        width={fields.logo.fields.file.details.image?.width || 37}
      />
    </div>
  );
}

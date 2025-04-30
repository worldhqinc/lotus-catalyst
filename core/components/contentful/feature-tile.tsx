import { CircleSlash2, HelpCircle, Microwave } from 'lucide-react';

import type { featureTile } from '~/contentful/schema';

const IconMap = {
  'circle-slash-2': CircleSlash2,
  microwave: Microwave,
} as const;

type IconKey = keyof typeof IconMap;

function isIconKey(key: string): key is IconKey {
  return key in IconMap;
}

interface FeatureTileProps {
  metadata: featureTile['metadata'];
  sys: featureTile['sys'];
  fields: featureTile['fields'];
}

export function FeatureTile({ fields }: FeatureTileProps) {
  const Icon = isIconKey(fields.icon) ? IconMap[fields.icon] : HelpCircle;

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Icon className="h-6 w-6" strokeWidth={1.5} />
      <span className="text-contrast-400 max-w-52 text-center text-balance">{fields.label}</span>
    </div>
  );
}

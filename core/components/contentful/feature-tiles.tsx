import { type featureTiles, featureTileSchema } from '~/contentful/schema';

import { FeatureTile } from './feature-tile';

interface FeatureTilesProps {
  metadata: featureTiles['metadata'];
  sys: featureTiles['sys'];
  fields: featureTiles['fields'];
}

export function FeatureTiles({ fields }: FeatureTilesProps) {
  const parsedItems = fields.items.map((item) => featureTileSchema.parse(item));

  return (
    <div className="bg-contrast-100 relative mt-4 hidden grid-cols-2 gap-2 rounded-xl px-4 py-10 @2xl:grid">
      {parsedItems.map((item) => (
        <FeatureTile key={item.sys.id} {...item} />
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-contrast-200 h-20 w-[1px]" />
      </div>
    </div>
  );
}

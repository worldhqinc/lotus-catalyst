import { Fragment } from 'react';

import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { Image } from '~/components/image';
import { WistiaPlayer } from '~/components/wistia-player';
import { blockProductFeatures, featureItemSchema } from '~/contentful/schema';
import { ensureImageUrl } from '~/lib/utils';

export function BlockProductFeatures({
  heading,
  items,
  alternate,
}: blockProductFeatures['fields']) {
  const parsedItems = items?.map((item) => featureItemSchema.parse(item)) ?? [];

  return (
    <SectionLayout containerClassName="bg-white py-24" containerSize="2xl">
      <div className="mb-17 flex flex-col items-center">
        <h2 className="text-surface-foreground max-w-4xl text-center text-2xl md:text-4xl">
          {heading}
        </h2>
      </div>
      <div
        className={
          alternate
            ? 'grid grid-cols-1 gap-8 md:grid-cols-3'
            : 'grid grid-cols-1 gap-8 md:grid-cols-2 md:grid-rows-2'
        }
      >
        {parsedItems.map(({ sys, fields }, idx) => {
          const isFirst = idx === 0;

          return (
            <Fragment key={sys.id}>
              {alternate ? (
                <div>
                  <div className="relative aspect-square overflow-hidden rounded-lg">
                    {fields.wistiaId ? (
                      <div className="absolute inset-0 h-full w-full">
                        <WistiaPlayer
                          anchorIds={[]}
                          pageType="page"
                          wistiaMediaId={fields.wistiaId}
                        />
                      </div>
                    ) : (
                      <Image
                        alt={fields.image.fields.title || fields.heading}
                        className="absolute inset-0 h-full w-full object-cover"
                        height={fields.image.fields.file.details.image?.height || 300}
                        src={ensureImageUrl(fields.image.fields.file.url)}
                        width={fields.image.fields.file.details.image?.width || 400}
                      />
                    )}
                  </div>
                  <div className="mt-6 text-center md:text-left">
                    <h3 className="text-surface-foreground font-medium">{fields.heading}</h3>
                    {!!fields.description && (
                      <p className="mt-2 max-w-[45ch] text-balance text-gray-500">
                        {fields.description}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className={isFirst ? 'md:row-span-2' : ''}>
                  <div
                    className={`relative overflow-hidden rounded-lg ${isFirst ? 'aspect-video md:h-full md:w-full' : 'aspect-video'}`}
                  >
                    {fields.wistiaId ? (
                      <div className="absolute inset-0 h-full w-full">
                        <WistiaPlayer
                          anchorIds={[]}
                          pageType="page"
                          wistiaMediaId={fields.wistiaId}
                        />
                      </div>
                    ) : (
                      <Image
                        alt={fields.image.fields.title || fields.heading}
                        className="absolute inset-0 h-full w-full object-cover"
                        height={fields.image.fields.file.details.image?.height || 300}
                        src={ensureImageUrl(fields.image.fields.file.url)}
                        width={fields.image.fields.file.details.image?.width || 400}
                      />
                    )}
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent p-6 md:p-8">
                      <h3 className="text-background font-medium">{fields.heading}</h3>
                      {!!fields.description && (
                        <p className="text-background max-w-[45ch] text-lg text-balance">
                          {fields.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </SectionLayout>
  );
}

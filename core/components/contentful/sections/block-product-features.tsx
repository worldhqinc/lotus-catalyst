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
    <SectionLayout containerClassName="bg-white" containerSize="2xl">
      <div className="mb-8 flex flex-col items-start lg:mb-16">
        <h2 className="text-surface-foreground max-w-4xl text-2xl md:text-4xl">{heading}</h2>
      </div>
      <div
        className={
          alternate
            ? 'grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-3 lg:gap-6'
            : 'grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 md:grid-rows-2 lg:gap-6'
        }
      >
        {parsedItems.map(({ sys, fields }, idx) => {
          const isFirst = idx === 0;

          return (
            <Fragment key={sys.id}>
              {alternate ? (
                <div>
                  <div className="relative isolate aspect-square overflow-hidden rounded-lg">
                    <div className="absolute inset-0 h-full w-full object-cover after:absolute after:inset-0 after:bg-gradient-to-b after:from-transparent after:to-black/60 lg:after:from-40%">
                      {fields.wistiaId ? (
                        <WistiaPlayer pageType="page" wistiaMediaId={fields.wistiaId} />
                      ) : (
                        <Image
                          alt={fields.image.fields.description || fields.heading}
                          className="h-full w-full object-cover"
                          height={fields.image.fields.file.details.image?.height || 300}
                          src={ensureImageUrl(fields.image.fields.file.url)}
                          width={fields.image.fields.file.details.image?.width || 400}
                        />
                      )}
                    </div>
                  </div>
                  <div className="mt-4 lg:mt-6">
                    <h3 className="text-surface-foreground text-xl">{fields.heading}</h3>
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
                    className={`relative isolate overflow-hidden rounded-lg ${isFirst ? 'aspect-square md:h-full md:w-full' : 'aspect-square lg:aspect-video'}`}
                  >
                    <div className="absolute inset-0 h-full w-full after:absolute after:inset-0 after:bg-gradient-to-b after:from-transparent after:to-black/60 lg:after:from-40%">
                      {fields.wistiaId ? (
                        <WistiaPlayer pageType="page" wistiaMediaId={fields.wistiaId} />
                      ) : (
                        <Image
                          alt={fields.image.fields.description || fields.heading}
                          className="h-full w-full object-cover"
                          height={fields.image.fields.file.details.image?.height || 300}
                          src={ensureImageUrl(fields.image.fields.file.url)}
                          width={fields.image.fields.file.details.image?.width || 400}
                        />
                      )}
                    </div>
                    <div className="absolute bottom-0 w-full p-4 md:p-8">
                      <h3 className="text-background text-xl">{fields.heading}</h3>
                      {!!fields.description && (
                        <p className="text-background max-w-[45ch] text-balance">
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

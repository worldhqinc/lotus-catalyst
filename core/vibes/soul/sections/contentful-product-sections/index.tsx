import { Streamable } from '@/vibes/soul/lib/streamable';
import { ProductFinishedGoodsData } from '~/app/[locale]/(default)/product/[slug]/page-data';

import ContentfulBlockProductFeatures from '../contentful-block-product-features';
import ContentfulBlockProductFeaturesAccordion from '../contentful-block-product-features-accordion';

interface ContentfulProductSectionsProps {
  data: Streamable<ProductFinishedGoodsData>;
}

type ContentEntry = NonNullable<ProductFinishedGoodsData['fields']['pageContentEntries']>[number];

export default async function ContentfulProductSections({ data }: ContentfulProductSectionsProps) {
  const productData = await data;

  if (!productData.fields.pageContentEntries) {
    return null;
  }

  return (
    <>
      {productData.fields.pageContentEntries.map((entry: ContentEntry) => {
        if (entry.sys.contentType.sys.id === 'blockProductFeatures') {
          return <ContentfulBlockProductFeatures entry={entry} key={entry.sys.id} />;
        }

        if (entry.sys.contentType.sys.id === 'blockProductFeaturesAccordion') {
          return <ContentfulBlockProductFeaturesAccordion entry={entry} key={entry.sys.id} />;
        }

        return null;
      })}
    </>
  );
}

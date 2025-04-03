import { Streamable } from '@/vibes/soul/lib/streamable';
import { ProductFinishedGoodsData } from '~/app/[locale]/(default)/product/[slug]/page-data';
import ContentfulBlockProductFeatures from '../contentful-block-product-features';
import ContentfulBlockProductFeaturesAccordion from '../contentful-block-product-features-accordion';

interface ContentfulProductSectionsProps {
  data: Streamable<ProductFinishedGoodsData>;
}

export default async function ContentfulProductSections({ data }: ContentfulProductSectionsProps) {
  const {
    fields: { pageContentEntries },
  } = await data;

  return (
    <>
      {pageContentEntries.map((entry) => {
        if (entry.sys.contentType.sys.id === 'blockProductFeatures') {
          return <ContentfulBlockProductFeatures key={entry.sys.id} entry={entry} />;
        }
        if (entry.sys.contentType.sys.id === 'blockProductFeaturesAccordion') {
          return <ContentfulBlockProductFeaturesAccordion key={entry.sys.id} entry={entry} />;
        }
      })}
    </>
  );
}

import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { Entry } from 'contentful';

import { ProductFinishedGoodsData } from '~/app/[locale]/(default)/product/[slug]/page-data';

interface Props {
  data: Entry<ProductFinishedGoodsData> | null | undefined;
}

function getContentfulField(
  data: Entry<ProductFinishedGoodsData>,
  field: keyof ProductFinishedGoodsData['fields'],
): string {
  return typeof data.fields[field] === 'string'
    ? data.fields[field]
    : (data.fields[field]?.['en-US'] ?? '');
}

export async function ContentfulProductData({ data }: Props) {
  if (!data) {
    return null;
  }

  const shortDescriptionRichText = await richTextFromMarkdown(
    getContentfulField(data, 'shortDescription'),
  );
  const shortDescription = documentToHtmlString(shortDescriptionRichText);

  return (
    <div className="mb-8 flex flex-col gap-2 rounded-lg bg-contrast-100 p-4">
      <h3 className="text-lg font-bold">Contentful Product Data</h3>
      <div className="text-sm text-contrast-500">
        <p>Contentful BC Reference: {getContentfulField(data, 'bcProductReference')}</p>
        <p>Contentful Default Price: {getContentfulField(data, 'defaultPrice')}</p>
      </div>
      <div className="text-sm text-contrast-500">
        <p className="mb-4">Contentful Short Description:</p>
        <div
          className="prose rounded-lg bg-white p-4"
          dangerouslySetInnerHTML={{ __html: shortDescription }}
        />
      </div>
    </div>
  );
}

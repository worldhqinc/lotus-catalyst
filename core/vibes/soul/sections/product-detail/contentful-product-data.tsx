import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

import { productFinishedGoods } from '~/contentful/schema';

interface Props {
  data: productFinishedGoods | null | undefined;
}

interface LocalizedField {
  'en-US'?: unknown;
}

function isLocalizedField(value: unknown): value is LocalizedField {
  return value != null && typeof value === 'object' && 'en-US' in value;
}

function getContentfulField(
  data: productFinishedGoods,
  field: keyof productFinishedGoods['fields'],
): string {
  const value = data.fields[field];

  if (typeof value === 'string') {
    return value;
  }

  if (isLocalizedField(value)) {
    const nested = value['en-US'];

    if (typeof nested === 'string') {
      return nested;
    }
  }

  return '';
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
    <div className="bg-contrast-100 mb-8 flex flex-col gap-2 rounded-lg p-4">
      <h3 className="text-lg font-bold">Contentful Product Data</h3>
      <div className="text-contrast-500 text-sm">
        <p>Contentful BC Reference: {getContentfulField(data, 'bcProductReference')}</p>
        <p>Contentful Default Price: {getContentfulField(data, 'defaultPrice')}</p>
      </div>
      <div className="text-contrast-500 text-sm">
        <p className="mb-4">Contentful Short Description:</p>
        <div
          className="prose rounded-lg bg-white p-4"
          dangerouslySetInnerHTML={{ __html: shortDescription }}
        />
      </div>
    </div>
  );
}
